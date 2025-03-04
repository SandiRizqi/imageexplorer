import React, { useState } from 'react';
import SearchContainer from '../container/SearchContainer';
import AccountContainer from '../container/AccountContainer';
import { motion, AnimatePresence } from 'framer-motion';



interface SidebarProps {
    isMobile: boolean;
    menuOpen: boolean;
}

export default function Sidebar({ isMobile, menuOpen }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'search' | 'account'>('search');
    


    return (
        <div >
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
                        className={`flex-1 text-center text-gray-300 text-xs py-4 font-semibold ${activeTab === 'search' ? 'bg-secondarycolor border-b' : 'bg-maincolor'}`}
                    >
                        SEARCH
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex-1 text-center py-4 text-xs font-semibold ${activeTab === 'account' ? 'bg-secondarycolor border-b' : 'bg-maincolor'}`}
                    >
                        ACCOUNT
                    </button>
                </div>



                {/* Content */}
                <div className='flex flex-col h-[calc(100%-100px)] overflow-hidden'>
                    <AnimatePresence mode="wait">
                        {activeTab === 'search' ? (
                            <motion.div
                                key="search"
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                className="w-full h-full"
                            >
                                <SearchContainer />
                            </motion.div>
                                
                        ) : (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                exit={{ x: "100%" }}
                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                className="w-full h-full"
                            >
                                <AccountContainer />
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
