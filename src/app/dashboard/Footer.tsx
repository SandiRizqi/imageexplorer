"use client"
import React from 'react';

export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-maincolor border-t border-gray-700 z-40">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
                <div className="mb-2 sm:mb-0 text-gray-300">
                    © {new Date().getFullYear()} rupabumi.com. All rights reserved.
                </div>
                <div className="flex items-center space-x-4">
                    <span>Version 1.0.0</span>
                    <span>•</span>
                    <span>Last updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </footer>
    );
}