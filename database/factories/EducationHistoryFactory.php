<?php

namespace Database\Factories;

use App\Models\EducationHistory;
use App\Models\ApplicantProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class EducationHistoryFactory extends Factory
{
    protected $model = EducationHistory::class;

    public function definition(): array
    {
        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'institution_name' => fake()->company(),
            'degree' => fake()->randomElement(['Bachelor of Science', 'Master of Science', 'Bachelor of Arts', 'High School Diploma']),
            'passing_year' => fake()->numberBetween(2015, 2024),
        ];
    }
}
