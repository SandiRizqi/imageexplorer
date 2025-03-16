"use client"
import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
    const [currentTime, setCurrentTime] = useState('2025-03-16 07:14:51');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const utcString = now.toISOString().replace('T', ' ').slice(0, 19);
            setCurrentTime(utcString);
        };

        updateTime();
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-maincolor flex flex-col">
            {/* Header with UTC Time */}
            <header className="bg-maincolor border-b border-gray-700 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-gray-400 text-sm text-center">
                        {currentTime} UTC
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-6xl font-bold text-yellow-400">404</h1>
                        <h2 className="text-2xl text-gray-300">Page Not Found</h2>
                    </div>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Sorry, we couldn&apos;t find the page you&apos;re looking for.
                    </p>
                    <Link 
                        href="/"
                        className="inline-flex items-center px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg
                                 hover:bg-yellow-400 transition-colors duration-200 font-semibold space-x-2"
                    >
                        <Home className="w-5 h-5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-maincolor border-t border-gray-700 p-4">
                <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
                    © 2025 Image Explorer. All rights reserved.
                </div>
            </footer>
        </div>
    );
}