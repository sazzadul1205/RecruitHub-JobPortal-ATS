<?php

namespace Database\Seeders;

use App\Models\JobHistory;
use Illuminate\Database\Seeder;

class JobHistorySeeder extends Seeder
{
    public function run(): void
    {
        JobHistory::factory()->count(12)->create();
    }
}
