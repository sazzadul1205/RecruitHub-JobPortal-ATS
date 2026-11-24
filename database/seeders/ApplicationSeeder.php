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
        $applicants = User::factory()->count(5)->create();

        $applicants->shuffle()->each(fn ($user) => ApplicantProfile::factory()->create([
            'user_id' => $user->id,
        ]));

        $profiles = ApplicantProfile::whereIn('user_id', $applicants->pluck('id'))->get();
        $listings = JobListing::factory()->count(8)->create();

        // Build unique (user, listing) pairs to respect the unique index
        $pairs = [];
        foreach ($applicants as $applicant) {
            foreach ($listings as $listing) {
                $pairs[] = [
                    'user_id' => $applicant->id,
                    'job_listing_id' => $listing->id,
                ];
            }
        }
        $pairs = collect($pairs)->shuffle()->take(20);

        $pairs->each(function ($pair) use ($profiles) {
            Application::factory()->create(array_merge($pair, [
                'applicant_profile_id' => $profiles->random()->id,
            ]));
        });
    }
}
