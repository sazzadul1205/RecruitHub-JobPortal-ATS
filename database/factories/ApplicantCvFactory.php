<?php

namespace Database\Factories;

use App\Models\ApplicantCv;
use App\Models\ApplicantProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantCvFactory extends Factory
{
    protected $model = ApplicantCv::class;

    public function definition(): array
    {
        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'cv_path' => 'cvs/'.fake()->uuid().'.pdf',
            'original_name' => fake()->word().'_resume.pdf',
            'status' => 'active',
            'order_position' => 1,
            'is_primary' => true,
        ];
    }
}
