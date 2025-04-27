"use client";

import { useState, useEffect, FC } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

const WelcomePopup: FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisited");
        if (!hasVisited) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // localStorage.setItem("hasVisited", "true"); // Mark as visited after close
    };

    const handleDontShow = () => {
        localStorage.setItem("hasVisited", "true");
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                {/* Modal Panel */}
                <DialogPanel className="bg-maincolor text-white rounded-lg p-8 w-[90%] max-w-lg shadow-2xl relative animate-pop">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-transform hover:scale-110"
                        aria-label="Close Welcome Popup"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Modal Title */}
                    <DialogTitle className="text-2xl font-extrabold text-greenmaincolor text-center mb-6 leading-tight">
                        Welcome to Ruang Bumi Explorer
                    </DialogTitle>

                    {/* Modal Content */}
                    <div className="text-left text-gray-300 space-y-4">
                        <p className="text-base leading-relaxed">
                            Discover the world`s most powerful collection of satellite imagery, aerial photos, and DEM datasets right at your fingertips.
                        </p>

                        <div>
                            <p className="font-semibold text-gray-200 mb-3">Latest Updates:</p>
                            <ul className="list-none space-y-2 text-sm text-gray-300 pl-0">
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>New 30-cm ultra-high resolution satellite imagery added.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Access massive 130-km footprints from SuperView Neo imagery (50 cm, 8-band).</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>First radar dataset TerraSAR-X available, reaching 25-cm resolution.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>Expanded satellite fleet: BJ3A (50 cm), SuperView-2 (40 cm), BJ3N (30 cm), SuperView Neo (30 cm).</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="mr-2 mt-1">•</span>
                                    <span>SPOT World Heritage imagery now part of our catalog!</span>
                                </li>
                            </ul>
                        </div>



                        <p className="text-sm text-gray-400 leading-relaxed">
                            Sign up for a free Ruang Bumi Explorer account today to save searches, track orders, and access exclusive features.
                        </p>
                    </div>

                    {/* Explore Button */}
                    <div className="flex justify-center mt-8 space-x-2">
                        <button
                            onClick={handleDontShow}
                            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold rounded-lg transition-colors duration-200 shadow-md"
                        >
                            Dont show this again!
                        </button>

                        <button
                            onClick={handleClose}
                            className="px-6 py-2 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors duration-200 shadow-md"
                        >
                            Let`s Explore
                        </button>
                    </div>
                </DialogPanel>
            </div>

            {/* Popup Animation */}
            <style jsx global>{`
    @keyframes pop {
      0% {
        transform: scale(0.95);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .animate-pop {
      animation: pop 0.4s ease-out;
    }
  `}</style>
        </Dialog>

    );
};

export default WelcomePopup;
