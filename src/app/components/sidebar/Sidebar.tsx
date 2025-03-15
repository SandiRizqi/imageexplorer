import React, { useState } from 'react';
import SearchContainer from '../container/SearchContainer';
import AccountContainer from '../container/AccountContainer';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useConfig } from '../context/ConfigProvider';
import { usePolygon } from '../context/PolygonProvider';
import { getSavedConfig } from '../Tools';
import Alert from '../Alert';


interface SidebarProps {
    isMobile: boolean;
    menuOpen: boolean;
    onClose: () => void; // Function to handle closing
}

export default function Sidebar({ isMobile, menuOpen, onClose }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<'search' | 'account'>('search');
    const {setConfig, setFilters, setImageResults, setSelectedItem} = useConfig();
    const {setPolygon} = usePolygon();
    const searchParams = useSearchParams();
    const configId = searchParams?.get('savedconfig');
    const [Error, setError] = useState<string|null>(null);
  

    function handleDashboard (path: string) {
        window.location.replace(path);
    }


    useEffect(() => {
        if (configId) {
            // setLoadingMap(true);
            const fetchConfig = async () => {
                const data = await getSavedConfig(configId, setError);
                if (data) {
                    setPolygon(data['polygon'])
                    setFilters(data['filter']);
                    setImageResults(data['results']);
                    setSelectedItem(data['selected']);
                    setConfig(prev => ({...prev, configID: configId}));
                    // setLoadingMap(false);
                    return;
                }
            };
    
            fetchConfig();
        }

    }, [configId]);

    return (
        <div>
            {/* Sidebar */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: menuOpen ? "0%" : "-100%" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute top-0 left-0 h-full bg-gray-100 text-white z-20 shadow-lg"
                style={{
                    width: isMobile ? "100%" : "400px",
                }}
            >
                {/* Close Button for Mobile */}
                {isMobile && (
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-3 bg-maincolor hover:bg-secondarycolor text-white p-2 rounded-full shadow-md border"
                    >
                        <X size={14} />
                    </button>
                )}

                {/* Tabs */}
                <div className="flex border-b border-gray-600 h-[50px] shadow-xl">
                    <button
                        onClick={() => setActiveTab('search')}
                        className={`flex-1 text-center text-gray-300 text-xs py-4 font-semibold ${activeTab === 'search' ? 'bg-secondarycolor border-b' : 'bg-maincolor'}`}
                    >
                        SEARCH
                    </button>
                    <button
                        onClick={() => handleDashboard('/dashboard')}
                        className={`flex-1 text-center py-4 text-xs font-semibold ${activeTab === 'account' ? 'bg-secondarycolor border-b' : 'bg-maincolor'}`}
                    >
                        DASHBOARD
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
                                key="account"
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
            </motion.div>
            {Error && <Alert category={"error"} message={Error} setClose={setError} />}
        </div>
    );
}
