<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\JobListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user()->load('roles');
        
        if ($user->hasRole('admin')) {
            return $this->adminDashboard();
        }
        
        if ($user->hasRole('employer')) {
            return $this->employerDashboard($user);
        }
        
        return $this->applicantDashboard($user);
    }

    private function adminDashboard()
    {
        $totalJobs = JobListing::count();
        $activeJobs = JobListing::where('is_active', true)->count();
        $totalApplications = Application::count();
        $pendingApplications = Application::where('status', 'pending')->count();
        $recentApplications = Application::with(['jobListing:slug,title,category_id', 'user'])
            ->latest()
            ->take(5)
            ->get();
        $recentJobs = JobListing::with('category')
            ->latest()
            ->take(5)
            ->get();
        
        return inertia('dashboard', [
            'stats' => [
                'total_jobs' => $totalJobs,
                'active_jobs' => $activeJobs,
                'total_applications' => $totalApplications,
                'pending_applications' => $pendingApplications,
            ],
            'recentApplications' => $recentApplications,
            'recentJobs' => $recentJobs,
            'userRole' => 'admin',
        ]);
    }

    private function employerDashboard($user)
    {
        $myJobs = JobListing::where('user_id', $user->id)->count();
        $activeJobs = JobListing::where('user_id', $user->id)->where('is_active', true)->count();
        $myApplications = Application::whereHas('jobListing', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();
        $pendingApplications = Application::whereHas('jobListing', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->where('status', 'pending')->count();
        $recentApplications = Application::with(['jobListing:slug,title,category_id', 'user'])
            ->whereHas('jobListing', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();
        $recentJobs = JobListing::where('user_id', $user->id)
            ->with('category')
            ->latest()
            ->take(5)
            ->get();
        
        return inertia('dashboard', [
            'stats' => [
                'my_jobs' => $myJobs,
                'active_jobs' => $activeJobs,
                'total_applications' => $myApplications,
                'pending_applications' => $pendingApplications,
            ],
            'recentApplications' => $recentApplications,
            'recentJobs' => $recentJobs,
            'userRole' => 'employer',
        ]);
    }

    private function applicantDashboard($user)
    {
        $myApplications = Application::where('user_id', $user->id)->count();
        $pendingApplications = Application::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();
        $acceptedApplications = Application::where('user_id', $user->id)
            ->where('status', 'accepted')
            ->count();
        $rejectedApplications = Application::where('user_id', $user->id)
            ->where('status', 'rejected')
            ->count();
        $recentApplications = Application::with(['jobListing:slug,title,category_id', 'jobListing.category'])
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();
        
        return inertia('dashboard', [
            'stats' => [
                'total_applications' => $myApplications,
                'pending_applications' => $pendingApplications,
                'accepted_applications' => $acceptedApplications,
                'rejected_applications' => $rejectedApplications,
            ],
            'recentApplications' => $recentApplications,
            'userRole' => 'applicant',
        ]);
    }
}