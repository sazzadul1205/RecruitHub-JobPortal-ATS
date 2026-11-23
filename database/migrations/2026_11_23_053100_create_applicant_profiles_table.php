<?php

use App\Enums\Gender;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birth_date')->nullable();
            $table->string('gender')->nullable()->comment(Gender::class);
            $table->string('blood_type')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->string('photo_path')->nullable();
            $table->json('social_links')->nullable();
            $table->integer('experience_years')->default(0);
            $table->string('current_job_title')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('user_id');
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicant_profiles');
    }
};
