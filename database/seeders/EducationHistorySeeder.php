<?php

namespace Database\Seeders;

use App\Models\ApplicantProfile;
use App\Models\EducationHistory;
use Illuminate\Database\Seeder;

class EducationHistorySeeder extends Seeder
{
    public function run(): void
    {
        $profile = ApplicantProfile::first();
        if (! $profile) {
            return;
        }

        EducationHistory::create([
            'applicant_profile_id' => $profile->id,
            'institution_name' => 'State University',
            'degree' => 'Bachelor of Science in Computer Science',
            'passing_year' => 2018,
        ]);
    }
}
