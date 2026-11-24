<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\JobHistory;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobHistoryFactory extends Factory
{
    protected $model = JobHistory::class;

    public function definition(): array
    {
        $startingYear = fake()->numberBetween(2015, 2022);

        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'company_name' => fake()->company(),
            'position' => fake()->jobTitle(),
            'starting_year' => $startingYear,
            'ending_year' => fake()->numberBetween($startingYear, 2026),
            'is_current' => false,
        ];
    }
}
