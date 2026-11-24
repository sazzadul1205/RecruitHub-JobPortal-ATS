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
            'birth_date' => fake()->dateTimeBetween('-40 years', '-18 years'),
            'gender' => fake()->randomElement(['male', 'female', 'other', 'prefer_not_to_say']),
            'blood_type' => fake()->randomElement([null, 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'photo_path' => null,
            'social_links' => ['linkedin' => fake()->url()],
            'experience_years' => fake()->numberBetween(0, 20),
            'current_job_title' => fake()->jobTitle(),
        ];
    }
}
