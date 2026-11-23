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
            'birth_date' => 'date',
            'experience_years' => 'integer',
            'photo_path' => 'string',
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

    public function primaryCv()
    {
        return $this->hasOne(ApplicantCv::class)->where('is_primary', true);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getCompletionPercentageAttribute(): int
    {
        $fields = ['first_name', 'last_name', 'phone'];
        $filled = 0;
        foreach ($fields as $field) {
            if (!empty($this->{$field})) {
                $filled++;
            }
        }
        return (int) round(($filled / count($fields)) * 100);
    }
}
