<?php

namespace Database\Seeders;

use App\Models\EducationHistory;
use Illuminate\Database\Seeder;

class EducationHistorySeeder extends Seeder
{
    public function run(): void
    {
        EducationHistory::factory()->count(10)->create();
    }
}
