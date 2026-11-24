<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
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

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
