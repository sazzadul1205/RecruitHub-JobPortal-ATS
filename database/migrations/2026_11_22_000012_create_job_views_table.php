<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained()->index();
            $table->foreignId('user_id')->nullable()->constrained()->index();
            $table->string('ip_address', 45);
            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_views');
    }
};
