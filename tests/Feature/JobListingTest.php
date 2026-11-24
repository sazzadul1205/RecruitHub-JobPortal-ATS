<?php

use App\Models\JobListing;
use App\Models\User;

it('can list job listings', function () {
    JobListing::factory()->count(3)->create();

    $response = $this->actingAs(User::factory()->create())->get('/backend/listing');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->where('jobListings.data', fn ($jobs) => count($jobs) === 3));
});

it('can create a job listing', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/backend/listing', [
        'title' => 'PHP Developer',
        'slug' => 'php-developer',
        'description' => 'We need a PHP developer.',
        'job_type' => 'full_time',
        'is_active' => true,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('job_listings', ['slug' => 'php-developer', 'user_id' => $user->id]);
});

it('can update a job listing owned by the user', function () {
    $user = User::factory()->create();
    $listing = JobListing::factory()->create(['user_id' => $user->id, 'title' => 'Old']);

    $response = $this->actingAs($user)->put('/backend/listing/'.$listing->id, [
        'title' => 'Updated',
        'slug' => $listing->slug,
        'description' => $listing->description,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('job_listings', ['id' => $listing->id, 'title' => 'Updated']);
});

it('cannot update a job listing owned by another user', function () {
    $listing = JobListing::factory()->create();

    $response = $this->actingAs(User::factory()->create())->put('/backend/listing/'.$listing->id, [
        'title' => 'Hacked',
        'slug' => $listing->slug,
        'description' => $listing->description,
    ]);

    $response->assertStatus(403);
});

it('can toggle active on a job listing', function () {
    $user = User::factory()->create();
    $listing = JobListing::factory()->create(['user_id' => $user->id, 'is_active' => true]);

    $response = $this->actingAs($user)->patch('/backend/listing/'.$listing->id.'/toggle-active');

    $response->assertStatus(200);
    $this->assertDatabaseHas('job_listings', ['id' => $listing->id, 'is_active' => false]);
});

it('can soft delete a job listing', function () {
    $user = User::factory()->create();
    $listing = JobListing::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete('/backend/listing/'.$listing->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('job_listings', ['id' => $listing->id]);
});
