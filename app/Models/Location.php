<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Location extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'address',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function jobListings(): BelongsToMany
    {
        return $this->belongsToMany(JobListing::class, 'job_listing_location');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
