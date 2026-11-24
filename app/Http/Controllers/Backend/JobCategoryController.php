<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\JobCategory;
use App\Models\User;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobCategoryController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.view')) {
            abort(403, 'You do not have permission to view categories.');
        }

        return Inertia::render('Backend/JobCategories/Index', [
            'categories' => JobCategory::latest()->paginate(15),
        ]);
    }

    public function getActive(): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.get_active')) {
            abort(403, 'You do not have permission to view active categories.');
        }

        return response()->json(JobCategory::active()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.create')) {
            abort(403, 'You do not have permission to create categories.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_categories,slug',
            'is_active' => 'boolean',
        ]);

        $category = JobCategory::create($data);

        return response()->json($category, 201);
    }

    public function update(Request $request, JobCategory $jobCategory): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.edit')) {
            abort(403, 'You do not have permission to edit categories.');
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:job_categories,slug,'.$jobCategory->id,
            'is_active' => 'boolean',
        ]);

        $jobCategory->update($data);

        return response()->json($jobCategory);
    }

    public function toggleActive(JobCategory $jobCategory): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.toggle_active')) {
            abort(403, 'You do not have permission to change category status.');
        }

        $jobCategory->update(['is_active' => ! $jobCategory->is_active]);

        return response()->json($jobCategory);
    }

    public function destroy(JobCategory $jobCategory): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.delete')) {
            abort(403, 'You do not have permission to delete categories.');
        }

        $jobCategory->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    public function restore(JobCategory $jobCategory): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.restore')) {
            abort(403, 'You do not have permission to restore categories.');
        }

        $jobCategory->restore();

        return response()->json(['message' => 'Category restored.']);
    }

    public function forceDelete(JobCategory $jobCategory): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.force_delete')) {
            abort(403, 'You do not have permission to permanently delete categories.');
        }

        $jobCategory->forceDelete();

        return response()->json(['message' => 'Category permanently deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.bulk_delete')) {
            abort(403, 'You do not have permission to bulk delete categories.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Categories deleted.']);
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.bulk_restore')) {
            abort(403, 'You do not have permission to bulk restore categories.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->restore();

        return response()->json(['message' => 'Categories restored.']);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.bulk_activate')) {
            abort(403, 'You do not have permission to bulk activate categories.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->update(['is_active' => true]);

        return response()->json(['message' => 'Categories activated.']);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.bulk_deactivate')) {
            abort(403, 'You do not have permission to bulk deactivate categories.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->update(['is_active' => false]);

        return response()->json(['message' => 'Categories deactivated.']);
    }

    public function bulkForceDelete(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('categories.bulk_force_delete')) {
            abort(403, 'You do not have permission to permanently delete categories.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->forceDelete();

        return response()->json(['message' => 'Categories permanently deleted.']);
    }
}
