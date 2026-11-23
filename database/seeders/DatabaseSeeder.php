<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
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
    }
}
