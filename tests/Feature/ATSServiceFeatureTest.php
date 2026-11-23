<?php

use App\Enums\ATSCalculationStatus;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\User;
use App\Services\ATSService;
use Illuminate\Support\Facades\Storage;

test('ATS service returns 0 score when job has no keywords', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['keywords' => [], 'is_active' => true]);
    $application = Application::factory()->create([
        'job_listing_id' => $job->id,
        'user_id' => $user->id,
        'ats_calculation_status' => ATSCalculationStatus::Pending->value,
    ]);

    $service = new ATSService;
    $service->calculate($application);

    $application->refresh();
    expect($application->ats_calculation_status)->toBe(ATSCalculationStatus::Completed);
    expect($application->ats_percentage)->toBe('0.00');
});

test('ATS service calculates matching score based on keywords', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create([
        'keywords' => ['php', 'laravel', 'mysql'],
        'is_active' => true,
    ]);
    $application = Application::factory()->create([
        'job_listing_id' => $job->id,
        'user_id' => $user->id,
        'resume_path' => 'resumes/test.txt',
        'ats_calculation_status' => ATSCalculationStatus::Pending->value,
    ]);

    Storage::fake('private');
    Storage::disk('private')->put('resumes/test.txt', 'I am a PHP developer with Laravel and MySQL experience.');

    $service = new ATSService;
    $service->calculate($application);

    $application->refresh();
    expect($application->ats_calculation_status)->toBe(ATSCalculationStatus::Completed);
    expect($application->ats_percentage)->toBe('100.00');
    expect($application->matched_keywords)->toContain('php', 'laravel', 'mysql');
});

test('ATS service calculates partial match score', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create([
        'keywords' => ['php', 'laravel', 'mysql', 'react'],
        'is_active' => true,
    ]);
    $application = Application::factory()->create([
        'job_listing_id' => $job->id,
        'user_id' => $user->id,
        'resume_path' => 'resumes/test.txt',
        'ats_calculation_status' => ATSCalculationStatus::Pending->value,
    ]);

    Storage::fake('private');
    Storage::disk('private')->put('resumes/test.txt', 'I am a PHP developer.');

    $service = new ATSService;
    $service->calculate($application);

    $application->refresh();
    expect($application->ats_calculation_status)->toBe(ATSCalculationStatus::Completed);
    expect($application->ats_percentage)->toBe('25.00');
    expect($application->matched_keywords)->toContain('php');
    expect($application->missing_keywords)->toContain('laravel', 'mysql', 'react');
});

test('ATS service marks as failed when resume file does not exist', function () {
    $user = User::factory()->create();
    $job = JobListing::factory()->create(['keywords' => ['php'], 'is_active' => true]);
    $application = Application::factory()->create([
        'job_listing_id' => $job->id,
        'user_id' => $user->id,
        'resume_path' => 'resumes/nonexistent.txt',
        'ats_calculation_status' => ATSCalculationStatus::Pending->value,
    ]);

    $service = new ATSService;
    $service->calculate($application);

    $application->refresh();
    expect($application->ats_calculation_status)->toBe(ATSCalculationStatus::Failed);
});
