<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('company_name');
            $table->string('position');
            $table->integer('starting_year');
            $table->integer('ending_year')->nullable();
            $table->boolean('is_current')->default(false);
            $table->softDeletes();
            $table->timestamps();
            $table->index('applicant_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_histories');
    }
};
