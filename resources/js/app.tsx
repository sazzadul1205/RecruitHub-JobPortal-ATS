import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Lazy-load pages with support for both .tsx and .jsx extensions
const pages = import.meta.glob(['./pages/**/*.tsx', './pages/**/*.jsx'], { eager: false });

const resolvePage = (name: string) => {
    const normalizedName = name.replace(/\\/g, '/');
    const baseName = normalizedName.split('/').pop() || normalizedName;
    const candidates = [
        `./pages/${normalizedName}.jsx`,
        `./pages/${normalizedName}.tsx`,
        `./pages/${normalizedName}/${baseName}.jsx`,
        `./pages/${normalizedName}/${baseName}.tsx`,
        `./pages/${normalizedName}/index.jsx`,
        `./pages/${normalizedName}/index.tsx`,
    ];

    const exactMatch = candidates.find((candidate) => pages[candidate]);
    if (exactMatch) {
        return resolvePageComponent(exactMatch, pages);
    }

    // Case-insensitive fallback
    const lowerCaseName = normalizedName.toLowerCase();
    const caseInsensitiveMatch = Object.keys(pages).find((candidate) => {
        const candidateLower = candidate.toLowerCase();
        return candidates.some((c) => candidateLower === c.toLowerCase());
    });

    return resolvePageComponent(caseInsensitiveMatch ?? candidates[0], pages);
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: resolvePage,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
