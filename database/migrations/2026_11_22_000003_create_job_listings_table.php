<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->index();
            $table->foreignId('category_id')->nullable()->constrained('job_categories')->index();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('job_type')->nullable()->index();
            $table->string('experience_level')->nullable()->index();
            $table->string('education_requirement')->nullable()->index();
            $table->text('education_details')->nullable();
            $table->decimal('salary_min', 10, 2)->nullable();
            $table->decimal('salary_max', 10, 2)->nullable();
            $table->boolean('is_salary_negotiable')->default(false);
            $table->boolean('as_per_companies_policy')->default(false);
            $table->json('benefits')->nullable();
            $table->json('skills')->nullable();
            $table->json('responsibilities')->nullable();
            $table->json('keywords')->nullable();
            $table->timestamp('application_deadline')->nullable()->index();
            $table->timestamp('publish_at')->nullable()->index();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('views_count')->default(0);
            $table->boolean('required_facebook_link')->default(false);
            $table->boolean('required_linkedin_link')->default(false);
            $table->softDeletes();
            $table->timestamps();
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};
