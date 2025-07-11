import React, { useState, useEffect } from 'react';
import { OrderData } from './OrderProcessing';
import { useConfig } from '../context/ConfigProvider';
import { ImageItem } from '../types';
import { useAuth } from '../context/AuthProrider';
import { usePolygon } from '../context/PolygonProvider';
import * as turf from "@turf/turf";

interface OrderReviewProps {
    orderData: OrderData;
    selectedItems: ImageItem[]
    onConfirm: () => void;
    onBack: () => void;
}

interface UserFormData {
    name: string;
    email: string;
    phone?: string;
    company?: string;
}

export default function OrderReviewModal({ orderData, selectedItems, onConfirm, onBack}: OrderReviewProps) {
    const [additionalNotes, setAdditionalNotes] = useState('');
    const {config} = useConfig();
    const {session} = useAuth();
    const { polygon } = usePolygon(); // Tambahkan hook untuk polygon
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // State untuk estimated price
    const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
    const [priceLoading, setPriceLoading] = useState(false);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [totalAreaAOI, setTotalAreaAOI] = useState<number>(0); // State untuk total area AOI
    
    const [userData, setUserData] = useState<UserFormData>({
        name: '',
        email: '',
        phone: '',
        company: ''
    });

    // Fungsi untuk menghitung total area AOI dari polygon
    const calculateTotalAreaAOI = () => {
        if (polygon.length >= 3) {
            const isClosed = polygon[0][0] === polygon[polygon.length - 1][0] && 
                            polygon[0][1] === polygon[polygon.length - 1][1];
            
            if (isClosed) {
                const turfPolygon = turf.polygon([polygon]);
                const area = turf.area(turfPolygon);
                return area / 1000000; // Convert to km²
            }
        }
        return 0;
    };

    // Effect untuk menghitung total area AOI ketika polygon berubah
    useEffect(() => {
        const aoiArea = calculateTotalAreaAOI();
        setTotalAreaAOI(aoiArea);
    }, [polygon]);

    // Fungsi untuk menghitung estimated price dengan total area AOI
    const calculateEstimatedPrice = async () => {
        setPriceLoading(true);
        setPriceError(null);
        
        try {
            // Siapkan data untuk dikirim ke API calculate-price dengan total area AOI
            const calculationData = {
                selectedItems: selectedItems.map(item => ({
                    satelliteShortName: item.collection_vehicle_short,
                    satellite: item.collection_vehicle_short,
                    area_sqkm: item.coverage || 25 // Tetap kirim coverage untuk kompatibilitas
                })),
                processingTypes: orderData.processingTypes,
                totalArea: totalAreaAOI // Tambahkan total area AOI
            };

            console.log('Sending calculation data with AOI:', calculationData);

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/calculate-price`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(calculationData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Price calculation result:', result);
            
            setEstimatedPrice(result.estimatedPrice || 0);
            
        } catch (error) {
            console.error('Price calculation error:', error);
            setPriceError('Gagal menghitung harga');
            setEstimatedPrice(0);
        } finally {
            setPriceLoading(false);
        }
    };

    // Auto-calculate price ketika component dimuat atau data berubah
    useEffect(() => {
        if (selectedItems.length > 0 && totalAreaAOI > 0) {
            calculateEstimatedPrice();
        }
    }, [selectedItems, orderData.processingTypes, totalAreaAOI]);

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
            case 'raw': return 'Raw Data';
            case 'imageprocessing': return 'Image Processing';
            case 'olah_citra': return 'Olah Citra';
            case 'imageanalysis': return 'Image Analysis';
            case 'tafsir_pl': return 'Tafsir PL';
            case 'layouting': return 'Layout Design';
            case 'layout': return 'Layout';
            default: return type;
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = {
                userData: session?.user || userData,
                processingTypes: orderData.processingTypes,
                estimatedPrice: estimatedPrice, // Gunakan calculated price
                additionalNotes: additionalNotes,
                selectedItems: selectedItems,
                configID: config.configID,
                totalArea: totalAreaAOI // Tambahkan total area AOI ke data order
            };
            
            console.log('Submitting order with AOI:', data);
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/saveorder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) throw new Error('Failed to save order');
            
            const responseData = await response.json();
            console.log("Order saved:", responseData);
            
            setLoading(false);
            onConfirm();
        } catch (error) {
            console.error('Order submission error:', error);
            alert('Failed to save order');
        } finally {
            setLoading(false);
        }
    };

    const isValid = !agreedToTerms || !userData.name || !userData.email || !userData.phone;

    // Format harga dalam Rupiah
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <>
            {/* Selected Scenes Section */}
            <div className="space-y-6">
                <div className="bg-maincolor rounded-md p-4 mb-4">
                    <h3 className="text-sm font-medium text-greenmaincolor mb-2">Your selected scenes</h3>

                    <div className="overflow-x-auto max-h-[200px] overflow-y-auto">
                        <table className="min-w-full text-sm text-left">
                            <thead className="text-xs border-b border-gray-700 sticky top-0 bg-secondarycolor z-10">
                                <tr>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Sensor name</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Date</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Res.</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Cloud</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Off-nadir</th>
                                    <th scope="col" className="py-2 px-3 text-gray-400">Coverage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map((scene) => (
                                    <tr key={scene.objectid} className="border-b border-gray-700 hover:bg-gray-700">
                                        <td className="py-2 px-3 text-greenmaincolor">{scene.collection_vehicle_short}</td>
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
                                        <td className="py-2 px-3">{scene.coverage?.toFixed(2)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Two-column grid layout for larger screens, single column for mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column - Your Information */}
                    {!session && (
                        <div className="bg-maincolor rounded-md p-4">
                            <h3 className="text-sm font-medium text-greenmaincolor mb-2">Your Information</h3>

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
                    )}

                    {/* Right column - Order Summary */}
                    <div className="bg-maincolor rounded-md p-4">
                        <h3 className="text-sm font-medium text-greenmaincolor mb-2">Order Summary</h3>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Selected Scenes:</span>
                                <span className="text-white">{selectedItems.length}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Area (AOI):</span>
                                <span className="text-white">
                                    {totalAreaAOI.toFixed(2)} km²
                                </span>
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
                                <div className="text-right">
                                    {priceLoading ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin h-4 w-4 text-greensecondarycolor mr-1" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                                            </svg>
                                            <span className="text-gray-400 text-sm">Calculating...</span>
                                        </div>
                                    ) : priceError ? (
                                        <div className="text-right">
                                            <span className="text-red-400 text-sm">{priceError}</span>
                                            <button
                                                onClick={calculateEstimatedPrice}
                                                className="block text-xs text-greenmaincolor hover:text-greensecondarycolor mt-1"
                                            >
                                                Coba lagi
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-greensecondarycolor">
                                            {formatPrice(estimatedPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Tombol manual recalculate (opsional) */}
                            {!priceLoading && !priceError && (
                                <div className="text-right">
                                    <button
                                        onClick={calculateEstimatedPrice}
                                        className="text-xs text-greenmaincolor hover:text-greensecondarycolor"
                                    >
                                        Hitung ulang harga
                                    </button>
                                </div>
                            )}
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
                        className="w-full px-3 py-2 bg-maincolor border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-greenmaincolor"
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
                        className="mt-1 accent-greenmaincolor"
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
                    className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 w-full sm:w-auto order-2 sm:order-1"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="bg-greenmaincolor text-black px-4 py-2 rounded-md shadow-md hover:bg-greensecondarycolor disabled:bg-gray-600 disabled:text-gray-400 w-full sm:w-auto order-1 sm:order-2"
                    onClick={handleSubmit}
                    disabled={session === null ? isValid : !agreedToTerms}
                >
                    {!loading ? "Submit Order" : (
                        <div className="flex items-center">
                            <svg className="animate-spin h-4 w-4 text-gray-900 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                            </svg>
                            <span>Creating...</span>
                        </div>
                    )}
                </button>
            </div>
        </>
    );
}
