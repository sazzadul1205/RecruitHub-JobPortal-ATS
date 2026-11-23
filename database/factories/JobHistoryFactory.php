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
        $startYear = fake()->numberBetween(2015, 2023);

        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'company_name' => fake()->company(),
            'position' => fake()->jobTitle(),
            'starting_year' => $startYear,
            'ending_year' => fake()->randomElement([null, $startYear + fake()->numberBetween(1, 5)]),
            'is_current' => fake()->boolean(),
        ];
    }
}
