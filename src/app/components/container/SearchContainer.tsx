import React from 'react';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ChevronUp } from 'lucide-react';
import DatasetFilter from '../widget/DatasetFilter';
import responseData from '../assets/responseCitra.json';


export default function SearchContainer() {
    const [isFilterExpanded, setIsFilterExpanded] = useState<boolean>(false);
    console.log(responseData)

    const toggleFilter = () => {
        setIsFilterExpanded((prev) => !prev);
    };

    return (
        <div className="flex flex-col h-screen">
            <div
                className="p-3 text-md bg-gray-800  h-[50px] flex items-center justify-between cursor-pointer transition-all duration-300 shadow-xl"
                onClick={toggleFilter}
            >
                <div className="flex items-center">
                    <span className="text-gray-300 ">Filters</span>
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
                <div className="p-2 px-4 bg-gray-800 h-full flex flex-col">
                    {/* Add filter controls here */}
                    <DatasetFilter />
                </div>
            </div>



            {/* Main Content (Table) */}
            <div className={`flex-grow overflow-hidden transition-all duration-300  ${isFilterExpanded ? "max-h-[50%]": "max-h-[100%]"}`}>
                <div className="h-full">
                    <div className="max-h-full overflow-y-auto">
                        <table className="w-full table-fixed text-left text-sm max-w-full">
                            <thead className="border-b border-gray-700 bg-gray-300 text-gray-800 sticky top-0 h-[50px] shadow-lg">
                                <tr className="text-xs">
                                    <th className="p-2  w-[30px]"><input type="checkbox" className='accent-yellow-400'/></th>
                                    <th className="p-2 min-w-[20px]">Sat</th>
                                    <th className="p-2 w-[80px]">Date</th>
                                    <th className="p-2 min-w-[40px]">Res</th>
                                    <th className="p-2 min-w-[40px]">Cloud</th>
                                    <th className="p-2 max-w-[40px] whitespace-nowrap">Off-Nadir</th>
                                    <th className="p-2 min-w-[20px]"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-800">
                                {responseData.results.map((row, index) => (
                                    <tr key={index} className="border-b border-gray-700 text-xs hover:bg-gray-100 h-[40px] text-left">
                                        <td className="p-2"><input type="checkbox" className='accent-yellow-400' /></td>
                                        <td className="p-2 whitespace-nowrap">{row.collection_vehicle_short}</td>
                                        <td className="p-2 whitespace-nowrap">{row.collection_date}</td>
                                        <td className="p-2 whitespace-nowrap">{row.resolution}</td>
                                        <td className="p-2 whitespace-nowrap">{row.cloud_cover_percent} %</td>
                                        <td className={`p-2 font-semibold ${row.color || ''} whitespace-nowrap`}>{100}</td>
                                        <td className="p-2 whitespace-nowrap"><FaInfoCircle className="text-gray-400 hover:text-gray-200" /></td>
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
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400">
                        CLEAR
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400">
                        SAVE
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400">
                        SUBMIT FOR QUOTE
                    </button>
                </div>
            </div>
        </div>
    )
}
