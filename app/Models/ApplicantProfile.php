<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicantProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'blood_type',
        'phone',
        'address',
        'photo_path',
        'social_links',
        'experience_years',
        'current_job_title',
    ];

    protected function casts(): array
    {
        return [
            'social_links' => 'array',
            'experience_years' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function cvs(): HasMany
    {
        return $this->hasMany(ApplicantCv::class)->orderBy('order_position');
    }

    public function jobHistories(): HasMany
    {
        return $this->hasMany(JobHistory::class);
    }

    public function educationHistories(): HasMany
    {
        return $this->hasMany(EducationHistory::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(Achievement::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
