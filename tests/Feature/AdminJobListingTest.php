<?php

use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

function setupEmployerWithPermissions(): User
{
    $user = User::factory()->create(['email' => 'employer@example.com']);
    $role = Role::create(['name' => 'employer_test', 'guard_name' => 'web']);
    $permissions = ['job_listings.view', 'job_listings.create', 'job_listings.update', 'job_listings.destroy'];
    foreach ($permissions as $permName) {
        $perm = Permission::firstOrCreate(['name' => $permName, 'guard_name' => 'web']);
        $role->permissions()->attach($perm);
    }
    $user->roles()->attach($role);

    return $user;
}

test('employer can view job listings index', function () {
    $user = setupEmployerWithPermissions();

    JobListing::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get('/backend/listing');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('jobs/admin-index'));
});

test('employer can create job listing', function () {
    $user = setupEmployerWithPermissions();

    $category = JobCategory::factory()->create();
    $location = Location::factory()->create();

    $response = $this->actingAs($user)->post('/backend/listing', [
        'category_id' => $category->id,
        'title' => 'Senior PHP Developer',
        'slug' => 'senior-php-developer',
        'description' => 'We are looking for a senior PHP developer.',
        'requirements' => '5+ years PHP experience.',
        'job_type' => 'full_time',
        'experience_level' => 'senior',
        'education_requirement' => 'bachelors',
        'salary_min' => 70000,
        'salary_max' => 120000,
        'is_active' => true,
        'keywords' => ['php', 'laravel'],
        'skills' => ['php', 'laravel'],
        'responsibilities' => ['develop features'],
    ]);

    $response->assertRedirect('/backend/listing');
    $this->assertDatabaseHas('job_listings', [
        'title' => 'Senior PHP Developer',
        'slug' => 'senior-php-developer',
        'user_id' => $user->id,
    ]);
});

test('employer can update their own job listing', function () {
    $user = setupEmployerWithPermissions();

    $job = JobListing::factory()->create(['user_id' => $user->id, 'title' => 'Old Title']);

    $response = $this->actingAs($user)->put('/backend/listing/' . $job->id, [
        'category_id' => $job->category_id,
        'title' => 'Updated Title',
        'slug' => 'updated-title-' . $job->id,
        'description' => 'Updated description.',
        'requirements' => 'Updated requirements.',
        'job_type' => 'full_time',
        'experience_level' => 'senior',
        'education_requirement' => 'bachelors',
        'salary_min' => 70000,
        'salary_max' => 120000,
        'is_active' => true,
        'keywords' => ['php'],
        'skills' => ['php'],
        'responsibilities' => ['develop'],
    ]);

    $response->assertRedirect('/backend/listing');
    $this->assertDatabaseHas('job_listings', [
        'id' => $job->id,
        'title' => 'Updated Title',
    ]);
});

test('employer cannot update another user job listing', function () {
    $user = setupEmployerWithPermissions();
    $otherUser = User::factory()->create();

    $job = JobListing::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)->put('/backend/listing/' . $job->id, [
        'category_id' => $job->category_id,
        'title' => 'Hacked Title',
        'slug' => 'hacked-title-' . $job->id,
        'description' => 'Hacked description.',
        'requirements' => 'Hacked requirements.',
        'job_type' => 'full_time',
        'experience_level' => 'senior',
        'education_requirement' => 'bachelors',
        'salary_min' => 70000,
        'salary_max' => 120000,
        'is_active' => true,
        'keywords' => ['php'],
        'skills' => ['php'],
        'responsibilities' => ['develop'],
    ]);

    $response->assertStatus(403);
});

test('employer can delete their own job listing', function () {
    $user = setupEmployerWithPermissions();

    $job = JobListing::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete('/backend/listing/' . $job->id);

    $response->assertRedirect('/backend/listing');
    $this->assertSoftDeleted('job_listings', ['id' => $job->id]);
});
