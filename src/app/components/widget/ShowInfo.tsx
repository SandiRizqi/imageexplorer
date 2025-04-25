import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ImageItem } from "../types";


interface ImageDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageData: ImageItem | null;
}

const ShowImageInfo: React.FC<ImageDetailModalProps> = ({ isOpen, onClose, imageData }) => {
    if (!imageData) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <DialogPanel className="bg-maincolor rounded-md w-[90%] max-w-md p-4 text-white relative">
                {/* Image Positioned at Top-Right */}
                {/* <div className="absolute top-3 right-3">
                    <Image
                        src={imageData.preview_url || ''}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                </div> */}

                {/* Title */}
                <DialogTitle className="text-lg font-semibold mb-3">{imageData.collection_vehicle_short}</DialogTitle>

                {/* Key Information */}
                <div className="grid grid-cols-2 gap-2 text-sm text-left">
                    <p><strong>Date:</strong> {imageData.collection_date}</p>
                    <p><strong>Time:</strong> {imageData.acq_time || "N/A"}</p>
                    <p><strong>Resolution:</strong> {imageData.resolution || "N/A"}</p>
                    <p><strong>Cloud Cover:</strong> {imageData.cloud_cover_percent} %</p>
                    <p><strong>Sensor :</strong> {imageData.satellite || imageData.collection_vehicle_short || "N/A"}</p>
                    
                    <p><strong>ImageBand Type:</strong> {imageData.imageBand || "N/A"}</p>
                    <p><strong>Band Count:</strong> {imageData.imageBandCount || "N/A"} </p>
                    <p><strong>Sun Azimuth:</strong> {imageData.sun_az || "N/A"} </p>
                </div>

                {/* Close Button */}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="bg-gray-600 px-3 py-2 text-white hover:bg-red-600">
                        Close
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    );
};

export default ShowImageInfo;
