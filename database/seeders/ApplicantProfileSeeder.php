<?php

namespace Database\Seeders;

use App\Models\ApplicantProfile;
use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicantProfileSeeder extends Seeder
{
    public function run(): void
    {
        $applicants = User::factory()->count(5)->create();

        $applicants->shuffle()->each(fn ($user) => ApplicantProfile::factory()->create([
            'user_id' => $user->id,
        ]));
    }
}
