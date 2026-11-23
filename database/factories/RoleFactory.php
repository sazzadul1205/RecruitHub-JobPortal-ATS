<?php

namespace Database\Factories;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    protected $model = Role::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(['admin', 'employer', 'applicant']),
            'guard_name' => 'web',
            'description' => fake()->sentence(),
        ];
    }
}

class PermissionFactory extends Factory
{
    protected $model = Permission::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->word() . '.' . fake()->word(),
            'guard_name' => 'web',
            'description' => fake()->sentence(),
        ];
    }
}
