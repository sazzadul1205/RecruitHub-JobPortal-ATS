import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';

export function AppShell({ children, variant = 'header' }) {
    const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    const handleSidebarChange = (open) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', open);
        }
    };

    return (
        <SidebarProvider isOpen={isOpen} onChange={handleSidebarChange}>
            <div className="flex h-full w-full">
                {variant === 'sidebar' && (
                    <div className="hidden md:flex md:w-64 flex-col border-r">
                        <div className="flex-none p-4">
                            <a href="/" className="flex items-center space-x-2">
                                <span className="font-semibold">RecruitHub</span>
                            </a>
                        </div>
                    </div>
                )}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
