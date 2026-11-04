<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class Mailer
{
    public static function notificationRecipient(): string
    {
        $fallback = trim((string) config('mail.notify_to', ''));

        try {
            $value = (string) (DB::table('settings')->where('key', 'email')->value('value') ?? '');
            if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                return $value;
            }
        } catch (\Throwable $e) {
            Log::warning('mail: setting email unreadable - ' . $e->getMessage());
        }

        return filter_var($fallback, FILTER_VALIDATE_EMAIL) ? $fallback : '';
    }

    public static function appBaseUrl(): string
    {
        $configured = rtrim(trim((string) config('app.url', '')), '/');
        if ($configured !== '') {
            return $configured;
        }

        return rtrim((string) request()->root(), '/');
    }

    public static function send(string $to, string $subject, string $html, string $text = '', string $replyTo = ''): bool
    {
        $to = trim($to);
        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            Log::warning('mail: invalid recipient');

            return false;
        }

        $fromEmail = trim((string) config('mail.from.address', ''));
        if (!filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
            Log::warning('mail: from address is not configured');

            return false;
        }
        $fromName = trim((string) config('mail.from.name', ''));

        try {
            Mail::send([], [], static function ($message) use ($fromEmail, $fromName, $to, $subject, $html, $text, $replyTo): void {
                $message->from($fromEmail, $fromName)
                    ->to($to)
                    ->subject($subject);

                if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
                    $message->replyTo($replyTo);
                }

                $message->html($html);

                if ($text !== '') {
                    $message->text($text);
                }
            });

            return true;
        } catch (\Throwable $e) {
            Log::error('mail: ' . $e->getMessage());

            return false;
        }
    }

    public static function notifyNewContactMessage(array $message): bool
    {
        $recipient = self::notificationRecipient();
        if ($recipient === '') {
            Log::warning('mail: no recipient for contact notification');

            return false;
        }

        $name = (string) ($message['name'] ?? '');
        $email = (string) ($message['email'] ?? '');
        $phone = (string) ($message['phone'] ?? '');
        $body = (string) ($message['message'] ?? '');
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

        return self::send($recipient, 'Nouveau message de ' . $name, $html, $text, $email);
    }

    public static function sendPasswordReset(string $to, string $token): bool
    {
        $base = self::appBaseUrl();
        if ($base === '') {
            Log::warning('mail: APP_URL is not configured, reset link is incomplete');
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

        return self::send($to, 'Réinitialisation de votre mot de passe', $html, $text);
    }
}
