<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobView extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_listing_id',
        'user_id',
        'ip_address',
    ];

    public function jobListing(): BelongsTo
    {
        return $this->belongsTo(JobListing::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
