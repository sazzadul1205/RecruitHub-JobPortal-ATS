import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Briefcase, FileText, Users, Building2, MapPin, Target, BarChart3 } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

    const footerNavItems: NavItem[] = [];

export function AppSidebar({ user }: { user?: { role?: { slug?: string } | null } | null }) {
    const isAdmin = user?.role?.slug === 'admin';
    const isEmployer = user?.role?.slug === 'employer';

    const dynamicNavItems: NavItem[] = [
        ...(isAdmin || isEmployer
            ? [
                {
                    title: 'Job Listings',
                    url: '/backend/listing',
                    icon: Briefcase,
                },
                {
                    title: 'Create Job Listing',
                    url: '/backend/listing/create',
                    icon: FileText,
                },
                {
                    title: 'Applications',
                    url: '/backend/applications',
                    icon: Users,
                },
            ]
            : []),
        ...(isAdmin
            ? [
                {
                    title: 'Categories',
                    url: '/backend/categories',
                    icon: Building2,
                },
                {
                    title: 'Locations',
                    url: '/backend/locations',
                    icon: MapPin,
                },
                {
                    title: 'Statistics',
                    url: '/backend/statistics',
                    icon: BarChart3,
                },
            ]
            : []),
        {
            title: 'Browse Jobs',
            url: '/backend/seeker/jobs',
            icon: Target,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={dynamicNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
