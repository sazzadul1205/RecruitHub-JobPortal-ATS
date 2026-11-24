<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'job_listing_id' => JobListing::factory(),
            'applicant_profile_id' => ApplicantProfile::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'education_level' => fake()->randomElement(['high_school', 'bachelors', 'masters']),
            'years_of_experience' => fake()->numberBetween(0, 20),
            'expected_salary' => fake()->numberBetween(40000, 150000),
            'facebook_link' => null,
            'linkedin_link' => fake()->url(),
            'resume_path' => 'resumes/'.fake()->uuid().'.pdf',
            'ats_score' => null,
            'matched_keywords' => null,
            'missing_keywords' => null,
            'ats_calculation_status' => 'pending',
            'ats_attempt_count' => 0,
            'ats_last_attempted_at' => null,
            'ats_percentage' => null,
            'status' => 'pending',
            'employer_notes' => null,
        ];
    }
}
