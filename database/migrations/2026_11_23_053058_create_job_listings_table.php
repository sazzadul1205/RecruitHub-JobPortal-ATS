<?php

use App\Enums\EducationRequirement;
use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained('job_categories')->onDelete('set null');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements');
            $table->string('job_type')->comment(JobType::class);
            $table->string('experience_level')->comment(ExperienceLevel::class);
            $table->string('education_requirement')->nullable()->comment(EducationRequirement::class);
            $table->string('education_details')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->boolean('is_salary_negotiable')->default(false);
            $table->boolean('as_per_companies_policy')->default(false);
            $table->json('benefits')->nullable();
            $table->json('skills')->nullable();
            $table->json('responsibilities')->nullable();
            $table->json('keywords')->nullable();
            $table->timestamp('publish_at')->nullable();
            $table->timestamp('application_deadline')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('views_count')->default(0);
            $table->boolean('required_facebook_link')->default(false);
            $table->boolean('required_linkedin_link')->default(false);
            $table->softDeletes();
            $table->timestamps();
            $table->index('user_id');
            $table->index('category_id');
            $table->index('job_type');
            $table->index('experience_level');
            $table->index('is_active');
            $table->index('publish_at');
            $table->index('application_deadline');
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
