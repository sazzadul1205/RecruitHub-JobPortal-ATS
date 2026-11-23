<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Enums\ATSCalculationStatus;
use App\Enums\EducationRequirement;
use App\Enums\ExperienceLevel;
use App\Enums\JobType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'publish_at',
        'application_deadline',
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
            'is_active' => 'boolean',
            'required_facebook_link' => 'boolean',
            'required_linkedin_link' => 'boolean',
            'salary_min' => 'decimal:2',
            'salary_max' => 'decimal:2',
            'publish_at' => 'datetime',
            'application_deadline' => 'datetime',
            'job_type' => JobType::class,
            'experience_level' => ExperienceLevel::class,
            'education_requirement' => EducationRequirement::class,
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
        return $this->belongsToMany(Location::class, 'job_listing_location')->withTimestamps();
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(JobView::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePublished($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('publish_at')
                ->orWhere('publish_at', '<=', now());
        })->where(function ($q) {
            $q->whereNull('application_deadline')
                ->orWhere('application_deadline', '>=', now());
        });
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeByJobType($query, $jobType)
    {
        return $query->where('job_type', $jobType);
    }

    public function scopeByExperienceLevel($query, $level)
    {
        return $query->where('experience_level', $level);
    }

    public function scopeByLocation($query, $locationId)
    {
        return $query->whereHas('locations', function ($q) use ($locationId) {
            $q->where('locations.id', $locationId);
        });
    }

    public function scopeByKeyword($query, $keyword)
    {
        return $query->where(function ($q) use ($keyword) {
            $q->where('title', 'like', "%{$keyword}%")
                ->orWhere('description', 'like', "%{$keyword}%")
                ->orWhere('skills', 'like', "%{$keyword}%");
        });
    }

    public function scopeBySalaryRange($query, $min, $max)
    {
        return $query->where(function ($q) use ($min, $max) {
            $q->whereBetween('salary_min', [$min, $max])
                ->orWhereBetween('salary_max', [$min, $max])
                ->orWhere(function ($inner) use ($min, $max) {
                    $inner->where('salary_min', '<=', $min)
                        ->where('salary_max', '>=', $max);
                });
        });
    }
}
