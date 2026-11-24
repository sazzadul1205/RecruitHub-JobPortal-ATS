<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobCategoryController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Backend/JobCategories/Index', [
            'categories' => JobCategory::latest()->paginate(15),
        ]);
    }

    public function getActive(): JsonResponse
    {
        return response()->json(JobCategory::active()->get());
    }

    public function store(Request $request): JsonResponse
    {
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
        $jobCategory->update(['is_active' => ! $jobCategory->is_active]);

        return response()->json($jobCategory);
    }

    public function destroy(JobCategory $jobCategory): JsonResponse
    {
        $jobCategory->delete();

        return response()->json(['message' => 'Category deleted.']);
    }

    public function restore(JobCategory $jobCategory): JsonResponse
    {
        $jobCategory->restore();

        return response()->json($jobCategory);
    }

    public function forceDelete(JobCategory $jobCategory): JsonResponse
    {
        $jobCategory->forceDelete();

        return response()->json(['message' => 'Category permanently deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->delete();

        return response()->json(['message' => 'Categories deleted.']);
    }

    public function bulkRestore(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->restore();

        return response()->json(['message' => 'Categories restored.']);
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->update(['is_active' => true]);

        return response()->json(['message' => 'Categories activated.']);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->update(['is_active' => false]);

        return response()->json(['message' => 'Categories deactivated.']);
    }

    public function bulkForceDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobCategory::whereIn('id', $ids)->forceDelete();

        return response()->json(['message' => 'Categories permanently deleted.']);
    }
}
