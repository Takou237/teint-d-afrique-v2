<?php

namespace App\Http\Middleware;

use App\Support\ApiException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyCsrfToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $expected = (string) $request->session()->get('csrf_token', '');
        $provided = (string) $request->header('X-CSRF-Token', '');

        if ($expected === '' || $provided === '' || !hash_equals($expected, $provided)) {
            throw new ApiException('invalid_csrf_token', 403);
        }

        return $next($request);
    }
}
