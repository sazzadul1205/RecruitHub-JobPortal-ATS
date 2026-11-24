import { Link, usePage, router } from '@inertiajs/react';

import { useAuth } from '@/hooks/useAuth';

import {
  LayoutDashboard,
  Briefcase,
  Plus,
  Users,
  Folder,
  MapPin,
  BarChart2,
  Target,
  LogOut,
  User,
  Settings,
  FileText,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Briefcase,
  Plus,
  Users,
  Folder,
  MapPin,
  BarChart2,
  Target,
  User,
  Settings,
  FileText,
};

export default function AppSidebarLayout({ children, breadcrumbs = [] }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const {
        hasAnyPermission,
        hasRole,
    } = useAuth();

    const isAdmin = hasAnyPermission(['dashboard.admin']) || hasRole('admin');
    const isEmployer = hasRole('employer') || hasAnyPermission(['dashboard.employer']);

    const mainNavItems = [
        { title: 'Dashboard', url: '/dashboard', icon: 'LayoutDashboard' },
    ];

    const dynamicNavItems = [
        ...(isAdmin || isEmployer
            ? [
                { title: 'Job Listings', url: '/backend/listing', icon: 'Briefcase' },
                { title: 'Create Job Listing', url: '/backend/listing/create', icon: 'Plus' },
                { title: 'Applications', url: '/backend/applications', icon: 'Users' },
            ]
            : []),
        ...(isAdmin
            ? [
                { title: 'Categories', url: '/backend/categories', icon: 'Folder' },
                { title: 'Locations', url: '/backend/locations', icon: 'MapPin' },
                { title: 'Statistics', url: '/backend/statistics', icon: 'BarChart2' },
            ]
            : []),
        { title: 'Browse Jobs', url: '/backend/seeker/jobs', icon: 'Target' },
        ...(!isAdmin
            ? [
                { title: 'My Profile', url: '/settings/profile', icon: 'User' },
                { title: 'Complete Profile', url: '/profile/complete', icon: 'FileText' },
            ]
            : []),
    ];

    const page = usePage();
    const currentUrl = page.url;

    return (
        <div className="flex h-screen">
            <aside className="hidden w-64 bg-white border-r border-gray-200 flex-col md:flex z-20">
                <div className="p-5 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <Briefcase className="text-lg text-blue-600" />
                        <span className="font-bold text-xl text-gray-900">RecruitHub</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    <h3 className="text-xs font-semibold uppercase text-gray-400 mb-3 px-3">Platform</h3>
                    {[...mainNavItems, ...dynamicNavItems].map((item) => {
                        const isActive = currentUrl === item.url;
                        const Icon = iconMap[item.icon];
                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <nav className="space-y-1">
                        <div className="px-3 py-2.5 border rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs font-medium">{user?.name?.charAt(0) || 'U'}</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.post(route('logout'), {
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>
            </aside>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6 sm:p-8">
                {children}
            </div>
        </div>
    );
}
