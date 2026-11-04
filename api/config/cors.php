<?php

$origins = array_values(array_filter(array_map('trim', explode(',', (string) env('CORS_ORIGINS', '')))));

return [
    'paths' => ['api/*', 'uploads/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => empty($origins) ? ['*'] : $origins,
    'allowed_origins_patterns' => [
        '#^https?://.*\.vercel\.app$#',
        '#^https?://localhost(:[0-9]+)?$#',
        '#^https?://127\.0\.0\.1(:[0-9]+)?$#',
    ],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['*'],
    'max_age' => 86400,
    'supports_credentials' => true,
];
