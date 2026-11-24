<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::factory()->jobSeeker()->create();
        Role::factory()->employer()->create();
        Role::factory()->admin()->create();
    }
}
