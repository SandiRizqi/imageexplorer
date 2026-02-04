import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthProrider';
import { useLanguage } from '../context/LanguageProvider';
import { translations } from '../../translations';

export default function DashboardSwitcher() {
    const router = useRouter();
    const { session } = useAuth();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { language } = useLanguage();
    const t = translations[language];

    const currentPage = pathname === '/' ? t.explorer : t.dashboard;

    const handleNavigate = (path: string) => {
        // setIsDropdownOpen(false);
        router.push(path);
    };


    return (
        <div>
            <div className="relative">
                <div className='flex flex-row items-center space-x-2'>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        disabled={session === null}
                        className={`inline-flex items-center justify-between w-40 px-4 py-2 text-sm font-medium text-gray-400 bg-secondarycolor  h-[50px] ${session === null && "cursor-not-allowed opacity-50"}`}
                    >
                        <span>{currentPage}</span>
                        <ChevronDownIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
                    </button>
                    {/* <Image src={logo} alt="Logo" width={45} height={45} className='ml-8' /> */}

                </div>


                {/* Dropdown menu */}
                {isDropdownOpen && (
                    <div className="absolute z-10 w-40 mt-0 bg-white shadow-lg">
                        <div className="py-1">
                            <button
                                onClick={() => handleNavigate('/dashboard')}
                                className={`${pathname === '/dashboard'
                                    ? 'bg-greenmaincolor text-gray-900'
                                    : 'text-gray-700'
                                    } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                            >

                                {t.dashboard}
                            </button>
                            <button
                                onClick={() => handleNavigate('/')}
                                className={`${pathname === '/'
                                    ? 'bg-greenmaincolor text-gray-900'
                                    : 'text-gray-700'
                                    } flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100`}
                            >
                                {t.explorer}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
