<?php

use App\Http\Controllers\ApplicationsController;
use App\Http\Controllers\ApplyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PublicJobListingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /* ============ Public Job Portal Routes ============ */
    Route::get('jobs', [PublicJobListingController::class, 'index'])->name('jobs.index');
    Route::get('jobs/{slug}', [PublicJobListingController::class, 'show'])->name('jobs.show');

    /* ============ Applicant Routes ============ */
    Route::get('apply', [ApplyController::class, 'index'])->name('applications.my');
    Route::get('apply/create/{slug}', [ApplyController::class, 'create'])->name('applications.create');
    Route::post('apply/store/{slug}', [ApplyController::class, 'store'])->name('applications.store');
    Route::get('apply/trashed', [ApplyController::class, 'trashed'])->name('applications.trashed');
    Route::get('apply/{id}', [ApplyController::class, 'show'])->name('applications.my.show');
    Route::get('apply/{id}/edit', [ApplyController::class, 'edit'])->name('applications.my.edit');
    Route::put('apply/{id}', [ApplyController::class, 'update'])->name('applications.my.update');
    Route::delete('apply/{id}', [ApplyController::class, 'destroy'])->name('applications.my.destroy');
    Route::post('apply/{id}/restore', [ApplyController::class, 'restore'])->name('applications.my.restore');
    Route::delete('apply/{id}/force-delete', [ApplyController::class, 'forceDelete'])->name('applications.my.force-delete');
    Route::post('apply/{id}/recalculate-ats', [ApplyController::class, 'recalculateAts'])->name('applications.my.recalculate-ats');
    Route::get('apply/{id}/ats-status', [ApplyController::class, 'getAtsStatus'])->name('applications.my.ats-status');

    /* ============ Admin Job Listing Routes ============ */
    Route::middleware(['permission:job_listings.view'])->group(function () {
        Route::get('backend/listing', [JobListingController::class, 'adminIndex'])->name('jobs.admin.index');
        Route::get('backend/listing/{jobListing}/applications', [JobListingController::class, 'applications'])->name('jobs.admin.applications');
        Route::get('backend/statistics', [JobListingController::class, 'statistics'])->name('jobs.admin.statistics');
    });

    Route::middleware(['permission:job_listings.create'])->group(function () {
        Route::get('backend/listing/create', [JobListingController::class, 'adminCreate'])->name('jobs.admin.create');
        Route::post('backend/listing', [JobListingController::class, 'adminStore'])->name('jobs.admin.store');
    });

    Route::middleware(['permission:job_listings.show'])->group(function () {
        Route::get('backend/listing/{jobListing}', [JobListingController::class, 'adminShow'])->name('jobs.admin.show');
    });

    Route::middleware(['permission:job_listings.update'])->group(function () {
        Route::get('backend/listing/{jobListing}/edit', [JobListingController::class, 'adminEdit'])->name('jobs.admin.edit');
        Route::put('backend/listing/{jobListing}', [JobListingController::class, 'adminUpdate'])->name('jobs.admin.update');
    });

    Route::middleware(['permission:job_listings.destroy'])->group(function () {
        Route::delete('backend/listing/{jobListing}', [JobListingController::class, 'adminDestroy'])->name('jobs.admin.destroy');
    });

    Route::middleware(['permission:job_listings.toggle_active'])->group(function () {
        Route::patch('backend/listing/{jobListing}/toggle-active', [JobListingController::class, 'toggleActive'])->name('jobs.admin.toggle-active');
    });

    Route::middleware(['permission:job_listings.restore'])->group(function () {
        Route::patch('backend/listing/{jobListing}/restore', [JobListingController::class, 'restore'])->name('jobs.admin.restore');
    });

    Route::middleware(['permission:job_listings.force_delete'])->group(function () {
        Route::delete('backend/listing/{jobListing}/force-delete', [JobListingController::class, 'forceDelete'])->name('jobs.admin.force-delete');
    });

    Route::middleware(['permission:job_listings.bulk_activate'])->group(function () {
        Route::post('backend/listing/bulk-activate', [JobListingController::class, 'bulkActivate'])->name('jobs.admin.bulk-activate');
    });

    Route::middleware(['permission:job_listings.bulk_deactivate'])->group(function () {
        Route::post('backend/listing/bulk-deactivate', [JobListingController::class, 'bulkDeactivate'])->name('jobs.admin.bulk-deactivate');
    });

    Route::middleware(['permission:job_listings.bulk_delete'])->group(function () {
        Route::delete('backend/listing/bulk-delete', [JobListingController::class, 'bulkDelete'])->name('jobs.admin.bulk-delete');
    });

    /* ============ Admin Application Routes ============ */
    Route::middleware(['permission:applications.view'])->group(function () {
        Route::get('backend/applications', [ApplicationsController::class, 'index'])->name('applications.admin.index');
    });

    Route::middleware(['permission:applications.job_applications'])->group(function () {
        Route::get('backend/applications/job/{jobId}', [ApplicationsController::class, 'jobApplications'])->name('applications.admin.job');
    });

    Route::middleware(['permission:applications.show'])->group(function () {
        Route::get('backend/applications/{id}', [ApplicationsController::class, 'show'])->name('applications.admin.show');
    });

    Route::middleware(['permission:applications.status.update'])->group(function () {
        Route::put('backend/applications/{id}/status', [ApplicationsController::class, 'updateStatus'])->name('applications.admin.status.update');
    });

    Route::middleware(['permission:applications.bulk_status.update'])->group(function () {
        Route::post('backend/applications/bulk-status', [ApplicationsController::class, 'bulkUpdateStatus'])->name('applications.admin.bulk-status');
    });

    Route::middleware(['permission:applications.destroy'])->group(function () {
        Route::delete('backend/applications/{id}', [ApplicationsController::class, 'destroy'])->name('applications.admin.destroy');
    });

    Route::middleware(['permission:applications.bulk_delete'])->group(function () {
        Route::delete('backend/applications/bulk-delete', [ApplicationsController::class, 'bulkDelete'])->name('applications.admin.bulk-delete');
    });

    Route::middleware(['permission:applications.download_resume'])->group(function () {
        Route::get('backend/applications/{id}/download-resume', [ApplicationsController::class, 'downloadResume'])->name('applications.admin.download-resume');
    });

    Route::middleware(['permission:applications.bulk_download_resumes'])->group(function () {
        Route::post('backend/applications/bulk-download', [ApplicationsController::class, 'bulkDownloadResumes'])->name('applications.admin.bulk-download');
    });

    Route::middleware(['permission:applications.email.send'])->group(function () {
        Route::post('backend/applications/{id}/send-email', [ApplicationsController::class, 'sendEmail'])->name('applications.admin.send-email');
    });

    Route::middleware(['permission:applications.bulk_email.send'])->group(function () {
        Route::post('backend/applications/bulk-send-email', [ApplicationsController::class, 'sendBulkEmail'])->name('applications.admin.bulk-send-email');
    });

    Route::middleware(['permission:applications.recalculate_ats'])->group(function () {
        Route::post('backend/applications/{id}/recalculate-ats', [ApplicationsController::class, 'recalculateAts'])->name('applications.admin.recalculate-ats');
    });

    Route::middleware(['permission:applications.export'])->group(function () {
        Route::post('backend/applications/export/{jobId}', [ApplicationsController::class, 'exportApplications'])->name('applications.admin.export');
    });

    Route::middleware(['permission:applications.export_single'])->group(function () {
        Route::post('backend/applications/export-single/{id}', [ApplicationsController::class, 'exportSingleApplication'])->name('applications.admin.export-single');
    });

    /* ============ API Routes ============ */
    Route::get('api/jobs/popular', [PublicJobListingController::class, 'popular'])->name('api.jobs.popular');
    Route::get('api/jobs/trending', [PublicJobListingController::class, 'trending'])->name('api.jobs.trending');

    /* ============ Category Routes ============ */
    Route::middleware(['permission:job_categories.view'])->group(function () {
        Route::get('backend/categories', [JobCategoryController::class, 'index'])->name('categories.index');
        Route::get('backend/categories/active', [JobCategoryController::class, 'getActiveCategories'])->name('categories.active');
    });

    Route::middleware(['permission:job_categories.create'])->group(function () {
        Route::post('backend/categories', [JobCategoryController::class, 'store'])->name('categories.store');
    });

    Route::middleware(['permission:job_categories.update'])->group(function () {
        Route::put('backend/categories/{id}', [JobCategoryController::class, 'update'])->name('categories.update');
    });

    Route::middleware(['permission:job_categories.toggle_active'])->group(function () {
        Route::patch('backend/categories/{id}/toggle-active', [JobCategoryController::class, 'toggleActive'])->name('categories.toggle-active');
    });

    Route::middleware(['permission:job_categories.destroy'])->group(function () {
        Route::delete('backend/categories/{id}', [JobCategoryController::class, 'destroy'])->name('categories.destroy');
    });

    Route::middleware(['permission:job_categories.restore'])->group(function () {
        Route::post('backend/categories/{id}/restore', [JobCategoryController::class, 'restore'])->name('categories.restore');
    });

    Route::middleware(['permission:job_categories.force_delete'])->group(function () {
        Route::delete('backend/categories/{id}/force-delete', [JobCategoryController::class, 'forceDelete'])->name('categories.force-delete');
    });

    Route::middleware(['permission:job_categories.bulk_delete'])->group(function () {
        Route::post('backend/categories/bulk-delete', [JobCategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
    });

    Route::middleware(['permission:job_categories.bulk_restore'])->group(function () {
        Route::post('backend/categories/bulk-restore', [JobCategoryController::class, 'bulkRestore'])->name('categories.bulk-restore');
    });

    Route::middleware(['permission:job_categories.bulk_activate'])->group(function () {
        Route::post('backend/categories/bulk-activate', [JobCategoryController::class, 'bulkActivate'])->name('categories.bulk-activate');
    });

    Route::middleware(['permission:job_categories.bulk_deactivate'])->group(function () {
        Route::post('backend/categories/bulk-deactivate', [JobCategoryController::class, 'bulkDeactivate'])->name('categories.bulk-deactivate');
    });

    Route::middleware(['permission:job_categories.bulk_force_delete'])->group(function () {
        Route::post('backend/categories/bulk-force-delete', [JobCategoryController::class, 'bulkForceDelete'])->name('categories.bulk-force-delete');
    });

    /* ============ Location Routes ============ */
    Route::middleware(['permission:locations.view'])->group(function () {
        Route::get('backend/locations', [LocationController::class, 'index'])->name('locations.index');
        Route::get('backend/locations/active', [LocationController::class, 'getActiveLocations'])->name('locations.active');
    });

    Route::middleware(['permission:locations.create'])->group(function () {
        Route::post('backend/locations', [LocationController::class, 'store'])->name('locations.store');
    });

    Route::middleware(['permission:locations.update'])->group(function () {
        Route::put('backend/locations/{id}', [LocationController::class, 'update'])->name('locations.update');
    });

    Route::middleware(['permission:locations.toggle_active'])->group(function () {
        Route::patch('backend/locations/{id}/toggle-active', [LocationController::class, 'toggleActive'])->name('locations.toggle-active');
    });

    Route::middleware(['permission:locations.destroy'])->group(function () {
        Route::delete('backend/locations/{id}', [LocationController::class, 'destroy'])->name('locations.destroy');
    });

    Route::middleware(['permission:locations.restore'])->group(function () {
        Route::post('backend/locations/{id}/restore', [LocationController::class, 'restore'])->name('locations.restore');
    });

    Route::middleware(['permission:locations.force_delete'])->group(function () {
        Route::delete('backend/locations/{id}/force-delete', [LocationController::class, 'forceDelete'])->name('locations.force-delete');
    });

    Route::middleware(['permission:locations.bulk_delete'])->group(function () {
        Route::post('backend/locations/bulk-delete', [LocationController::class, 'bulkDelete'])->name('locations.bulk-delete');
    });

    Route::middleware(['permission:locations.bulk_restore'])->group(function () {
        Route::post('backend/locations/bulk-restore', [LocationController::class, 'bulkRestore'])->name('locations.bulk-restore');
    });

    Route::middleware(['permission:locations.bulk_activate'])->group(function () {
        Route::post('backend/locations/bulk-activate', [LocationController::class, 'bulkActivate'])->name('locations.bulk-activate');
    });

    Route::middleware(['permission:locations.bulk_deactivate'])->group(function () {
        Route::post('backend/locations/bulk-deactivate', [LocationController::class, 'bulkDeactivate'])->name('locations.bulk-deactivate');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
