<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('status_timelines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->index();
            $table->string('status')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('status_timelines');
    }
};
