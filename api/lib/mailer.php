<?php
/**
 * Envoi d'emails sans dépendance externe (pas de Composer) :
 *  - transport "smtp" : client SMTP natif avec STARTTLS/SSL et AUTH LOGIN (recommandé) ;
 *  - transport "mail" : fonction mail() du serveur (secours, livraison moins fiable).
 *
 * Configuration dans api/config.php (bloc "mail") ou via variables d'environnement
 * (MAIL_TRANSPORT, MAIL_HOST, MAIL_PORT, MAIL_ENCRYPTION, MAIL_USER, MAIL_PASS,
 *  MAIL_FROM, MAIL_FROM_NAME, MAIL_NOTIFY_TO, APP_URL) — voir config.php.example.
 *
 * Aucune erreur d'envoi ne doit casser une requête métier : send_mail() renvoie false
 * et journalise le problème au lieu de lever une exception.
 */

declare(strict_types=1);

function mail_settings(): array
{
    global $config;
    return isset($config['mail']) && is_array($config['mail']) ? $config['mail'] : [];
}

/** Adresse qui reçoit les notifications du site : réglage "email" du site, sinon MAIL_NOTIFY_TO. */
function mail_notification_recipient(): string
{
    $fallback = trim((string)(mail_settings()['notify_to'] ?? ''));
    try {
        $stmt = db()->prepare('SELECT `value` FROM settings WHERE `key` = ? LIMIT 1');
        $stmt->execute(['email']);
        $value = (string)($stmt->fetchColumn() ?: '');
        if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
            return $value;
        }
    } catch (Throwable $e) {
        error_log('mail: réglage email illisible — ' . $e->getMessage());
    }
    return filter_var($fallback, FILTER_VALIDATE_EMAIL) ? $fallback : '';
}

/** Origine publique du site (ex. https://teintdafrique.com), sans slash final. */
function app_base_url(): string
{
    global $config;
    $configured = rtrim(trim((string)($config['app_url'] ?? '')), '/');
    if ($configured !== '') {
        return $configured;
    }

    $https = ($_SERVER['HTTPS'] ?? '') !== '' && ($_SERVER['HTTPS'] ?? '') !== 'off';
    if (strtolower((string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https') {
        $https = true;
    }
    $host = (string)($_SERVER['HTTP_HOST'] ?? '');
    if ($host === '') {
        return '';
    }
    return ($https ? 'https' : 'http') . '://' . $host;
}

/** Envoie un email HTML (avec version texte) ; renvoie false en cas d'échec. */
function send_mail(string $to, string $subject, string $html, string $text = '', string $replyTo = ''): bool
{
    $settings = mail_settings();
    $to = trim($to);
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        error_log('mail: destinataire invalide');
        return false;
    }

    $fromEmail = trim((string)($settings['from_email'] ?? ''));
    if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
        error_log('mail: "from_email" non configuré dans api/config.php');
        return false;
    }
    $fromName = trim((string)($settings['from_name'] ?? ''));
    [$headers, $body] = build_mime($fromEmail, $fromName, $to, $subject, $replyTo, $html, $text);

    $transport = strtolower((string)($settings['transport'] ?? 'smtp'));
    try {
        if ($transport === 'mail') {
            $additional = $headers;
            return @mail(
                $to,
                '=?UTF-8?B?' . base64_encode($subject) . '?=',
                $body,
                $additional,
                '-f' . $fromEmail
            );
        }

        $host = trim((string)($settings['host'] ?? ''));
        if ($host === '') {
            error_log('mail: "host" SMTP non configuré dans api/config.php');
            return false;
        }
        smtp_send(
            $host,
            (int)($settings['port'] ?? 587),
            strtolower((string)($settings['encryption'] ?? 'tls')),
            (string)($settings['user'] ?? ''),
            (string)($settings['pass'] ?? ''),
            $fromEmail,
            $to,
            $headers . "\r\n\r\n" . $body
        );
        return true;
    } catch (Throwable $e) {
        error_log('mail: ' . $e->getMessage());
        return false;
    }
}

