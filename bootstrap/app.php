<?php

use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RBAC\CheckPermission;
use App\Http\Middleware\RBAC\CheckRole;
use App\Http\Middleware\RBAC\OwnershipCheck;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Gate;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'permission' => CheckPermission::class,
            'role' => CheckRole::class,
            'ownership' => OwnershipCheck::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

Gate::define('viewAnyJobListing', fn ($user) => $user->hasPermission('job_listings.view'));
Gate::define('createJobListing', fn ($user) => $user->hasPermission('job_listings.create'));
Gate::define('viewJobListing', fn ($user, $jobListing) => $user->hasPermission('job_listings.show') && ($user->isAdmin() || $jobListing->user_id === $user->id));
Gate::define('updateJobListing', fn ($user, $jobListing) => $user->hasPermission('job_listings.update') && ($user->isAdmin() || $jobListing->user_id === $user->id));
Gate::define('deleteJobListing', fn ($user, $jobListing) => $user->hasPermission('job_listings.destroy') && ($user->isAdmin() || $jobListing->user_id === $user->id));
Gate::define('toggleActiveJobListing', fn ($user) => $user->hasPermission('job_listings.toggle_active'));
Gate::define('restoreJobListing', fn ($user) => $user->hasPermission('job_listings.restore'));
Gate::define('forceDeleteJobListing', fn ($user) => $user->hasPermission('job_listings.force_delete'));
Gate::define('bulkActivateJobListing', fn ($user) => $user->hasPermission('job_listings.bulk_activate'));
Gate::define('bulkDeactivateJobListing', fn ($user) => $user->hasPermission('job_listings.bulk_deactivate'));
Gate::define('bulkDeleteJobListing', fn ($user) => $user->hasPermission('job_listings.bulk_delete'));
Gate::define('viewJobListingApplications', fn ($user) => $user->hasPermission('job_listings.applications'));
Gate::define('updateJobListingStatuses', fn ($user) => $user->hasPermission('job_listings.update_statuses'));
Gate::define('viewJobListingStatistics', fn ($user) => $user->hasPermission('job_listings.statistics'));

Gate::define('viewAnyApplication', fn ($user) => $user->hasPermission('applications.view'));
Gate::define('viewJobApplications', fn ($user) => $user->hasPermission('applications.job_applications'));
Gate::define('viewApplication', fn ($user, $application) => $user->hasPermission('applications.show') && ($user->isAdmin() || $application->user_id === $user->id));
Gate::define('updateApplicationStatus', fn ($user) => $user->hasPermission('applications.status.update'));
Gate::define('bulkUpdateApplicationStatus', fn ($user) => $user->hasPermission('applications.bulk_status.update'));
Gate::define('deleteApplication', fn ($user, $application) => $user->hasPermission('applications.destroy') && ($user->isAdmin() || $application->user_id === $user->id));
Gate::define('bulkDeleteApplication', fn ($user) => $user->hasPermission('applications.bulk_delete'));
Gate::define('restoreApplication', fn ($user) => $user->hasPermission('applications.restore'));
Gate::define('bulkRestoreApplication', fn ($user) => $user->hasPermission('applications.bulk_restore'));
Gate::define('forceDeleteApplication', fn ($user) => $user->hasPermission('applications.force_delete'));
Gate::define('downloadResume', fn ($user) => $user->hasPermission('applications.download_resume'));
Gate::define('bulkDownloadResumes', fn ($user) => $user->hasPermission('applications.bulk_download_resumes'));
Gate::define('sendApplicationEmail', fn ($user) => $user->hasPermission('applications.email.send'));
Gate::define('bulkSendApplicationEmail', fn ($user) => $user->hasPermission('applications.bulk_email.send'));
Gate::define('exportApplications', fn ($user) => $user->hasPermission('applications.export'));
Gate::define('exportSingleApplication', fn ($user) => $user->hasPermission('applications.export_single'));
Gate::define('recalculateAts', fn ($user) => $user->hasPermission('applications.recalculate_ats'));

Gate::define('viewAnyJobCategory', fn ($user) => $user->hasPermission('job_categories.view'));
Gate::define('createJobCategory', fn ($user) => $user->hasPermission('job_categories.create'));
Gate::define('updateJobCategory', fn ($user) => $user->hasPermission('job_categories.update'));
Gate::define('toggleActiveJobCategory', fn ($user) => $user->hasPermission('job_categories.toggle_active'));
Gate::define('deleteJobCategory', fn ($user) => $user->hasPermission('job_categories.destroy'));
Gate::define('restoreJobCategory', fn ($user) => $user->hasPermission('job_categories.restore'));
Gate::define('forceDeleteJobCategory', fn ($user) => $user->hasPermission('job_categories.force_delete'));
Gate::define('bulkDeleteJobCategory', fn ($user) => $user->hasPermission('job_categories.bulk_delete'));
Gate::define('bulkRestoreJobCategory', fn ($user) => $user->hasPermission('job_categories.bulk_restore'));
Gate::define('bulkActivateJobCategory', fn ($user) => $user->hasPermission('job_categories.bulk_activate'));
Gate::define('bulkDeactivateJobCategory', fn ($user) => $user->hasPermission('job_categories.bulk_deactivate'));
Gate::define('bulkForceDeleteJobCategory', fn ($user) => $user->hasPermission('job_categories.bulk_force_delete'));

Gate::define('viewAnyLocation', fn ($user) => $user->hasPermission('locations.view'));
Gate::define('createLocation', fn ($user) => $user->hasPermission('locations.create'));
Gate::define('updateLocation', fn ($user) => $user->hasPermission('locations.update'));
Gate::define('toggleActiveLocation', fn ($user) => $user->hasPermission('locations.toggle_active'));
Gate::define('deleteLocation', fn ($user) => $user->hasPermission('locations.destroy'));
Gate::define('restoreLocation', fn ($user) => $user->hasPermission('locations.restore'));
Gate::define('forceDeleteLocation', fn ($user) => $user->hasPermission('locations.force_delete'));
Gate::define('bulkDeleteLocation', fn ($user) => $user->hasPermission('locations.bulk_delete'));
Gate::define('bulkRestoreLocation', fn ($user) => $user->hasPermission('locations.bulk_restore'));
Gate::define('bulkActivateLocation', fn ($user) => $user->hasPermission('locations.bulk_activate'));
Gate::define('bulkDeactivateLocation', fn ($user) => $user->hasPermission('locations.bulk_deactivate'));

Gate::define('viewAnyApplicantProfile', fn ($user) => $user->isAdmin() || $user->isEmployer());
Gate::define('updateOwnApplicantProfile', fn ($user) => $user->isApplicant());
