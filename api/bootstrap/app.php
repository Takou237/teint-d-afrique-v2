<?php

use App\Support\ApiException;
use App\Support\ApiResponse;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->dontReport([
            ApiException::class,
        ]);

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($e instanceof ApiException) {
                return ApiResponse::error($e->errorCode, $e->status);
            }

            if (!$request->is('api/*')) {
                return null;
            }

            if ($e instanceof MethodNotAllowedHttpException) {
                return ApiResponse::error('method_not_allowed', 405);
            }

            if ($e instanceof NotFoundHttpException) {
                return ApiResponse::error('not_found', 404);
            }

            error_log('[API Error] ' . get_class($e) . ': ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            report($e);

            if (config('app.debug')) {
                return ApiResponse::error($e->getMessage(), 500);
            }

            return ApiResponse::error('internal_error', 500);
        });
    })->create();
