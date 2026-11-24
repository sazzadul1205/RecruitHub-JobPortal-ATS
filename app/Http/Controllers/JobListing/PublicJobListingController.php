<?php

namespace App\Http\Controllers\JobListing;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicJobListingController extends Controller
{
    public function index(Request $request): Response
    {
        $query = JobListing::active()->with(['category', 'locations']);

        if ($request->has('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%'.$request->keyword.'%')
                    ->orWhere('description', 'like', '%'.$request->keyword.'%');
            });
        }

        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        if ($request->has('location')) {
            $query->whereHas('locations', fn ($q) => $q->where('locations.id', $request->location));
        }

        if ($request->has('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->has('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        $sort = $request->sort ?? 'latest';
        match ($sort) {
            'oldest' => $query->oldest(),
            'deadline_soon' => $query->orderBy('application_deadline', 'asc'),
            'deadline_latest' => $query->orderBy('application_deadline', 'desc'),
            'salary_high' => $query->orderBy('salary_max', 'desc'),
            'salary_low' => $query->orderBy('salary_min', 'asc'),
            default => $query->latest(),
        };

        return Inertia::render('Backend/PublicJobListing/Index', [
            'jobListings' => $query->paginate(15)->withQueryString(),
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'filters' => $request->only(['keyword', 'category', 'location', 'job_type', 'experience_level', 'sort']),
            'stats' => [
                'total_jobs' => $query->count(),
                'total_views' => JobListing::sum('views_count'),
                'total_applications' => Application::count(),
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $listing = JobListing::active()->where('slug', $slug)->with(['category', 'locations'])->firstOrFail();

        $listing->increment('views_count');

        $related = JobListing::active()
            ->where('category_id', $listing->category_id)
            ->where('id', '!=', $listing->id)
            ->limit(3)
            ->get();

        return Inertia::render('Backend/PublicJobListing/Show', [
            'jobListing' => $listing,
            'related' => $related,
        ]);
    }

    public function popular(): JsonResponse
    {
        return response()->json(JobListing::active()->orderByDesc('views_count')->limit(10)->get());
    }

    public function trending(): JsonResponse
    {
        return response()->json(JobListing::active()->withCount('applications')->orderByDesc('applications_count')->limit(10)->get());
    }

    public function categories(): JsonResponse
    {
        return response()->json(JobCategory::active()->get());
    }

    public function locations(): JsonResponse
    {
        return response()->json(Location::active()->get());
    }
}
