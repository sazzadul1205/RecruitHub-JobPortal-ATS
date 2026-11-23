<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EducationHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'applicant_profile_id',
        'institution_name',
        'degree',
        'passing_year',
    ];

    protected function casts(): array
    {
        return [
            'passing_year' => 'integer',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
