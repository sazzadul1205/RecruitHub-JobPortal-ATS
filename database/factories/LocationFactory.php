<?php

namespace Database\Factories;

use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->city(),
            'address' => fake()->address(),
            'is_active' => true,
        ];
    }
}
