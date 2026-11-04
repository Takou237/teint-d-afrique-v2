<?php

$origins = array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ORIGINS', '')))));

return [
    'paths' => ['api/*', 'uploads/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => $origins,
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
