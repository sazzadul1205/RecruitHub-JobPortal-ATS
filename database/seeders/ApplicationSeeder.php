<?php

namespace Database\Seeders;

use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $applicant = User::where('email', 'applicant@example.com')->first();
        $profile = ApplicantProfile::first();
        $job = JobListing::first();

        if (! $applicant || ! $profile || ! $job) {
            return;
        }

        Application::create([
            'user_id' => $applicant->id,
            'job_listing_id' => $job->id,
            'applicant_profile_id' => $profile->id,
            'name' => 'John Doe',
            'email' => 'applicant@example.com',
            'phone' => '+1234567890',
            'education_level' => 'bachelors',
            'years_of_experience' => 5,
            'expected_salary' => 75000,
            'linkedin_link' => 'https://linkedin.com/in/johndoe',
            'resume_path' => 'resumes/sample-resume.pdf',
            'ats_score' => [
                'percentage' => 75.0,
                'matched_keywords' => ['php', 'laravel', 'mysql'],
                'missing_keywords' => ['javascript'],
                'matched_count' => 3,
                'total_keywords' => 4,
                'analysis' => [
                    'level' => 'Good',
                    'message' => 'Your resume matches many key requirements.',
                    'color' => 'blue',
                ],
            ],
            'matched_keywords' => ['php', 'laravel', 'mysql'],
            'missing_keywords' => ['javascript'],
            'ats_percentage' => 75.0,
            'ats_calculation_status' => 'completed',
            'ats_attempt_count' => 1,
            'ats_last_attempted_at' => now(),
            'status' => 'pending',
        ]);
    }
}
