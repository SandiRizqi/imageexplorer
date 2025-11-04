"use client";

import { useState, useEffect, FC } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import Tour from "./Tour";

const WelcomePopup: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tourOpen, setTourOpen] = useState<boolean>(false);

  const steps = [
    {
      target: '.upload-aoi',
      content: 'Upload or draw your polygon',
      disableBeacon: true, 
    },
    {
      target: '.dataset-filter',
      content: 'Filter your satellite imagery datasets.',
      disableBeacon: true, 
    },
    {
      target: '.filter-daterange',
      content: 'Filter your the daterange.',
      disableBeacon: true, 
    },
    {
      target: '.filter-cloudcover',
      content: 'Filter the maximum cloudcover percentage.',
      disableBeacon: true, 
    },
    {
      target: '.apply-search',
      content: 'Search your data.',
      disableBeacon: true, 
    },
  ];

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

  const handleTour = () => {
    setIsOpen(false);
    setTourOpen(true);
    // localStorage.setItem("hasVisited", "true"); // Mark as visited after close
  };

  const handleTourClose = () => {
    setTourOpen(false);
  };

  const handleDontShow = () => {
    localStorage.setItem("hasVisited", "true");
    setIsOpen(false);
  };

  return (
    <Tour steps={steps} isOpen={tourOpen} onClose={handleTourClose}>
      <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
          {/* Modal Panel */}
          <DialogPanel className="bg-maincolor text-white rounded-lg p-4 sm:p-8 w-full max-w-full sm:max-w-5xl shadow-2xl relative animate-pop overflow-y-auto max-h-[95vh]">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-transform hover:scale-110"
              aria-label="Close Welcome Popup"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Title */}
            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-greenmaincolor text-center mb-4 sm:mb-6 leading-tight">
              Welcome to Ruang Bumi Explorer
            </DialogTitle>

            {/* Modal Content */}
            <div className="text-left text-gray-300 space-y-4">
              <p className="text-base leading-relaxed">
                Discover the world`s most powerful collection of satellite
                imagery, aerial photos, and DEM datasets right at your fingertips.
              </p>

              <div>
                <p className="font-semibold text-gray-200 mb-3">
                  Latest Updates:
                </p>
                <ul className="list-none space-y-2 text-sm text-gray-300 pl-0">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>
                      New 30-cm ultra-high resolution satellite imagery added.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>
                      Access massive 130-km footprints from SuperView Neo imagery
                      (50 cm, 8-band).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>
                      First radar dataset TerraSAR-X available, reaching 25-cm
                      resolution.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>
                      Expanded satellite fleet: BJ3A (50 cm), SuperView-2 (40 cm),
                      BJ3N (30 cm), SuperView Neo (30 cm).
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1">•</span>
                    <span>
                      SPOT World Heritage imagery now part of our catalog!
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                Sign up for a free Ruang Bumi Explorer account today to save
                searches, track orders, and access exclusive features.
              </p>

              {/* Process Flow Section */}
              <div className="mt-6 sm:mt-8">
                <p className="font-semibold text-gray-200 text-center mb-8 sm:mb-14 mt-8 sm:mt-16">
                  HOW TO ORDER
                </p>
                <div
                  className="
                    flex flex-row flex-nowrap overflow-x-auto
                    sm:flex-row sm:overflow-x-visible
                    items-center justify-start sm:justify-between
                    space-x-4 sm:space-x-6
                    pb-4 sm:pb-0
                  "
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {/* Step 1 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step1.png"
                        alt="Step 1"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-center font-bold">
                      DEFINE / UPLOAD AOI
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:block">
                    <span className="text-white">&rarr;</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step2.png"
                        alt="Step 2"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-center">
                      SEARCH IMAGERY
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:block">
                    <span className="text-white">&rarr;</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step3.png"
                        alt="Step 3"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-center">
                      SAVE OR CREATE QUOTE
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:block">
                    <span className="text-white">&rarr;</span>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step4.png"
                        alt="Step 4"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-center">
                      CHOOSE IMAGERY PROCESSING
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:block">
                    <span className="text-white">&rarr;</span>
                  </div>

                  {/* Step 5 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step5.png"
                        alt="Step 5"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-center">
                      ADD ORDER INFORMATION
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden sm:block">
                    <span className="text-white">&rarr;</span>
                  </div>

                  {/* Step 6 */}
                  <div className="flex flex-col items-center min-w-[100px] sm:min-w-0">
                    <div className="bg-greensecondarycolor rounded-full p-3 sm:p-4 mb-2">
                      <img
                        src="https://s3.ap-southeast-1.amazonaws.com/cdn.ruangbumi.com/steps/Step6.png"
                        alt="Step 6"
                        className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                      />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-center">
                      CONFIRMATION
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Explore Button */}
            <div className="flex flex-col sm:flex-row justify-center mt-8 sm:mt-14 mb-4 sm:mb-6 space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={handleDontShow}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-gray-700 hover:bg-red-600 text-white font-bold rounded-lg transition-colors duration-200 shadow-md"
              >
                Dont show this again!
              </button>

              <button
                onClick={handleTour}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors duration-200 shadow-md"
              >
                Tour
              </button>

              <button
                onClick={handleClose}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-greenmaincolor hover:bg-greensecondarycolor text-gray-900 font-bold rounded-lg transition-colors duration-200 shadow-md"
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
          @media (max-width: 640px) {
            /* Remove right/left border radius if needed */
            .max-w-5xl {
              max-width: 100vw !important;
            }
          }
        `}</style>
      </Dialog>
    </Tour>
  );
};

export default WelcomePopup;