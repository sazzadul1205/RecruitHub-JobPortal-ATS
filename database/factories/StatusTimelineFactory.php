<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\StatusTimeline;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatusTimelineFactory extends Factory
{
    protected $model = StatusTimeline::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'status' => fake()->randomElement(['pending', 'shortlisted', 'rejected', 'hired']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
