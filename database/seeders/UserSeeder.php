<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ], [
            'description' => 'Platform administrator with full access',
        ]);

        $employerRole = Role::firstOrCreate([
            'name' => 'employer',
            'guard_name' => 'web',
        ], [
            'description' => 'Posts jobs and screens applicants',
        ]);

        $applicantRole = Role::firstOrCreate([
            'name' => 'applicant',
            'guard_name' => 'web',
        ], [
            'description' => 'Job seeker who manages own profile and applications',
        ]);

        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
            ]
        );
        $adminUser->roles()->sync([$adminRole->id]);

        $employerUser = User::firstOrCreate(
            ['email' => 'employer@example.com'],
            [
                'name' => 'Employer User',
                'password' => bcrypt('password'),
            ]
        );
        $employerUser->roles()->sync([$employerRole->id]);

        $applicantUser = User::firstOrCreate(
            ['email' => 'applicant@example.com'],
            [
                'name' => 'Applicant User',
                'password' => bcrypt('password'),
            ]
        );
        $applicantUser->roles()->sync([$applicantRole->id]);

        $adminPermissions = [
            'job_listings.view', 'job_listings.create', 'job_listings.update',
            'job_listings.destroy', 'job_listings.toggle_active', 'job_listings.restore',
            'job_listings.force_delete', 'job_listings.bulk_activate', 'job_listings.bulk_deactivate',
            'job_listings.bulk_delete', 'job_listings.applications', 'job_listings.update_statuses',
            'job_listings.statistics', 'applications.view', 'applications.job_applications',
            'applications.show', 'applications.status.update', 'applications.bulk_status.update',
            'applications.destroy', 'applications.bulk_delete', 'applications.restore',
            'applications.bulk_restore', 'applications.force_delete', 'applications.download_resume',
            'applications.bulk_download_resumes', 'applications.email.send', 'applications.bulk_email.send',
            'applications.export', 'applications.export_single', 'applications.recalculate_ats',
            'job_categories.view', 'job_categories.create', 'job_categories.update',
            'job_categories.toggle_active', 'job_categories.destroy', 'job_categories.restore',
            'job_categories.force_delete', 'job_categories.bulk_delete', 'job_categories.bulk_restore',
            'job_categories.bulk_activate', 'job_categories.bulk_deactivate', 'job_categories.bulk_force_delete',
            'locations.view', 'locations.create', 'locations.update', 'locations.toggle_active',
            'locations.destroy', 'locations.restore', 'locations.force_delete', 'locations.bulk_delete',
            'locations.bulk_restore', 'locations.bulk_activate', 'locations.bulk_deactivate',
        ];

        foreach ($adminPermissions as $permName) {
            $perm = Permission::firstOrCreate([
                'name' => $permName,
                'guard_name' => 'web',
            ], [
                'description' => "Permission for {$permName}",
            ]);
            $adminRole->permissions()->syncWithoutDetaching([$perm->id]);
        }

        $employerPermissions = [
            'job_listings.view', 'job_listings.create', 'job_listings.update',
            'job_listings.destroy', 'job_listings.toggle_active', 'job_listings.restore',
            'job_listings.applications', 'job_listings.status.update',
            'applications.show', 'applications.status.update', 'applications.bulk_status.update',
            'applications.download_resume', 'applications.bulk_download_resumes',
            'applications.email.send', 'applications.bulk_email.send',
            'applications.export', 'applications.export_single', 'applications.recalculate_ats',
            'job_categories.view', 'locations.view',
        ];

        foreach ($employerPermissions as $permName) {
            $perm = Permission::firstOrCreate([
                'name' => $permName,
                'guard_name' => 'web',
            ], [
                'description' => "Permission for {$permName}",
            ]);
            $employerRole->permissions()->syncWithoutDetaching([$perm->id]);
        }
    }
}
