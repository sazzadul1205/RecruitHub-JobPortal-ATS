<?php

namespace App\Http\Controllers;

use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicJobListingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JobListing::with(['category', 'locations'])
            ->active()
            ->published();

        if ($request->filled('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->keyword}%")
                    ->orWhere('description', 'like', "%{$request->keyword}%")
                    ->orWhere('skills', 'like', "%{$request->keyword}%");
            });
        }
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('location')) {
            $query->whereHas('locations', fn ($q) => $q->where('locations.id', $request->location));
        }
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }
        if ($request->filled('salary_min')) {
            $query->where('salary_max', '>=', $request->salary_min);
        }
        if ($request->filled('salary_max')) {
            $query->where('salary_min', '<=', $request->salary_max);
        }

        $sort = $request->get('sort', 'latest');
        $query->match($sort, [
            'latest' => fn ($q) => $q->latest('publish_at'),
            'oldest' => fn ($q) => $q->oldest('publish_at'),
            'deadline_soon' => fn ($q) => $q->orderBy('application_deadline', 'asc'),
            'deadline_latest' => fn ($q) => $q->orderBy('application_deadline', 'desc'),
            'salary_high' => fn ($q) => $q->orderBy('salary_max', 'desc'),
            'salary_low' => fn ($q) => $q->orderBy('salary_min', 'asc'),
            'popular' => fn ($q) => $q->orderBy('views_count', 'desc'),
            'most_applied' => fn ($q) => $q->withCount('applications')->orderBy('applications_count', 'desc'),
        ][$sort] ?? fn ($q) => $q->latest());

        $jobs = $query->paginate(12)->withQueryString();

        return Inertia::render('jobs/public-index', [
            'jobs' => $jobs,
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'filters' => $request->only(['keyword', 'category', 'location', 'job_type', 'experience_level', 'salary_min', 'salary_max', 'sort']),
        ]);
    }

    public function show(JobListing $jobListing): Response
    {
        if (!$jobListing->is_active || !$jobListing->isPublished()) {
            abort(404);
        }

        $ip = request()->ip();
        \App\Models\JobView::updateOrCreate(
            ['job_listing_id' => $jobListing->id, 'ip_address' => $ip],
            ['job_listing_id' => $jobListing->id, 'ip_address' => $ip]
        );

        $jobListing->increment('views_count');

        $jobListing->load(['category', 'locations', 'employer']);

        $related = JobListing::where('category_id', $jobListing->category_id)
            ->where('id', '!=', $jobListing->id)
            ->active()
            ->published()
            ->limit(3)
            ->get();

        return Inertia::render('jobs/public-show', [
            'job' => $jobListing,
            'related_jobs' => $related,
        ]);
    }

    public function popular(Request $request)
    {
        $jobs = JobListing::active()
            ->published()
            ->orderBy('views_count', 'desc')
            ->limit(10)
            ->get(['id', 'title', 'slug', 'views_count']);

        return response()->json($jobs);
    }

    public function trending(Request $request)
    {
        $jobs = JobListing::active()
            ->published()
            ->withCount('applications')
            ->orderBy('applications_count', 'desc')
            ->limit(10)
            ->get(['id', 'title', 'slug', 'applications_count']);

        return response()->json($jobs);
    }
}
