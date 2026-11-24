<?php

use App\Http\Controllers\ApplyController;
use App\Http\Controllers\ApplicationsController;
use App\Http\Controllers\JobCategoryController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PublicJobListingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('backend')->name('backend.')->group(function () {
    Route::get('seeker/jobs', [PublicJobListingController::class, 'index'])->name('seeker.jobs.index');
    Route::get('seeker/jobs/{slug}', [PublicJobListingController::class, 'show'])->name('seeker.jobs.show');
    Route::get('listing', [JobListingController::class, 'adminIndex'])->name('listing.index');
    Route::get('listing/create', [JobListingController::class, 'adminCreate'])->name('listing.create');
    Route::post('listing', [JobListingController::class, 'adminStore'])->name('listing.store');
    Route::get('listing/{jobListing}', [JobListingController::class, 'adminShow'])->name('listing.show');
    Route::get('listing/{jobListing}/edit', [JobListingController::class, 'adminEdit'])->name('listing.edit');
    Route::put('listing/{jobListing}', [JobListingController::class, 'adminUpdate'])->name('listing.update');
    Route::delete('listing/{jobListing}', [JobListingController::class, 'adminDestroy'])->name('listing.destroy');
    Route::patch('listing/{jobListing}/toggle-active', [JobListingController::class, 'toggleActive'])->name('listing.toggle-active');
    Route::patch('listing/{jobListing}/restore', [JobListingController::class, 'restore'])->name('listing.restore');
    Route::delete('listing/{jobListing}/force-delete', [JobListingController::class, 'forceDelete'])->name('listing.force-delete');
    Route::get('listing/{jobListing}/applications', [JobListingController::class, 'applications'])->name('listing.applications');
    Route::post('listing/bulk-activate', [JobListingController::class, 'bulkActivate'])->name('listing.bulk-activate');
    Route::post('listing/bulk-deactivate', [JobListingController::class, 'bulkDeactivate'])->name('listing.bulk-deactivate');
    Route::delete('listing/bulk-delete', [JobListingController::class, 'bulkDelete'])->name('listing.bulk-delete');
    Route::get('statistics', [JobListingController::class, 'statistics'])->name('statistics');
});

Route::middleware(['auth'])->group(function () {
    Route::get('apply', [ApplyController::class, 'index'])->name('apply.index');
    Route::get('apply/create/{slug}', [ApplyController::class, 'create'])->name('apply.create');
    Route::post('apply/store/{slug}', [ApplyController::class, 'store'])->name('apply.store');
    Route::get('apply/trashed', [ApplyController::class, 'trashed'])->name('apply.trashed');
    Route::get('apply/{application}', [ApplyController::class, 'show'])->name('apply.show');
    Route::get('apply/{application}/edit', [ApplyController::class, 'edit'])->name('apply.edit');
    Route::put('apply/{application}', [ApplyController::class, 'update'])->name('apply.update');
    Route::delete('apply/{application}', [ApplyController::class, 'destroy'])->name('apply.destroy');
    Route::post('apply/{application}/restore', [ApplyController::class, 'restore'])->name('apply.restore');
    Route::delete('apply/{application}/force-delete', [ApplyController::class, 'forceDelete'])->name('apply.force-delete');
    Route::post('apply/{application}/recalculate-ats', [ApplyController::class, 'recalculateAts'])->name('apply.recalculate-ats');
    Route::get('apply/{application}/ats-status', [ApplyController::class, 'getAtsStatus'])->name('apply.ats-status');
});

