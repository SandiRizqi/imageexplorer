"use client"
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../components/context/AuthProrider';
import Image from 'next/image';
import logo from "../components/assets/SIE.png";

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { session, signIn, signOut } = useAuth();

    const currentPage = pathname === '/explorer' ? 'Explorer' : 'Dashboard';

    const handleNavigate = (path: string) => {
        // setIsDropdownOpen(false);
        router.push(path);
    };

    return (
        <header className="bg-maincolor shadow-md top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Left side - Navigation Dropdown */}
                    <div className="relative">
                        <div className='flex flex-row items-center space-x-2'>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="inline-flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-400 bg-secondarycolor  h-12"
                            >
                                <span>{currentPage}</span>
                                <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                            </button>
                            <Image src={logo} alt="Logo" width={45} height={45} className='ml-8  p-[10px]' />

                        </div>
                        

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-40 mt-0 bg-white shadow-lg">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleNavigate('/dashboard')}
                                        className={`${
                                            pathname === '/dashboard'
                                                ? 'bg-greenmaincolor text-gray-900'
                                                : 'text-gray-700'
                                        } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => handleNavigate('/')}
                                        className={`${
                                            pathname === '/'
                                                ? 'bg-greenmaincolor text-gray-900'
                                                : 'text-gray-700'
                                        } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                                    >
                                        Explorer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right side - User info and menu */}
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-1 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                    {session?.user?.image ? (
                                        <Image
                                            src={session.user.image}
                                            alt="avatar"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <span className="text-sm font-medium text-gray-600">
                                            {session?.user?.name?.[0] || 'U'}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-medium text-gray-300">
                                    {session?.user?.name || 'Guest'}
                                </div>
                                <ChevronDownIcon className="w-4 h-4 text-gray-300" />
                            </button>

                            {/* User dropdown menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg py-1 z-10">
                                    {session ? (
                                        <button
                                            onClick={() => {
                                                signOut();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign Out
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                signIn();
                                                setIsUserMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Sign In with Google
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Click outside detector */}
            {(isDropdownOpen || isUserMenuOpen) && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setIsUserMenuOpen(false);
                    }}
                />
            )}
        </header>
    );
}