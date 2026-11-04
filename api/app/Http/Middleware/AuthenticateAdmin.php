<?php

namespace App\Http\Middleware;

use App\Support\ApiException;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (empty($request->session()->get('admin_id'))) {
            throw new ApiException('unauthorized', 401);
        }

        return $next($request);
    }
}
