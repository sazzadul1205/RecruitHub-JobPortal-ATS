<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_cvs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->index();
            $table->string('cv_path');
            $table->string('original_name');
            $table->string('status')->default('pending')->index();
            $table->unsignedInteger('order_position')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('applicant_cvs');
    }
};
