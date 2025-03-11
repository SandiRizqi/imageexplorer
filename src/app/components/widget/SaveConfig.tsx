import React, { useState, useEffect } from 'react';
import { usePolygon } from '../context/PolygonProvider';
import { useConfig } from '../context/ConfigProvider';
import { saveConfig, getPresignedUrl } from '../Tools';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ImageItem } from '../types';

type ImagePreview = {
    id: string;
    url: string;
    metadata: {
        id: string;
        date: string;
        resolution: string;
        cloudCoverage: string;
        offNadir: string;
    }
};

export default function SaveConfigButton() {
    const { polygon } = usePolygon();
    const { filters, imageResult, selectedItem } = useConfig();
    const [modalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [configID, setConfigID] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);

    // Load selected image previews when modal opens
    useEffect(() => {
        if (modalOpen && selectedItem.length > 0) {
            loadImagePreviews();
        }
    }, [modalOpen]);

    const loadImagePreviews = async () => {
        setLoading(true);
        const previews: ImagePreview[] = [];
        
        // Find selected images from imageResult
        const selectedImages = imageResult.filter(img => selectedItem.includes(img.objectid));
        
        for (const item of selectedImages) {
            try {
                const data = {
                    catid: item.objectid,
                    satelliteShortName: item.collection_vehicle_short,
                    forceHighestQuality: false
                };
                
                const imageUrl = await getPresignedUrl(data, setError);
                if (imageUrl) {
                    previews.push({
                        id: item.objectid,
                        url: imageUrl,
                        metadata: {
                            id: item.objectid,
                            date: item.collection_date,
                            resolution: item.resolution,
                            cloudCoverage: `${item.cloud_cover_percent}%`,
                            offNadir: typeof item.offnadir === 'number' 
                                ? `${item.offnadir.toFixed(1)}°` 
                                : Array.isArray(item.offnadir) 
                                    ? `${parseFloat(item.offnadir[0]).toFixed(1)}°` 
                                    : item.offnadir || ""
                        }
                    });
                }
            } catch (err) {
                console.error("Error loading image preview:", err);
            }
        }
        
        setImagePreviews(previews);
        setLoading(false);
    };

    const handleSaveConfig = async () => {
        setError(null);
        setConfigID(null);
        setCopied(false);
        setLoading(true);

        const configData = {
            filter: filters,
            polygon: polygon,
            results: imageResult,
            selected: selectedItem
        };

        try {
            const savedConfigID = await saveConfig(configData, setError);
            if (savedConfigID) {
                setConfigID(savedConfigID);
            }
        } catch {
            setError("Failed to save configuration.");
        }

        setLoading(false);
    };

    const handleCopy = () => {
        if (configID) {
            navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <button
                className="flex-1 bg-yellow-500 text-gray-900 py-2 px-2 rounded-md text-xs 
                        hover:bg-yellow-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={() => setModalOpen(true)}
                disabled={selectedItem.length <= 0 || loading}
            >
                {loading ? (
                    <svg className="animate-spin h-4 w-4 text-gray-900 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                    </svg>
                ) : "SAVE"}
            </button>

            {/* Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <DialogPanel className="bg-maincolor text-white rounded-lg p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
                        <DialogTitle className="text-lg font-semibold text-yellow-500 text-center">
                            Review / Save
                        </DialogTitle>

                        <div className="mt-4 border-t border-b border-gray-700 py-4">
                        {imagePreviews.length > 0 ? (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
                                {imagePreviews.map((image) => (
                                    <div 
                                        key={image.id} 
                                        className="flex border border-gray-700 rounded-md overflow-hidden items-center p-2"
                                    >
                                        {/* Thumbnail Image */}
                                        <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center bg-gray-800 rounded-md">
                                            <img 
                                                src={image.url} 
                                                alt="Satellite imagery" 
                                                className="w-full h-full object-contain rounded-md"
                                            />
                                        </div>

                                        {/* Image Metadata */}
                                        <div className="p-2 text-xs space-y-1 flex-1">
                                            <div className="text-xs text-gray-400">
                                                {image.id}
                                            </div>
                                            <div>Date: {image.metadata.date}</div>
                                            <div>Resolution: {image.metadata.resolution}</div>
                                            <div>Cloud coverage: {image.metadata.cloudCoverage}</div>
                                            <div>Off-nadir: {image.metadata.offNadir}</div>

                                            {/* Remove Button - Kecil & di bawah Cloud Coverage */}
                                            <div className="mt-1 flex justify-end">
                                                <button
                                                    className="bg-red-600 text-white text-[10px] px-2 py-1 rounded-md"
                                                    onClick={() => {
                                                        setImagePreviews(previews => previews.filter(p => p.id !== image.id));
                                                    }}
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-400">
                                {loading ? (
                                    <div className="flex justify-center items-center">
                                        <svg className="animate-spin h-6 w-6 text-yellow-500 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
                                        </svg>
                                        <span>Loading images...</span>
                                    </div>
                                ) : (
                                    "No images selected"
                                )}
                            </div>
                        )}
                    </div>



                        <div className="mt-6 text-center">
                            <div className="flex justify-between space-x-2">
                                <span className="text-sm text-gray-400">
                                    {selectedItem.length} Selected
                                </span>
                                <div className="flex space-x-2">
                                    <button
                                        className="bg-gray-700 text-white px-4 py-2 rounded-md text-xs hover:bg-gray-600"
                                        onClick={() => setModalOpen(false)}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-md text-xs hover:bg-yellow-400"
                                        onClick={handleSaveConfig}
                                        disabled={loading || configID !== null}
                                    >
                                        SAVE SEARCH
                                    </button>
                                    <button
                                        className="bg-gray-700 text-white px-4 py-2 rounded-md text-xs hover:bg-gray-600"
                                        onClick={() => navigator.clipboard.writeText(selectedItem.join(', '))}
                                    >
                                        COPY IDs
                                    </button>
                                    <button
                                        className="bg-gray-700 text-white px-4 py-2 rounded-md text-xs hover:bg-gray-600"
                                    >
                                        SAVE AS KMZ
                                    </button>
                                    <button
                                        className="bg-gray-700 text-white px-4 py-2 rounded-md text-xs hover:bg-gray-600"
                                    >
                                        SAVE AS SHP
                                    </button>
                                </div>
                            </div>
                        </div>

                        {configID && (
                            <div className="mt-4 bg-gray-800 p-4 rounded-md">
                                <p className="text-sm text-center text-green-400 mb-2">
                                    Configuration saved successfully!
                                </p>
                                <div className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-md">
                                    <span className="text-sm text-gray-300 truncate">{`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`}</span>
                                    <button
                                        className="bg-yellow-500 text-gray-800 px-3 py-1 text-xs rounded-md shadow-md hover:bg-yellow-400"
                                        onClick={handleCopy}
                                    >
                                        {copied ? "Copied!" : "Copy"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 bg-red-900/30 border border-red-500 p-3 rounded-md text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}