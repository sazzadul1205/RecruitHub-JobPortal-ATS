<?php

namespace App\Http\Controllers;

use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\Application;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    public function adminIndex(Request $request): Response
    {
        $query = JobListing::with(['employer', 'category', 'locations']);

        if ($request->has('status') && $request->status === 'active') {
            $query->where('is_active', true);
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $listings = $query->latest()->paginate(15);

        $activeJobs = JobListing::where('is_active', true)->count();
        $inactiveJobs = JobListing::where('is_active', false)->count();
        $deletedJobs = JobListing::onlyTrashed()->count();
        $totalViews = JobListing::sum('views_count');
        $totalJobs = JobListing::count();

        return Inertia::render('Backend/JobListings/Index', [
            'jobListings' => $listings,
            'activeJobs' => $activeJobs,
            'inactiveJobs' => $inactiveJobs,
            'deletedJobs' => $deletedJobs,
            'totalViews' => $totalViews,
            'totalJobs' => $totalJobs,
            'filters' => $request->only(['status', 'category']),
            'filterOptions' => [
                'categories' => JobCategory::active()->get(),
                'jobTypes' => collect(JobType::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
                'experienceLevels' => collect(ExperienceLevel::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
                'locations' => Location::active()->get(),
            ],
        ]);
    }

    public function adminCreate(): Response
    {
        return Inertia::render('Backend/JobListings/Create', [
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

        (new SimpleLogger)->info('job_listing.created', ['job_listing_id' => $listing->id]);

        return response()->json($listing, 201);
    }

    public function adminShow(JobListing $jobListing): Response
    {
        $this->authorizeListing($jobListing);

        $jobListing->load(['employer', 'category', 'locations', 'applications.user']);

        $applicationStats = $jobListing->applications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $averageAtsScore = $jobListing->applications()
            ->whereNotNull('ats_percentage')
            ->avg('ats_percentage');

        $recentApplications = $jobListing->applications()
            ->with('user')
            ->latest()
            ->take(10)
            ->get();

        $totalViews = $jobListing->views_count;

        return Inertia::render('Backend/JobListings/Show', [
            'jobListing' => $jobListing,
            'applicationStats' => $applicationStats,
            'averageAtsScore' => round($averageAtsScore ?? 0, 1),
            'recentApplications' => $recentApplications,
            'totalViews' => $totalViews,
        ]);
    }

    public function adminEdit(JobListing $jobListing): Response
    {
        $this->authorizeListing($jobListing);

        return Inertia::render('Backend/JobListings/Edit', [
            'jobListing' => $jobListing,
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

        (new SimpleLogger)->info('job_listing.updated', ['job_listing_id' => $jobListing->id]);

        return response()->json($jobListing);
    }

    public function adminDestroy(JobListing $jobListing): JsonResponse
    {
        $this->authorizeListing($jobListing);

        $jobListing->delete();

        (new SimpleLogger)->info('job_listing.deleted', ['job_listing_id' => $jobListing->id]);

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

    public function applications(JobListing $jobListing): Response
    {
        $this->authorizeListing($jobListing);

        $applications = $jobListing->applications()->with('user')->latest()->paginate(15);

        $stats = [
            'total' => $jobListing->applications()->count(),
            'pending' => $jobListing->applications()->where('status', 'pending')->count(),
            'shortlisted' => $jobListing->applications()->where('status', 'shortlisted')->count(),
            'rejected' => $jobListing->applications()->where('status', 'rejected')->count(),
            'hired' => $jobListing->applications()->where('status', 'hired')->count(),
        ];

        return Inertia::render('Backend/JobListings/Applications', [
            'jobListing' => $jobListing,
            'applications' => $applications,
            'stats' => $stats,
        ]);
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

    public function statistics(): Response
    {
        $summary = [
            'total_jobs' => JobListing::count(),
            'active_jobs' => JobListing::where('is_active', true)->count(),
            'total_applications' => Application::count(),
            'pending_applications' => Application::where('status', 'pending')->count(),
            'shortlisted_applications' => Application::where('status', 'shortlisted')->count(),
            'rejected_applications' => Application::where('status', 'rejected')->count(),
            'hired_applications' => Application::where('status', 'hired')->count(),
        ];

        $trends = [
            'jobs_growth' => '+12%',
            'applications_growth' => '+8%',
        ];

        $jobsByType = JobListing::select('job_type', \DB::raw('count(*) as count'))->groupBy('job_type')->get();
        $jobsByExperience = JobListing::select('experience_level', \DB::raw('count(*) as count'))->groupBy('experience_level')->get();
        $jobsByCategory = JobListing::select('category_id', \DB::raw('count(*) as count'))->groupBy('category_id')->with('category')->get();
        $jobsByLocation = JobListing::join('job_listing_location', 'job_listings.id', '=', 'job_listing_location.job_listing_id')
            ->join('locations', 'job_listing_location.location_id', '=', 'locations.id')
            ->select('locations.name', \DB::raw('count(*) as count'))
            ->groupBy('locations.name')->get();
        $monthlyJobs = JobListing::select(\DB::raw('MONTH(created_at) as month'), \DB::raw('count(*) as count'))->groupBy('month')->orderBy('month')->get();
        $applicationsByStatus = Application::select('status', \DB::raw('count(*) as count'))->groupBy('status')->get();
        $monthlyApplications = Application::select(\DB::raw('MONTH(created_at) as month'), \DB::raw('count(*) as count'))->groupBy('month')->orderBy('month')->get();
        $applicationsByJob = JobListing::withCount('applications')->orderByDesc('applications_count')->take(10)->get();
        $atsScoreByJobType = JobListing::select('job_type', \DB::raw('AVG(views_count) as avg_views'))->groupBy('job_type')->get();
        $topEmployers = User::where('role_id', function ($q) {
            $q->select('id')->from('roles')->where('slug', 'employer');
        })->withCount('jobListings')->orderByDesc('job_listings_count')->take(10)->get();
        $topEmployersByApplications = User::where('role_id', function ($q) {
            $q->select('id')->from('roles')->where('slug', 'employer');
        })->withCount('jobListings')->withCount('jobListings as applications_count', function ($q) {
            $q->join('applications', 'applications.job_listing_id', '=', 'job_listings.id');
        })->orderByDesc('applications_count')->take(10)->get();

        return Inertia::render('Backend/Statistics/Index', [
            'summary' => $summary,
            'trends' => $trends,
            'jobsByType' => $jobsByType,
            'jobsByExperience' => $jobsByExperience,
            'jobsByCategory' => $jobsByCategory,
            'jobsByLocation' => $jobsByLocation,
            'monthlyJobs' => $monthlyJobs,
            'applicationsByStatus' => $applicationsByStatus,
            'monthlyApplications' => $monthlyApplications,
            'applicationsByJob' => $applicationsByJob,
            'atsScoreByJobType' => $atsScoreByJobType,
            'topEmployers' => $topEmployers,
            'topEmployersByApplications' => $topEmployersByApplications,
            'dateRange' => 'all_time',
            'filters' => [],
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
