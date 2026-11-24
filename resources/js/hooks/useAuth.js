// hooks/useAuth.js
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

/**
 * useAuth
 * --------------------------------------------------
 * Centralized authentication + RBAC (Role-Based Access Control) helper hook.
 *
 * Responsibilities:
 * - Exposes authenticated user from Inertia page props
 * - Normalizes roles and permissions
 * - Provides reusable role/permission checking utilities
 * - Encapsulates admin bypass logic in one place
 *
 * This keeps UI components clean and prevents duplication of auth logic.
 */
export function useAuth() {
    // Inertia.js global page props (backend injects auth data here)
    const { auth } = usePage().props;

    // Current authenticated user object (or undefined/null if guest)
    const user = auth?.user;

    /**
     * Extract role slugs from user object
     * Example: [{ slug: 'admin' }, { slug: 'employer' }] → ['admin', 'employer']
     *
     * useMemo ensures we only recompute when user changes.
     */
    const roles = useMemo(() => {
        return user?.roles?.map(role => role.slug) || [];
    }, [user]);

    /**
     * Extract permission slugs from user object
     * Example: ['jobs.create', 'jobs.manage']
     *
     * Defaults to empty array for unauthenticated users.
     */
    const permissions = useMemo(() => {
        return user?.permissions || [];
    }, [user]);

    /**
     * Check if user has a specific role
     *
     * Rules:
     * - Guest users always fail
     * - admin bypasses all role checks
     * - otherwise checks direct role match
     */
    const hasRole = (roleSlug) => {
        if (!user) return false;

        // Global override: admin has all roles implicitly
        if (roles.includes('admin')) return true;

        return roles.includes(roleSlug);
    };

    /**
     * Check if user has at least one role from a list
     *
     * Example:
     * hasAnyRole(['admin', 'employer'])
     */
    const hasAnyRole = (roleSlugs) => {
        if (!user) return false;

        if (roles.includes('admin')) return true;

        return roleSlugs.some(slug => roles.includes(slug));
    };

    /**
     * Check if user has ALL roles in a list
     *
     * Example:
     * hasAllRoles(['admin', 'employer'])
     */
    const hasAllRoles = (roleSlugs) => {
        if (!user) return false;

        if (roles.includes('admin')) return true;

        return roleSlugs.every(slug => roles.includes(slug));
    };

    /**
     * Check single permission
     *
     * Permissions are typically fine-grained:
     * e.g. 'jobs.create', 'users.delete'
     */
    const hasPermission = (permissionSlug) => {
        if (!user) return false;

        // admin bypass
        if (roles.includes('admin')) return true;

        return permissions.includes(permissionSlug);
    };

    /**
     * Check if user has ANY of the given permissions
     */
    const hasAnyPermission = (permissionSlugs) => {
        if (!user) return false;

        if (roles.includes('admin')) return true;

        return permissionSlugs.some(slug => permissions.includes(slug));
    };

    /**
     * Check if user has ALL required permissions
     */
    const hasAllPermissions = (permissionSlugs) => {
        if (!user) return false;

        if (roles.includes('admin')) return true;

        return permissionSlugs.every(slug => permissions.includes(slug));
    };

    /**
     * Ownership check helper
     *
     * Useful for:
     * - "Edit own job listing"
     * - "Delete own application"
     */
    const isOwner = (userId) => {
        return user?.id === userId;
    };

    return {
        // Core auth state
        user,
        isAuthenticated: !!user,

        // Normalized RBAC data
        roles,
        permissions,

        // Role helpers
        hasRole,
        hasAnyRole,
        hasAllRoles,

        // Permission helpers
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,

        // Ownership helper
        isOwner,
    };
}
