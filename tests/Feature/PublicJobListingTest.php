<?php

use App\Models\JobListing;

it('can list public jobs', function () {
    JobListing::factory()->count(3)->create(['is_active' => true]);

    $response = $this->get('/backend/seeker/jobs');

    $response->assertStatus(200);
    $response->assertJsonCount(3, 'data');
});

it('can show a public job by slug', function () {
    $job = JobListing::factory()->create(['slug' => 'php-developer', 'is_active' => true]);

    $response = $this->get('/backend/seeker/jobs/php-developer');

    $response->assertStatus(200);
    $response->assertJsonFragment(['slug' => 'php-developer']);
});

it('increments view count when a job is shown', function () {
    $job = JobListing::factory()->create(['slug' => 'php-dev', 'views_count' => 0, 'is_active' => true]);

    $this->get('/backend/seeker/jobs/php-dev');

    $this->assertDatabaseHas('job_listings', ['id' => $job->id, 'views_count' => 1]);
});

it('returns popular jobs', function () {
    JobListing::factory()->count(5)->create(['is_active' => true]);

    $response = $this->get('/api/jobs/popular');

    $response->assertStatus(200);
});
