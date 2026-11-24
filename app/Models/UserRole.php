<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserRole extends Pivot
{
    use HasFactory;

    /**
     * Table name
     */
    protected $table = 'user_roles';

    /**
     * Fillable fields
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'assigned_by',
        'assigned_at',
        'is_active',
        'expires_at',
    ];

    /**
     * Cast fields
     */
    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
            'expires_at' => 'datetime',
            'is_active' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * User this role assignment belongs to
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Role this assignment belongs to
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * User who assigned this role
     */
    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Only active and non-expired role assignments
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function (Builder $q): Builder {
                return $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    /**
     * Expired role assignments
     */
    public function scopeExpired(Builder $query): Builder
    {
        return $query->where(function (Builder $q): Builder {
            return $q->where('is_active', false)
                ->orWhere('expires_at', '<=', now());
        });
    }

    /**
     * Check if this assignment is expired
     */
    public function isExpired(): bool
    {
        return ! $this->is_active ||
            ($this->expires_at && $this->expires_at <= now());
    }

    /**
     * Expire this role assignment
     */
    public function expire(): bool
    {
        return (bool) $this->update([
            'is_active' => false,
            'expires_at' => now(),
        ]);
    }
}
