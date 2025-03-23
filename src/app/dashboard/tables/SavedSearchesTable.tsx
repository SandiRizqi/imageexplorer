"use client"
import { useState, useEffect } from 'react';
import { useAuth } from '../../components/context/AuthProrider';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getConfigsByUser } from '../../components/Tools';
import { ConfigType } from '../../components/types';


const ITEMS_PER_PAGE = 15;

interface SavedSearchesTableProps {
    onSearchSelect?: (searchId: string) => void;
}


const LoadingComponent = () => {
    return (
        <tr>
            <td colSpan={6} className="text-center py-6 text-gray-400">
                Loading orders...
            </td>
        </tr>
    )
}

export default function SavedSearchesTable({ onSearchSelect }: SavedSearchesTableProps) {
    const {status} = useAuth();
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [userConfigs, setUserConfigs] = useState<ConfigType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);


    useEffect(() => {
        if (status === "authenticated") {
            setLoading(true); // Start loading
            getConfigsByUser(setUserConfigs).finally(() => setLoading(false));
        }

    },[])

    const totalPages = Math.ceil(userConfigs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSearches = userConfigs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <>
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
                Saved Searches
            </h2>

            <div className="relative h-[calc(100%-10px)]">
                {/* Fixed Header */}
                <table className="min-w-full divide-y divide-gray-700 border-b border-gray-500">
                    <thead className="bg-maincolor">
                        <tr>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                ID
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Query Name
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Date
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                URL
                            </th>
                        </tr>
                    </thead>
                </table>

                {/* Scrollable Body */}
                <div className="overflow-y-auto h-[calc(100%-100px)]">
                    <table className="min-w-full divide-y divide-gray-700">
                        <tbody className="bg-maincolor divide-y divide-gray-700">
                            {loading ? (
                                <LoadingComponent /> 
                            ) : (
                                currentSearches.map((search, idx) => (
                                    <tr
                                        key={search.id}
                                        className={`cursor-pointer transition-colors duration-150 ${
                                            selectedItem === search.id
                                                ? 'bg-secondarycolor'
                                                : 'hover:bg-secondarycolor'
                                        }`}
                                        onClick={() => {
                                            setSelectedItem(search.id);
                                            onSearchSelect?.(search.id);
                                        }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            #{idx + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {search?.userData?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {new Date(search.timestamp * 1000).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a
                                                href={`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${search.id}`}
                                                className="text-blue-400 hover:text-blue-300"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${search.id}`}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                                    
                            )
                            }
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="absolute bottom-0 left-0 right-0 bg-maincolor border-t border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, userConfigs.length)} of {userConfigs.length}
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronsLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </button>
                        <span className="text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronsRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}