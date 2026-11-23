<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobListingSeeder extends Seeder
{
    public function run(): void
    {
        $employer = User::where('email', 'employer@example.com')->first();
        if (!$employer) {
            $employer = User::factory()->create(['email' => 'employer@example.com']);
        }

        $jobs = [
            [
                'title' => 'Senior PHP Developer',
                'slug' => 'senior-php-developer',
                'description' => 'We are looking for a senior PHP developer to join our team.',
                'requirements' => '5+ years of PHP experience, Laravel knowledge required.',
                'job_type' => 'full_time',
                'experience_level' => 'senior',
                'education_requirement' => 'bachelors',
                'salary_min' => 70000,
                'salary_max' => 120000,
                'keywords' => ['php', 'laravel', 'mysql', 'javascript'],
                'benefits' => ['health insurance', 'remote work'],
                'skills' => ['php', 'laravel', 'mysql'],
                'responsibilities' => ['develop features', 'write tests', 'code review'],
                'is_active' => true,
                'required_linkedin_link' => true,
            ],
            [
                'title' => 'Frontend React Developer',
                'slug' => 'frontend-react-developer',
                'description' => 'Build beautiful user interfaces with React.',
                'requirements' => '3+ years of React experience, knowledge of modern JavaScript.',
                'job_type' => 'full_time',
                'experience_level' => 'mid',
                'education_requirement' => 'bachelors',
                'salary_min' => 50000,
                'salary_max' => 90000,
                'keywords' => ['react', 'javascript', 'html', 'css'],
                'benefits' => ['flexible hours', 'paid time off'],
                'skills' => ['react', 'javascript', 'html'],
                'responsibilities' => ['build ui components', 'collaborate with designers', 'optimize performance'],
                'is_active' => true,
                'required_facebook_link' => false,
                'required_linkedin_link' => true,
            ],
            [
                'title' => 'DevOps Engineer',
                'slug' => 'devops-engineer',
                'description' => 'Manage our cloud infrastructure and CI/CD pipelines.',
                'requirements' => 'AWS experience, Docker, Kubernetes knowledge.',
                'job_type' => 'full_time',
                'experience_level' => 'senior',
                'education_requirement' => 'bachelors',
                'salary_min' => 80000,
                'salary_max' => 140000,
                'keywords' => ['aws', 'docker', 'kubernetes', 'ci/cd'],
                'benefits' => ['health insurance', 'remote work', 'flexible hours'],
                'skills' => ['aws', 'docker', 'kubernetes'],
                'responsibilities' => ['manage infrastructure', 'deploy applications', 'monitor systems'],
                'is_active' => true,
            ],
        ];

        foreach ($jobs as $job) {
            JobListing::create(array_merge($job, ['user_id' => $employer->id]));
        }
    }
}
