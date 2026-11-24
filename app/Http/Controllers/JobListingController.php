<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\AtsCalculationStatus;
use App\Models\Application;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;
use App\Services\ATSService;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class JobListingController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        $query = JobListing::with(['employer', 'category', 'locations']);

        if ($request->has('status') && $request->status === 'active') {
            $query->where('is_active', true);
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $listings = $query->latest()->paginate(15);

        return response()->json($listings);
    }

    public function adminCreate(): JsonResponse
    {
        return response()->json([
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
        ]);
    }

    public function adminStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id' => 'nullable|exists:job_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_listings,slug',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'job_type' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'education_requirement' => 'nullable|string',
            'education_details' => 'nullable|string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'benefits' => 'nullable|array',
            'skills' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'keywords' => 'nullable|array|max:100',
            'application_deadline' => 'nullable|date',
            'publish_at' => 'nullable|date',
            'is_active' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
        ]);

        $listing = JobListing::create(array_merge($data, [
            'user_id' => auth()->id(),
        ]));

        (new SimpleLogger())->info('job_listing.created', ['job_listing_id' => $listing->id]);

        return response()->json($listing, 201);
    }

    public function adminShow(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        return response()->json($jobListing->load(['employer', 'category', 'locations', 'applications']));
    }

    public function adminEdit(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        return response()->json([
            'listing' => $jobListing,
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
        ]);
    }

    public function adminUpdate(Request $request, JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $data = $request->validate([
            'category_id' => 'nullable|exists:job_categories,id',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:job_listings,slug,'.$jobListing->id,
            'description' => 'sometimes|required|string',
            'requirements' => 'nullable|string',
            'job_type' => 'nullable|string',
            'experience_level' => 'nullable|string',
            'education_requirement' => 'nullable|string',
            'education_details' => 'nullable|string',
            'salary_min' => 'nullable|numeric',
            'salary_max' => 'nullable|numeric',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'benefits' => 'nullable|array',
            'skills' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'keywords' => 'nullable|array|max:100',
            'application_deadline' => 'nullable|date',
            'publish_at' => 'nullable|date',
            'is_active' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
        ]);

        $jobListing->update($data);

        (new SimpleLogger())->info('job_listing.updated', ['job_listing_id' => $jobListing->id]);

        return response()->json($jobListing);
    }

    public function adminDestroy(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $jobListing->delete();

        (new SimpleLogger())->info('job_listing.deleted', ['job_listing_id' => $jobListing->id]);

        return response()->json(['message' => 'Job listing deleted.']);
    }

    public function toggleActive(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $jobListing->update(['is_active' => ! $jobListing->is_active]);

        return response()->json($jobListing);
    }

    public function restore(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $jobListing->restore();

        return response()->json($jobListing);
    }

    public function forceDelete(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $jobListing->forceDelete();

        return response()->json(['message' => 'Job listing permanently deleted.']);
    }

    public function applications(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        return response()->json($jobListing->applications()->with('user')->latest()->paginate(15));
    }

    public function bulkActivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobListing::whereIn('id', $ids)->where('user_id', auth()->id())->update(['is_active' => true]);

        return response()->json(['message' => 'Listings activated.']);
    }

    public function bulkDeactivate(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobListing::whereIn('id', $ids)->where('user_id', auth()->id())->update(['is_active' => false]);

        return response()->json(['message' => 'Listings deactivated.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $ids = $request->validate(['ids' => 'required|array'])->ids;

        JobListing::whereIn('id', $ids)->where('user_id', auth()->id())->delete();

        return response()->json(['message' => 'Listings deleted.']);
    }

    public function statistics(): JsonResponse
    {
        return response()->json([
            'jobs_by_type' => JobListing::select('job_type', \DB::raw('count(*) as count'))->groupBy('job_type')->get(),
            'jobs_by_category' => JobListing::select('category_id', \DB::raw('count(*) as count'))->groupBy('category_id')->get(),
            'applications_by_status' => Application::select('status', \DB::raw('count(*) as count'))->groupBy('status')->get(),
        ]);
    }

    protected function authorizeListing(JobListing $jobListing): void
    {
        $user = auth()->user();

        if ($user?->isAdmin()) {
            return;
        }

        if ($jobListing->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
