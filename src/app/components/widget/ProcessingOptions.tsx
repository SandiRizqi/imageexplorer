import React, { useState } from 'react';

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
    const [selectedOptions, setSelectedOptions] = useState<ProcessingType[]>([]);

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
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(o => o !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <div>
            <p className="text-sm text-center mb-4">
                Select processing options for your {selectedItems} selected image{selectedItems !== 1 ? 's' : ''}:
            </p>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {options.map((option) => (
                    <div 
                        key={option.id}
                        className={`flex items-center p-3 rounded-md cursor-pointer transition-all
                                  ${selectedOptions.includes(option.id) 
                                      ? 'bg-yellow-500/20 border border-yellow-500' 
                                      : 'bg-gray-800 border border-gray-700 hover:border-gray-500'}`}
                        onClick={() => toggleOption(option.id)}
                    >
                        <div className={`p-2 rounded-full ${selectedOptions.includes(option.id) ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-gray-300'}`}>
                            {option.icon}
                        </div>
                        <div className="ml-3">
                            <h3 className={`font-medium ${selectedOptions.includes(option.id) ? 'text-yellow-500' : 'text-white'}`}>
                                {option.name}
                            </h3>
                            <p className="text-xs text-gray-400">{option.description}</p>
                        </div>
                        <div className="ml-auto">
                            <div className={`w-5 h-5 rounded-full border-2
                                          ${selectedOptions.includes(option.id)
                                              ? 'border-yellow-500 bg-yellow-500'
                                              : 'border-gray-500'}`}>
                                {selectedOptions.includes(option.id) && (
                                    <svg className="w-full h-full text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-6">
                <button
                    className="bg-gray-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
                    onClick={() => setSelectedOptions([])}
                >
                    Clear
                </button>
                <button
                    className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-yellow-400 disabled:bg-gray-600 disabled:text-gray-400"
                    onClick={() => onSelect(selectedOptions)}
                    disabled={selectedOptions.length === 0}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}