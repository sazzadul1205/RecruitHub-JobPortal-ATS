<?php

namespace Database\Factories;

use App\Enums\EducationRequirement;
use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'category_id' => JobCategory::factory(),
            'title' => fake()->jobTitle(),
            'slug' => fake()->unique()->slug(),
            'description' => fake()->paragraph(),
            'requirements' => fake()->paragraph(),
            'job_type' => fake()->randomElement(JobType::cases())->value,
            'experience_level' => fake()->randomElement(ExperienceLevel::cases())->value,
            'education_requirement' => fake()->randomElement(EducationRequirement::cases())->value,
            'education_details' => fake()->optional()->sentence(),
            'salary_min' => fake()->randomElement([null, 30000, 50000, 70000]),
            'salary_max' => fake()->randomElement([null, 50000, 80000, 120000]),
            'is_salary_negotiable' => fake()->boolean(),
            'as_per_companies_policy' => fake()->boolean(),
            'benefits' => fake()->optional()->randomElements(['health insurance', 'remote work', 'flexible hours', 'paid time off'], 2),
            'skills' => fake()->optional()->randomElements(['php', 'laravel', 'javascript', 'react', 'mysql'], 3),
            'responsibilities' => fake()->optional()->randomElements(['develop features', 'write tests', 'code review', 'mentor juniors'], 3),
            'keywords' => fake()->optional()->randomElements(['php', 'laravel', 'react', 'mysql', 'api'], 3),
            'publish_at' => now(),
            'application_deadline' => now()->addDays(30),
            'is_active' => true,
            'views_count' => fake()->numberBetween(0, 1000),
            'required_facebook_link' => false,
            'required_linkedin_link' => false,
        ];
    }
}
