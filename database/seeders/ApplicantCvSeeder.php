<?php

namespace Database\Seeders;

use App\Models\ApplicantCv;
use Illuminate\Database\Seeder;

class ApplicantCvSeeder extends Seeder
{
    public function run(): void
    {
        ApplicantCv::factory()->count(10)->create();
    }
}
