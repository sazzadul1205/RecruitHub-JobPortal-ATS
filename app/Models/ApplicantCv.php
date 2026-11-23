<?php

namespace App\Models;

use App\Enums\ApplicantCvStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApplicantCv extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'applicant_profile_id',
        'cv_path',
        'original_name',
        'status',
        'order_position',
        'is_primary',
    ];

    protected function casts(): array
    {
        return [
            'status' => ApplicantCvStatus::class,
            'order_position' => 'integer',
            'is_primary' => 'boolean',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', ApplicantCvStatus::Active->value);
    }

    public function scopePending($query)
    {
        return $query->where('status', ApplicantCvStatus::Pending->value);
    }
}
