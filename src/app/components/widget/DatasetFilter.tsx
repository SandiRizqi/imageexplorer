import React from 'react';
import { useState } from 'react';
import DatasetSelector from './DatasetSelector';
import { useConfig } from '../context/ConfigProvider';
import { usePolygon } from '../context/PolygonProvider';
import LoadingScreen from '../LoadingScreen';
import { useMap } from '../context/MapProvider';
import axios from 'axios';
import Alert from '../Alert';



// type selectedMode = string | null;
type DatasetFilterProps = {
    onLoading: (loading: boolean) => void; // Function that takes a boolean and returns void
  };

export default function DatasetFilter({onLoading} : DatasetFilterProps) {
    const {map} = useMap();
    // const [selected, setSelected] = useState<selectedMode>(null);
    const {config, setConfig, filters, setFilters, resetFilter, selectedItem, setImageResults} = useConfig();
    const {polygon} = usePolygon();
    const [isOpenDataSelector, setIsOpenDataSelector] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const defaultStartDate = new Date(filters.startDate).toISOString().split("T")[0];
    const defaultEndDate = new Date(filters.endDate).toISOString().split("T")[0];
    const [Error, setError] = useState<string|null>(null);

    const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>, key: string): void => {
        const selectedDate = new Date(e.target.value); // Parse as local time
        selectedDate.setHours(selectedDate.getHours() + 7); // Adjust to UTC+7
        const formattedDate = selectedDate.toISOString().split(".")[0];
        setFilters(prev => ({
            ...prev,
            [key]: formattedDate,
            dateFilter: [{ ...prev.dateFilter[0], [key]: formattedDate }]
        }));
    };


    function handleChangeSlider(e: React.ChangeEvent<HTMLInputElement>, key: string): void {
        setFilters(prev => (
            {...prev,
                [key]: parseInt(e.target.value)
            }
        ))
    }


    // Function to handle selection
    // const handleCheckboxChange = (value: selectedMode) : void => {
    //     setSelected(selected === value ? null : value);
    // };


    const removeImagePreview = (id: string) => {
        if (map?.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    };

    const handleReset = () => {
        selectedItem.forEach(item => {
            removeImagePreview(item);
          });
        setImageResults([]);
        setConfig({...config, isFilterOpen: false});
    }


    const handleSubmit = async () => {
        
        if (polygon.length < 3) {
            setError("You need to provide at least 3 coordinates for a polygon or upload a geojson, kml, or shapefile.");
            return;
        };

        handleReset();

        const data = { ...filters, coords: polygon };
    
        try {
            setLoading(true);
            onLoading(true);
    
            const config = {
                headers: {
                    "Content-Type": "application/json", 
                }
            };
    
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search`, data, config);
            setImageResults(response.data["results"])
            return ; // Return data if needed for further processing
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data.error)
            } else {
                setError("Something error in server.");
            }
            setConfig(prev => ({...prev, isFilterOpen: true}))
        } finally {
            setLoading(false);
            onLoading(false);
        }
    };


    return (
        <>
            {/* Main Content */}
            {loading && <LoadingScreen />}
            <div className="flex-grow space-y-4 mt-4">
                {/* Date Inputs */}
                <div className="flex justify-between">
                    <div className="flex flex-col w-1/2 pr-2">
                        <label className="text-sm text-gray-400">Start Date</label>
                        <input type="date" className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style" value={defaultStartDate} onChange={(e) => handleChangeDate(e, 'startDate')} />
                    </div>
                    <div className="flex flex-col w-1/2 pl-2">
                        <label className="text-sm text-gray-400">End Date</label>
                        <input type="date" className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style" value={defaultEndDate} onChange={(e) => handleChangeDate(e, 'endDate')}/>
                    </div>
                </div>

                {/* Sliders */}
                <div className="flex-grow flex flex-col justify-between space-y-1">
                    <div>
                        <label className="text-sm text-gray-400 flex justify-between">
                            Cloud Cover: <span className="text-gray-300">{filters.cloudcover_max}%</span>
                        </label>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            className="w-full accent-yellow-400 h-[5px]"  
                            value={filters.cloudcover_max} 
                            onChange={(e) => handleChangeSlider(e, "cloudcover_max")}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex justify-between">
                            Off Nadir: <span className="text-gray-300">{filters.offnadir_max}°</span>
                        </label>
                        <input 
                            type="range" 
                            min="0" 
                            max="60" 
                            className="w-full accent-yellow-400 h-[5px]" 
                            value={filters.offnadir_max} 
                            onChange={(e) => handleChangeSlider(e, "offnadir_max")}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 flex justify-between">
                            Resolution: <span className="text-gray-300">{filters.resolution_max} m</span>
                        </label>
                        <input 
                            type="range" 
                            min="0" 
                            max="30" 
                            className="w-full accent-yellow-400 h-[5px]" 
                            value={filters.resolution_max} 
                            onChange={(e) => handleChangeSlider(e, "resolution_max")}
                        />
                    </div>
                </div>

                {/* Data Types - Allow Only One Selection */}
                
                {/* <p className='mb-0 mb-0 text-gray-400'>Filter:</p>
                <div className="text-sm text-gray-400 flex flex-row space-x-4">
                    
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "stereo"}
                            onChange={() => handleCheckboxChange("stereo")}
                            className="accent-yellow-400"
                        />
                        <span className='text-xs'>Stereo</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "color"}
                            onChange={() => handleCheckboxChange("color")}
                            className="accent-yellow-400"
                        />
                        <span className='text-xs'>Color</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "dem"}
                            onChange={() => handleCheckboxChange("dem")}
                            className="accent-yellow-400"
                        />
                        <span className='text-xs'>DEM</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={selected === "sar"}
                            onChange={() => handleCheckboxChange("sar")}
                            className="accent-yellow-400"
                        />
                        <span className='text-xs'>SAR</span>
                    </label>
                </div> */}

            </div> 
            <DatasetSelector isOpen={isOpenDataSelector} onClose={() => setIsOpenDataSelector(false)}/>

            {/* Footer - Stays at Bottom */}
            <div className="mt-2 pb-2">
                <button className="bg-yellow-500 text-black w-full py-2 rounded-md  hover:bg-yellow-400"
                onClick={()=> setIsOpenDataSelector(true)}
                >
                    SELECT DATASETS
                </button>
                <span className='text-yellow-500 text-xs flex p-1 flex-row w-full justify-center'>{filters.satellites.length} of 58 datasets selected</span>
                <div className="flex justify-between items-center text-sm mt-2">
                    <div></div>
                    <button className="text-gray-300 bg-red-600 py-2 px-4 rounded-md hover:bg-red-500" onClick={resetFilter}>RESET</button>
                    <button className="bg-buttonmaincolor px-4 py-2 rounded-md text-white hover:bg-buttonsecondarycolor" onClick={handleSubmit}>APPLY</button>
                </div>
            </div>
            {Error && <Alert category={"error"} message={Error} setClose={setError} />}
        </>
    )
}
