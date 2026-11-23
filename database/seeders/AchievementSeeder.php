<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\ApplicantProfile;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $profile = ApplicantProfile::first();
        if (!$profile) {
            return;
        }

        Achievement::create([
            'applicant_profile_id' => $profile->id,
            'achievement_name' => 'Employee of the Month',
            'achievement_details' => 'Recognized for outstanding performance in Q3 2022.',
        ]);
    }
}
