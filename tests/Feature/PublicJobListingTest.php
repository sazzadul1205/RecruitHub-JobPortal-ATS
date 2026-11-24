<?php

use App\Models\JobListing;
use App\Models\User;

it('can list public jobs', function () {
    JobListing::factory()->count(3)->create(['is_active' => true]);

    $response = $this->actingAs(User::factory()->create())->get('/backend/seeker/jobs');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->where('jobListings.data', fn ($jobs) => count($jobs) === 3));
});

it('can show a public job by slug', function () {
    $job = JobListing::factory()->create(['slug' => 'php-developer', 'is_active' => true]);

    $response = $this->actingAs(User::factory()->create())->get('/backend/seeker/jobs/php-developer');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->where('jobListing.slug', 'php-developer'));
});

it('increments view count when a job is shown', function () {
    $job = JobListing::factory()->create(['slug' => 'php-dev', 'views_count' => 0, 'is_active' => true]);

    $this->actingAs(User::factory()->create())->get('/backend/seeker/jobs/php-dev');

    $this->assertDatabaseHas('job_listings', ['id' => $job->id, 'views_count' => 1]);
});

it('returns popular jobs', function () {
    JobListing::factory()->count(5)->create(['is_active' => true]);

    $response = $this->get('/api/jobs/popular');

    $response->assertStatus(200);
});

it('returns trending jobs', function () {
    JobListing::factory()->count(5)->create(['is_active' => true]);

    $response = $this->get('/api/jobs/trending');

    $response->assertStatus(200);
});
