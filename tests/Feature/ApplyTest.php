<?php

use App\Models\Application;
use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use App\Models\JobListing;
use App\Models\User;

it('an applicant can apply to a job', function () {
    $user = User::factory()->create();
    $profile = ApplicantProfile::factory()->create(['user_id' => $user->id]);
    $cv = ApplicantCv::factory()->create(['applicant_profile_id' => $profile->id, 'status' => 'active']);
    $listing = JobListing::factory()->create(['slug' => 'php-dev']);

    $response = $this->actingAs($user)->post('/apply/store/php-dev', [
        'applicant_cv_id' => $cv->id,
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('applications', [
        'job_listing_id' => $listing->id,
        'user_id' => $user->id,
        'email' => 'john@example.com',
    ]);
});

it('cannot apply twice to the same job', function () {
    $user = User::factory()->create();
    $profile = ApplicantProfile::factory()->create(['user_id' => $user->id]);
    $cv = ApplicantCv::factory()->create(['applicant_profile_id' => $profile->id, 'status' => 'active']);
    $listing = JobListing::factory()->create(['slug' => 'php-dev']);

    Application::factory()->create(['user_id' => $user->id, 'job_listing_id' => $listing->id]);

    $response = $this->actingAs($user)->post('/apply/store/php-dev', [
        'applicant_cv_id' => $cv->id,
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'phone' => '1234567890',
    ]);

    $response->assertStatus(422);
});

it('an applicant can list their applications', function () {
    $user = User::factory()->create();
    Application::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get('/apply');

    $response->assertStatus(200);
    $response->assertJsonCount(3, 'data');
});

it('an applicant can update their pending application', function () {
    $user = User::factory()->create();
    $application = Application::factory()->create(['user_id' => $user->id, 'status' => 'pending']);

    $response = $this->actingAs($user)->put('/apply/'.$application->id, [
        'name' => 'Updated Name',
        'email' => $application->email,
        'phone' => $application->phone,
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('applications', ['id' => $application->id, 'name' => 'Updated Name']);
});

it('an applicant cannot update a non-pending application', function () {
    $user = User::factory()->create();
    $application = Application::factory()->create(['user_id' => $user->id, 'status' => 'hired']);

    $response = $this->actingAs($user)->put('/apply/'.$application->id, [
        'name' => 'Updated Name',
        'email' => $application->email,
        'phone' => $application->phone,
    ]);

    $response->assertStatus(422);
});

it('an applicant can withdraw their application', function () {
    $user = User::factory()->create();
    $application = Application::factory()->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->delete('/apply/'.$application->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('applications', ['id' => $application->id]);
});