/**
 * Construit les en-têtes et le corps MIME (multipart/alternative texte + HTML).
 * Le corps est encodé en base64 : aucun souci d'accents ni de lignes « . ».
 *
 * @return array{0: string, 1: string}
 */
function build_mime(
    string $fromEmail,
    string $fromName,
    string $to,
    string $subject,
    string $replyTo,
    string $html,
    string $text
): array {
    $boundary = 'tda-' . bin2hex(random_bytes(12));
    $headers = [
        'From: ' . format_address($fromEmail, $fromName),
        'To: <' . $to . '>',
        'Subject: =?UTF-8?B?' . base64_encode($subject) . '?=',
        'Date: ' . date('r'),
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . format_address($replyTo, '');
    }

    $text = $text !== '' ? $text : html_entity_decode(strip_tags(str_replace('<br', "\n<br", $html)), ENT_QUOTES, 'UTF-8');
    $body = '--' . $boundary . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text), 76, "\r\n")
        . '--' . $boundary . "\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html), 76, "\r\n")
        . '--' . $boundary . "--\r\n";

    return [implode("\r\n", $headers), $body];
}

function format_address(string $email, string $name): string
{
    if ($name === '') {
        return '<' . $email . '>';
    }
    return '=?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>';
}

/** Envoie la commande (ou seulement lit la réponse si $command est vide) et vérifie le code SMTP. */
function smtp_command($fp, string $command, array $expected): string
{
    if ($command !== '' && fwrite($fp, $command . "\r\n") === false) {
        throw new RuntimeException('écriture SMTP impossible');
    }
    $raw = '';
    while (($line = fgets($fp, 515)) !== false) {
        $raw .= $line;
        // Une réponse multi-lignes se termine par "250 " (espace), pas "250-".
        if (strlen($line) < 4 || $line[3] === ' ') {
            break;
        }
    }
    if ($raw === '') {
        throw new RuntimeException('réponse SMTP vide (connexion interrompue ?)');
    }
    $code = (int)substr($raw, 0, 3);
    if (!in_array($code, $expected, true)) {
        throw new RuntimeException('SMTP ' . trim($raw));
    }
    return $raw;
}

