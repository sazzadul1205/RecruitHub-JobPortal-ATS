<?php

namespace App\Http\Controllers\Backend;

use App\Enums\AtsCalculationStatus;
use App\Enums\EducationLevel;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Notifications\ApplicationStatusUpdated;
use App\Services\ATSService;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.view')) {
            abort(403, 'You do not have permission to view applications.');
        }

        $query = Application::with(['user', 'jobListing', 'applicantProfile']);

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('job_listing_id')) {
            $query->where('job_listing_id', $request->job_listing_id);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $applications = $query->latest()->paginate(15);

        $statusCounts = Application::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();
        $totalApplications = Application::count();

        return Inertia::render('Backend/Applications/Index', [
            'applications' => $applications,
            'jobs' => JobListing::active()->get(),
            'categories' => JobCategory::active()->get(),
            'locations' => Location::active()->get(),
            'jobTypes' => collect(JobType::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
            'educationLevels' => collect(EducationLevel::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
            'filters' => $request->only(['status', 'job_listing_id', 'user_id', 'search']),
            'statusCounts' => $statusCounts,
            'totalApplications' => $totalApplications,
            'filterOptions' => [
                'jobTypes' => collect(JobType::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
                'educationLevels' => collect(EducationLevel::cases())->map(fn ($c) => ['value' => $c->value, 'label' => ucwords(str_replace('_', ' ', $c->value))]),
            ],
        ]);
    }

    public function jobApplications(JobListing $jobListing, Request $request): Response
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.job_applications')) {
            abort(403, 'You do not have permission to view job applications.');
        }

        $applications = $jobListing->applications()->with('user')->latest()->paginate(15);

        $statusCounts = $jobListing->applications()
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        return Inertia::render('Backend/Applications/JobApplications', [
            'job' => $jobListing,
            'applications' => $applications,
            'statusCounts' => $statusCounts,
            'filters' => $request->only(['status', 'search']),
            'filterOptions' => [],
        ]);
    }

    public function show(Application $application): Response
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.show')) {
            abort(403, 'You do not have permission to view application details.');
        }

        $application->load(['user', 'jobListing', 'applicantProfile', 'statusTimelines']);

        $atsAnalysis = [
            'score' => $application->ats_percentage ?? 0,
            'matched_keywords' => $application->matched_keywords ?? [],
            'missing_keywords' => $application->missing_keywords ?? [],
            'suggestions' => [],
            'calculated_at' => $application->ats_last_attempted_at,
        ];

        return Inertia::render('Backend/Applications/Show', [
            'application' => $application,
            'atsAnalysis' => $atsAnalysis,
        ]);
    }

    public function updateStatus(Request $request, Application $application): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.status.update')) {
            abort(403, 'You do not have permission to update application status.');
        }

        $data = $request->validate([
            'status' => 'required|in:pending,shortlisted,rejected,hired',
            'notes' => 'nullable|string',
        ]);

        $previous = $application->status;
        $application->update(['status' => $data['status']]);

        $application->statusTimelines()->create([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        $application->user->notify(new ApplicationStatusUpdated($application, $previous));

        (new SimpleLogger)->info('application.status_updated', [
            'application_id' => $application->id,
            'previous_status' => $previous,
            'new_status' => $data['status'],
        ]);

        return response()->json($application->load('statusTimelines'));
    }

    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.bulk_status.update')) {
            abort(403, 'You do not have permission to bulk update application status.');
        }

        $data = $request->validate([
            'application_ids' => 'required|array',
            'application_ids.*' => 'exists:applications,id',
            'status' => 'required|in:pending,shortlisted,rejected,hired',
            'notes' => 'nullable|string',
        ]);

        foreach ($data['application_ids'] as $id) {
            $application = Application::find($id);
            if (! $application) {
                continue;
            }
            if (! $user?->hasPermission('applications.status.update')) {
                continue;
            }

            $previous = $application->status;
            $application->update(['status' => $data['status']]);
            $application->statusTimelines()->create([
                'status' => $data['status'],
                'notes' => $data['notes'] ?? null,
            ]);
            $application->user->notify(new ApplicationStatusUpdated($application, $previous));
        }

        return response()->json(['message' => 'Statuses updated.']);
    }

    public function destroy(Application $application): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.destroy')) {
            abort(403, 'You do not have permission to delete applications.');
        }

        $application->delete();

        return response()->json(['message' => 'Application deleted.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.bulk_delete')) {
            abort(403, 'You do not have permission to bulk delete applications.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        foreach ($ids as $id) {
            $application = Application::find($id);
            if (! $application) {
                continue;
            }
            $application->delete();
        }

        return response()->json(['message' => 'Applications deleted.']);
    }

    public function downloadResume(Application $application): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.download_resume')) {
            abort(403, 'You do not have permission to download resumes.');
        }

        if (! file_exists(storage_path('app/'.$application->resume_path))) {
            return response()->json(['message' => 'Resume not found.'], 404);
        }

        return response()->download(storage_path('app/'.$application->resume_path));
    }

    public function bulkDownloadResumes(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.bulk_download_resumes')) {
            abort(403, 'You do not have permission to bulk download resumes.');
        }

        $ids = $request->validate(['ids' => 'required|array'])->ids;

        $paths = [];
        foreach ($ids as $id) {
            $application = Application::find($id);
            if (! $application) {
                continue;
            }
            if (file_exists(storage_path('app/'.$application->resume_path))) {
                $paths[] = storage_path('app/'.$application->resume_path);
            }
        }

        return response()->json(['message' => 'Prepared '.count($paths).' resumes for download.', 'paths' => $paths]);
    }

    public function sendEmail(Request $request, Application $application): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.email.send')) {
            abort(403, 'You do not have permission to send emails.');
        }

        $request->validate([
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        (new SimpleLogger)->info('application.email_sent', [
            'application_id' => $application->id,
            'job_id' => $application->job_listing_id,
        ]);

        return response()->json(['message' => 'Email sent to '.$application->email.'.']);
    }

    public function sendBulkEmail(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.bulk_email.send')) {
            abort(403, 'You do not have permission to send bulk emails.');
        }

        $data = $request->validate([
            'application_ids' => 'required|array',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);

        foreach ($data['application_ids'] as $id) {
            $application = Application::find($id);
            if (! $application) {
                continue;
            }
            (new SimpleLogger)->info('application.bulk_email_sent', [
                'application_id' => $application->id,
            ]);
        }

        return response()->json(['message' => 'Bulk emails sent.']);
    }

    public function recalculateAts(Request $request, Application $application, ATSService $atsService): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.recalculate_ats')) {
            abort(403, 'You do not have permission to recalculate ATS scores.');
        }

        $application->update([
            'ats_calculation_status' => AtsCalculationStatus::Processing->value,
            'ats_attempt_count' => $application->ats_attempt_count + 1,
            'ats_last_attempted_at' => now(),
        ]);

        $result = $atsService->calculate($application);

        $application->update([
            'ats_score' => $result,
            'matched_keywords' => $result['matched_keywords'],
            'missing_keywords' => $result['missing_keywords'],
            'ats_percentage' => $result['percentage'],
            'ats_calculation_status' => empty($result['matched_keywords']) && empty($result['missing_keywords'])
                ? AtsCalculationStatus::Failed->value
                : AtsCalculationStatus::Completed->value,
        ]);

        (new SimpleLogger)->info('application.ats_recalculated', [
            'application_id' => $application->id,
            'percentage' => $result['percentage'],
        ]);

        return response()->json($application);
    }

    public function exportApplications(Request $request, JobListing $jobListing): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.export')) {
            abort(403, 'You do not have permission to export applications.');
        }

        $applications = $jobListing->applications()->with('user')->get();

        return response()->json([
            'job_listing' => $jobListing,
            'applications' => $applications,
            'format' => $request->get('format', 'csv'),
        ]);
    }

    public function exportSingleApplication(Application $application): JsonResponse
    {
        $user = auth()->user();

        if (! $user?->hasPermission('applications.export_single')) {
            abort(403, 'You do not have permission to export application.');
        }

        return response()->json($application->load('user'));
    }
}
