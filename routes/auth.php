<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\ProfileCompletionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Profile completion
    Route::get('profile/complete', [ProfileCompletionController::class, 'show'])
        ->name('profile.complete');
    Route::post('profile/complete', [ProfileCompletionController::class, 'store'])
        ->name('profile.complete.store');
    Route::post('profile/cv', [ProfileCompletionController::class, 'uploadCv'])
        ->name('profile.cv.store');
    Route::delete('profile/cv/{cv}', [ProfileCompletionController::class, 'destroyCv'])
        ->name('profile.cv.destroy');
    Route::patch('profile/cv/{cv}/primary', [ProfileCompletionController::class, 'primaryCv'])
        ->name('profile.cv.primary');
    Route::post('profile/photo', [ProfileCompletionController::class, 'uploadPhoto'])
        ->name('profile.photo.store');
});
