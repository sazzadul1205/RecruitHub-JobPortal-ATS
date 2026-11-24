<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(
        public Application $application,
        public string $previousStatus,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'job_listing_id' => $this->application->job_listing_id,
            'status' => $this->application->status,
            'previous_status' => $this->previousStatus,
            'message' => 'Your application status has been updated to '.$this->application->status.'.',
        ];
    }
}
