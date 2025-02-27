import React from 'react';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ChevronUp } from 'lucide-react';
import { ImagesData } from '../data';


export default function SearchContainer() {
    const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);

    const toggleFilter = () => {
        setIsFilterExpanded((prev) => !prev);
    };

    return (
        <div className="flex flex-col h-screen">
            <div
                className="p-3 text-md bg-gray-800 border-b border-gray-600 h-[50px] flex items-center justify-between cursor-pointer transition-all duration-300 shadow-xl"
                onClick={toggleFilter}
            >
                <div className="flex items-center">
                    <span className="text-gray-400 font-semibold">Filters</span>
                    <span className="text-gray-300 text-xs ml-2">

                    </span>
                </div>

                {/* Animated Arrow Icon */}
                <div
                    className={`transition-transform duration-300  ${isFilterExpanded ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <ChevronUp size={22} color="#9ca3af" />
                </div>
            </div>

            {/* Expanding Filter Section */}
            <div
                className={`overflow-hidden transition-all duration-300 ${isFilterExpanded ? "h-[50%]" : "h-0"
                    }`}
            >
                <div className="p-2">
                    {/* Add filter controls here */}
                    <p className="text-gray-600 text-xs">Filter options go here...</p>



                </div>
            </div>



            {/* Main Content (Table) */}
            <div className="flex-grow overflow-hidden">
                <div className="overflow-x-auto h-full">
                    <div className="max-h-full overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-700 bg-gray-800 sticky top-0">
                                <tr className="text-xs shadow-xl">
                                    <th className="p-2"><input type="checkbox" /></th>
                                    <th className="p-2">Sat</th>
                                    <th className="p-2">Date ↓</th>
                                    <th className="p-2">Res</th>
                                    <th className="p-2">Cloud</th>
                                    <th className="p-2">Off-Nadir</th>
                                    <th className="p-2"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-800">
                                {ImagesData.map((row, index) => (
                                    <tr key={index} className="border-b border-gray-700 text-xs hover:bg-gray-100 h-[40px]">
                                        <td className="p-2"><input type="checkbox" /></td>
                                        <td className="p-2">{row.sat}</td>
                                        <td className="p-2">{row.date}</td>
                                        <td className="p-2">{row.res}</td>
                                        <td className="p-2">{row.cloud}</td>
                                        <td className={`p-2 font-semibold ${row.color || ''}`}>{row.offNadir}</td>
                                        <td className="p-2"><FaInfoCircle className="text-gray-400 hover:text-gray-200 cursor-pointer" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            {/* Footer Buttons */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex flex-col items-center border-t border-gray-300 pb-4">
                <p className="text-xs text-gray-200">0 / 0 selected</p>
                <div className="flex gap-2 w-full mt-2">
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-4 rounded-md text-xs hover:bg-yellow-400">
                        CLEAR
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-4 rounded-md text-xs hover:bg-yellow-400">
                        REVIEW/SAVE
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-4 rounded-md text-xs hover:bg-yellow-400">
                        SUBMIT FOR QUOTE
                    </button>
                </div>
            </div>
        </div>
    )
}
