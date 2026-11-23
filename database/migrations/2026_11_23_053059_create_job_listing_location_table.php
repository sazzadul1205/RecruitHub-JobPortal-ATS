<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listing_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained()->onDelete('cascade');
            $table->foreignId('location_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->unique(['job_listing_id', 'location_id']);
            $table->index('job_listing_id');
            $table->index('location_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listing_location');
    }
};
