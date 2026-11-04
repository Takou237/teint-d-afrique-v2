<?php

namespace App\Support;

use RuntimeException;

class ApiException extends RuntimeException
{
    public function __construct(
        public readonly string $errorCode,
        public readonly int $status = 400,
    ) {
        parent::__construct($errorCode);
    }
}
