import {useEffect, useState} from 'react';
import {Moon, Sun} from 'lucide-react';
import {Button} from "@/components/ui/button";

function DarkMode() {
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme === 'dark';
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (darkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(prev => !prev);

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            className={`
        !bg-white text-gray-900
        dark:!bg-black dark:text-gray-100
        !rounded-full
        shadow-md
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
      `}
        >
            {darkMode ? (
                <Sun size={20} className="text-yellow-500"/>
            ) : (
                <Moon size={20} className="text-blue-300"/>
            )}
        </Button>
    );
}

export default DarkMode;
