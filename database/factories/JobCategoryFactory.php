<?php

namespace Database\Factories;

use App\Models\JobCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobCategoryFactory extends Factory
{
    protected $model = JobCategory::class;

    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'is_active' => true,
        ];
    }
}
