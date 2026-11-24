<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'description' => fake()->sentence(),
        ];
    }

    public function jobSeeker(): static
    {
        return $this->state([
            'name' => 'Job Seeker',
            'slug' => 'job_seeker',
            'description' => 'Search and apply for jobs',
        ]);
    }

    public function employer(): static
    {
        return $this->state([
            'name' => 'Employer',
            'slug' => 'employer',
            'description' => 'Post jobs and manage applications',
        ]);
    }

    public function admin(): static
    {
        return $this->state([
            'name' => 'Admin',
            'slug' => 'admin',
            'description' => 'Platform administrator',
        ]);
    }
}
