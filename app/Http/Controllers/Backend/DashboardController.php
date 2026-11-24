<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();

        $roles = $user->roles->pluck('slug')->all() ?? [];
        $permissions = $user->getPermissionsListAttribute ?? [];

        $isAdmin = in_array('admin', $roles, true) || in_array('dashboard.admin', $permissions, true);
        $isEmployer = in_array('employer', $roles, true) || in_array('dashboard.employer', $permissions, true);
        $isJobSeeker = in_array('job-seeker', $roles, true) || in_array('dashboard.job_seeker', $permissions, true);

        $role = 'guest';
        if ($isAdmin) {
            $role = 'admin';
        } elseif ($isEmployer) {
            $role = 'staff';
        } elseif ($isJobSeeker) {
            $role = 'job_seeker';
        }

        $dashboardData = [
            'role' => $role,
            'permissions' => $permissions,
            'job_seeker' => null,
            'admin_staff' => null,
            'generated_at' => now()->toDateTimeString(),
        ];

        if ($isJobSeeker) {
            $dashboardData['job_seeker'] = $this->jobSeekerData($user);
        }

        if ($isAdmin || $isEmployer) {
            $dashboardData['admin_staff'] = $isAdmin
                ? $this->platformAdminData()
                : $this->employerData($user);
        }

        return Inertia::render('dashboard', [
            'dashboardData' => $dashboardData,
        ]);
    }

    private function jobSeekerData(User $user): ?array
    {
        $profile = $user->applicantProfile;

        if (! $profile) {
            return null;
        }

        $statusCounts = Application::query()
            ->where('applicant_profile_id', $profile->id)
            ->selectRaw(<<<'SQL'
            COUNT(*)                                                    AS total,
            COALESCE(SUM(status = 'pending'), 0)     AS pending,
            COALESCE(SUM(status = 'shortlisted'), 0) AS shortlisted,
            COALESCE(SUM(status = 'rejected'), 0)    AS rejected,
            COALESCE(SUM(status = 'hired'), 0)       AS hired
        SQL)
            ->first();

        $recentApplications = $profile->applications()
            ->with(['jobListing.category', 'jobListing.employer'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Application $app) => [
                'id' => $app->id,
                'job_title' => $app->jobListing?->title ?? 'N/A',
                'company' => $app->jobListing?->employer?->name ?? 'N/A',
                'status' => $app->status,
                'ats_score' => $app->ats_percentage,
                'applied_at' => $app->created_at?->toDateTimeString(),
                'deadline' => $app->jobListing?->application_deadline?->toDateString(),
            ])->values();

        return [
            'role' => 'job_seeker',
            'summary' => [
                'total_applications' => (int) $statusCounts->total,
                'pending_applications' => (int) $statusCounts->pending,
                'shortlisted_applications' => (int) $statusCounts->shortlisted,
                'rejected_applications' => (int) $statusCounts->rejected,
                'hired_applications' => (int) $statusCounts->hired,
            ],
            'recent_applications' => $recentApplications,
            'recent_notifications' => $user->notifications()->latest()->limit(5)->get()->map(fn ($n) => [
                'id' => $n->id,
                'title' => $n->data['title'] ?? 'Update received',
                'body' => $n->data['message'] ?? null,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at?->toDateTimeString(),
            ])->values(),
        ];
    }

    private function platformAdminData(): array
    {
        return [
            'scope' => 'platform',
            'role' => 'admin',
            'summary' => [
                'total_jobs' => JobListing::count(),
                'active_jobs' => JobListing::where('is_active', true)->count(),
                'total_applications' => Application::count(),
                'pending_applications' => Application::where('status', 'pending')->count(),
                'shortlisted_applications' => Application::where('status', 'shortlisted')->count(),
                'rejected_applications' => Application::where('status', 'rejected')->count(),
                'hired_applications' => Application::where('status', 'hired')->count(),
                'active_locations' => Location::where('is_active', true)->count(),
            ],
            'recent_applications' => Application::query()
                ->with(['jobListing.employer:id,name', 'jobListing:id,title,user_id'])
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (Application $app) => [
                    'id' => $app->id,
                    'applicant' => $app->name ?? 'N/A',
                    'job_title' => $app->jobListing?->title ?? 'N/A',
                    'company' => $app->jobListing?->employer?->name ?? 'N/A',
                    'status' => $app->status,
                    'ats_score' => $app->ats_percentage,
                    'submitted_at' => $app->created_at?->toDateTimeString(),
                ])->values(),
        ];
    }

    private function employerData(User $user): array
    {
        $jobIds = JobListing::query()
            ->where('user_id', $user->id)
            ->whereNull('deleted_at')
            ->select('id');

        $jobs = JobListing::query()
            ->where('user_id', $user->id)
            ->whereNull('deleted_at');

        $applications = Application::query()->whereIn('job_listing_id', $jobIds);

        $statusCounts = (clone $applications)
            ->selectRaw(<<<'SQL'
                COUNT(*)                                                    AS total,
                COALESCE(SUM(status = 'pending'), 0)     AS pending,
                COALESCE(SUM(status = 'shortlisted'), 0) AS shortlisted,
                COALESCE(SUM(status = 'rejected'), 0)    AS rejected,
                COALESCE(SUM(status = 'hired'), 0)       AS hired
            SQL)
            ->first();

        $myJobs = $jobs->get()->map(fn (JobListing $job) => [
            'id' => $job->id,
            'title' => $job->title,
            'category' => $job->category?->name ?? 'N/A',
            'is_active' => (bool) $job->is_active,
            'deadline' => $job->application_deadline?->toDateString(),
            'views_count' => (int) $job->views_count,
            'applications_count' => $job->applications()->count(),
        ])->values();

        return [
            'scope' => 'employer',
            'role' => 'employer',
            'summary' => [
                'total_jobs' => (int) (clone $jobs)->count(),
                'active_jobs' => (clone $jobs)->where('is_active', true)->where('application_deadline', '>=', now())->count(),
                'total_applications' => (int) $statusCounts->total,
                'pending_applications' => (int) $statusCounts->pending,
                'shortlisted_applications' => (int) $statusCounts->shortlisted,
                'hired_applications' => (int) $statusCounts->hired,
            ],
            'my_jobs' => $myJobs,
            'recent_applications' => (clone $applications)
                ->with(['jobListing:id,title,user_id', 'jobListing.employer:id,name'])
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (Application $app) => [
                    'id' => $app->id,
                    'applicant' => $app->name ?? 'N/A',
                    'job_title' => $app->jobListing?->title ?? 'N/A',
                    'company' => $app->jobListing?->employer?->name ?? 'N/A',
                    'status' => $app->status,
                    'ats_score' => $app->ats_percentage,
                    'submitted_at' => $app->created_at?->toDateTimeString(),
                ])->values(),
        ];
    }
}
