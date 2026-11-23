<?php

namespace App\Http\Middleware\RBAC;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class OwnershipCheck
{
    public function handle(Request $request, Closure $next, string $model, string $userField = 'user_id'): Response
    {
        $user = auth()->user();
        if (! $user) {
            abort(403);
        }

        if ($user->isAdmin()) {
            return $next($request);
        }

        $id = $request->route($model) ?? $request->input('id');
        if (! $id) {
            abort(403);
        }

        $record = app("App\Models\\".ucfirst($model))->find($id);
        if (! $record) {
            abort(404);
        }

        if ($record->{$userField} != $user->id) {
            abort(403);
        }

        return $next($request);
    }
}
