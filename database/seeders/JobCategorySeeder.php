<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Software Development', 'slug' => 'software-development'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Marketing', 'slug' => 'marketing'],
            ['name' => 'Sales', 'slug' => 'sales'],
            ['name' => 'Customer Support', 'slug' => 'customer-support'],
            ['name' => 'Product Management', 'slug' => 'product-management'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'DevOps', 'slug' => 'devops'],
            ['name' => 'Human Resources', 'slug' => 'human-resources'],
            ['name' => 'Finance', 'slug' => 'finance'],
        ];

        foreach ($categories as $category) {
            JobCategory::create($category);
        }
    }
}
