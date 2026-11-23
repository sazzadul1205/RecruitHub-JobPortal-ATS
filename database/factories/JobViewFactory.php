<?php

namespace Database\Factories;

use App\Models\JobListing;
use App\Models\JobView;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class JobViewFactory extends Factory
{
    protected $model = JobView::class;

    public function definition(): array
    {
        return [
            'job_listing_id' => JobListing::factory(),
            'user_id' => fake()->randomElement([null, User::factory()]),
            'ip_address' => fake()->ipv4(),
        ];
    }
}
