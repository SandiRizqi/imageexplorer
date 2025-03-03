import React from 'react';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ChevronUp } from 'lucide-react';
import DatasetFilter from '../widget/DatasetFilter';
import { useMap } from '../context/MapProvider';
import { useConfig } from '../context/ConfigProvider';
import { GeoJSONSource, ImageSource } from 'maplibre-gl';

interface Coordinates {
    x: number;
    y: number;
  }



interface ImageItem {
    acq_time: string;
    alt_productid: string;
    api: string | null;
    azimuth_angle: number | null;
    bottomright: Coordinates;
    cloud_cover_percent: number;
    collection_date: string; // Format: MM-DD-YYYY
    collection_vehicle_short: string;
    color: boolean;
    data_type: string | null;
    imageBand: string;
    imageBandCount: number | null;
    js_api: string | null;
    js_date: string; // Format: MM-DD-YYYY
    js_resolution: number;
    length_factor: number;
    look_direction: string | null;
    max_off_nadir: number;
    max_pan_res: number;
    min_off_nadir: number;
    min_pan_res: number;
    mission: string | null;
    multi_res: string | null;
    objectid: string;
    offnadir: number;
    order_id: string;
    orientation_angle: number | null;
    path_direction: number | null;
    polarization_channels: string | null;
    preview_url: string;
    renderOrigin: string | null;
    resolution: string;
    satellite: string | null;
    scan_direction: string | null;
    stereo_pair: string | null;
    sun_az: number;
    sun_elev: number;
    target_az: number | null;
    target_az_max: number | null;
    target_az_min: number | null;
    topleft: Coordinates;
};

type ImageOverlay = {
    id: string;
    url: string;
    coordinates: [[number, number], [number, number], [number, number], [number, number]];
};

