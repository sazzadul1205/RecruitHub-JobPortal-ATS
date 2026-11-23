import { useEffect, useState } from 'react';

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
};

export function initializeTheme() {
    applyTheme();
    localStorage.setItem('appearance', 'light');
}

export function useAppearance() {
    const [appearance, setAppearance] = useState('light');

    const updateAppearance = (mode) => {
        setAppearance('light');
        localStorage.setItem('appearance', 'light');
        applyTheme();
    };

    useEffect(() => {
        applyTheme();
        localStorage.setItem('appearance', 'light');
    }, []);

    return { appearance: 'light', updateAppearance };
}
