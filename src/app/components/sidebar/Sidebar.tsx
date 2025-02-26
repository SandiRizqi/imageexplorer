import React, { useState } from 'react';
import SearchContainer from '../container/SearchContainer';
import AccountContainer from '../container/AccountContainer';


interface SidebarProps {
    isMobile: boolean;
    menuOpen: boolean;
}

export default function Sidebar({ isMobile, menuOpen }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'search' | 'account'>('search');

    return (
        <div>
            {/* Sidebar */}
            <div
                className={`absolute top-0 left-0 h-full bg-gray-100 text-white  transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{
                    width: isMobile ? "100%" : "400px",
                }}
            >
                {/* Tabs */}
                <div className="flex border-b border-gray-600 h-[50px] shadow-xl">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 text-center text-gray-300 text-xs py-4 font-semibold ${activeTab === 'search' ? 'bg-gray-700 border-b' : 'bg-gray-800'}`}
                    >
                        SEARCH
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex-1 text-center py-4 text-xs font-semibold ${activeTab === 'account' ? 'bg-gray-700 border-b' : 'bg-gray-800'}`}
                    >
                        ACCOUNT
                    </button>
                </div>

                

                {/* Content */}
                <div className='flex flex-col h-[calc(100%-100px)]'>
                    {activeTab === 'search' ? (
                        <>
                            <div className="p-3 text-xs bg-gray-800 border-b border-gray-600 h-[50px] flex items-center">
                                <span className="text-gray-400">Filters </span>
                                <span className="text-gray-300 text-xs">39/71 datasets, Res. &lt; 2.0m, Cloud &lt; 100%, Off-Nadir &lt; 60°</span>
                            </div>
                            <SearchContainer />
                        </>

                    ) : (
                        <AccountContainer />
                    )}
                </div>
            </div>
        </div>
    );
}
