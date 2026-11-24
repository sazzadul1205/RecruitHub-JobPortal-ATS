<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            JobCategorySeeder::class,
            LocationSeeder::class,
            JobListingSeeder::class,
            ApplicantProfileSeeder::class,
            ApplicantCvSeeder::class,
            JobHistorySeeder::class,
            EducationHistorySeeder::class,
            AchievementSeeder::class,
            ApplicationSeeder::class,
        ]);

        $jobSeeker = Role::query()->jobSeeker()->first();
        $employer = Role::query()->employer()->first();
        $admin = Role::query()->admin()->first();

        User::factory()->create([
            'name' => 'Job Seeker Demo',
            'email' => 'jobseeker@example.com',
            'password' => Hash::make('password'),
            'role_id' => $jobSeeker?->id,
        ]);

        User::factory()->create([
            'name' => 'Employer Demo',
            'email' => 'employer@example.com',
            'password' => Hash::make('password'),
            'role_id' => $employer?->id,
        ]);

        User::factory()->create([
            'name' => 'Admin Demo',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role_id' => $admin?->id,
        ]);
    }
}
