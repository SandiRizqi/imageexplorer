"use client"
import React, { useState } from 'react';
import { Order, SavedSearch } from '../components/types';
import Header from './Header';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'orders' | 'searches'>('orders');
    const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // Sample data - in real application, this would come from your API/database
    const [orders] = useState<Order[]>([
        {
            id: '1',
            status: 'pending',
            date: '2025-03-15',
            customerName: 'John Doe',
            total: 299.99,
            items: 3
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        }
        ,{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },{
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        },
        {
            id: '2',
            status: 'completed',
            date: '2025-03-14',
            customerName: 'Jane Smith',
            total: 199.99,
            items: 2
        }
    ]);

    const [savedSearches] = useState<SavedSearch[]>([
        {
            id: '1',
            date: '2025-03-15',
            url: 'https://example.com/search?q=products',
            queryName: 'Popular Products'
        },
        {
            id: '2',
            date: '2025-03-14',
            url: 'https://example.com/search?q=deals',
            queryName: 'Best Deals'
        }
    ]);

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (sortOrder === 'date') {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.customerName.localeCompare(b.customerName);
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-16">
                {/* Current UTC Time */}
                <div className="mb-6 text-right text-sm text-gray-500">
                    Current UTC Time: 2025-03-15 05:48:05
                </div>

                {/* Main Content */}
                <div className="bg-secondarycolor rounded-lg shadow">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-500">
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'orders'
                                    ? 'border-b-2 border-yellow-400 text-yellow-400'
                                    : 'text-gray-400 hover:text-yellow-300'
                            }`}
                            onClick={() => setActiveTab('orders')}
                        >
                            Orders
                        </button>
                        <button
                            className={`px-6 py-3 text-sm font-medium ${
                                activeTab === 'searches'
                                    ? 'border-b-2 border-yellow-400 text-yellow-400'
                                    : 'text-gray-400 hover:text-yellow-300'
                            }`}
                            onClick={() => setActiveTab('searches')}
                        >
                            Saved Searches
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'orders' ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-yellow-400">Orders List</h2>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'date' | 'name')}
                                        className="px-3 py-1 rounded-md text-sm bg-gray-700 text-gray-300 border border-gray-600"
                                    >
                                        <option value="date">Sort by Date</option>
                                        <option value="name">Sort by Name</option>
                                    </select>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Order ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Items
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {sortedOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className={`cursor-pointer transition-colors duration-150 ${
                                                        selectedItem === order.id
                                                            ? 'bg-maincolor'
                                                            : 'hover:bg-gray-600'
                                                    }`}
                                                    onClick={() => setSelectedItem(order.id)}
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
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-yellow-400 mb-4">Saved Searches</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Query Name
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                    URL
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {savedSearches.map((search) => (
                                                <tr
                                                    key={search.id}
                                                    className={`cursor-pointer transition-colors duration-150 ${
                                                        selectedItem === search.id
                                                            ? 'bg-gray-800'
                                                            : 'hover:bg-gray-700'
                                                    }`}
                                                    onClick={() => setSelectedItem(search.id)}
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
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}