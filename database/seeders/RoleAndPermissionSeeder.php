<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::create([
            'name' => 'admin',
            'guard_name' => 'web',
            'description' => 'Platform administrator with full access',
        ]);

        $employerRole = Role::create([
            'name' => 'employer',
            'guard_name' => 'web',
            'description' => 'Posts jobs and screens applicants',
        ]);

        $applicantRole = Role::create([
            'name' => 'applicant',
            'guard_name' => 'web',
            'description' => 'Job seeker who manages own profile and applications',
        ]);

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

        $applicantPermissions = [];

        foreach ($adminPermissions as $perm) {
            Permission::create([
                'name' => $perm,
                'guard_name' => 'web',
                'description' => "Permission for {$perm}",
            ]);
        }

        foreach ($employerPermissions as $perm) {
            if (! Permission::where('name', $perm)->exists()) {
                Permission::create([
                    'name' => $perm,
                    'guard_name' => 'web',
                    'description' => "Permission for {$perm}",
                ]);
            }
        }

        $adminRole->permissions()->attach(Permission::all()->pluck('id'));

        $employerPermissionIds = Permission::whereIn('name', $employerPermissions)->pluck('id');
        $employerRole->permissions()->attach($employerPermissionIds);

        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $adminUser->roles()->attach($adminRole);

        $employerUser = User::create([
            'name' => 'Employer User',
            'email' => 'employer@example.com',
            'password' => bcrypt('password'),
        ]);
        $employerUser->roles()->attach($employerRole);

        $applicantUser = User::create([
            'name' => 'Applicant User',
            'email' => 'applicant@example.com',
            'password' => bcrypt('password'),
        ]);
        $applicantUser->roles()->attach($applicantRole);
    }
}
