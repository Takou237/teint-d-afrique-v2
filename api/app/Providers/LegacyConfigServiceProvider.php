<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class LegacyConfigServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if ($this->app->environment('testing')) {
            return;
        }

        $path = base_path('config.php');
        if (!is_file($path)) {
            return;
        }

        $legacy = require $path;
        if (!is_array($legacy)) {
            return;
        }

        $db = $legacy['db'] ?? null;
        if (is_array($db)) {
            config([
                'database.default' => 'mysql',
                'database.connections.mysql.host' => $db['host'] ?? config('database.connections.mysql.host'),
                'database.connections.mysql.port' => (int) ($db['port'] ?? config('database.connections.mysql.port')),
                'database.connections.mysql.database' => $db['name'] ?? config('database.connections.mysql.database'),
                'database.connections.mysql.username' => $db['user'] ?? config('database.connections.mysql.username'),
                'database.connections.mysql.password' => $db['pass'] ?? config('database.connections.mysql.password'),
                'database.connections.mysql.charset' => $db['charset'] ?? config('database.connections.mysql.charset'),
            ]);
        }

        $sessionName = trim((string) ($legacy['session_name'] ?? ''));
        if ($sessionName !== '') {
            config(['session.cookie' => $sessionName]);
        }

        $sameSite = strtolower(trim((string) ($legacy['session_same_site'] ?? '')));
        if ($sameSite !== '') {
            config(['session.same_site' => $sameSite]);
        }

        $secure = $legacy['session_secure'] ?? null;
        if ($secure !== null) {
            config(['session.secure' => (bool) $secure || $sameSite === 'none']);
        }

        $appUrl = rtrim(trim((string) ($legacy['app_url'] ?? '')), '/');
        if ($appUrl !== '') {
            config(['app.url' => $appUrl]);
        }

        $corsOrigins = $legacy['cors_origins'] ?? null;
        if (is_array($corsOrigins) && $corsOrigins !== []) {
            config(['cors.allowed_origins' => array_values($corsOrigins)]);
        }

        $mail = $legacy['mail'] ?? null;
        if (is_array($mail)) {
            $transport = strtolower((string) ($mail['transport'] ?? 'smtp'));
            $encryption = strtolower((string) ($mail['encryption'] ?? ''));

            $scheme = null;
            if ($transport === 'smtp') {
                $scheme = match ($encryption) {
                    'ssl', 'smtps' => 'smtps',
                    '', 'none' => null,
                    default => 'smtp',
                };
            }

            config([
                'mail.default' => $transport === 'mail' ? 'sendmail' : 'smtp',
                'mail.mailers.smtp.host' => $mail['host'] ?? config('mail.mailers.smtp.host'),
                'mail.mailers.smtp.port' => (int) ($mail['port'] ?? config('mail.mailers.smtp.port')),
                'mail.mailers.smtp.username' => $mail['user'] ?? config('mail.mailers.smtp.username'),
                'mail.mailers.smtp.password' => $mail['pass'] ?? config('mail.mailers.smtp.password'),
                'mail.mailers.smtp.scheme' => $scheme,
                'mail.from.address' => $mail['from_email'] ?? config('mail.from.address'),
                'mail.from.name' => $mail['from_name'] ?? config('mail.from.name'),
                'mail.notify_to' => $mail['notify_to'] ?? config('mail.notify_to'),
            ]);
        }
    }
}
