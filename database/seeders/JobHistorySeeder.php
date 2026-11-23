<?php

namespace Database\Seeders;

use App\Models\JobHistory;
use App\Models\ApplicantProfile;
use Illuminate\Database\Seeder;

class JobHistorySeeder extends Seeder
{
    public function run(): void
    {
        $profile = ApplicantProfile::first();
        if (!$profile) {
            return;
        }

        JobHistory::create([
            'applicant_profile_id' => $profile->id,
            'company_name' => 'Tech Corp',
            'position' => 'PHP Developer',
            'starting_year' => 2020,
            'ending_year' => 2023,
            'is_current' => false,
        ]);

        JobHistory::create([
            'applicant_profile_id' => $profile->id,
            'company_name' => 'Web Solutions',
            'position' => 'Junior Developer',
            'starting_year' => 2018,
            'ending_year' => 2020,
            'is_current' => false,
        ]);
    }
}
