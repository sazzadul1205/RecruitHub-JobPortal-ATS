<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\StatusTimeline;
use App\Services\ATSService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationsController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(\Gate::allows('viewAnyApplication'), 403);

        $query = Application::with(['user', 'jobListing', 'applicantProfile']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('job_id')) {
            $query->where('job_listing_id', $request->job_id);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                    ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        if ($request->filled('min_ats_score')) {
            $query->where('ats_percentage', '>=', $request->min_ats_score);
        }

        $applications = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('applications/index', [
            'applications' => $applications,
            'statuses' => ApplicationStatus::cases(),
            'jobs' => JobListing::active()->get(),
            'filters' => $request->only(['status', 'job_id', 'search', 'min_ats_score']),
        ]);
    }

    public function jobApplications(JobListing $jobListing): Response
    {
        abort_unless(\Gate::allows('viewJobApplications'), 403);

        $applications = $jobListing->applications()->with('user')->latest()->paginate(15);

        return Inertia::render('applications/job-index', [
            'job' => $jobListing,
            'applications' => $applications,
        ]);
    }

    public function show(Application $application): Response
    {
        abort_unless(\Gate::allows('viewApplication', $application), 403);

        $application->load(['user', 'jobListing', 'applicantProfile', 'statusTimelines']);

        return Inertia::render('applications/show', [
            'application' => $application,
            'statuses' => ApplicationStatus::cases(),
        ]);
    }

    public function updateStatus(Request $request, Application $application): RedirectResponse
    {
        abort_unless(\Gate::allows('updateApplicationStatus'), 403);

        $validated = $request->validate([
            'status' => 'required|in:pending,shortlisted,rejected,hired',
            'notes' => 'nullable|string',
        ]);

        $oldStatus = $application->status;
        $application->update(['status' => $validated['status']]);

        StatusTimeline::create([
            'application_id' => $application->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        \Log::info('Application status updated', [
            'application_id' => $application->id,
            'old_status' => $oldStatus,
            'new_status' => $validated['status'],
            'updated_by' => auth()->id(),
        ]);

        return back()->with('success', "Application status updated to {$validated['status']}.");
    }

    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkUpdateApplicationStatus'), 403);

        $validated = $request->validate([
            'ids' => 'required|array',
            'status' => 'required|in:pending,shortlisted,rejected,hired',
        ]);

        Application::whereIn('id', $validated['ids'])->update(['status' => $validated['status']]);

        foreach ($validated['ids'] as $id) {
            StatusTimeline::create([
                'application_id' => $id,
                'status' => $validated['status'],
                'notes' => 'Bulk status update',
            ]);
        }

        return back()->with('success', 'Applications status updated.');
    }

    public function destroy(Application $application): RedirectResponse
    {
        abort_unless(\Gate::allows('deleteApplication', $application), 403);

        $application->delete();

        return back()->with('success', 'Application deleted.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkDeleteApplication'), 403);

        $request->validate(['ids' => 'required|array']);

        Application::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Applications deleted.');
    }

    public function downloadResume(Application $application)
    {
        abort_unless(\Gate::allows('downloadResume'), 403);

        if (! $application->resume_path || ! \Storage::disk('private')->exists($application->resume_path)) {
            abort(404);
        }

        return \Storage::disk('private')->download($application->resume_path, $application->resume_path);
    }

    public function bulkDownloadResumes(Request $request)
    {
        abort_unless(\Gate::allows('bulkDownloadResumes'), 403);

        $request->validate(['ids' => 'required|array']);

        $applications = Application::whereIn('id', $request->ids)->whereNotNull('resume_path')->get();

        $zipName = 'resumes_'.now()->format('Ymd_His').'.zip';
        $zipPath = 'temp/'.$zipName;

        $zip = new \ZipArchive;
        if ($zip->open(\Storage::disk('private')->path($zipPath), \ZipArchive::CREATE) === true) {
            foreach ($applications as $app) {
                if (\Storage::disk('private')->exists($app->resume_path)) {
                    $zip->addFile(\Storage::disk('private')->path($app->resume_path), basename($app->resume_path));
                }
            }
            $zip->close();
        }

        return \Storage::disk('private')->download($zipPath, $zipName);
    }

    public function sendEmail(Request $request, Application $application): RedirectResponse
    {
        abort_unless(\Gate::allows('sendApplicationEmail'), 403);

        $request->validate([
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        \Log::info('Email sent to applicant', [
            'application_id' => $application->id,
            'email' => $application->email,
            'subject' => $request->subject,
            'job' => $application->jobListing->title,
        ]);

        return back()->with('success', 'Email sent successfully.');
    }

    public function sendBulkEmail(Request $request): RedirectResponse
    {
        abort_unless(\Gate::allows('bulkSendApplicationEmail'), 403);

        $request->validate([
            'ids' => 'required|array',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        $applications = Application::whereIn('id', $request->ids)->get();

        foreach ($applications as $app) {
            \Log::info('Bulk email sent', [
                'application_id' => $app->id,
                'email' => $app->email,
                'subject' => $request->subject,
                'job' => $app->jobListing->title,
            ]);
        }

        return back()->with('success', 'Bulk emails sent.');
    }

    public function recalculateAts(Application $application): RedirectResponse
    {
        abort_unless(\Gate::allows('recalculateAts'), 403);

        $app = app(ATSService::class);
        $app->calculate($application);

        return back()->with('success', 'ATS score recalculated.');
    }

    public function exportApplications(Request $request, $jobId): RedirectResponse
    {
        abort_unless(\Gate::allows('exportApplications'), 403);

        $applications = Application::where('job_listing_id', $jobId)->with('user')->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=applications_job_{$jobId}.csv",
        ];

        $callback = function () use ($applications) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Status', 'ATS Score', 'Applied At']);
            foreach ($applications as $app) {
                fputcsv($handle, [
                    $app->id,
                    $app->name,
                    $app->email,
                    $app->phone,
                    $app->status,
                    $app->ats_percentage ?? 'N/A',
                    $app->created_at,
                ]);
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportSingleApplication(Application $application): RedirectResponse
    {
        abort_unless(\Gate::allows('exportSingleApplication'), 403);

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=application_{$application->id}.csv",
        ];

        $callback = function () use ($application) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Name', 'Email', 'Phone', 'Status', 'ATS Score', 'Applied At']);
            fputcsv($handle, [
                $application->id,
                $application->name,
                $application->email,
                $application->phone,
                $application->status,
                $application->ats_percentage ?? 'N/A',
                $application->created_at,
            ]);
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
