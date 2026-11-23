<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use App\Models\Location;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleAndPermissionSeeder::class,
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
