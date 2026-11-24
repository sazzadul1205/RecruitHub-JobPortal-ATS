<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login-jsx', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();
        $roleSlug = $user->role?->slug;

        $hasProfile = $user->applicantProfile()->exists();

        return match ($roleSlug) {
            'admin' => $hasProfile ? redirect()->intended(route('backend.listing.index', absolute: false)) : redirect()->intended(route('profile.complete')),
            'employer' => $hasProfile ? redirect()->intended(route('backend.listing.index', absolute: false)) : redirect()->intended(route('profile.complete')),
            default => $hasProfile ? redirect()->intended(route('backend.seeker.jobs.index', absolute: false)) : redirect()->intended(route('profile.complete')),
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
