import React from 'react';
import { useState } from 'react';
import DatasetSelector from './DatasetSelector';
import { useConfig } from '../context/ConfigProvider';

type selectedMode = string | null;

export default function DatasetFilter() {
    const [selected, setSelected] = useState<selectedMode>(null);
    const {filters} = useConfig();
    const [isOpenDataSelector, setIsOpenDataSelector] = useState<boolean>(false);

    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const selectedDate = new Date(e.target.value);
        const formattedDate = new Date(selectedDate.setUTCHours(0, 0, 0, 0)).toISOString();
        console.log(formattedDate);
    }


    // Function to handle selection
    const handleCheckboxChange = (value: selectedMode) : void => {
        setSelected(selected === value ? null : value);
    };


    return (
        <>
            {/* Main Content */}
            <div className="flex-grow space-y-4 mt-4">
                {/* Date Inputs */}
                <div className="flex justify-between">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="text-sm text-gray-400">Start Date</label>
                        <input type="date" className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style" onChange={handleChangeDate} />
                    </div>
                    <div className="flex flex-col w-1/2 pl-2">
                        <label className="text-sm text-gray-400">End Date</label>
                        <input type="date" className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style" />
                    </div>
                </div>

                {/* Sliders */}
                <div className="flex-grow flex flex-col justify-between">
                    <div>
                        <label className="text-sm text-gray-400">Cloud Cover:</label>
                        <input type="range" min="0" max="100" className="w-full accent-yellow-400 h-[5px]" value={filters.cloudcover_max}/>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Off Nadir:</label>
                        <input type="range" min="0" max="60" className="w-full accent-yellow-400 h-[5px]" value={filters.offnadir_max}/>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">Resolution:</label>
                        <input type="range" min="0" max="10" className="w-full accent-yellow-400 h-[5px]" value={filters.resolution_max}/>
                    </div>
                </div>

                {/* Data Types - Allow Only One Selection */}
                <div className="text-sm text-gray-400">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "stereo"}
                            onChange={() => handleCheckboxChange("stereo")}
                            className="accent-yellow-400"
                        />
                        <span>Stereo Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "color"}
                            onChange={() => handleCheckboxChange("color")}
                            className="accent-yellow-400"
                        />
                        <span>Color Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "dem"}
                            onChange={() => handleCheckboxChange("dem")}
                            className="accent-yellow-400"
                        />
                        <span>DEM Only</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "sar"}
                            onChange={() => handleCheckboxChange("sar")}
                            className="accent-yellow-400"
                        />
                        <span>SAR Only</span>
                    </label>
                </div>
            </div>
            <DatasetSelector isOpen={isOpenDataSelector} onClose={() => setIsOpenDataSelector(false)}/>

            {/* Footer - Stays at Bottom */}
            <div className="mt-2 pb-2">
                <button className="bg-yellow-500 text-black w-full py-2 rounded-md font-semibold hover:bg-yellow-400"
                onClick={()=> setIsOpenDataSelector(true)}
                >
                    SELECT DATASETS
                </button>
                <div className="flex justify-between items-center text-sm mt-2">
                    <div></div>
                    <button className="text-gray-300 bg-gray-600 py-2 px-4 rounded-md hover:bg-gray-500">RESET</button>
                    <button className="bg-green-600 px-4 py-2 rounded-md text-white hover:bg-green-500">APPLY</button>
                </div>
            </div>
        </>
    )
}
