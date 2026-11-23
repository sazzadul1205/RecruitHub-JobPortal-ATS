<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        abort_unless(\Gate::allows('viewAnyLocation'), 403);

        $locations = Location::withCount('listings')->latest()->paginate(15);

        return Inertia::render('locations/index', [
            'locations' => $locations,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('createLocation'), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:locations',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        Location::create($validated);

        return back()->with('success', 'Location created.');
    }

    public function update(Request $request, Location $location): RedirectResponse
    {
        abort_unless(\Gate::allows('updateLocation', $location), 403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:locations,slug,'.$location->id,
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $location->update($validated);

        return back()->with('success', 'Location updated.');
    }

    public function toggleActive(Location $location): RedirectResponse
    {
        abort_unless(\Gate::allows('toggleActiveLocation'), 403);

        $location->update(['is_active' => ! $location->is_active]);

        return back()->with('success', 'Location status updated.');
    }

    public function destroy(Location $location): RedirectResponse
    {
        abort_unless(\Gate::allows('deleteLocation'), 403);

        $location->delete();

        return back()->with('success', 'Location deleted.');
    }

    public function restore(Location $location): RedirectResponse
    {
        abort_unless(\Gate::allows('restoreLocation'), 403);

        $location->restore();

        return back()->with('success', 'Location restored.');
    }

    public function forceDelete(Location $location): RedirectResponse
    {
        abort_unless(\Gate::allows('forceDeleteLocation'), 403);

        $location->forceDelete();

        return back()->with('success', 'Location permanently deleted.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkDeleteLocation'), 403);

        $request->validate(['ids' => 'required|array']);

        Location::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Locations deleted.');
    }

    public function bulkRestore(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkRestoreLocation'), 403);

        $request->validate(['ids' => 'required|array']);

        Location::whereIn('id', $request->ids)->restore();

        return back()->with('success', 'Locations restored.');
    }

    public function bulkActivate(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkActivateLocation'), 403);

        $request->validate(['ids' => 'required|array']);

        Location::whereIn('id', $request->ids)->update(['is_active' => true]);

        return back()->with('success', 'Locations activated.');
    }

    public function bulkDeactivate(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkDeactivateLocation'), 403);

        $request->validate(['ids' => 'required|array']);

        Location::whereIn('id', $request->ids)->update(['is_active' => false]);

        return back()->with('success', 'Locations deactivated.');
    }

    public function getActiveLocations()
    {
        return response()->json(Location::active()->get(['id', 'name', 'slug']));
    }
}
