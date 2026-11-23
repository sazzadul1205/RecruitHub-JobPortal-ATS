import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

const sidebarNavItems = [
    {
        title: 'Profile',
        url: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        url: '/settings/password',
        icon: null,
    },
];

export default function SettingsLayout({ children }) {
    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <div className="mb-6 flex items-center gap-2">
                <Heading as="h2" className="text-xl font-bold">
                    Settings
                </Heading>
            </div>
            {children}
        </div>
    );
}
