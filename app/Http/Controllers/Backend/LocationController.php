<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\User;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.view')) {
            abort(403, 'You do not have permission to view locations.');
        }

        return Inertia::render('Backend/Locations/Index', [
            'locations' => Location::latest()->paginate(15),
        ]);
    }

    public function getActive(): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.get_active')) {
            abort(403, 'You do not have permission to view active locations.');
        }

        return response()->json(Location::active()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.create')) {
            abort(403, 'You do not have permission to create locations.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $location = Location::create($data);

        return response()->json($location, 201);
    }

    public function update(Request $request, Location $location): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.edit')) {
            abort(403, 'You do not have permission to edit locations.');
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $location->update($data);

        return response()->json($location);
    }

    public function toggleActive(Location $location): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.toggle_active')) {
            abort(403, 'You do not have permission to change location status.');
        }

        $location->update(['is_active' => ! $location->is_active]);

        return response()->json($location);
    }

    public function destroy(Location $location): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.delete')) {
            abort(403, 'You do not have permission to delete locations.');
        }

        $location->delete();

        return response()->json(['message' => 'Location deleted.']);
    }

    public function restore(Location $location): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.restore')) {
            abort(403, 'You do not have permission to restore locations.');
        }

        $location->restore();

        return response()->json(['message' => 'Location restored.']);
    }

    public function forceDelete(Location $location): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.force_delete')) {
            abort(403, 'You do not have permission to permanently delete locations.');
        }

        $location->forceDelete();

        return response()->json(['message' => 'Location permanently deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.bulk_delete')) {
            abort(403, 'You do not have permission to bulk delete locations.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Locations deleted.']);
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.bulk_restore')) {
            abort(403, 'You do not have permission to bulk restore locations.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->restore();

        return response()->json(['message' => 'Locations restored.']);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.bulk_activate')) {
            abort(403, 'You do not have permission to bulk activate locations.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->update(['is_active' => true]);

        return response()->json(['message' => 'Locations activated.']);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.bulk_deactivate')) {
            abort(403, 'You do not have permission to bulk deactivate locations.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->update(['is_active' => false]);

        return response()->json(['message' => 'Locations deactivated.']);
    }

    public function bulkForceDelete(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('locations.bulk_force_delete')) {
            abort(403, 'You do not have permission to permanently delete locations.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->forceDelete();

        return response()->json(['message' => 'Locations permanently deleted.']);
    }
}
