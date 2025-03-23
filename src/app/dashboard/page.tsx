"use client"
import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../components/context/AuthProrider';
import Header from './Header';
import Footer from './Footer';
import OrdersTable from './tables/OrdersTable';
import SavedSearchesTable from './tables/SavedSearchesTable';



export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<'orders' | 'searches'>('orders');
    // const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const {session} = useAuth(); 



    // const getStatusColor = (status: Order['status']) => {
    //     switch (status) {
    //         case 'pending':
    //             return 'bg-yellow-100 text-yellow-800';
    //         case 'completed':
    //             return 'bg-green-100 text-green-800';
    //         case 'cancelled':
    //             return 'bg-red-100 text-red-800';
    //         default:
    //             return 'bg-gray-100 text-gray-800';
    //     }
    // };

    // const sortedOrders = [...orders].sort((a, b) => {
    //     if (sortOrder === 'date') {
    //         return new Date(b.date).getTime() - new Date(a.date).getTime();
    //     }
    //     return a.customerName.localeCompare(b.customerName);
    // });

    useEffect(() => {
        console.log(selectedItem);
    }, [selectedItem])

    if (session === null) {
        return window.location.replace("/");
    };

    return (
        <Suspense fallback={<LoadingScreen />}>
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
                            <OrdersTable onOrderSelect={setSelectedItem}/>
                        ) : (
                            <SavedSearchesTable onSearchSelect={setSelectedItem}/>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
        </Suspense>
    );
}