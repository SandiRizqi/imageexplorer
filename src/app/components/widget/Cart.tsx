import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useConfig } from "../context/ConfigProvider";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface CartProps {
    isMobile: boolean;
}

export default function Cart({ isMobile }: CartProps) {
    const { selectedItem, imageResult } = useConfig();
    const cartItem = imageResult.filter(item => selectedItem.includes(item.objectid))
    const [isOpen, setIsOpen] = useState(false);

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
                            className="fixed top-0 right-0 h-full bg-secondarycolor shadow-lg z-50"
                            style={{ width: isMobile ? "100%" : "400px" }} // Full on mobile, max 400px on desktop
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-2 right-2 p-2 text-white-700 hover:text-white border rounded-full hover:bg-maincolor"
                            >
                                <X size={14}/>
                            </button>

                            {/* Drawer Content */}
                            <div className="p-4">
                                <h2 className="text-lg font-bold">Cart</h2>
                                {cartItem.length > 0 ? (
                                    <ul>
                                        {cartItem.map((item, index) => (
                                            <li key={index} className="py-2 border-b">
                                                {/* Details */}
                                            <div className="flex-1 text-white">
                                                <p className="font-semibold">{item.collection_vehicle_short}_{item.objectid}</p>
                                                <p><span className="font-bold">Date:</span> {item.collection_date}</p>
                                                <p><strong>Time:</strong> {item.acq_time || "N/A"}</p>
                                                <p><span className="font-bold">Resolution:</span> {item.resolution} m</p>
                                                <p><span className="font-bold">Cloud coverage:</span> {item.cloud_cover_percent}%</p>
                                            </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-300 mt-4">Your cart is empty.</p>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
