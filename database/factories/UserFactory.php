<?php

namespace Database\Factories;

use App\Models\Role;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'role_id' => Role::query()->jobSeeker()->value('id') ?? Role::factory()->jobSeeker()->create()->id,
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function jobSeeker(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::query()->jobSeeker()->value('id') ?? Role::factory()->jobSeeker()->create()->id,
        ]);
    }

    public function employer(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::query()->employer()->value('id') ?? Role::factory()->employer()->create()->id,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role_id' => Role::query()->admin()->value('id') ?? Role::factory()->admin()->create()->id,
        ]);
    }
}
