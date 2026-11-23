<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->onDelete('cascade');
            $table->string('achievement_name');
            $table->text('achievement_details');
            $table->softDeletes();
            $table->timestamps();
            $table->index('applicant_profile_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('achievements');
    }
};
