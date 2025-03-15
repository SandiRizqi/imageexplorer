"use client"
import React, { useState } from 'react';
import { Order, SavedSearch } from '../components/types';
import { useAuth } from '../components/context/AuthProrider';
import Header from './Header';
import Footer from './Footer';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'orders' | 'searches'>('orders');
    const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const {session} = useAuth(); 

    // Sample data - in real application, this would come from your API/database
    const [orders] = useState<Order[]>([
        { id: '1', status: 'pending', date: '2025-03-15', customerName: 'John Doe', total: 299.99, items: 3 },
        { id: '2', status: 'completed', date: '2025-03-14', customerName: 'Jane Smith', total: 199.99, items: 2 },
        { id: '3', status: 'completed', date: '2025-03-13', customerName: 'Alice Johnson', total: 399.99, items: 5 },
        { id: '4', status: 'pending', date: '2025-03-12', customerName: 'Bob Brown', total: 159.99, items: 1 },
        { id: '5', status: 'completed', date: '2025-03-11', customerName: 'Charlie Davis', total: 249.99, items: 4 },
        { id: '6', status: 'completed', date: '2025-03-10', customerName: 'Eve White', total: 119.99, items: 2 },
        { id: '7', status: 'pending', date: '2025-03-09', customerName: 'Frank Green', total: 299.99, items: 3 },
        { id: '8', status: 'completed', date: '2025-03-08', customerName: 'Grace Lee', total: 499.99, items: 6 },
        { id: '9', status: 'pending', date: '2025-03-07', customerName: 'Hank Scott', total: 349.99, items: 5 },
        { id: '10', status: 'completed', date: '2025-03-06', customerName: 'Ivy Clark', total: 199.99, items: 2 },
        { id: '11', status: 'completed', date: '2025-03-05', customerName: 'Jack Harris', total: 229.99, items: 3 },
        { id: '12', status: 'pending', date: '2025-03-04', customerName: 'Kara Adams', total: 159.99, items: 1 },
        { id: '13', status: 'completed', date: '2025-03-03', customerName: 'Leo Walker', total: 389.99, items: 4 },
        { id: '14', status: 'pending', date: '2025-03-02', customerName: 'Mona Martinez', total: 249.99, items: 3 },
        { id: '15', status: 'completed', date: '2025-03-01', customerName: 'Nathan Perez', total: 499.99, items: 7 },
        { id: '16', status: 'completed', date: '2025-02-28', customerName: 'Olivia Young', total: 179.99, items: 2 },
        { id: '17', status: 'pending', date: '2025-02-27', customerName: 'Paul King', total: 289.99, items: 4 },
        { id: '18', status: 'completed', date: '2025-02-26', customerName: 'Quinn Hill', total: 399.99, items: 5 },
        { id: '19', status: 'pending', date: '2025-02-25', customerName: 'Rachel Nelson', total: 229.99, items: 3 },
        { id: '20', status: 'completed', date: '2025-02-24', customerName: 'Steve Carter', total: 269.99, items: 4 }
    ]);
    

    const [savedSearches] = useState<SavedSearch[]>([
        { id: '1', date: '2025-03-15', url: 'https://example.com/search?q=products', queryName: 'Popular Products' },
        { id: '2', date: '2025-03-14', url: 'https://example.com/search?q=deals', queryName: 'Best Deals' },
        { id: '3', date: '2025-03-13', url: 'https://example.com/search?q=trending', queryName: 'Trending Items' },
        { id: '4', date: '2025-03-12', url: 'https://example.com/search?q=discounts', queryName: 'Top Discounts' },
        { id: '5', date: '2025-03-11', url: 'https://example.com/search?q=electronics', queryName: 'Latest Electronics' },
        { id: '6', date: '2025-03-10', url: 'https://example.com/search?q=fashion', queryName: 'New Fashion Trends' },
        { id: '7', date: '2025-03-09', url: 'https://example.com/search?q=best_sellers', queryName: 'Best Sellers' },
        { id: '8', date: '2025-03-08', url: 'https://example.com/search?q=home_decor', queryName: 'Home Décor Ideas' },
        { id: '9', date: '2025-03-07', url: 'https://example.com/search?q=offers', queryName: 'Exclusive Offers' },
        { id: '10', date: '2025-03-06', url: 'https://example.com/search?q=technology', queryName: 'Tech Innovations' },
        { id: '11', date: '2025-03-05', url: 'https://example.com/search?q=books', queryName: 'Books & Literature' },
        { id: '12', date: '2025-03-04', url: 'https://example.com/search?q=games', queryName: 'Top Games' },
        { id: '13', date: '2025-03-03', url: 'https://example.com/search?q=kitchen', queryName: 'Kitchen Essentials' },
        { id: '14', date: '2025-03-02', url: 'https://example.com/search?q=toys', queryName: 'Kids Toys' },
        { id: '15', date: '2025-03-01', url: 'https://example.com/search?q=fitness', queryName: 'Fitness Gear' },
        { id: '16', date: '2025-02-28', url: 'https://example.com/search?q=travel', queryName: 'Travel Deals' },
        { id: '17', date: '2025-02-27', url: 'https://example.com/search?q=sale', queryName: 'Seasonal Sale' },
        { id: '18', date: '2025-02-26', url: 'https://example.com/search?q=movies', queryName: 'Movies & Shows' },
        { id: '19', date: '2025-02-25', url: 'https://example.com/search?q=music', queryName: 'Top Music' },
        { id: '20', date: '2025-02-24', url: 'https://example.com/search?q=accessories', queryName: 'Fashion Accessories' }
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


    if (session === null) {
        return window.location.replace("/");
    };

    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            <Header />
            
            <main className="h-[calc(100vh-64px)] mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content */}
                <div className="bg-maincolor rounded-md shadow h-[80%] pb-4">
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
                    <div className="p-6 h-[calc(100%-48px)]">
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
                                <div className="h-[calc(100%-60px)]">
                                    <div className="relative h-full">
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
                                        <div className="overflow-y-auto h-[calc(100%-25px)]">
                                            <table className="min-w-full divide-y divide-gray-700">
                                                <tbody className="bg-maincolor divide-y divide-gray-700">
                                                    {sortedOrders.map((order) => (
                                                        <tr
                                                            key={order.id}
                                                            className={`cursor-pointer transition-colors duration-150 ${
                                                                selectedItem === order.id
                                                                    ? 'bg-secondarycolor'
                                                                    : 'hover:bg-secondarycolor'
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
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-yellow-400 mb-4">Saved Searches</h2>
                                <div className="h-[calc(100%-60px)] mb-4">
                                    <div className="relative h-full">
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
                                        <div className="overflow-y-auto h-[calc(100%-25px)]">
                                            <table className="min-w-full divide-y divide-gray-700">
                                                <tbody className="bg-maincolor divide-y divide-gray-700">
                                                    {savedSearches.map((search) => (
                                                        <tr
                                                            key={search.id}
                                                            className={`cursor-pointer transition-colors duration-150 ${
                                                                selectedItem === search.id
                                                                    ? 'bg-secondarycolor'
                                                                    : 'hover:bg-secondarycolor'
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
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}