import React, { useState } from 'react';
import { usePolygon } from '../context/PolygonProvider';
import { useConfig } from '../context/ConfigProvider';
import { saveConfig } from '../Tools';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import ProcessingOptions from './ProcessingOptions';
import OrderReview from './OrderReview';
import { ImageItem } from '../types';


type OrderStep = 'options' | 'review' | 'confirmation';
type ProcessingType = 'rawdata' | 'imageprocessing' | 'imageanalysis' | 'layouting';

export interface OrderData {
    processingTypes: ProcessingType[];
    estimatedPrice: number;
    orderDetails?: string;
    configID?: string;
}

export default function OrderProcessingButton() {
    const { polygon } = usePolygon();
    const { config, filters, imageResult, selectedItem } = useConfig();
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [configID, setConfigID] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState<OrderStep>('options');
    const [orderData, setOrderData] = useState<OrderData>({
        processingTypes: [],
        estimatedPrice: 0
    });

    const cartItems: ImageItem[] = imageResult.filter(item => 
        selectedItem.includes(item.collection_vehicle_short)
    );
    
    const handleSaveConfig = async () => {
        setError(null);
        setConfigID(null);
        setCopied(false);
        setLoading(true);

        const configData = {
            filter: filters,
            polygon: polygon,
            results: imageResult,
            selected: selectedItem,
            processingTypes: orderData.processingTypes
        };

        try {
            const savedConfigID = await saveConfig(configData, setError, config.configID);
            if (savedConfigID) {
                setConfigID(savedConfigID);
                setOrderData(prev => ({ ...prev, configID: savedConfigID }));
            }
        } catch {
            setError("Failed to save configuration.");
        }

        setLoading(false);
    };

    const startOrderProcess = () => {
        setCurrentStep('options');
        setModalOpen(true);
    };

    const handleProcessingSelection = (selectedOptions: ProcessingType[]) => {
        const basePrice = selectedItem.length * 50;
        let processingMultiplier = 1;

        if (selectedOptions.includes('rawdata')) processingMultiplier += 0.5;
        if (selectedOptions.includes('imageprocessing')) processingMultiplier += 1;
        if (selectedOptions.includes('imageanalysis')) processingMultiplier += 2;
        if (selectedOptions.includes('layouting')) processingMultiplier += 1.5;

        const estimatedPrice = Math.round(basePrice * processingMultiplier);

        setOrderData({
            processingTypes: selectedOptions,
            estimatedPrice: estimatedPrice
        });

        setCurrentStep('review');
    };

    const handleConfirmOrder = async () => {
        await handleSaveConfig();
        setCurrentStep('confirmation');
    };

    const handleCopy = () => {
        if (configID) {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const resetOrderProcess = () => {
        setModalOpen(false);
        setCurrentStep('options');
        setOrderData({
            processingTypes: [],
            estimatedPrice: 0
        });
    };

    return (
        <>
            <button
                className="flex-1 bg-green-600 text-white py-2 px-2 rounded-md text-xs 
                        hover:bg-green-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={startOrderProcess}
                disabled={selectedItem.length <= 0 || loading}
            >
                {loading ? (
                    <svg className="animate-spin h-4 w-4 text-white mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                    </svg>
                ) : "SUBMIT ORDER"}
            </button>

            {/* Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <DialogPanel className="bg-maincolor text-white rounded-lg  w-[100%] max-w-2xl shadow-xl max-h-[90vh] flex flex-col">
                        <DialogTitle className="text-lg font-semibold text-greenmaincolor text-center">
                            {error ? "Error" :
                                currentStep === 'options' ? "Processing Options" :
                                    currentStep === 'review' ? "Order Review" :
                                        "Order Confirmation"}
                        </DialogTitle>

                        <div className="mt-6 mb-8">
                            <div className="flex justify-center items-center">
                                {/* Step Indicator */}
                                <div className="flex items-center space-x-4">
                                    {['options', 'review', 'confirmation'].map((step, index) => (
                                        <React.Fragment key={step}>
                                            <div className={`flex flex-col items-center ${currentStep === step ? 'text-greenmaincolor' : 'text-gray-400'}`}>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                                        ${currentStep === step ? 'bg-greenmaincolor text-white' : 'bg-gray-700'}`}>
                                                    {index + 1}
                                                </div>
                                                <span className="text-xs mt-1 capitalize">{step}</span>
                                            </div>
                                            {index < 2 && <div className="w-12 h-px bg-gray-600"></div>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <p className="mt-4 text-sm text-center text-red-500">{error}</p>
                        )}

                        <div className="max-h-[70vh] p-4 overflow-y-auto">
                            {!error && currentStep === 'options' && (
                                <ProcessingOptions
                                    onSelect={handleProcessingSelection}
                                    selectedItems={selectedItem.length}
                                />
                            )}

                            {!error && currentStep === 'review' && (
                                <OrderReview
                                    orderData={orderData}
                                    selectedItems={cartItems}
                                    onConfirm={handleConfirmOrder}
                                    onBack={() => setCurrentStep('options')}
                                />
                            )}

                            {!error && currentStep === 'confirmation' && (
                                <div className="mt-4">
                                    <p className="text-sm text-center mb-4">
                                        Your order has been submitted successfully!
                                    </p>

                                    {configID && (
                                        <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md mt-4">
                                            <span className="text-sm text-gray-300 truncate">{`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`}</span>
                                            <button
                                                className="bg-greenmaincolor text-gray-800 px-3 py-1 text-xs rounded-md shadow-md hover:bg-greensecondarycolor"
                                                onClick={handleCopy}
                                            >
                                                {copied ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-6">
                                        <button
                                            className="w-full bg-greenmaincolor text-gray-800 py-2 rounded-md shadow-md hover:bg-greensecondarycolor"
                                            onClick={resetOrderProcess}
                                        >
                                            Done
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}