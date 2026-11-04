<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\GammeController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\ProduitController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Middleware\AuthenticateAdmin;
use App\Http\Middleware\VerifyCsrfToken;
use App\Support\ApiResponse;
use Illuminate\Support\Facades\Route;

Route::get('/', static fn () => ApiResponse::success([
    'service' => "Teint d'Afrique API",
    'status' => 'ok',
]));

Route::prefix('api')->group(function (): void {
    Route::get('auth/session.php', [AuthController::class, 'session']);
    Route::post('auth/login.php', [AuthController::class, 'login']);
    Route::post('auth/logout.php', [AuthController::class, 'logout']);
    Route::post('auth/password.php', [AuthController::class, 'password'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('auth/request-reset.php', [AuthController::class, 'requestReset']);
    Route::post('auth/reset.php', [AuthController::class, 'reset']);

    Route::get('admins/list.php', [AdminController::class, 'index'])
        ->middleware(AuthenticateAdmin::class);
    Route::post('admins/create.php', [AdminController::class, 'store'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('admins/delete.php', [AdminController::class, 'destroy'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::get('gammes/list.php', [GammeController::class, 'index']);
    Route::get('gammes/get.php', [GammeController::class, 'show']);
    Route::post('gammes/create.php', [GammeController::class, 'store'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('gammes/update.php', [GammeController::class, 'update'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('gammes/delete.php', [GammeController::class, 'destroy'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('gammes/reorder.php', [GammeController::class, 'reorder'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::post('produits/create.php', [ProduitController::class, 'store'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('produits/update.php', [ProduitController::class, 'update'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('produits/delete.php', [ProduitController::class, 'destroy'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('produits/reorder.php', [ProduitController::class, 'reorder'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::get('content/list.php', [ContentController::class, 'index']);
    Route::get('content/drafts.php', [ContentController::class, 'drafts'])
        ->middleware(AuthenticateAdmin::class);
    Route::post('content/update.php', [ContentController::class, 'store'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('content/publish.php', [ContentController::class, 'publish'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('content/discard.php', [ContentController::class, 'discard'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('content/delete.php', [ContentController::class, 'destroy'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::post('contact/submit.php', [ContactController::class, 'submit']);
    Route::get('contact/list.php', [ContactController::class, 'index'])
        ->middleware(AuthenticateAdmin::class);
    Route::post('contact/manage.php', [ContactController::class, 'manage'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::get('settings/list.php', [SettingsController::class, 'index']);
    Route::post('settings/update.php', [SettingsController::class, 'update'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);

    Route::get('media/list.php', [MediaController::class, 'index'])
        ->middleware(AuthenticateAdmin::class);
    Route::post('media/upload.php', [MediaController::class, 'upload'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('media/update.php', [MediaController::class, 'update'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
    Route::post('media/delete.php', [MediaController::class, 'destroy'])
        ->middleware([AuthenticateAdmin::class, VerifyCsrfToken::class]);
});
