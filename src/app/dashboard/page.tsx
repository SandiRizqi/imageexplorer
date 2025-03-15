"use client"
import React, { useState } from 'react';
import { useAuth } from '../components/context/AuthProrider';
import { Order, SavedSearch } from '../components/types';
import Header from './Header';

export default function Dashboard() {
    const { status, signIn, signOut } = useAuth();

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Auth Status and Buttons */}
                <div className="mb-8 flex items-center justify-between bg-white p-4 rounded-lg shadow">
                    <div>Dashboard Status: {status}</div>
                    <div className="space-x-4">
                        <button
                            onClick={() => signIn()}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                            Sign In with Google
                        </button>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Orders Section */}
                    <div className="bg-secondarycolor p-6 rounded-lg shadow">
                        <h2 className="text-xl font-bold mb-4 text-yellow-400">Recent Orders</h2>
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <div key={order.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-yellow-400">Order #{order.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-300">
                                        <p>Name: {order.customerName}</p>
                                        <p>Date: {order.date}</p>
                                        <p>Items: {order.items}</p>
                                        <p>Total: ${order.total.toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Saved Searches Section */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Saved Searches</h2>
                        <div className="space-y-4">
                            {savedSearches.map((search) => (
                                <div key={search.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{search.queryName}</span>
                                        <span className="text-sm text-gray-500">{search.date}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <p>ID: {search.id}</p>
                                        <a 
                                            href={search.url}
                                            className="text-blue-500 hover:text-blue-600 truncate block"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {search.url}
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}