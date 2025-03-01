import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ChevronUp } from 'lucide-react';
import DatasetFilter from '../widget/DatasetFilter';
import responseData from '../assets/responseCitra.json';
import { useMap } from '../context/MapProvider';
import { useConfig } from '../context/ConfigProvider';
import { GeoJSONSource, ImageSource } from 'maplibre-gl';


interface ImageItem {
    objectid: string;
    preview_url: string;
    topleft: { x: number; y: number };
    bottomright: { x: number; y: number };
    [key: string]: string | number | object | null; // Allows additional properties
};

type ImageOverlay = {
    id: string;
    url: string;
    coordinates: [[number, number], [number, number], [number, number], [number, number]];
};

export default function SearchContainer() {
    const {map} = useMap();
    const {config, setConfig} = useConfig();


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
                        "line-color": "#2a9df4",
                        "line-width": 4,
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
                    <span className="text-gray-300 text-xs ml-2">

                    </span>
                </div>

                {/* Animated Arrow Icon */}
                <div
                    className={`transition-transform duration-300  ${config.isFilterOpen ? "rotate-180" : "rotate-0"
                        }`}
                >
                    <ChevronUp size={22} color="#9ca3af" />
                </div>
            </div>

            {/* Expanding Filter Section */}
            <div
                className={`overflow-hidden transition-all duration-300 ${config.isFilterOpen ? "h-[50%]" : "h-0"
                    }`}
            >
                <div className="p-2 px-4 bg-gray-800 h-full flex flex-col overflow-y-auto">
                    {/* Add filter controls here */}
                    <DatasetFilter />
                </div>
            </div>



            {/* Main Content (Table) */}
            <div className={`flex-grow overflow-hidden transition-all duration-300  ${config.isFilterOpen ? "max-h-[50%]": "max-h-[100%]"}`}>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>





            {/* Footer Buttons */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex flex-col items-center border-t border-gray-300 pb-6">
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
