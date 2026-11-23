<?php

use App\Enums\ApplicationStatus;
use App\Enums\ATSCalculationStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('job_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('education_level')->nullable();
            $table->integer('years_of_experience')->default(0);
            $table->decimal('expected_salary', 12, 2)->nullable();
            $table->string('facebook_link')->nullable();
            $table->string('linkedin_link')->nullable();
            $table->string('resume_path')->nullable();
            $table->json('ats_score')->nullable();
            $table->json('matched_keywords')->nullable();
            $table->json('missing_keywords')->nullable();
            $table->decimal('ats_percentage', 5, 2)->nullable();
            $table->string('ats_calculation_status')->default(ATSCalculationStatus::Pending->value);
            $table->integer('ats_attempt_count')->default(0);
            $table->timestamp('ats_last_attempted_at')->nullable();
            $table->string('status')->default(ApplicationStatus::Pending->value);
            $table->text('employer_notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('user_id');
            $table->index('job_listing_id');
            $table->index('applicant_profile_id');
            $table->index('status');
            $table->index('ats_calculation_status');
            $table->index('ats_percentage');
            $table->unique(['job_listing_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
