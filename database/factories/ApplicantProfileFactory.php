<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantProfileFactory extends Factory
{
    protected $model = ApplicantProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'birth_date' => fake()->dateBetween('1980-01-01', '2005-01-01'),
            'gender' => fake()->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
            'blood_type' => fake()->optional()->randomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'photo_path' => null,
            'social_links' => fake()->optional()->randomElement([
                ['linkedin' => fake()->url()],
                ['facebook' => fake()->url()],
                ['twitter' => fake()->url()],
            ]),
            'experience_years' => fake()->numberBetween(0, 15),
            'current_job_title' => fake()->jobTitle(),
        ];
    }
}
