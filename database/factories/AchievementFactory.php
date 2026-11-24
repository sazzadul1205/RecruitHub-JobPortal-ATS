<?php

namespace Database\Factories;

use App\Models\Achievement;
use App\Models\ApplicantProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class AchievementFactory extends Factory
{
    protected $model = Achievement::class;

    public function definition(): array
    {
        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'achievement_name' => fake()->word(),
            'achievement_details' => fake()->sentence(),
        ];
    }
}
