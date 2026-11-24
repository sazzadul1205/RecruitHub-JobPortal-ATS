<?php

namespace App\Traits;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Collection;

trait HasRoles
{
    /**
     * The roles that belong to the user.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot(['assigned_by', 'assigned_at', 'is_active', 'expires_at'])
            ->withTimestamps();
    }

    /**
     * Check if the user has a given role.
     */
    public function hasRole(string $slug): bool
    {
        return $this->roles()->where('slug', $slug)->exists();
    }

    /**
     * Check if the user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    /**
     * Check if the user has all of the given roles.
     */
    public function hasAllRoles(array $roles): bool
    {
        foreach ($roles as $role) {
            if (!$this->hasRole($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Check if the user has a given permission.
     * Admin users (isAdmin) are granted all permissions.
     * Users without any roles are granted all permissions (permissive mode).
     */
    public function hasPermission(string $permission): bool
    {
        if (method_exists($this, 'isAdmin') && $this->isAdmin()) {
            return true;
        }

        // Permissive mode: if user has no roles, grant all permissions
        if (!$this->roles()->exists()) {
            return true;
        }

        return $this->roles()
            ->join('role_permissions', 'role_permissions.role_id', '=', 'roles.id')
            ->where('role_permissions.permission_slug', $permission)
            ->where('role_permissions.granted', true)
            ->exists();
    }

    /**
     * Get all permissions for the user.
     *
     * @return array<int, string>
     */
    public function getAllPermissions(): array
    {
        if (method_exists($this, 'isAdmin') && $this->isAdmin()) {
            return Permission::active()->pluck('slug')->toArray();
        }

        return $this->roles()
            ->join('role_permissions', 'role_permissions.role_id', '=', 'roles.id')
            ->where('role_permissions.granted', true)
            ->where('roles.is_active', true)
            ->distinct()
            ->pluck('role_permissions.permission_slug')
            ->toArray();
    }

    /**
     * Get the permissions list attribute for Inertia.
     *
     * @return array<int, string>
     */
    public function getPermissionsListAttribute(): array
    {
        return $this->getAllPermissions();
    }

    /**
     * Get roles list attribute for Inertia.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function getRolesListAttribute(): Collection
    {
        return $this->roles()->get(['id', 'name', 'slug']);
    }

    /**
     * Give a permission to a role assigned to the user.
     */
    public function givePermissionTo(Permission $permission): void
    {
        $this->roles()->each(function ($role) use ($permission): void {
            $role->permissions()->attach($permission->id, ['granted' => true]);
        });
    }
}
