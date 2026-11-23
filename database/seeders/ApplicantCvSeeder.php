<?php

namespace Database\Seeders;

use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use Illuminate\Database\Seeder;

class ApplicantCvSeeder extends Seeder
{
    public function run(): void
    {
        $profile = ApplicantProfile::first();
        if (!$profile) {
            return;
        }

        ApplicantCv::create([
            'applicant_profile_id' => $profile->id,
            'cv_path' => 'cvs/sample-resume.pdf',
            'original_name' => 'john_doe_resume.pdf',
            'status' => 'active',
            'order_position' => 1,
            'is_primary' => true,
        ]);
    }
}
