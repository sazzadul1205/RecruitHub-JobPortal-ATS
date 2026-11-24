<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobListing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'requirements',
        'job_type',
        'experience_level',
        'education_requirement',
        'education_details',
        'salary_min',
        'salary_max',
        'is_salary_negotiable',
        'as_per_companies_policy',
        'benefits',
        'skills',
        'responsibilities',
        'keywords',
        'application_deadline',
        'publish_at',
        'is_active',
        'views_count',
        'required_facebook_link',
        'required_linkedin_link',
    ];

    protected function casts(): array
    {
        return [
            'benefits' => 'array',
            'skills' => 'array',
            'responsibilities' => 'array',
            'keywords' => 'array',
            'is_salary_negotiable' => 'boolean',
            'as_per_companies_policy' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
            'is_active' => 'boolean',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'publish_at' => 'datetime',
            'application_deadline' => 'datetime',
        ];
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class);
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class, 'job_listing_location');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function jobViews(): HasMany
    {
        return $this->hasMany(JobView::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
