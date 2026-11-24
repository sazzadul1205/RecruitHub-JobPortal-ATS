<?php

use App\Models\JobCategory;
use App\Models\User;

it('can list job categories', function () {
    JobCategory::factory()->count(3)->create();

    $response = $this->actingAs(User::factory()->create())->get('/backend/categories');

    $response->assertStatus(200);
    $response->assertJsonCount(3, 'data');
});

it('can create a job category', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/backend/categories', [
        'name' => 'Engineering',
        'slug' => 'engineering',
        'is_active' => true,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('job_categories', ['slug' => 'engineering']);
});

it('can update a job category', function () {
    $category = JobCategory::factory()->create(['name' => 'Old']);

    $response = $this->actingAs(User::factory()->create())->put('/backend/categories/'.$category->id, [
        'name' => 'Updated',
        'slug' => 'updated',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('job_categories', ['id' => $category->id, 'name' => 'Updated']);
});

it('can toggle a job category active status', function () {
    $category = JobCategory::factory()->create(['is_active' => true]);

    $response = $this->actingAs(User::factory()->create())->patch('/backend/categories/'.$category->id.'/toggle-active');

    $response->assertStatus(200);
    $this->assertDatabaseHas('job_categories', ['id' => $category->id, 'is_active' => false]);
});

it('can soft delete a job category', function () {
    $category = JobCategory::factory()->create();

    $response = $this->actingAs(User::factory()->create())->delete('/backend/categories/'.$category->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('job_categories', ['id' => $category->id]);
});
