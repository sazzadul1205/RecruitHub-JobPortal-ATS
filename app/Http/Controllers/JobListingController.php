<?php

namespace App\Http\Controllers;

use App\Enums\EducationRequirement;
use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\Application;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    public function adminIndex(Request $request): Response
    {
        abort_unless(\Gate::allows('viewAnyJobListing'), 403);

        $query = JobListing::with(['employer', 'category', 'locations']);

        if ($request->filled('status')) {
            $query->where('is_active', $request->boolean('status'));
        }
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }
        if ($request->filled('location')) {
            $query->whereHas('locations', fn ($q) => $q->where('locations.id', $request->location));
        }
        if ($request->filled('employer')) {
            $query->where('user_id', $request->employer);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        $jobs = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('jobs/admin-index', [
            'jobs' => $jobs,
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'employers' => User::whereHas('jobListings')->get(),
            'jobTypes' => JobType::cases(),
            'experienceLevels' => ExperienceLevel::cases(),
            'filters' => $request->only(['status', 'category', 'job_type', 'experience_level', 'location', 'employer', 'search']),
        ]);
    }

    public function adminCreate(): Response
    {
        abort_unless(\Gate::allows('createJobListing'), 403);

        return Inertia::render('jobs/admin-create', [
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'jobTypes' => JobType::cases(),
            'experienceLevels' => ExperienceLevel::cases(),
            'educationRequirements' => EducationRequirement::cases(),
        ]);
    }

    public function adminStore(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('createJobListing'), 403);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:job_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_listings',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'job_type' => 'required|string',
            'experience_level' => 'required|string',
            'education_requirement' => 'nullable|string',
            'education_details' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'benefits' => 'nullable|array',
            'skills' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'keywords' => 'nullable|array|max:100',
            'publish_at' => 'nullable|date',
            'application_deadline' => 'nullable|date|after:publish_at',
            'is_active' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
        ]);

        $validated['user_id'] = auth()->id();

        JobListing::create($validated);

        return redirect()->route('jobs.admin.index')->with('success', 'Job listing created successfully.');
    }

    public function adminShow(JobListing $jobListing): Response
    {
        abort_unless(\Gate::allows('viewJobListing', $jobListing), 403);

        $jobListing->load(['employer', 'category', 'locations', 'applications.user']);

        return Inertia::render('jobs/admin-show', [
            'job' => $jobListing,
        ]);
    }

    public function adminEdit(JobListing $jobListing): Response
    {
        abort_unless(\Gate::allows('updateJobListing', $jobListing), 403);

        return Inertia::render('jobs/admin-edit', [
            'job' => $jobListing,
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'jobTypes' => JobType::cases(),
            'experienceLevels' => ExperienceLevel::cases(),
            'educationRequirements' => EducationRequirement::cases(),
        ]);
    }

    public function adminUpdate(Request $request, JobListing $jobListing): RedirectResponse
    {
        abort_unless(\Gate::allows('updateJobListing', $jobListing), 403);

        $validated = $request->validate([
            'category_id' => 'nullable|exists:job_categories,id',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:job_listings,slug,'.$jobListing->id,
            'description' => 'required|string',
            'requirements' => 'required|string',
            'job_type' => 'required|string',
            'experience_level' => 'required|string',
            'education_requirement' => 'nullable|string',
            'education_details' => 'nullable|string',
            'salary_min' => 'nullable|numeric|min:0',
            'salary_max' => 'nullable|numeric|min:0',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'benefits' => 'nullable|array',
            'skills' => 'nullable|array',
            'responsibilities' => 'nullable|array',
            'keywords' => 'nullable|array|max:100',
            'publish_at' => 'nullable|date',
            'application_deadline' => 'nullable|date|after:publish_at',
            'is_active' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
        ]);

        $jobListing->update($validated);

        return redirect()->route('jobs.admin.index')->with('success', 'Job listing updated successfully.');
    }

    public function adminDestroy(JobListing $jobListing): RedirectResponse
    {
        abort_unless(\Gate::allows('deleteJobListing', $jobListing), 403);

        $jobListing->delete();

        return redirect()->route('jobs.admin.index')->with('success', 'Job listing deleted successfully.');
    }

    public function toggleActive(JobListing $jobListing): RedirectResponse
    {
        abort_unless(\Gate::allows('toggleActiveJobListing'), 403);

        $jobListing->update(['is_active' => ! $jobListing->is_active]);

        return back()->with('success', 'Job listing status updated.');
    }

    public function restore(JobListing $jobListing): RedirectResponse
    {
        abort_unless(\Gate::allows('restoreJobListing'), 403);

        $jobListing->restore();

        return back()->with('success', 'Job listing restored.');
    }

    public function forceDelete(JobListing $jobListing): RedirectResponse
    {
        abort_unless(\Gate::allows('forceDeleteJobListing'), 403);

        $jobListing->forceDelete();

        return back()->with('success', 'Job listing permanently deleted.');
    }

    public function applications(JobListing $jobListing): Response
    {
        abort_unless(\Gate::allows('viewJobListingApplications'), 403);

        $applications = $jobListing->applications()->with('user')->latest()->paginate(15);

        return Inertia::render('jobs/admin-applications', [
            'job' => $jobListing,
            'applications' => $applications,
        ]);
    }

    public function bulkActivate(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkActivateJobListing'), 403);

        $request->validate(['ids' => 'required|array']);

        JobListing::whereIn('id', $request->ids)->update(['is_active' => true]);

        return back()->with('success', 'Job listings activated.');
    }

    public function bulkDeactivate(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkDeactivateJobListing'), 403);

        $request->validate(['ids' => 'required|array']);

        JobListing::whereIn('id', $request->ids)->update(['is_active' => false]);

        return back()->with('success', 'Job listings deactivated.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkDeleteJobListing'), 403);

        $request->validate(['ids' => 'required|array']);

        JobListing::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Job listings deleted.');
    }

    public function statistics(): Response
    {
        abort_unless(\Gate::allows('viewJobListingStatistics'), 403);

        $stats = [
            'jobs_by_type' => JobListing::selectRaw('job_type, count(*) as count')->groupBy('job_type')->get(),
            'jobs_by_experience' => JobListing::selectRaw('experience_level, count(*) as count')->groupBy('experience_level')->get(),
            'jobs_by_category' => JobListing::with('category')->get()->groupBy('category.name')->map(fn ($jobs) => ['name' => $jobs->first()->category?->name ?? 'Uncategorized', 'count' => $jobs->count()]),
            'applications_by_status' => Application::selectRaw('status, count(*) as count')->groupBy('status')->get(),
            'top_employers' => User::withCount('jobListings')->orderByDesc('job_listings_count')->limit(10)->get(),
        ];

        return Inertia::render('jobs/admin-statistics', ['stats' => $stats]);
    }
}
