<?php

namespace App\Http\Controllers;

use App\Enums\AtsCalculationStatus;
use App\Models\Application;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\JobListing;
use App\Models\StatusTimeline;
use App\Services\ATSService;
use App\Services\SimpleLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApplyController extends Controller
{
    public function index(): JsonResponse
    {
        $applications = Application::where('user_id', auth()->id())
            ->with('jobListing')
            ->latest()
            ->paginate(15);

        return response()->json($applications);
    }

    public function create(string $slug): JsonResponse
    {
        $jobListing = JobListing::where('slug', $slug)->firstOrFail();
        $profile = ApplicantProfile::where('user_id', auth()->id())->firstOrFail();
        $cvs = $profile->cvs()->where('status', 'active')->get();

        return response()->json([
            'job' => $jobListing,
            'cvs' => $cvs,
            'profile' => $profile,
        ]);
    }

    public function store(Request $request, string $slug, ATSService $atsService): JsonResponse
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

        (new SimpleLogger())->info('application.created', [
            'application_id' => $application->id,
            'job_listing_id' => $jobListing->id,
        ]);

        return response()->json($application, 201);
    }

    public function trashed(): JsonResponse
    {
        return response()->json(Application::where('user_id', auth()->id())->onlyTrashed()->latest()->paginate(15));
    }

    public function show(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        return response()->json($application->load('jobListing'));
    }

    public function edit(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        if ($application->status !== 'pending') {
            return response()->json(['message' => 'Only pending applications can be edited.'], 422);
        }

        return response()->json($application);
    }

    public function update(Request $request, Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

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
        $this->authorizeApplication($application);

        $application->delete();

        return response()->json(['message' => 'Application withdrawn.']);
    }

    public function restore(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        $application->restore();

        return response()->json($application);
    }

    public function forceDelete(Application $application): JsonResponse
    {
        $this->authorizeApplication($application);

        if (file_exists(storage_path('app/'.$application->resume_path))) {
            Storage::delete($application->resume_path);
        }

        $application->forceDelete();

        return response()->json(['message' => 'Application permanently deleted.']);
    }

    public function recalculateAts(Request $request, Application $application, ATSService $atsService): JsonResponse
    {
        $this->authorizeApplication($application);

        $result = $atsService->calculate($application);

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
        $this->authorizeApplication($application);

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

    protected function authorizeApplication(Application $application): void
    {
        if ($application->user_id !== auth()->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
