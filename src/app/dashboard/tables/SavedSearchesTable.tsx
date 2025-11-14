"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../components/context/AuthProrider";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { getConfigsByUser } from "../../components/Tools";
import { ConfigType } from "../../components/types";

const ITEMS_PER_PAGE = 15;

interface SavedSearchesTableProps {
  onSearchSelect?: (searchId: string) => void;
}

const LoadingComponent = () => {
  return (
    <tr>
      <td colSpan={4} className="text-center py-6 text-gray-400">
        Loading searches...
      </td>
    </tr>
  );
};

export default function SavedSearchesTable({
  onSearchSelect,
}: SavedSearchesTableProps) {
  const { status } = useAuth();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userConfigs, setUserConfigs] = useState<ConfigType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      getConfigsByUser(setUserConfigs).finally(() => setLoading(false));
    }
  }, [status]);

  const totalPages = Math.ceil(userConfigs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSearches = userConfigs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <h2 className="text-base font-bold text-white mb-4">Saved Searches</h2>

      <div className="relative h-[calc(100%-25px)] flex flex-col">
        {/* Table Container with Scroll */}
        <div className="flex-1 overflow-auto border border-gray-500 rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Header with Sticky Position */}
            <thead className="bg-maincolor sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Query Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider whitespace-nowrap">
                  URL
                </th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-maincolor divide-y divide-gray-700">
              {loading ? (
                <LoadingComponent />
              ) : currentSearches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400">
                    No saved searches found
                  </td>
                </tr>
              ) : (
                currentSearches.map((search, idx) => (
                  <tr
                    key={search.id}
                    className={`cursor-pointer transition-colors duration-150 ${
                      selectedItem === search.id
                        ? "bg-secondarycolor"
                        : "hover:bg-secondarycolor"
                    }`}
                    onClick={() => {
                      setSelectedItem(search.id);
                      onSearchSelect?.(search.id);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      #{startIndex + idx + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {search?.userData?.name || "Unnamed"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300 whitespace-nowrap">
                      {new Date(search.timestamp * 1000).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <div className="max-w-md overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                        <a
                          href={`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${search.id}`}
                          className="text-greensecondarycolor hover:text-greenmaincolor hover:underline transition-colors whitespace-nowrap inline-block"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${search.id}`}
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination - Fixed at Bottom */}
        <div className="flex-shrink-0 bg-maincolor border-t border-gray-700 px-3 sm:px-4 py-3 rounded-b-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Showing Info */}
            <div className="text-xs sm:text-sm text-gray-400 order-2 sm:order-1">
              Showing {userConfigs.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, userConfigs.length)} of{" "}
              {userConfigs.length}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 sm:gap-2 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <span className="text-xs sm:text-sm text-gray-400 min-w-[80px] sm:min-w-[100px] text-center px-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
