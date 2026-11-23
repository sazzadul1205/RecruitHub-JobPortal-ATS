<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\ATSCalculationStatus;
use App\Models\Application;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\JobListing;
use App\Models\StatusTimeline;
use App\Services\ATSService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ApplyController extends Controller
{
    public function index(): Response
    {
        $applications = Application::where('user_id', auth()->id())
            ->with('jobListing')
            ->latest()
            ->paginate(15);

        return Inertia::render('applications/my-index', [
            'applications' => $applications,
        ]);
    }

    public function create(string $slug): Response
    {
        $job = JobListing::where('slug', $slug)->active()->published()->firstOrFail();
        $profile = ApplicantProfile::where('user_id', auth()->id())->first();

        if (!$profile) {
            return redirect()->route('profile.edit')->with('error', 'Please complete your profile before applying.');
        }

        $cvs = $profile->cvs()->active()->get();
        $alreadyApplied = Application::where('user_id', auth()->id())
            ->where('job_listing_id', $job->id)
            ->exists();

        return Inertia::render('applications/apply-create', [
            'job' => $job,
            'cvs' => $cvs,
            'profile' => $profile,
            'already_applied' => $alreadyApplied,
        ]);
    }

    public function store(Request $request, string $slug): RedirectResponse
    {
        $job = JobListing::where('slug', $slug)->active()->published()->firstOrFail();

        $alreadyApplied = Application::where('user_id', auth()->id())
            ->where('job_listing_id', $job->id)
            ->exists();

        if ($alreadyApplied) {
            return back()->with('error', 'You have already applied to this job.');
        }

        $validated = $request->validate([
            'cv_id' => 'required|exists:applicant_cvs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:255',
            'education_level' => 'nullable|string|max:255',
            'years_of_experience' => 'nullable|integer|min:0',
            'expected_salary' => 'nullable|numeric|min:0',
            'facebook_link' => $job->required_facebook_link ? 'required|url' : 'nullable|url',
            'linkedin_link' => $job->required_linkedin_link ? 'required|url' : 'nullable|url',
        ]);

        $cv = ApplicantCv::find($validated['cv_id']);

        // Copy the CV to applications folder (snapshot at apply time)
        $resumePath = null;
        if ($cv && Storage::disk('private')->exists($cv->cv_path)) {
            $resumePath = 'applications/' . auth()->id() . '_' . $job->id . '_' . basename($cv->cv_path);
            Storage::disk('private')->copy($cv->cv_path, $resumePath);
        }

        $profile = ApplicantProfile::where('user_id', auth()->id())->first();

        $application = Application::create([
            'user_id' => auth()->id(),
            'job_listing_id' => $job->id,
            'applicant_profile_id' => $profile?->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'education_level' => $validated['education_level'] ?? null,
            'years_of_experience' => $validated['years_of_experience'] ?? 0,
            'expected_salary' => $validated['expected_salary'] ?? null,
            'facebook_link' => $validated['facebook_link'] ?? null,
            'linkedin_link' => $validated['linkedin_link'] ?? null,
            'resume_path' => $resumePath,
            'ats_calculation_status' => ATSCalculationStatus::Pending->value,
            'ats_attempt_count' => 0,
            'status' => ApplicationStatus::Pending->value,
        ]);

        // Dispatch ATS calculation
        $atsService = app(ATSService::class);
        $atsService->calculate($application);

        return redirect()->route('applications.my')->with('success', 'Application submitted successfully.');
    }

    public function trashed(): Response
    {
        $applications = Application::where('user_id', auth()->id())
            ->onlyTrashed()
            ->with('jobListing')
            ->latest()
            ->paginate(15);

        return Inertia::render('applications/my-trashed', [
            'applications' => $applications,
        ]);
    }

    public function show(Application $application): Response
    {
        abort_unless($application->user_id === auth()->id(), 403);

        $application->load(['jobListing', 'statusTimelines']);

        return Inertia::render('applications/my-show', [
            'application' => $application,
        ]);
    }

    public function edit(Application $application): Response
    {
        abort_unless($application->user_id === auth()->id(), 403);
        abort_unless($application->status === ApplicationStatus::Pending->value, 403, 'Can only edit pending applications.');

        $job = $application->jobListing;
        $profile = ApplicantProfile::where('user_id', auth()->id())->first();
        $cvs = $profile?->cvs()->active()->get();

        return Inertia::render('applications/my-edit', [
            'application' => $application,
            'job' => $job,
            'cvs' => $cvs,
        ]);
    }

    public function update(Request $request, Application $application): RedirectResponse
    {
        abort_unless($application->user_id === auth()->id(), 403);
        abort_unless($application->status === ApplicationStatus::Pending->value, 403, 'Can only edit pending applications.');

        $validated = $request->validate([
            'cv_id' => 'required|exists:applicant_cvs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone' => 'required|string|max:255',
            'education_level' => 'nullable|string|max:255',
            'years_of_experience' => 'nullable|integer|min:0',
            'expected_salary' => 'nullable|numeric|min:0',
            'facebook_link' => 'nullable|url',
            'linkedin_link' => 'nullable|url',
        ]);

        $cv = ApplicantCv::find($validated['cv_id']);
        $resumePath = $application->resume_path;

        if ($cv && Storage::disk('private')->exists($cv->cv_path)) {
            $resumePath = 'applications/' . auth()->id() . '_' . $application->job_listing_id . '_' . basename($cv->cv_path);
            Storage::disk('private')->copy($cv->cv_path, $resumePath);
        }

        $application->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'education_level' => $validated['education_level'] ?? null,
            'years_of_experience' => $validated['years_of_experience'] ?? 0,
            'expected_salary' => $validated['expected_salary'] ?? null,
            'facebook_link' => $validated['facebook_link'] ?? null,
            'linkedin_link' => $validated['linkedin_link'] ?? null,
            'resume_path' => $resumePath,
            'ats_calculation_status' => ATSCalculationStatus::Pending->value,
            'ats_attempt_count' => 0,
            'ats_percentage' => null,
            'ats_score' => null,
        ]);

        $atsService = app(ATSService::class);
        $atsService->calculate($application);

        return redirect()->route('applications.my')->with('success', 'Application updated successfully.');
    }

    public function destroy(Application $application): RedirectResponse
    {
        abort_unless($application->user_id === auth()->id(), 403);

        $application->delete();

        if ($application->resume_path && Storage::disk('private')->exists($application->resume_path)) {
            Storage::disk('private')->delete($application->resume_path);
        }

        return back()->with('success', 'Application withdrawn.');
    }

    public function restore(Application $application): RedirectResponse
    {
        abort_unless($application->user_id === auth()->id(), 403);

        $application->restore();

        return back()->with('success', 'Application restored.');
    }

    public function forceDelete(Application $application): RedirectResponse
    {
        abort_unless($application->user_id === auth()->id(), 403);

        if ($application->resume_path && Storage::disk('private')->exists($application->resume_path)) {
            Storage::disk('private')->delete($application->resume_path);
        }

        $application->forceDelete();

        return back()->with('success', 'Application permanently deleted.');
    }

    public function recalculateAts(Application $application): RedirectResponse
    {
        abort_unless($application->user_id === auth()->id(), 403);

        $atsService = app(ATSService::class);
        $atsService->calculate($application);

        return back()->with('success', 'ATS score recalculated.');
    }

    public function getAtsStatus(Application $application)
    {
        abort_unless($application->user_id === auth()->id(), 403);

        return response()->json([
            'status' => $application->ats_calculation_status,
            'percentage' => $application->ats_percentage,
        ]);
    }
}
