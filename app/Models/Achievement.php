<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Achievement extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'applicant_profile_id',
        'achievement_name',
        'achievement_details',
    ];

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
