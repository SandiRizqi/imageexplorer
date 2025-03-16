"use client"
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SavedSearch } from '../../components/types';

const ITEMS_PER_PAGE = 15;

interface SavedSearchesTableProps {
    searches: SavedSearch[];
    onSearchSelect?: (searchId: string) => void;
}

export default function SavedSearchesTable({ searches, onSearchSelect }: SavedSearchesTableProps) {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(searches.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentSearches = searches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
                            {currentSearches.map((search) => (
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
                                        #{search.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {search.queryName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {search.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <a
                                            href={search.url}
                                            className="text-blue-400 hover:text-blue-300"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {search.url}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="absolute bottom-0 left-0 right-0 bg-maincolor border-t border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, searches.length)} of {searches.length}
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