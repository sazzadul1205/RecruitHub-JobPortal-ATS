<?php

namespace Database\Seeders;

use App\Models\JobListing;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobListingSeeder extends Seeder
{
    public function run(): void
    {
        $employers = User::factory()->count(3)->create();

        JobListing::factory()->count(12)->create([
            'user_id' => fn () => $employers->random()->id,
        ]);
    }
}
