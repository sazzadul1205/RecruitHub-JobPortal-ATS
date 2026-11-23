<?php

namespace Database\Seeders;

use App\Models\ApplicantProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicantProfileSeeder extends Seeder
{
    public function run(): void
    {
        $applicant = User::where('email', 'applicant@example.com')->first();
        if (! $applicant) {
            $applicant = User::factory()->create(['email' => 'applicant@example.com']);
        }

        ApplicantProfile::create([
            'user_id' => $applicant->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '+1234567890',
            'gender' => 'male',
            'experience_years' => 5,
            'current_job_title' => 'PHP Developer',
            'social_links' => ['linkedin' => 'https://linkedin.com/in/johndoe'],
        ]);
    }
}
