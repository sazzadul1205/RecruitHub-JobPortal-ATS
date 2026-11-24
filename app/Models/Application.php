<?php

namespace App\Models;

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
        'ats_calculation_status',
        'ats_attempt_count',
        'ats_last_attempted_at',
        'ats_percentage',
        'status',
        'employer_notes',
    ];

    protected function casts(): array
    {
        return [
            'ats_score' => 'array',
            'matched_keywords' => 'array',
            'missing_keywords' => 'array',
            'ats_attempt_count' => 'integer',
            'ats_percentage' => 'decimal:2',
            'ats_last_attempted_at' => 'datetime',
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

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