function smtp_send(
    string $host,
    int $port,
    string $encryption,
    string $user,
    string $pass,
    string $fromEmail,
    string $to,
    string $message
): void {
    $prefix = $encryption === 'ssl' ? 'ssl://' : '';
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    $fp = @stream_socket_client(
        $prefix . $host . ':' . $port,
        $errno,
        $errstr,
        10,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if ($fp === false) {
        throw new RuntimeException("connexion SMTP {$host}:{$port} impossible ({$errstr})");
    }
    stream_set_timeout($fp, 10);

    try {
        smtp_command($fp, '', [220]);

        $hostname = (string)($_SERVER['SERVER_NAME'] ?? 'localhost');
        $hostname = $hostname !== '' ? $hostname : 'localhost';
        smtp_command($fp, 'EHLO ' . $hostname, [250]);

        if ($encryption === 'tls' || $encryption === 'starttls') {
            smtp_command($fp, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('négociation TLS impossible');
            }
            smtp_command($fp, 'EHLO ' . $hostname, [250]);
        }

        if ($user !== '') {
            smtp_command($fp, 'AUTH LOGIN', [334]);
            smtp_command($fp, base64_encode($user), [334]);
            smtp_command($fp, base64_encode($pass), [235]);
        }

        smtp_command($fp, 'MAIL FROM:<' . $fromEmail . '>', [250]);
        smtp_command($fp, 'RCPT TO:<' . $to . '>', [250, 251]);
        smtp_command($fp, 'DATA', [354]);

        $data = str_replace("\r\n.", "\r\n..", $message);
        if (substr($data, -2) !== "\r\n") {
            $data .= "\r\n";
        }
        if (fwrite($fp, $data . ".\r\n") === false) {
            throw new RuntimeException('envoi du message interrompu');
        }
        smtp_command($fp, '', [250]);

        smtp_command($fp, 'QUIT', [221, 250]);
    } finally {
        fclose($fp);
    }
}

/** Prévient le responsable du site qu'un nouveau message de contact est arrivé. */
function notify_new_contact_message(array $message): bool
{
    $recipient = mail_notification_recipient();
    if ($recipient === '') {
        error_log('mail: aucun destinataire pour la notification de contact');
        return false;
    }

    $name = (string)($message['name'] ?? '');
    $email = (string)($message['email'] ?? '');
    $phone = (string)($message['phone'] ?? '');
    $body = (string)($message['message'] ?? '');
    $e = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

    $text = "Nouveau message depuis le site\n\n"
        . "Nom : {$name}\n"
        . "Email : {$email}\n"
        . ($phone !== '' ? "Téléphone : {$phone}\n" : '')
        . "\n{$body}\n";

    $html = '<div style="font-family:Georgia,serif;color:#3B1705;max-width:560px">'
        . '<p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C97B1A;margin:0 0 8px">'
        . "Teint d'Afrique Cosmétiques</p>"
        . '<h1 style="font-size:22px;margin:0 0 16px">Nouveau message du site</h1>'
        . '<table cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.6">'
        . '<tr><td style="padding-right:12px;color:#3B1705;opacity:0.6">Nom</td><td>' . $e($name) . '</td></tr>'
        . '<tr><td style="padding-right:12px;color:#3B1705;opacity:0.6">Email</td><td>'
        . '<a href="mailto:' . $e($email) . '" style="color:#C97B1A">' . $e($email) . '</a></td></tr>'
        . ($phone !== ''
            ? '<tr><td style="padding-right:12px;color:#3B1705;opacity:0.6">Téléphone</td><td>' . $e($phone) . '</td></tr>'
            : '')
        . '</table>'
        . '<div style="margin-top:20px;padding:16px;background:#FAF6EF;border-left:3px solid #C97B1A;'
        . 'font-size:14px;line-height:1.7;white-space:pre-wrap">' . $e($body) . '</div>'
        . '<p style="font-size:12px;color:#3B1705;opacity:0.5;margin-top:20px">'
        . 'Répondez directement à cet email pour écrire au visiteur.</p>'
        . '</div>';

    return send_mail($recipient, 'Nouveau message de ' . $name, $html, $text, $email);
}

/** Envoie le lien de réinitialisation du mot de passe à un administrateur. */
function send_password_reset_mail(string $to, string $token): bool
{
    $base = app_base_url();
    if ($base === '') {
        error_log('mail: APP_URL non configuré, lien de réinitialisation incomplet');
    }
    $link = $base . '/admin?reset=' . rawurlencode($token);
    $e = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

    $text = "Réinitialisation du mot de passe\n\n"
        . "Ouvrez ce lien pour choisir un nouveau mot de passe (valable 1 heure) :\n{$link}\n\n"
        . "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n";

    $html = '<div style="font-family:Georgia,serif;color:#3B1705;max-width:560px">'
        . '<p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C97B1A;margin:0 0 8px">'
        . "Teint d'Afrique Cosmétiques</p>"
        . '<h1 style="font-size:22px;margin:0 0 16px">Réinitialiser votre mot de passe</h1>'
        . '<p style="font-size:14px;line-height:1.7">Ce lien est valable <strong>1 heure</strong> et ne peut servir '
        . "qu'une seule fois.</p>"
        . '<p style="margin:24px 0"><a href="' . $e($link) . '" style="background:#3B1705;color:#FAF6EF;'
        . 'padding:12px 22px;text-decoration:none;font-size:12px;letter-spacing:0.15em;text-transform:uppercase">'
        . 'Choisir un nouveau mot de passe</a></p>'
        . '<p style="font-size:12px;color:#3B1705;opacity:0.6;line-height:1.6">Si le bouton ne fonctionne pas, '
        . 'copiez ce lien dans votre navigateur :<br><span style="word-break:break-all">' . $e($link) . '</span></p>'
        . '<p style="font-size:12px;color:#3B1705;opacity:0.5;margin-top:20px">'
        . "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email : votre mot de passe reste inchangé.</p>"
        . '</div>';

    return send_mail($to, 'Réinitialisation de votre mot de passe', $html, $text);
}
