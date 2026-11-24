<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileCompletionController extends Controller
{
    public function show(Request $request): Response
    {
        $profile = $request->user()->applicantProfile()
            ->with(['cvs', 'jobHistories', 'educationHistories', 'achievements'])
            ->first();

        return Inertia::render('auth/CompleteProfile', [
            'applicantProfile' => $profile ? $profile->toArray() : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'max:255'],
            'blood_type' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'photo_path' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'experience_years' => ['nullable', 'integer'],
            'current_job_title' => ['nullable', 'string', 'max:255'],
            'cvs' => ['nullable', 'array'],
            'cvs.*.id' => ['nullable', 'integer', Rule::exists(ApplicantCv::class, 'id')],
            'cvs.*.is_primary' => ['nullable', 'boolean'],
            'cvs.*.order_position' => ['nullable', 'integer'],
            'job_histories' => ['nullable', 'array'],
            'job_histories.*.company_name' => ['nullable', 'string', 'max:255'],
            'job_histories.*.position' => ['nullable', 'string', 'max:255'],
            'job_histories.*.starting_year' => ['nullable', 'integer'],
            'job_histories.*.ending_year' => ['nullable', 'integer'],
            'job_histories.*.is_current' => ['nullable', 'boolean'],
            'education_histories' => ['nullable', 'array'],
            'education_histories.*.institution_name' => ['nullable', 'string', 'max:255'],
            'education_histories.*.degree' => ['nullable', 'string', 'max:255'],
            'education_histories.*.passing_year' => ['nullable', 'integer'],
            'achievements' => ['nullable', 'array'],
            'achievements.*.achievement_name' => ['nullable', 'string', 'max:255'],
            'achievements.*.achievement_details' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $profile = $user->applicantProfile()->first();

        $profileData = [
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'birth_date' => $validated['birth_date'],
            'gender' => $validated['gender'],
            'blood_type' => $validated['blood_type'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'photo_path' => $validated['photo_path'],
            'social_links' => $validated['social_links'] ?? [],
            'experience_years' => $validated['experience_years'],
            'current_job_title' => $validated['current_job_title'],
        ];

        if ($profile) {
            $profile->update($profileData);
        } else {
            $profile = ApplicantProfile::create($profileData);
        }

        // Sync CVs
        if (isset($validated['cvs'])) {
            $profile->cvs()->delete();
            foreach ($validated['cvs'] as $cv) {
                $profile->cvs()->create([
                    'original_name' => $cv['original_name'] ?? null,
                    'cv_path' => $cv['cv_path'] ?? null,
                    'status' => 'active',
                    'order_position' => $cv['order_position'] ?? 0,
                    'is_primary' => $cv['is_primary'] ?? false,
                ]);
            }
        }

        // Sync job histories
        if (isset($validated['job_histories'])) {
            $profile->jobHistories()->delete();
            foreach ($validated['job_histories'] as $job) {
                $profile->jobHistories()->create([
                    'company_name' => $job['company_name'] ?? null,
                    'position' => $job['position'] ?? null,
                    'starting_year' => $job['starting_year'] ?? null,
                    'ending_year' => $job['ending_year'] ?? null,
                    'is_current' => $job['is_current'] ?? false,
                ]);
            }
        }

        // Sync education histories
        if (isset($validated['education_histories'])) {
            $profile->educationHistories()->delete();
            foreach ($validated['education_histories'] as $edu) {
                $profile->educationHistories()->create([
                    'institution_name' => $edu['institution_name'] ?? null,
                    'degree' => $edu['degree'] ?? null,
                    'passing_year' => $edu['passing_year'] ?? null,
                ]);
            }
        }

        // Sync achievements
        if (isset($validated['achievements'])) {
            $profile->achievements()->delete();
            foreach ($validated['achievements'] as $ach) {
                $profile->achievements()->create([
                    'achievement_name' => $ach['achievement_name'] ?? null,
                    'achievement_details' => $ach['achievement_details'] ?? null,
                ]);
            }
        }

        return redirect()->route('dashboard');
    }

    public function uploadCv(Request $request)
    {
        $validated = $request->validate([
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $profile = $request->user()->applicantProfile()->first();

        if (! $profile) {
            return response()->json(['message' => 'Profile not found. Please complete basic info first.'], 400);
        }

        $path = $validated['cv']->store('cvs', 'public');

        $maxPosition = $profile->cvs()->max('order_position') ?? -1;

        $cv = $profile->cvs()->create([
            'original_name' => $validated['cv']->getClientOriginalName(),
            'cv_path' => $path,
            'status' => 'active',
            'order_position' => $maxPosition + 1,
            'is_primary' => $profile->cvs()->count() === 0,
        ]);

        return response()->json([
            'id' => $cv->id,
            'original_name' => $cv->original_name,
            'size' => $validated['cv']->getSize(),
            'type' => $validated['cv']->getMimeType(),
            'order_position' => $cv->order_position,
            'is_primary' => $cv->is_primary,
            'upload_date' => $cv->created_at->toISOString(),
            'status' => $cv->status,
            'cv_path' => $cv->cv_path,
            'url' => Storage::disk('public')->url($cv->cv_path),
        ]);
    }

    public function destroyCv(Request $request, ApplicantCv $cv)
    {
        $profile = $request->user()->applicantProfile()->first();

        if (! $profile || $cv->applicant_profile_id !== $profile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($cv->cv_path) {
            Storage::disk('public')->delete($cv->cv_path);
        }

        $cv->delete();

        return response()->json(['message' => 'CV deleted']);
    }

    public function primaryCv(Request $request, ApplicantCv $cv)
    {
        $profile = $request->user()->applicantProfile()->first();

        if (! $profile || $cv->applicant_profile_id !== $profile->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $profile->cvs()->update(['is_primary' => false]);
        $cv->update(['is_primary' => true]);

        return response()->json(['message' => 'Primary CV updated']);
    }

    public function uploadPhoto(Request $request)
    {
        $validated = $request->validate([
            'photo' => ['required', 'image', 'mimes:jpeg,jpg,png,gif', 'max:2048'],
        ]);

        $profile = $request->user()->applicantProfile()->first();

        if (! $profile) {
            return response()->json(['message' => 'Profile not found. Please complete basic info first.'], 400);
        }

        if ($profile->photo_path) {
            Storage::disk('public')->delete($profile->photo_path);
        }

        $path = $validated['photo']->store('photos', 'public');

        $profile->update(['photo_path' => $path]);

        return response()->json([
            'photo_path' => $path,
        ]);
    }
}