export default function SearchContainer() {
    const {map} = useMap();
    const {config, setConfig, filters, imageResult, setImageResults} = useConfig();
    const [loading, setOnLoading] = useState<boolean>(false);
   


    const drawPolygonPreview = (coords: [number, number][]) => {
            if (!map) return;
            const polygonData: GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} }],
            };
    
            if (map.getSource("polygon-preview")) {
                (map.getSource("polygon-preview") as GeoJSONSource).setData(polygonData);
            } else {
                map.addSource("polygon-preview", { type: "geojson", data: polygonData });
                map.addLayer({
                    id: "polygon-preview-border",
                    type: "line",
                    source: "polygon-preview",
                    paint: {
                        "line-color": config.defaultAOIPreviewColow,
                        "line-width": 2,
                        "line-opacity": 1, // Transparent border
                    },
                });
            }
    };


    const drawImagePreview  = (item: ImageItem) => {
        if(!map) return;
        const bbox: [[number, number], [number, number], [number, number], [number, number]] = [
            [item.topleft.x, item.topleft.y],  // Top-left
            [item.bottomright.x, item.topleft.y], // Top-right
            [item.bottomright.x, item.bottomright.y], // Bottom-right
            [item.topleft.x, item.bottomright.y], // Bottom-left
        ]

        const imageOverlay: ImageOverlay = {
            id: item.objectid ,
            url: item.preview_url,
            coordinates: bbox
        }

        if (map.getSource(imageOverlay.id)) {
            (map.getSource(imageOverlay.id) as ImageSource)
            .updateImage({
                    url: imageOverlay.url,
                    coordinates: imageOverlay.coordinates,
                }
            );
        } else {
            map.addSource(imageOverlay.id, {
                type: "image",
                url: imageOverlay.url,
                coordinates: imageOverlay.coordinates,
            });
            map.addLayer({
                id: imageOverlay.id,
                type: "raster",
                source: imageOverlay.id,
                paint: {
                    "raster-opacity": 1.0,
                },
            }, "polygon-border");
        }
    };



    // const removeShapesPreview = () => {
    //     if (map?.getLayer("polygon-preview-fill")) {
    //         map.removeLayer("polygon-preview-fill");

    //     }
    //     if (map?.getLayer("polygon-preview-border")) {
    //         map.removeLayer("polygon-preview-border");
    //         map.removeSource("polygon-preview");
    //     }
    // };


    const toggleFilter = () => {
        setConfig((prev) => ({...prev, isFilterOpen: !prev.isFilterOpen}));
    };

    const hoverItemHandler = (item: ImageItem) => {
        const coords: [number, number][] = [
            [item.topleft.x, item.topleft.y],  // Top-left
            [item.bottomright.x, item.topleft.y], // Top-right
            [item.bottomright.x, item.bottomright.y], // Bottom-right
            [item.topleft.x, item.bottomright.y], // Bottom-left
            [item.topleft.x, item.topleft.y] 
        ]


        drawPolygonPreview(coords);
    }

    const selectItem = (item: ImageItem) => {
        drawImagePreview(item);
    }

    return (
        <div className="flex flex-col h-screen">
            <div
                className="p-3 text-md bg-gray-800  h-[50px] flex items-center justify-between cursor-pointer transition-all duration-300 shadow-xl"
                onClick={toggleFilter}
            >
                <div className="flex items-center">
                    <span className="text-gray-300 ">Filters</span>
                    <span className="text-gray-400 text-[10px] ml-2">
                        {filters.satellites.length}/58 datasets, Res  {`< ${filters.resolution_max} m`}, Cloud {`< ${filters.cloudcover_max}%`}, Off-Nadir {`< ${filters.offnadir_max}°`}
                    </span>
                </div>

                {/* Animated Arrow Icon */}
                <div
                    className={`transition-transform h-8 w-8 items-center flex justify-center rounded-full bg-gray-600 hover:bg-gray-500 duration-300  ${config.isFilterOpen ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <ChevronUp size={22} color="#9ca3af" />
                </div>
            </div>

            {/* Expanding Filter Section */}
            <div
                className={`overflow-hidden transition-all duration-300 ${config.isFilterOpen ? "h-[calc(50%-50px)]" : "h-0"
                    }`}
            >
                <div className="p-2 px-4 bg-gray-800 h-full flex flex-col overflow-y-auto">
                    {/* Add filter controls here */}
                    <DatasetFilter onLoading={setOnLoading}/>
                </div>
            </div>



            {/* Main Content (Table) */}
            <div className={`flex-grow overflow-hidden bg-white transition-all duration-300  ${config.isFilterOpen ? "max-h-[calc(50%-150px)]": "max-h-[calc(100%-200px)]"}`}>
            <div className="h-full">
                <div className="max-h-full overflow-y-auto">
                    <table className="w-full table-fixed text-left text-sm max-w-full">
                        <thead className="bg-gray-300 text-gray-800 sticky top-0 h-[50px] shadow-lg">
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
                            {loading ? (
                                // Render loading rows while data is being fetched
                                [...Array(10)].map((_, index) => (
                                    <tr key={index} className="border-b border-gray-500 text-sm h-[40px] bg-gray-200 animate-pulse">
                                        <td className="p-2"><div className="h-4 w-4 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-10 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-16 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-12 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-12 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-12 bg-gray-300 rounded"></div></td>
                                        <td className="p-2"><div className="h-4 w-4 bg-gray-300 rounded"></div></td>
                                    </tr>
                                ))
                            ) : (
                                imageResult.length > 0 ? (
                                    imageResult.map((row, index) => (
                                        <tr key={index} className="border-b border-gray-700 text-xs hover:bg-gray-100 h-[40px] text-left cursor-pointer" 
                                            onClick={() => selectItem(row)}
                                            onMouseEnter={() => hoverItemHandler(row)}
                                        >
                                            <td className="p-2"><input type="checkbox" className='accent-yellow-400' /></td>
                                            <td className="p-2 whitespace-nowrap">{row.collection_vehicle_short}</td>
                                            <td className="p-2 whitespace-nowrap">{row.collection_date}</td>
                                            <td className="p-2 whitespace-nowrap">{row.resolution}</td>
                                            <td className="p-2 whitespace-nowrap">{row.cloud_cover_percent} %</td>
                                            <td className={`p-2 font-semibold ${row.color || ''} whitespace-nowrap`}>{100}</td>
                                            <td className="p-2 whitespace-nowrap"><FaInfoCircle className="text-gray-400 hover:text-gray-200" /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4 text-gray-500">No data available</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>






            {/* Footer Buttons */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex flex-col items-center justify-end border-t border-gray-300 pb-6 h-[100px]">
                <p className="text-xs text-gray-200">0 / {imageResult.length} selected</p>
                <div className="flex gap-2 w-full mt-2">
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400"
                    onClick={() => setImageResults([])}
                    >
                        CLEAR
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400">
                        SAVE
                    </button>
                    <button className="flex-1 bg-yellow-500 text-gray-800 py-2 px-2 rounded-md text-xs hover:bg-yellow-400">
                        CREATE QUOTE
                    </button>
                </div>
            </div>
        </div>
    )
}
