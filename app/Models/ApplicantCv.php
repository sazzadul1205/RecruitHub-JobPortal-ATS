<?php

namespace App\Models;

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
            'is_primary' => 'boolean',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }
}
