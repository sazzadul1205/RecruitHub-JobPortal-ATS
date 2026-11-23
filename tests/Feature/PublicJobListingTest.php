<?php

use App\Models\JobCategory;
use App\Models\JobListing;
use App\Models\Location;
use App\Models\User;

test('public job listing index loads successfully', function () {
    $user = User::factory()->create();
    $category = JobCategory::factory()->create(['is_active' => true]);
    $location = Location::factory()->create(['is_active' => true]);

    JobListing::factory()->count(5)->create([
        'category_id' => $category->id,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->get('/jobs');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('jobs/public-index'));
});

test('public job listing filters by category', function () {
    $user = User::factory()->create();
    $category = JobCategory::factory()->create(['is_active' => true]);

    JobListing::factory()->count(3)->create(['category_id' => $category->id, 'is_active' => true]);
    JobListing::factory()->count(2)->create(['is_active' => true]);

    $response = $this->actingAs($user)->get('/jobs?category='.$category->id);

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('jobs/public-index'));
});

test('public job listing shows individual job', function () {
    $user = User::factory()->create();
    $category = JobCategory::factory()->create(['is_active' => true]);
    $location = Location::factory()->create(['is_active' => true]);

    $job = JobListing::factory()->create([
        'category_id' => $category->id,
        'is_active' => true,
        'slug' => 'senior-php-developer',
    ]);
    $job->locations()->attach($location);

    $response = $this->actingAs($user)->get('/jobs/senior-php-developer');

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('jobs/public-show'));
});

test('public job listing returns 404 for inactive job', function () {
    $user = User::factory()->create();
    JobListing::factory()->create(['is_active' => false, 'slug' => 'inactive-job']);

    $response = $this->actingAs($user)->get('/jobs/inactive-job');

    $response->assertNotFound();
});

test('public job listing popular API returns JSON', function () {
    $user = User::factory()->create();
    JobListing::factory()->count(3)->create(['is_active' => true]);

    $response = $this->actingAs($user)->get('/api/jobs/popular');

    $response->assertOk();
    $response->assertJsonStructure([0 => ['id', 'title', 'slug', 'views_count']]);
});
