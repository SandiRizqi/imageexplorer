"use client"
import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Order } from '../../components/types';

const ITEMS_PER_PAGE = 15;

interface OrdersTableProps {
    orders: Order[];
    onOrderSelect?: (orderId: string) => void;
}

export default function OrdersTable({ orders, onOrderSelect }: OrdersTableProps) {
    const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortOrder === 'date') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.customerName.localeCompare(b.customerName);
    });

    const totalPages = Math.ceil(sortedOrders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentOrders = sortedOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
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
                        Total Orders: {orders.length}
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
                                Items
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
                            {currentOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`cursor-pointer transition-colors duration-150 ${
                                        selectedItem === order.id
                                            ? 'bg-secondarycolor'
                                            : 'hover:bg-secondarycolor'
                                    }`}
                                    onClick={() => {
                                        setSelectedItem(order.id);
                                        onOrderSelect?.(order.id);
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        #{order.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.customerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {order.items}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        ${order.total.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
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