//src/app/components/widget/ProcessingOptions.tsx
import React, { useState } from 'react';
import LoadingScreen from '../LoadingScreen';

type ProcessingType = 'rawdata' | 'imageprocessing' | 'imageanalysis' | 'layouting';

interface ProcessingOption {
    id: ProcessingType;
    name: string;
    description: string;
    icon: React.ReactNode;
}

interface ProcessingOptionsProps {
    onSelect: (options: ProcessingType[]) => void;
    selectedItems: number;
}

export default function ProcessingOptions({ onSelect, selectedItems }: ProcessingOptionsProps) {
    const [selectedOptions, setSelectedOptions] = useState<ProcessingType[]>(['rawdata']);
    const [isLoading, setIsLoading] = useState(false);

    const options: ProcessingOption[] = [
        {
            id: 'rawdata',
            name: 'Raw Data',
            description: 'Unprocessed satellite imagery data',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
                </svg>
            )
        },
        {
            id: 'imageprocessing',
            name: 'Image Processing',
            description: 'Enhanced imagery with color correction and balancing',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                </svg>
            )
        },
        {
            id: 'imageanalysis',
            name: 'Image Analysis',
            description: 'Detailed analysis with annotations and insights',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
            )
        },
        {
            id: 'layouting',
            name: 'Layout Design',
            description: 'Professional layout and presentation of imagery',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
            )
        }
    ];

    const toggleOption = (option: ProcessingType) => {
        if (option === 'rawdata') return;
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleContinue = () => {
        setIsLoading(true);
        onSelect(selectedOptions);
    };

    return (
        <div className="space-y-6">
            {isLoading && <LoadingScreen />}

            <p className="text-sm text-center mb-4 text-gray-300">
                Select processing options for your {selectedItems} selected image{selectedItems !== 1 ? 's' : ''}
            </p>
        
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((option) => (
                    <div 
                        key={option.id}
                        className={`p-4 rounded-lg border-2 transition-all
                            ${selectedOptions.includes(option.id) 
                                ? 'border-greenmaincolor bg-greenmaincolor/10' 
                                : 'border-gray-700'}
                            ${option.id === 'rawdata' 
                                ? 'cursor-not-allowed opacity-75' 
                                : 'cursor-pointer hover:border-greenmaincolor'}`}
                        onClick={() => option.id !== 'rawdata' && toggleOption(option.id)}
                    >
                        <div className="flex items-start">
                            <div className={`p-2 rounded-lg ${selectedOptions.includes(option.id) ? 'bg-greensecondarycolor' : 'bg-gray-700'}`}>
                                {option.icon}
                            </div>
                            <div className="ml-4">
                                <h3 className="font-medium text-white">{option.name}</h3>
                                <p className="text-xs text-gray-400 mt-1">{option.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        
            {/* Tombol */}
            <div className="flex justify-between mt-8">
                <div className="space-x-4">
                    <button
                        className="px-6 py-2 bg-gray-700 rounded-md hover:bg-red-600 transition"
                        onClick={() => setSelectedOptions(['rawdata'])}
                    >
                        Clear
                    </button>
                    <button
                        className="px-6 py-2 bg-greenmaincolor text-gray-900 rounded-md hover:bg-greensecondarycolor transition disabled:opacity-50"
                        onClick={handleContinue}
                        disabled={selectedOptions.length === 0}
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
