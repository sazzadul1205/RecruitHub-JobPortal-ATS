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
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'education_level' => fake()->randomElement(['bachelors', 'masters', 'high_school']),
            'years_of_experience' => fake()->numberBetween(0, 10),
            'expected_salary' => fake()->randomElement([null, 50000, 75000, 100000]),
            'facebook_link' => fake()->optional()->url(),
            'linkedin_link' => fake()->optional()->url(),
            'resume_path' => 'resumes/'.fake()->uuid().'.pdf',
            'ats_score' => null,
            'matched_keywords' => null,
            'missing_keywords' => null,
            'ats_percentage' => null,
            'ats_calculation_status' => 'pending',
            'ats_attempt_count' => 0,
            'ats_last_attempted_at' => null,
            'status' => 'pending',
            'employer_notes' => null,
        ];
    }
}
