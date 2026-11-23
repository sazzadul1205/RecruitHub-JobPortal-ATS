<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobCategoryController extends Controller
{
    public function index(): Response
    {

        $categories = JobCategory::withCount('jobListings')->latest()->paginate(15);

        return Inertia::render('categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_categories',
            'is_active' => 'boolean',
        ]);

        JobCategory::create($validated);

        return back()->with('success', 'Category created.');
    }

    public function update(Request $request, JobCategory $category): RedirectResponse
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_categories,slug,'.$category->id,
            'is_active' => 'boolean',
        ]);

        $category->update($validated);

        return back()->with('success', 'Category updated.');
    }

    public function toggleActive(JobCategory $category): RedirectResponse
    {

        $category->update(['is_active' => ! $category->is_active]);

        return back()->with('success', 'Category status updated.');
    }

    public function destroy(JobCategory $category): RedirectResponse
    {

        $category->delete();

        return back()->with('success', 'Category deleted.');
    }

    public function restore(JobCategory $category): RedirectResponse
    {

        $category->restore();

        return back()->with('success', 'Category restored.');
    }

    public function forceDelete(JobCategory $category): RedirectResponse
    {

        $category->forceDelete();

        return back()->with('success', 'Category permanently deleted.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {

        $request->validate(['ids' => 'required|array']);

        JobCategory::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Categories deleted.');
    }

    public function bulkRestore(Request $request): RedirectResponse
    {

        $request->validate(['ids' => 'required|array']);

        JobCategory::whereIn('id', $request->ids)->restore();

        return back()->with('success', 'Categories restored.');
    }

    public function bulkActivate(Request $request): RedirectResponse
    {

        $request->validate(['ids' => 'required|array']);

        JobCategory::whereIn('id', $request->ids)->update(['is_active' => true]);

        return back()->with('success', 'Categories activated.');
    }

    public function bulkDeactivate(Request $request): RedirectResponse
    {

        $request->validate(['ids' => 'required|array']);

        JobCategory::whereIn('id', $request->ids)->update(['is_active' => false]);

        return back()->with('success', 'Categories deactivated.');
    }

    public function bulkForceDelete(Request $request): RedirectResponse
    {

        $request->validate(['ids' => 'required|array']);

        JobCategory::whereIn('id', $request->ids)->forceDelete();

        return back()->with('success', 'Categories permanently deleted.');
    }

    public function getActiveCategories()
    {
        return response()->json(JobCategory::active()->get(['id', 'name', 'slug']));
    }
}
