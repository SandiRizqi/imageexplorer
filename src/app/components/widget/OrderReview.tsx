import React, { useState } from 'react';
import { OrderData } from './OrderProcessing';
import { useConfig } from '../context/ConfigProvider';
import { ImageItem } from '../types';

interface OrderReviewProps {
    orderData: OrderData;
    selectedItems: ImageItem[]
    onConfirm: () => void;
    onBack: () => void;
}

interface UserFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
}

export default function OrderReviewModal({ orderData, selectedItems, onConfirm, onBack}: OrderReviewProps) {
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const {selectedItem } = useConfig();
    const [userData, setUserData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getProcessingTypeLabel = (type: string): string => {
        switch (type) {
            case 'rawdata': return 'Raw Data';
            case 'imageprocessing': return 'Image Processing';
            case 'imageanalysis': return 'Image Analysis';
            case 'layouting': return 'Layout Design';
            default: return type;
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/saveorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userData: userData,
                    processingTypes: orderData.processingTypes,
                    estimatedPrice: orderData.estimatedPrice,
                    additionalNotes: additionalNotes,
                    selectedItems: selectedItem,
                    configID: orderData.configID
                })
            });
    
            if (!response.ok) throw new Error('Failed to save order');
            
            const responseData = await response.json();
            console.log("Order ID:", responseData.id);
            onConfirm();
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Failed to save order');
        }
    };


    return (
        <>
            {/* Selected Scenes Section */}
            <div className="space-y-6">
                <div className="bg-maincolor rounded-md p-4 mb-4">
                    <h3 className="text-sm font-medium text-yellow-500 mb-2">Your selected scenes</h3>

                    <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="text-xs border-b border-gray-700 sticky top-0 bg-secondarycolor z-10">
                                <tr>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Sensor name</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Date</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Res.</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Cloud</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Off-nadir</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map((scene) => (
                                    <tr key={scene.objectid} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="py-2 px-3 text-yellow-500">{scene.collection_vehicle_short}</td>
                                        <td className="py-2 px-3">{scene.collection_date}</td>
                                        <td className="py-2 px-3">{scene.resolution}</td>
                                        <td className="py-2 px-3">{scene.cloud_cover_percent}%</td>
                                        <td className="py-2 px-3">
                                            {typeof scene.offnadir === 'number'
                                                ? `${scene.offnadir.toFixed(1)}°`
                                                : Array.isArray(scene.offnadir)
                                                    ? `${parseFloat(scene.offnadir[0]).toFixed(1)}°`
                                                    : scene.offnadir || ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Two-column grid layout for larger screens, single column for mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column - Your Information */}
                    <div className="bg-maincolor rounded-md p-4">
                        <h3 className="text-sm font-medium text-yellow-500 mb-2">Your Information</h3>

                        <div className="space-y-3">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Your name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="w-full px-3 py-2 input-style rounded-md text-white text-sm"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email address<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 input-style rounded-md text-white text-sm"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                                    Phone number<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="w-full px-3 py-2 input-style rounded-md text-white text-sm"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    id="company"
                                    name="company"
                                    className="w-full px-3 py-2 input-style rounded-md text-white text-sm"
                                    value={userData.company}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right column - Order Summary */}
                    <div className="bg-maincolor rounded-md p-4">
                        <h3 className="text-sm font-medium text-yellow-500 mb-2">Order Summary</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Selected Scenes:</span>
                                <span className="text-white">{selectedItems.length}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Processing Options:</span>
                                <div className="text-right">
                                    {orderData.processingTypes.length > 0 ? (
                                        orderData.processingTypes.map(type => (
                                            <div key={type} className="text-white">
                                                {getProcessingTypeLabel(type)}
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">None selected</span>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-700 my-2 pt-2 flex justify-between font-medium">
                                <span className="text-gray-300">Estimated Price:</span>
                                <span className="text-yellow-400">${orderData.estimatedPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments section - Full width */}
                <div className="mt-4">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">
                        Comments:
                    </label>
                    <textarea
                        id="notes"
                        rows={3}
                        className="w-full px-3 py-2 bg-maincolor border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        placeholder="Add any specific requirements or notes for your order..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                    ></textarea>
                </div>

                {/* Terms and buttons - Full width */}
                <div className="mt-4 flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 accent-yellow-500"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className="ml-2 text-xs text-gray-400">
                        I agree to the processing and use of the selected imagery according to the terms of service and privacy policy.
                    </label>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 w-full sm:w-auto order-2 sm:order-1"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-500 disabled:bg-gray-600 disabled:text-gray-400 w-full sm:w-auto order-1 sm:order-2"
                    onClick={handleSubmit}
                    disabled={!agreedToTerms || !userData.name || !userData.email || !userData.phone}
                >
                    Submit Order
                </button>
            </div>
        </>
    );
}