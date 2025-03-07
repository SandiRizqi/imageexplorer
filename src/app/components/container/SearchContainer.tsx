import React from 'react';
import { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { ChevronUp } from 'lucide-react';
import DatasetFilter from '../widget/DatasetFilter';
import { useMap } from '../context/MapProvider';
import { usePolygon } from '../context/PolygonProvider';
import { useConfig } from '../context/ConfigProvider';
import { GeoJSONSource, ImageSource } from 'maplibre-gl';
import { getPresignedUrl } from '../Tools';
import ShowImageInfo from '../widget/ShowInfo';
import { ImageItem } from '../types';
import Alert from '../Alert';


type ImageOverlay = {
    id: string;
    url: string;
    coordinates: [[number, number], [number, number], [number, number], [number, number]];
};

type SortKey = keyof ImageItem;

type SortOrder = 'asc' | 'desc';

export default function SearchContainer() {
    const { map, setLoadingMap } = useMap();
    const {polygon} = usePolygon();
    const { config, setConfig, filters, imageResult, setImageResults, selectedItem, setSelectedItem } = useConfig();
    const [loading, setOnLoading] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [infoDetail, setInfoDetail] = useState<ImageItem | null>(null);
    const [Error, setError] = useState<string|null>(null);



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


    const drawImagePreview = async (item: ImageItem) => {
        if (!map) return;
        const data = {
            catid: item['objectid'],
            satelliteShortName: item['collection_vehicle_short'],
            forceHighestQuality: false
        }
        const response: string = await getPresignedUrl(data);
        const bbox: [[number, number], [number, number], [number, number], [number, number]] = [

            [item.topleft.x, item.bottomright.y], // Bottom-left
            [item.bottomright.x, item.bottomright.y], // Bottom-right
            [item.bottomright.x, item.topleft.y], // Top-right
            [item.topleft.x, item.topleft.y],  // Top-left
        ]
        if (response === '') {
            return null;
        }

        const imageOverlay: ImageOverlay = {
            id: item.objectid,
            url: response,
            coordinates: bbox
        }

        if (map.getSource(imageOverlay.id)) {
            (map.getSource(imageOverlay.id) as ImageSource)
                .updateImage({
                    url: response,
                    coordinates: imageOverlay.coordinates,
                }
                );
        } else {
            map.addSource(imageOverlay.id, {
                type: "image",
                url: response,
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

        return response;
    };



    const removeImagePreview = (id: string) => {
        if (map?.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    };


    const toggleFilter = () => {
        setConfig((prev) => ({ ...prev, isFilterOpen: !prev.isFilterOpen }));
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

    const leaveItemHendler = () => {
        if (map?.getLayer("polygon-preview-border")) {
            map.removeLayer("polygon-preview-border");
            map.removeSource("polygon-preview");
        }
    }

    const selectItem = async (item: ImageItem) => {
        if (polygon.length < 3) {
            setError("You need to provide at least 3 coordinates for a polygon or upload a geojson, kml, or shapefile.");
            return;
        };

        if (selectedItem.includes(item.objectid)) {
            removeImagePreview(item.objectid);
            const filteredArray = selectedItem.filter(obj => obj !== item.objectid);
            setSelectedItem(filteredArray);
            return;
        };
        setLoadingMap(true);
        const url = await drawImagePreview(item);
        if (url) {
            setSelectedItem(prev => ([...prev, item.objectid]));
        };
        setLoadingMap(false);
        return;

    }

    const handleReset = () => {
        selectedItem.forEach(item => {
            removeImagePreview(item);
        });
        setSelectedItem([]);
        setImageResults([]);
    };


    const handleSort = (key: SortKey) => {
        const newOrder: SortOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(newOrder);

        const sortedData = [...imageResult].sort((a, b) => {
            let valueA = a[key];
            let valueB = b[key];

            // Ensure both values exist
            if (valueA === null || valueA === undefined) valueA = '';
            if (valueB === null || valueB === undefined) valueB = '';

            // Sort by 'collection_date' (convert "MM-DD-YYYY" to Date)
            if (key === 'collection_date') {
                const dateA = new Date(valueA as string).getTime();
                const dateB = new Date(valueB as string).getTime();
                return newOrder === 'asc' ? dateA - dateB : dateB - dateA;
            }

            // Convert 'cloud_cover_percent', 'offnadir', 'sun_az', 'resolution' to numbers
            if (['cloud_cover_percent', 'offnadir', 'resolution'].includes(key)) {
                const numA = parseFloat((valueA as string).toString().replace(/[^0-9.]/g, '')) || 0;
                const numB = parseFloat((valueB as string).toString().replace(/[^0-9.]/g, '')) || 0;
                return newOrder === 'asc' ? numA - numB : numB - numA;
            }

            // Sort by 'collection_vehicle_short' as a string
            if (key === 'collection_vehicle_short') {
                return newOrder === 'asc'
                    ? (valueA as string).localeCompare(valueB as string)
                    : (valueB as string).localeCompare(valueA as string);
            }

            return 0;
        });

        setImageResults(sortedData);
    };

    return (
        <div className="flex flex-col h-screen">
            <div
                className="p-3 text-md bg-maincolor  h-[50px] flex items-center justify-between cursor-pointer transition-all duration-300 shadow-xl"
                onClick={toggleFilter}
            >
                <div className="flex items-center">
                    <span className="text-gray-300">Filters</span>
                    <span className="text-gray-400 text-[10px] ml-2">
                        {filters.satellites.length}/58 datasets, Res  {`< ${filters.resolution_max} m`}, Cloud {`< ${filters.cloudcover_max}%`}, Off-Nadir {`< ${filters.offnadir_max}°`}
                    </span>
                </div>

                {/* Animated Arrow Icon */}
                <div
                    className={`transition-transform h-8 w-8 items-center flex justify-center rounded-full bg-maincolor hover:bg-secondarycolor border duration-300  ${config.isFilterOpen ? "rotate-180" : "rotate-0"
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
                <div className="p-2 px-4 bg-maincolor h-full flex flex-col overflow-y-auto">
                    {/* Add filter controls here */}
                    <DatasetFilter onLoading={setOnLoading} />
                </div>
            </div>



            {/* Main Content (Table) */}
            <div className={`flex-grow overflow-hidden bg-white transition-all duration-300  ${config.isFilterOpen ? "max-h-[calc(50%-150px)]" : "max-h-[calc(100%-200px)]"}`}>
                <div className="h-full">
                    <div className="max-h-full overflow-y-auto">
                        <table className="w-full table-fixed text-left text-sm max-w-full">
                            <thead className="bg-gray-300 text-maincolor sticky top-0 h-[50px] shadow-lg">
                                <tr className="text-xs">
                                    <th className="p-2  w-[30px]"><input type="checkbox" className='accent-yellow-400' /></th>
                                    <th className="p-2 min-w-[20px] cursor-pointer" onClick={() => handleSort('collection_vehicle_short')} >Sat</th>
                                    <th className="p-2 w-[80px] cursor-pointer" onClick={() => handleSort('collection_date')}>Date</th>
                                    <th className="p-2 min-w-[40px] cursor-pointer" onClick={() => handleSort('resolution')}>Res</th>
                                    <th className="p-2 min-w-[40px] cursor-pointer" onClick={() => handleSort('cloud_cover_percent')}>Cloud</th>
                                    <th className="p-2 max-w-[40px] whitespace-nowrap" >Off-Nadir</th>
                                    <th className="p-2 min-w-[20px]"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white text-maincolor" onMouseLeave={leaveItemHendler}>
                                {loading ? (
                                    // Render loading rows while data is being fetched
                                    [...Array(50)].map((_, index) => (
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
                                            <tr
                                                key={index}
                                                className="border-b border-gray-700 text-xs hover:bg-gray-100 h-[40px] text-left"
                                            >
                                                <td className="p-2">
                                                    <input
                                                        type="checkbox"
                                                        className="accent-yellow-400"
                                                        checked={selectedItem.includes(row.objectid)}
                                                    />
                                                </td>
                                                <td
                                                    className="p-2 whitespace-nowrap cursor-pointer"
                                                    onClick={() => selectItem(row)}
                                                    onMouseEnter={() => hoverItemHandler(row)}
                                                >
                                                    {row.collection_vehicle_short}
                                                </td>
                                                <td
                                                    className="p-2 whitespace-nowrap cursor-pointer"
                                                    onClick={() => selectItem(row)}
                                                    onMouseEnter={() => hoverItemHandler(row)}
                                                >
                                                    {row.collection_date}
                                                </td>
                                                <td
                                                    className="p-2 whitespace-nowrap cursor-pointer"
                                                    onClick={() => selectItem(row)}
                                                    onMouseEnter={() => hoverItemHandler(row)}
                                                >
                                                    {row.resolution}
                                                </td>
                                                <td
                                                    className="p-2 whitespace-nowrap cursor-pointer"
                                                    onClick={() => selectItem(row)}
                                                    onMouseEnter={() => hoverItemHandler(row)}
                                                >
                                                    {row.cloud_cover_percent} %
                                                </td>
                                                <td
                                                    className="p-2 font-semibold whitespace-nowrap cursor-pointer"
                                                    onClick={() => selectItem(row)}
                                                    onMouseEnter={() => hoverItemHandler(row)}
                                                >
                                                    {Array.isArray(row.offnadir)
                                                        ? parseFloat(row.offnadir[0]).toFixed(1)
                                                        : typeof row.offnadir === "number"
                                                            ? row.offnadir.toFixed(1)
                                                            : row.offnadir || ""}
                                                </td>
                                                <td className="p-2 whitespace-nowrap">
                                                    <FaInfoCircle
                                                        className="text-gray-400 hover:text-gray-200 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent row click event
                                                            setInfoDetail(row);
                                                        }}
                                                    />
                                                </td>
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
            <div className="absolute bottom-0 w-full bg-maincolor p-2 flex flex-col items-center justify-end border-t border-gray-300 pb-6 h-[100px]">
                <p className="text-xs text-gray-200">{selectedItem.length} / {imageResult.length} selected</p>
                <div className="flex gap-2 w-full mt-2">
                    <button className="flex-1 bg-yellow-500 text-gray-900 py-2 px-2 rounded-md text-xs hover:bg-yellow-400"
                        onClick={handleReset}
                    >
                        CLEAR
                    </button>
                    <button 
                        className="flex-1 bg-yellow-500 text-gray-900 py-2 px-2 rounded-md text-xs 
                        hover:bg-yellow-400 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                        disabled={selectedItem.length <= 0 }
                    >
                        SAVE
                    </button>

                </div>
            </div>

            {infoDetail && <ShowImageInfo isOpen={infoDetail !== null} onClose={() => setInfoDetail(null)} imageData={infoDetail} />}
            {Error && <Alert category={"error"} message={Error} setClose={setError} />}
        </div>
    )
}