Route::middleware(['auth'])->prefix('backend/applications')->name('applications.')->group(function () {
    Route::get('/', [ApplicationsController::class, 'index'])->name('index');
    Route::get('job/{jobListing}', [ApplicationsController::class, 'jobApplications'])->name('job');
    Route::get('{application}', [ApplicationsController::class, 'show'])->name('show');
    Route::put('{application}/status', [ApplicationsController::class, 'updateStatus'])->name('status.update');
    Route::post('bulk-status', [ApplicationsController::class, 'bulkUpdateStatus'])->name('bulk-status.update');
    Route::delete('{application}', [ApplicationsController::class, 'destroy'])->name('destroy');
    Route::post('bulk-delete', [ApplicationsController::class, 'bulkDelete'])->name('bulk-delete');
    Route::get('{application}/download-resume', [ApplicationsController::class, 'downloadResume'])->name('download-resume');
    Route::post('bulk-download', [ApplicationsController::class, 'bulkDownloadResumes'])->name('bulk-download');
    Route::post('{application}/send-email', [ApplicationsController::class, 'sendEmail'])->name('send-email');
    Route::post('bulk-send-email', [ApplicationsController::class, 'sendBulkEmail'])->name('bulk-send-email');
    Route::post('{application}/recalculate-ats', [ApplicationsController::class, 'recalculateAts'])->name('recalculate-ats');
    Route::post('export/{jobListing}', [ApplicationsController::class, 'exportApplications'])->name('export');
    Route::post('export-single/{application}', [ApplicationsController::class, 'exportSingleApplication'])->name('export-single');
});

Route::middleware(['auth'])->prefix('backend')->name('backend.')->group(function () {
    Route::get('categories', [JobCategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/active', [JobCategoryController::class, 'getActive'])->name('categories.active');
    Route::post('categories', [JobCategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{jobCategory}', [JobCategoryController::class, 'update'])->name('categories.update');
    Route::patch('categories/{jobCategory}/toggle-active', [JobCategoryController::class, 'toggleActive'])->name('categories.toggle-active');
    Route::delete('categories/{jobCategory}', [JobCategoryController::class, 'destroy'])->name('categories.destroy');
    Route::post('categories/{jobCategory}/restore', [JobCategoryController::class, 'restore'])->name('categories.restore');
    Route::delete('categories/{jobCategory}/force-delete', [JobCategoryController::class, 'forceDelete'])->name('categories.force-delete');
    Route::post('categories/bulk-delete', [JobCategoryController::class, 'bulkDelete'])->name('categories.bulk-delete');
    Route::post('categories/bulk-restore', [JobCategoryController::class, 'bulkRestore'])->name('categories.bulk-restore');
    Route::post('categories/bulk-activate', [JobCategoryController::class, 'bulkActivate'])->name('categories.bulk-activate');
    Route::post('categories/bulk-deactivate', [JobCategoryController::class, 'bulkDeactivate'])->name('categories.bulk-deactivate');
    Route::post('categories/bulk-force-delete', [JobCategoryController::class, 'bulkForceDelete'])->name('categories.bulk-force-delete');

    Route::get('locations', [LocationController::class, 'index'])->name('locations.index');
    Route::get('locations/active', [LocationController::class, 'getActive'])->name('locations.active');
    Route::post('locations', [LocationController::class, 'store'])->name('locations.store');
    Route::put('locations/{location}', [LocationController::class, 'update'])->name('locations.update');
    Route::patch('locations/{location}/toggle-active', [LocationController::class, 'toggleActive'])->name('locations.toggle-active');
    Route::delete('locations/{location}', [LocationController::class, 'destroy'])->name('locations.destroy');
    Route::post('locations/{location}/restore', [LocationController::class, 'restore'])->name('locations.restore');
    Route::delete('locations/{location}/force-delete', [LocationController::class, 'forceDelete'])->name('locations.force-delete');
    Route::post('locations/bulk-delete', [LocationController::class, 'bulkDelete'])->name('locations.bulk-delete');
    Route::post('locations/bulk-restore', [LocationController::class, 'bulkRestore'])->name('locations.bulk-restore');
    Route::post('locations/bulk-activate', [LocationController::class, 'bulkActivate'])->name('locations.bulk-activate');
    Route::post('locations/bulk-deactivate', [LocationController::class, 'bulkDeactivate'])->name('locations.bulk-deactivate');
});
