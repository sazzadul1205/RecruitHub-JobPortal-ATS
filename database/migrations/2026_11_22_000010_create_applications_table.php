<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->index();
            $table->foreignId('job_listing_id')->constrained()->index();
            $table->foreignId('applicant_profile_id')->constrained()->index();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('education_level')->nullable()->index();
            $table->unsignedInteger('years_of_experience')->nullable();
            $table->decimal('expected_salary', 10, 2)->nullable();
            $table->string('facebook_link')->nullable();
            $table->string('linkedin_link')->nullable();
            $table->string('resume_path');
            $table->json('ats_score')->nullable();
            $table->json('matched_keywords')->nullable();
            $table->json('missing_keywords')->nullable();
            $table->string('ats_calculation_status')->default('pending')->index();
            $table->unsignedInteger('ats_attempt_count')->default(0);
            $table->timestamp('ats_last_attempted_at')->nullable()->index();
            $table->decimal('ats_percentage', 5, 2)->nullable()->index();
            $table->string('status')->default('pending')->index();
            $table->text('employer_notes')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->unique(['job_listing_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
