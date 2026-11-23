<?php

namespace App\Notifications;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Application $application,
        public string $oldStatus,
        public string $newStatus
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'job_title' => $this->application->jobListing->title,
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'message' => "Your application for {$this->application->jobListing->title} has been updated to {$this->newStatus}.",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Application Status Updated')
            ->line("Your application for {$this->application->jobListing->title} has been updated.")
            ->line("Previous status: {$this->oldStatus}")
            ->line("New status: {$this->newStatus}")
            ->action('View Application', url('/apply/' . $this->application->id))
            ->line('Thank you for using our application!');
    }
}
