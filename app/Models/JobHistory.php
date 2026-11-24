<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'applicant_profile_id',
        'company_name',
        'position',
        'starting_year',
        'ending_year',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'is_current' => 'boolean',
            'starting_year' => 'integer',
            'ending_year' => 'integer',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
