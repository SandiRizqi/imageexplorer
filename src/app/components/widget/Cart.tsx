import React, { useState } from "react";
import { ShoppingCart, X } from "lucide-react";
import { useConfig } from "../context/ConfigProvider";
import { motion, AnimatePresence } from "framer-motion";
import ProcessingOptions from "./ProcessingOptions";
import OrderReview from "./OrderReview";
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

interface CartProps {
    isMobile: boolean;
}

type OrderStep = 'options' | 'review' | 'confirmation';
type ProcessingType = 'rawdata' | 'imageprocessing' | 'imageanalysis' | 'layouting';

interface OrderData {
  processingTypes: ProcessingType[];
  estimatedPrice: number;
  orderDetails?: string;
  configID?: string;
}

export default function Cart({ isMobile }: CartProps) {
    const { selectedItem, imageResult } = useConfig();
    const cartItem = imageResult.filter(item => selectedItem.includes(item.objectid));
    const [isOpen, setIsOpen] = useState(false);
    const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState<OrderStep>('options');
    const [orderData, setOrderData] = useState<OrderData>({
        processingTypes: [],
        estimatedPrice: 0
    });
    
    const handleProcessingSelect = (selectedOptions: ProcessingType[]) => {
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

    const handleConfirmOrder = () => {
        // Here you can implement the order confirmation logic
        // For example, saving configuration, sending order to backend, etc.
        console.log("Order confirmed with data:", orderData);
        setCurrentStep('confirmation');
    };

    const resetOrderProcess = () => {
        setIsProcessingModalOpen(false);
        setCurrentStep('options');
        setOrderData({
            processingTypes: [],
            estimatedPrice: 0
        });
    };

    return (
        <>
            {/* Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative flex items-center gap-2 p-2 text-white hover:text-gray-300 w-10 h-10 rounded-full hover:bg-secondarycolor transition"
            >
                <ShoppingCart className="w-5 h-5" size={14} />

                {/* Badge */}
                {selectedItem.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0 rounded-full">
                        {selectedItem.length}
                    </span>
                )}
            </button>

            {/* Animate Presence to manage enter/exit animations */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Drawer Overlay (click to close) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black bg-opacity-50 z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 h-full bg-secondarycolor shadow-lg z-50 flex flex-col"
                            style={{ width: isMobile ? "100%" : "400px" }} // Full on mobile, max 400px on desktop
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 p-2 text-white hover:text-gray-200 border rounded-full hover:bg-maincolor"
                            >
                                <X size={14} />
                            </button>

                            {/* Drawer Content */}
                            <div className="p-4 flex-1 overflow-hidden">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                                <ShoppingCart size={18} /> My Cart
                            </h2>


                                {/* Cart Items List with Scroll */}
                                <div className="mt-4 space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                                    {cartItem.length > 0 ? (
                                        <ul>
                                            {cartItem.map((item, index) => (
                                                <li key={index} className="p-3 mt-1 border-b border-gray-700 bg-maincolor rounded-lg flex flex-col">
                                                    {/* Details */}
                                                    <p className="font-semibold text-white truncate w-50">{item.collection_vehicle_short}_{item.objectid}</p>
                                                    <p className="text-gray-300"><span className="font-bold">Date:</span> {item.collection_date}</p>
                                                    <p className="text-gray-300"><strong>Time:</strong> {item.acq_time || "N/A"}</p>
                                                    <p className="text-gray-300"><span className="font-bold">Resolution:</span> {item.resolution}</p>
                                                    <p className="text-gray-300"><span className="font-bold">Cloud coverage:</span> {item.cloud_cover_percent}%</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-300 mt-4">Your cart is empty.</p>
                                    )}
                                </div>
                            </div>

                            {/* Create Quote Button */}
                            {cartItem.length > 0 && (
                                <div className="p-4 bg-maincolor">
                                    <button 
                                        className="w-full bg-yellow-500 text-gray-800 py-2 rounded-md hover:bg-yellow-400 transition"
                                        onClick={() => setIsProcessingModalOpen(true)}
                                    >
                                        Create Quote
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            
            {/* Processing Options Modal */}
            <Dialog open={isProcessingModalOpen} onClose={() => setIsProcessingModalOpen(false)} className="relative z-[60]">
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
                    <DialogPanel className="bg-maincolor text-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
                        <DialogTitle className="text-lg font-semibold text-yellow-500 text-center mb-4">
                            {currentStep === 'options' ? "Order Processing" : 
                             currentStep === 'review' ? "Order Review" : 
                             "Order Confirmation"}
                        </DialogTitle>
                        
                        {currentStep === 'options' && (
                            <ProcessingOptions 
                                onSelect={handleProcessingSelect} 
                                selectedItems={cartItem.length} 
                            />
                        )}
                        
                        {currentStep === 'review' && (
                            <OrderReview 
                                orderData={orderData}
                                selectedItems={selectedItem.length}
                                onConfirm={handleConfirmOrder}
                                onBack={() => setCurrentStep('options')}
                            />
                        )}
                        
                        {currentStep === 'confirmation' && (
                            <div className="mt-4">
                                <p className="text-sm text-center mb-4">
                                    Your order has been submitted successfully!
                                </p>
                                
                                <div className="flex justify-end mt-6">
                                    <button
                                        className="w-full bg-yellow-500 text-gray-800 py-2 rounded-md shadow-md hover:bg-yellow-400"
                                        onClick={resetOrderProcess}
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 'options' && (
                            <button
                                className="mt-4 text-gray-400 text-sm hover:text-gray-300"
                                onClick={() => setIsProcessingModalOpen(false)}
                            >
                                Cancel
                            </button>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}