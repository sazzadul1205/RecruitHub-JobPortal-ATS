<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/Locations/Index', [
            'locations' => Location::latest()->paginate(15),
        ]);
    }

    public function getActive(): JsonResponse
    {
        return response()->json(Location::active()->get());
    }

    public function store(Request $request): JsonResponse
    {
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
        $location->update(['is_active' => ! $location->is_active]);

        return response()->json($location);
    }

    public function destroy(Location $location): JsonResponse
    {
        $location->delete();

        return response()->json(['message' => 'Location deleted.']);
    }

    public function restore(Location $location): JsonResponse
    {
        $location->restore();

        return response()->json($location);
    }

    public function forceDelete(Location $location): JsonResponse
    {
        $location->forceDelete();

        return response()->json(['message' => 'Location permanently deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Locations deleted.']);
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->restore();

        return response()->json(['message' => 'Locations restored.']);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->update(['is_active' => true]);

        return response()->json(['message' => 'Locations activated.']);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        Location::whereIn('id', $ids)->update(['is_active' => false]);

        return response()->json(['message' => 'Locations deactivated.']);
    }
}
