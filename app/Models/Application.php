<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use App\Enums\ATSCalculationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Application extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'job_listing_id',
        'applicant_profile_id',
        'name',
        'email',
        'phone',
        'education_level',
        'years_of_experience',
        'expected_salary',
        'facebook_link',
        'linkedin_link',
        'resume_path',
        'ats_score',
        'matched_keywords',
        'missing_keywords',
        'ats_percentage',
        'ats_calculation_status',
        'ats_attempt_count',
        'ats_last_attempted_at',
        'status',
        'employer_notes',
    ];

    protected function casts(): array
    {
        return [
            'ats_score' => 'array',
            'matched_keywords' => 'array',
            'missing_keywords' => 'array',
            'ats_percentage' => 'decimal:2',
            'ats_calculation_status' => ATSCalculationStatus::class,
            'ats_attempt_count' => 'integer',
            'ats_last_attempted_at' => 'datetime',
            'status' => ApplicationStatus::class,
            'expected_salary' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    public function statusTimelines(): HasMany
    {
        return $this->hasMany(StatusTimeline::class);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByJob($query, $jobId)
    {
        return $query->where('job_listing_id', $jobId);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeWithMinAtsScore($query, $minScore)
    {
        return $query->where('ats_percentage', '>=', $minScore);
    }
}
