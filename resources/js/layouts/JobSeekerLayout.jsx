// resources/js/layouts/JobSeekerLayout.jsx

// React
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// Icons
import { FiBell, FiBriefcase, FiChevronRight, FiFileText, FiHome, FiLogOut, FiMenu, FiSearch, FiSettings, FiUser, FiX } from 'react-icons/fi';

const JobSeekerLayout = ({ children }) => {
    const { props, url } = usePage();
    const { auth } = props;
    const user = auth?.user;

    const userName = user?.name || 'User';
    const userEmail = user?.email || '';

    const notificationMeta = props.notifications || {
        unread_count: 0,
        recent: [],
    };

    // States
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isDrawerAnimating, setIsDrawerAnimating] = useState(false);

    // Refs
    const settingsRef = useRef(null);
    const drawerRef = useRef(null);

    // Close settings when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setIsSettingsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isDrawerOpen]);

    // Handle drawer open/close with animation
    const openDrawer = () => {
        setIsDrawerAnimating(true);
        setIsDrawerOpen(true);
        // Allow time for the DOM to update before triggering the animation
        setTimeout(() => {
            setIsDrawerAnimating(false);
        }, 50);
    };

    const closeDrawer = () => {
        setIsDrawerAnimating(true);
        setIsDrawerOpen(false);
        // Allow time for the animation to complete
        setTimeout(() => {
            setIsDrawerAnimating(false);
        }, 350);
    };

    // Safe route helper
    const safeRoute = (name, params = {}) => {
        try {
            if (typeof window !== 'undefined' && window.route) {
                return window.route(name, params);
            }

            return '#';
        } catch (e) {
            console.warn(`Route '${name}' error:`, e.message);
            return '#';
        }
    };

    // Route active detection
    const isRouteActive = (routeName) => {
        try {
            if (typeof window !== 'undefined' && window.route) {
                const currentRouteName = window.route().current();

                if (currentRouteName === routeName) {
                    return true;
                }

                if (currentRouteName && currentRouteName.startsWith(`${routeName}.`)) {
                    return true;
                }

                const specialCases = {
                    'backend.applicant.profile.show': 'backend.applicant.profile.',
                    'backend.apply.index': 'backend.apply.',
                    'backend.notifications.index': 'backend.notifications.',
                    'public.jobs.index': 'public.jobs.',
                    'backend.seeker.jobs.index': 'backend.seeker.jobs.',
                };

                for (const [key, prefix] of Object.entries(specialCases)) {
                    if (routeName === key && currentRouteName && currentRouteName.startsWith(prefix)) {
                        return true;
                    }
                }

                if (routeName === 'public.jobs.index' || routeName === 'backend.seeker.jobs.index') {
                    if (url.includes('/backend/seeker/jobs')) {
                        return true;
                    }

                    if (url.includes('/jobs') && !url.includes('/backend/')) {
                        return true;
                    }
                }

                return false;
            }

            return false;
        } catch (e) {
            console.warn(`Route '${routeName}' error:`, e.message);
            return false;
        }
    };

    // Menu items
    const menuItems = [
        {
            name: 'Dashboard',
            routeName: 'backend.dashboard',
            icon: FiHome,
            description: 'Overview & stats',
        },
        {
            name: 'Browse Jobs',
            routeName: 'public.jobs.index',
            icon: FiSearch,
            description: 'Find your next role',
        },
        {
            name: 'My Profile',
            routeName: 'backend.applicant.profile.show',
            icon: FiUser,
            description: 'View & edit profile',
            routeParams: {
                id: user?.applicantProfile?.id || null,
            },
        },
        {
            name: 'My Applications',
            routeName: 'backend.apply.index',
            icon: FiFileText,
            description: 'Track applications',
        },
        {
            name: 'Notifications',
            routeName: 'backend.notifications.index',
            icon: FiBell,
            badgeCount: notificationMeta.unread_count,
            description: 'Updates & alerts',
        },
    ];

    // Render menu item
    const renderMenuItem = (item, shouldCloseDrawer = false) => {
        const href = safeRoute(item.routeName, item.routeParams || {});

        const isActive = isRouteActive(item.routeName);

        if (href === '#') {
            return null;
        }

        return (
            <Link
                key={item.name}
                href={href}
                prefetch
                onClick={shouldCloseDrawer ? closeDrawer : undefined}
                className={`group relative mb-1 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ${
                    isActive ? 'bg-green-100 font-semibold text-green-700 shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                } `}
                title={item.description}
            >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'} `} />

                <span className="flex-1 truncate">{item.name}</span>

                {item.badgeCount > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white">
                        {item.badgeCount > 99 ? '99+' : item.badgeCount}
                    </span>
                )}

                {isActive && <span className="absolute left-0 h-8 w-1 rounded-r-full bg-green-500" />}
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* DESKTOP SIDEBAR */}
            <aside
                className={`fixed top-0 left-0 z-50 hidden h-full flex-col border-r border-gray-200 bg-white shadow-xl transition-all duration-300 lg:flex ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                {/* Logo Section */}
                <div className="border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between gap-2">
                        <Link href={safeRoute('home') || '/'} prefetch className="group flex min-w-0 items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-600 to-green-700 shadow-md transition-all duration-200 group-hover:shadow-lg">
                                <FiBriefcase className="h-5 w-5 text-white" />
                            </div>

                            {!isCollapsed && (
                                <span className="truncate bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent">
                                    Seeker Panel
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <FiChevronRight
                                className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'} `}
                            />
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="scrollbar-thin scrollbar-thumb-gray-300 flex-1 overflow-y-auto px-3 py-4">
                    {!isCollapsed && (
                        <div className="mb-3 px-4">
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Job Seeker</p>
                        </div>
                    )}

                    <div className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</div>
                </nav>

                {/* User Section */}
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                    {!isCollapsed ? (
                        <>
                            <div className="mb-3 flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-green-700 shadow-md">
                                    <span className="text-sm font-semibold text-white">{userName.charAt(0).toUpperCase()}</span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>

                                    <p className="truncate text-xs text-gray-500">{userEmail}</p>

                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                        Job Seeker
                                    </p>
                                </div>
                            </div>

                            <Link
                                href={safeRoute('logout')}
                                method="post"
                                as="button"
                                className="group flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-600 transition-all duration-200 hover:bg-red-50"
                            >
                                <FiLogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />

                                <span className="font-medium">Logout</span>
                            </Link>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-green-700 shadow-md">
                                <span className="text-sm font-semibold text-white">{userName.charAt(0).toUpperCase()}</span>

                                <div className="absolute top-1/2 left-full z-60 ml-2 hidden -translate-y-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                                    {userName}
                                    <br />
                                    Job Seeker
                                </div>
                            </div>

                            <Link
                                href={safeRoute('logout')}
                                method="post"
                                as="button"
                                className="group rounded-lg p-2 text-red-600 transition-all duration-200 hover:bg-red-50"
                                title="Logout"
                                aria-label="Logout"
                            >
                                <FiLogOut className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* MOBILE BOTTOM DOCKER */}
            <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg lg:hidden">
                <div className="flex items-center justify-between px-4 py-2 sm:px-6">
                    {/* Burger Menu */}
                    <button
                        onClick={openDrawer}
                        className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
                        aria-label="Open navigation menu"
                    >
                        <FiMenu className="h-6 w-6 text-gray-700" />
                    </button>

                    {/* Center Logo */}
                    <Link href={safeRoute('home') || '/'} prefetch className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-green-600 to-green-700 shadow-md">
                            <FiBriefcase className="h-6 w-6 text-white" />
                        </div>
                    </Link>

                    {/* Settings */}
                    <div className="relative" ref={settingsRef}>
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
                            aria-label="Settings"
                            aria-expanded={isSettingsOpen}
                        >
                            <FiSettings className="h-6 w-6 text-gray-700" />
                        </button>

                        {/* Drop-up menu */}
                        {isSettingsOpen && (
                            <div className="absolute right-0 bottom-full z-200 mb-2 w-48 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-gray-100 bg-white py-1 shadow-xl">
                                <Link
                                    href={safeRoute('backend.applicant.profile.show', {
                                        id: user?.applicantProfile?.id || null,
                                    })}
                                    prefetch
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    <FiUser className="h-4 w-4 shrink-0" />
                                    <span>Profile</span>
                                </Link>

                                <Link
                                    href={safeRoute('logout')}
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    <FiLogOut className="h-4 w-4 shrink-0" />
                                    <span>Logout</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE DRAWER */}
            <>
                {/* Backdrop - Fade in/out */}
                <div
                    className={`fixed inset-0 z-150 bg-black/50 transition-all duration-300 ease-out lg:hidden ${
                        isDrawerOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
                    } `}
                    onClick={closeDrawer}
                    aria-hidden="true"
                    style={{
                        transition: isDrawerAnimating ? 'opacity 0.3s ease-out' : 'none',
                    }}
                />

                {/* Drawer - Slide in/out */}
                <div
                    ref={drawerRef}
                    className={`fixed top-0 left-0 z-160 h-full w-[min(18rem,85vw)] bg-white shadow-2xl transition-all duration-300 ease-out lg:hidden`}
                    style={{
                        transform: isDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: isDrawerAnimating ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                >
                    <div className="flex h-full flex-col">
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 p-4">
                            <Link href={safeRoute('home') || '/'} onClick={closeDrawer} className="flex min-w-0 items-center gap-2">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-green-600 to-green-700 shadow-md">
                                    <FiBriefcase className="h-5 w-5 text-white" />
                                </div>

                                <span className="truncate bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-xl font-bold text-transparent">
                                    Job Seeker Panel
                                </span>
                            </Link>

                            <button
                                onClick={closeDrawer}
                                className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-gray-100"
                                aria-label="Close menu"
                            >
                                <FiX className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Drawer Navigation - Items slide in with stagger */}
                        <nav className="flex-1 overflow-y-auto px-3 py-4">
                            <div className="mb-3 px-4">
                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Job Seeker</p>
                            </div>

                            <div className="space-y-1">
                                {menuItems.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className={`transition-all duration-300 ease-out ${
                                            isDrawerOpen ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                                        } `}
                                        style={{
                                            transitionDelay: isDrawerOpen ? `${index * 50}ms` : '0ms',
                                        }}
                                    >
                                        {renderMenuItem(item, true)}
                                    </div>
                                ))}
                            </div>
                        </nav>

                        {/* Drawer User Info - Slides in from bottom */}
                        <div
                            className={`border-t border-gray-200 bg-gray-50 p-4 transition-all duration-400 ease-out ${isDrawerOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                            style={{
                                transitionDelay: isDrawerOpen ? '150ms' : '0ms',
                            }}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-600 to-green-700 shadow-md">
                                    <span className="text-sm font-semibold text-white">{userName.charAt(0).toUpperCase()}</span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>

                                    <p className="truncate text-xs text-gray-500">{userEmail}</p>

                                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                                        Job Seeker
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

            {/* MAIN CONTENT */}
            <main
                className={`min-h-screen w-full min-w-0 px-4 py-4 pb-24 text-black transition-all duration-300 sm:px-6 sm:py-6 lg:pb-6 ${isCollapsed ? 'lg:ml-20 lg:w-[calc(100%-5rem)]' : 'lg:ml-64 lg:w-[calc(100%-16rem)]'}`}
            >
                {children}
            </main>
        </div>
    );
};

export default JobSeekerLayout;
