"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getOrdersByUser } from '../../components/Tools';
import { useAuth } from '../../components/context/AuthProrider';
import { OrderType } from '../../components/types';



const ITEMS_PER_PAGE = 15;

interface OrdersTableProps {
    onOrderSelect?: (orderId: string) => void;
}


const typeColors: Record<string, string> = {
    "rawdata": "bg-blue-500",
    "imageprocessing": "bg-green-500",
    "imageanalysis": "bg-yellow-500",
    "layouting": "bg-purple-500"
  };


const LoadingComponent = () => {
    return (
        <tr>
            <td colSpan={6} className="text-center py-6 text-gray-400">
                Loading orders...
            </td>
        </tr>
    )
}

export default function OrdersTable({ onOrderSelect }: OrdersTableProps) {
    const { status} = useAuth();
    const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
    const [userOrders, setUserOrders] = useState<OrderType[]>([]);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
  


    useEffect(() => {
        if (status === "authenticated") {
            setLoading(true); // Start loading
            getOrdersByUser(setUserOrders).finally(() => setLoading(false));
        }

    }, [status])

    const sortedOrders = [...userOrders].sort((a, b) => {
        if (sortOrder === 'date') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return a.userData.name.localeCompare(b.userData.name);
    });

    const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOrders = sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400">Orders List</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as 'date' | 'name')}
                        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-300 border border-gray-600"
                    >
                        <option value="date">Sort by Date</option>
                        <option value="name">Sort by Name</option>
                    </select>
                    <span className="text-sm text-gray-400">
                        Total Orders: {userOrders.length}
                    </span>
                </div>
            </div>

            <div className="relative h-[calc(100%-10px)]">
                {/* Fixed Header */}
                <table className="min-w-full divide-y divide-gray-700 border-b border-gray-500">
                    <thead className="bg-maincolor">
                        <tr>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Order ID
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Customer
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Date
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Status
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Tasks
                            </th>
                            <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider bg-maincolor z-10">
                                Total
                            </th>
                        </tr>
                    </thead>
                </table>

                {/* Scrollable Body */}
                <div className="overflow-y-auto h-[calc(100%-100px)]">
                    <table className="min-w-full divide-y divide-gray-700">
                        <tbody className="bg-maincolor divide-y divide-gray-700">
                        {loading ? ( // Show loading indicator when loading
                                <LoadingComponent />
                            ) : (
                                currentOrders.map((order) => (
                                    <tr
                                        key={order.orderId}
                                        className={`cursor-pointer transition-colors duration-150 ${
                                            selectedItem === order.orderId
                                                ? 'bg-secondarycolor'
                                                : 'hover:bg-secondarycolor'
                                        }`}
                                        onClick={() => {
                                            setSelectedItem(order.orderId);
                                            onOrderSelect?.(order.orderId);
                                        }}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {order.orderId.slice(0, 20) + "..."}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {order.userData.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order?.status)}`}>
                                                {order?.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <div className="flex flex-col space-y-2">
                                                {order.processingTypes.map((type: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className={`px-2 py-1 text-xs font-semibold text-white rounded-lg ${typeColors[type] || "bg-gray-400"}`}
                                                    >
                                                        {type}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            ${order.estimatedPrice.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="absolute bottom-0 left-0 right-0 bg-maincolor border-t border-gray-700 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-400">
                        Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, sortedOrders.length)} of {sortedOrders.length}
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