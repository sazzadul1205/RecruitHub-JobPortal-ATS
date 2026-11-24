<?php

namespace Database\Factories;

use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    public function definition(): array
    {
        $title = fake()->unique()->jobTitle();

        return [
            'user_id' => User::factory(),
            'category_id' => JobCategory::factory(),
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'requirements' => fake()->paragraph(),
            'job_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'freelance', 'internship']),
            'experience_level' => fake()->randomElement(['entry_level', 'mid_level', 'senior_level', 'executive']),
            'education_requirement' => fake()->randomElement(['high_school', 'bachelors', 'masters']),
            'education_details' => fake()->sentence(),
            'salary_min' => fake()->numberBetween(40000, 80000),
            'salary_max' => fake()->numberBetween(80001, 150000),
            'is_salary_negotiable' => fake()->boolean(),
            'as_per_companies_policy' => fake()->boolean(),
            'benefits' => ['Health insurance', 'Remote work', 'Paid time off'],
            'skills' => ['PHP', 'Laravel', 'MySQL'],
            'responsibilities' => ['Develop features', 'Write tests', 'Review code'],
            'keywords' => ['php', 'laravel', 'mysql'],
            'application_deadline' => fake()->dateTimeBetween('+1 month', '+6 months'),
            'publish_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'is_active' => true,
            'views_count' => fake()->numberBetween(0, 500),
            'required_facebook_link' => false,
            'required_linkedin_link' => false,
        ];
    }
}
