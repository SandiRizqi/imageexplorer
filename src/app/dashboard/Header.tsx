"use client"
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../components/context/AuthProrider';
import Image from 'next/image';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const {session} = useAuth();

    const currentPage = pathname === '/explorer' ? 'Explorer' : 'Dashboard';

    const handleNavigate = (path: string) => {
        setIsDropdownOpen(false);
        router.push(path);
    };

    return (
        <header className="bg-maincolor  shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Navigation Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <span>{currentPage}</span>
                            <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-40 mt-1 bg-white rounded-md shadow-lg">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleNavigate('/dashboard')}
                                        className={`${
                                            pathname === '/dashboard'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700'
                                        } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/')}
                                        className={`${
                                            pathname === '/'
                                                ? 'bg-gray-100 text-gray-900'
                                                : 'text-gray-700'
                                        } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                                    >
                                        Explorer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - User info and time */}
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    <Image src={session?.user?.image || ''} alt='avatar' width={30} height={30} className='rounded-full'/>
                                </span>
                            </div>
                            <div className="text-sm font-medium text-gray-300">
                                {session?.user?.name}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside detector */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </header>
    );
}