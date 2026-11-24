<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\ApplicantProfile;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $applicants = User::factory()->count(5)->create();
        $profiles = ApplicantProfile::factory()->count(5)->create([
            'user_id' => fn () => $applicants->random()->id,
        ]);
        $listings = JobListing::factory()->count(8)->create();

        Application::factory()->count(20)->create([
            'user_id' => fn () => $applicants->random()->id,
            'job_listing_id' => fn () => $listings->random()->id,
            'applicant_profile_id' => fn () => $profiles->random()->id,
        ]);
    }
}
