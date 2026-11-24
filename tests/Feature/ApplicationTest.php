<?php

use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;

it('can list applications', function () {
    Application::factory()->count(3)->create();

    $response = $this->actingAs(User::factory()->create(['email' => 'admin@admin.test']))->get('/backend/applications');

    $response->assertStatus(200);
    $response->assertJsonCount(3, 'data');
});

it('can update application status', function () {
    $application = Application::factory()->create(['status' => 'pending']);

    $response = $this->actingAs(User::factory()->create(['email' => 'admin@admin.test']))->put('/backend/applications/'.$application->id.'/status', [
        'status' => 'shortlisted',
        'notes' => 'Great candidate.',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('applications', ['id' => $application->id, 'status' => 'shortlisted']);
    $this->assertDatabaseHas('status_timelines', ['application_id' => $application->id, 'status' => 'shortlisted']);
});

it('can bulk update application status', function () {
    $applications = Application::factory()->count(3)->create(['status' => 'pending']);

    $response = $this->actingAs(User::factory()->create(['email' => 'admin@admin.test']))->post('/backend/applications/bulk-status', [
        'application_ids' => $applications->pluck('id')->toArray(),
        'status' => 'rejected',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseCount('applications', 3);
    $this->assertDatabaseHas('applications', ['id' => $applications->first()->id, 'status' => 'rejected']);
});

it('can soft delete an application', function () {
    $application = Application::factory()->create();

    $response = $this->actingAs(User::factory()->create(['email' => 'admin@admin.test']))->delete('/backend/applications/'.$application->id);

    $response->assertStatus(200);
    $this->assertSoftDeleted('applications', ['id' => $application->id]);
});

it('can recalculate ATS for an application', function () {
    $listing = JobListing::factory()->create(['keywords' => ['php', 'laravel']]);
    $application = Application::factory()->create([
        'job_listing_id' => $listing->id,
        'resume_path' => 'resumes/test.pdf',
        'ats_calculation_status' => 'pending',
    ]);

    $response = $this->actingAs(User::factory()->create(['email' => 'admin@admin.test']))->post('/backend/applications/'.$application->id.'/recalculate-ats');

    $response->assertStatus(200);
    $this->assertDatabaseHas('applications', ['id' => $application->id, 'ats_calculation_status' => 'completed']);
});
