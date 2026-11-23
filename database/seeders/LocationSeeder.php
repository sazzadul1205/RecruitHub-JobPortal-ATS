<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            ['name' => 'New York', 'slug' => 'new-york', 'address' => 'New York, NY, USA'],
            ['name' => 'London', 'slug' => 'london', 'address' => 'London, UK'],
            ['name' => 'Remote', 'slug' => 'remote', 'address' => 'Remote'],
            ['name' => 'San Francisco', 'slug' => 'san-francisco', 'address' => 'San Francisco, CA, USA'],
            ['name' => 'Berlin', 'slug' => 'berlin', 'address' => 'Berlin, Germany'],
            ['name' => 'Toronto', 'slug' => 'toronto', 'address' => 'Toronto, Canada'],
        ];

        foreach ($locations as $location) {
            Location::create($location);
        }
    }
}
