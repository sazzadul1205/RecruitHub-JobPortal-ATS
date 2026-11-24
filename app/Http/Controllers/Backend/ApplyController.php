<?php

namespace App\Http\Controllers\Backend;

use App\Enums\AtsCalculationStatus;
use App\Http\Controllers\Controller;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\StatusTimeline;
use App\Services\ATSService;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ApplyController extends Controller
{
    protected ATSService $atsService;

    public function __construct(ATSService $atsService)
    {
        $this->atsService = $atsService;
    }

    public function index(): Response
    {
        $applications = Application::where('user_id', auth()->id())
            ->with('jobListing')
            ->latest()
            ->paginate(15);

        $stats = [
            'total' => Application::where('user_id', auth()->id())->count(),
            'pending' => Application::where('user_id', auth()->id())->where('status', 'pending')->count(),
            'shortlisted' => Application::where('user_id', auth()->id())->where('status', 'shortlisted')->count(),
            'rejected' => Application::where('user_id', auth()->id())->where('status', 'rejected')->count(),
            'hired' => Application::where('user_id', auth()->id())->where('status', 'hired')->count(),
            'average_ats_score' => Application::where('user_id', auth()->id())->whereNotNull('ats_percentage')->avg('ats_percentage') ?? 0,
        ];

        return Inertia::render('Backend/Apply/Index', [
            'applications' => $applications,
            'stats' => $stats,
        ]);
    }

    public function create(string $slug): Response
    {
        $jobListing = JobListing::where('slug', $slug)->firstOrFail();
        $profile = ApplicantProfile::where('user_id', auth()->id())->firstOrFail();
        $cvs = $profile->cvs()->where('status', 'active')->get();

        return Inertia::render('Backend/Apply/Create', [
            'job' => $jobListing,
            'cvs' => $cvs,
            'profile' => $profile,
            'hasSoftDeleted' => false,
        ]);
    }

    public function store(Request $request, string $slug): JsonResponse
    {
        $jobListing = JobListing::where('slug', $slug)->firstOrFail();
        $profile = ApplicantProfile::where('user_id', auth()->id())->firstOrFail();

        $data = $request->validate([
            'applicant_cv_id' => 'required|exists:applicant_cvs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'education_level' => 'nullable|string',
            'years_of_experience' => 'nullable|integer',
            'expected_salary' => 'nullable|numeric',
            'facebook_link' => 'nullable|url',
            'linkedin_link' => 'nullable|url',
        ]);

        if ($jobListing->required_facebook_link && empty($data['facebook_link'])) {
            return response()->json(['message' => 'Facebook link is required for this job.'], 422);
        }

        if ($jobListing->required_linkedin_link && empty($data['linkedin_link'])) {
            return response()->json(['message' => 'LinkedIn link is required for this job.'], 422);
        }

        $cv = ApplicantCv::where('id', $data['applicant_cv_id'])
            ->where('applicant_profile_id', $profile->id)
            ->firstOrFail();

        if (Application::where('job_listing_id', $jobListing->id)->where('user_id', auth()->id())->exists()) {
            return response()->json(['message' => 'You have already applied to this job.'], 422);
        }

        $resumePath = $this->copyCv($cv);

        $application = Application::create([
            'user_id' => auth()->id(),
            'job_listing_id' => $jobListing->id,
            'applicant_profile_id' => $profile->id,
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'education_level' => $data['education_level'] ?? null,
            'years_of_experience' => $data['years_of_experience'] ?? null,
            'expected_salary' => $data['expected_salary'] ?? null,
            'facebook_link' => $data['facebook_link'] ?? null,
            'linkedin_link' => $data['linkedin_link'] ?? null,
            'resume_path' => $resumePath,
            'ats_calculation_status' => AtsCalculationStatus::Pending->value,
            'status' => 'pending',
        ]);

        StatusTimeline::create([
            'application_id' => $application->id,
            'status' => 'pending',
            'notes' => 'Application submitted.',
        ]);

        (new SimpleLogger)->info('application.created', [
            'application_id' => $application->id,
            'job_listing_id' => $jobListing->id,
        ]);

        return response()->json($application, 201);
    }

    public function trashed(): JsonResponse
    {
        return response()->json(Application::where('user_id', auth()->id())->onlyTrashed()->latest()->paginate(15));
    }

    public function show(Application $application): Response
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $application->load(['jobListing', 'applicantProfile', 'statusTimelines']);

        $atsDetails = [
            'score' => $application->ats_percentage ?? 0,
            'matched_keywords' => $application->matched_keywords ?? [],
            'missing_keywords' => $application->missing_keywords ?? [],
            'suggestions' => [],
            'status' => $application->ats_calculation_status,
        ];

        $atsStatus = $application->ats_calculation_status;
        $isDeleted = $application->trashed();

        return Inertia::render('Backend/Apply/Show', [
            'application' => $application,
            'jobListing' => $application->jobListing,
            'applicantProfile' => $application->applicantProfile,
            'statusTimeline' => $application->statusTimelines,
            'atsDetails' => $atsDetails,
            'atsStatus' => $atsStatus,
            'isDeleted' => $isDeleted,
        ]);
    }

    public function edit(Application $application): Response
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        if ($application->status !== 'pending') {
            abort(403, 'Only pending applications can be edited.');
        }

        $profile = ApplicantProfile::where('user_id', auth()->id())->firstOrFail();
        $cvs = $profile->cvs()->where('status', 'active')->get();

        return Inertia::render('Backend/Apply/Edit', [
            'application' => $application,
            'jobListing' => $application->jobListing,
            'cvs' => $cvs,
            'currentCvId' => $application->applicant_cv_id ?? null,
        ]);
    }

    public function update(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Only pending applications can be edited.'], 422);
        }

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'education_level' => 'nullable|string',
            'years_of_experience' => 'nullable|integer',
            'expected_salary' => 'nullable|numeric',
            'facebook_link' => 'nullable|url',
            'linkedin_link' => 'nullable|url',
        ]);

        $application->update($data);

        return response()->json($application);
    }

    public function destroy(Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $application->delete();

        return response()->json(['message' => 'Application withdrawn.']);
    }

    public function restore(Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $application->restore();

        return response()->json($application);
    }

    public function forceDelete(Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        if (file_exists(storage_path('app/'.$application->resume_path))) {
            Storage::delete($application->resume_path);
        }

        $application->forceDelete();

        return response()->json(['message' => 'Application permanently deleted.']);
    }

    public function recalculateAts(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        $result = $this->atsService->calculate($application);

        $application->update([
            'ats_score' => $result,
            'matched_keywords' => $result['matched_keywords'],
            'missing_keywords' => $result['missing_keywords'],
            'ats_percentage' => $result['percentage'],
            'ats_calculation_status' => AtsCalculationStatus::Completed->value,
            'ats_attempt_count' => $application->ats_attempt_count + 1,
            'ats_last_attempted_at' => now(),
        ]);

        return response()->json($application);
    }

    public function getAtsStatus(Application $application): JsonResponse
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }

        return response()->json([
            'status' => $application->ats_calculation_status,
            'percentage' => $application->ats_percentage,
            'attempt_count' => $application->ats_attempt_count,
        ]);
    }

    protected function copyCv(ApplicantCv $cv): string
    {
        $source = storage_path('app/'.$cv->cv_path);
        $directory = 'resumes/applications/'.auth()->id();
        $filename = Str::uuid().'.pdf';
        $destination = $directory.'/'.$filename;

        if (file_exists($source)) {
            Storage::makeDirectory($directory);
            copy($source, storage_path('app/'.$destination));
        }

        return $destination;
    }
}
