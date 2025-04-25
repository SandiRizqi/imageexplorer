import React, { useState, useEffect } from "react";
import { useMap } from "../context/MapProvider";
import { MapMouseEvent, GeoJSONSource, LngLatBounds } from "maplibre-gl";
import { Square, Trash2, Pentagon } from "lucide-react";
import { usePolygon } from "../context/PolygonProvider";
import { useConfig } from "../context/ConfigProvider";
import "maplibre-gl/dist/maplibre-gl.css";

type DrawMode = "polygon" | "rectangle" | null;

const DrawTool: React.FC = () => {
    const { map } = useMap();
    const { polygon, setPolygon } = usePolygon();
    const {config} = useConfig();
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [drawMode, setDrawMode] = useState<DrawMode>(null);
    const [startPoint, setStartPoint] = useState<[number, number] | null>(null);

    const stopDrawing = () => {
        if (drawMode === "polygon" && polygon.length > 2) {
            drawPolygon([...polygon, polygon[0]]);
            setPolygon([...polygon, polygon[0]]);
        }
        setIsDrawing(false);
        setStartPoint(null);
        setDrawMode(null);
        if (map) {
            map.getCanvas().style.cursor = "grab"; // or "default" depending on your preference
        }
    };


    useEffect(() => {
        if (!map || !isDrawing) return;

        const handleClick = (e: MapMouseEvent) => {
            const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];

            if (drawMode === "polygon") {
                setPolygon((prevCoords) => [...prevCoords, newPoint]);
            } else if (drawMode === "rectangle" && !startPoint) {
                setStartPoint(newPoint);
            } else if (drawMode === "rectangle" && startPoint) {
                const coords = generateRectangle(startPoint, newPoint);
                drawPolygon(coords);
                setPolygon(coords);
                stopDrawing();
            }
        };

        const handleMouseMove = (e: MapMouseEvent) => {
            if (drawMode === "polygon" && polygon.length > 0) {
                drawLine([...polygon, [e.lngLat.lng, e.lngLat.lat]]);
            } else if (drawMode === "rectangle" && startPoint) {
                drawLine(generateRectangle(startPoint, [e.lngLat.lng, e.lngLat.lat]));
                setPolygon(generateRectangle(startPoint, [e.lngLat.lng, e.lngLat.lat]));
            }
        };

        

        map.on("click", handleClick);
        map.on("mousemove", handleMouseMove);
        map.once("dblclick", stopDrawing);

        map.on("style.load", () => {
            if (polygon.length > 3) {
                drawPolygon(polygon);
            }
        })

        return () => {
            map.off("click", handleClick);
            map.off("mousemove", handleMouseMove);
            map.off("dblclick", stopDrawing);
            map.on("style.load", () => {
                if (polygon.length > 3) {
                    drawPolygon(polygon);
                    
                }
            })
        };
    }, [map, isDrawing, drawMode, polygon, startPoint, setPolygon, stopDrawing]);



    const startDrawing = (mode: DrawMode) => {
        if (!map) return;
        removeShapes();
        setDrawMode(mode);
        setIsDrawing(true);
        setPolygon([]);
        setStartPoint(null);
        map.getCanvas().style.cursor = "crosshair";
    };

    const drawLine = (coords: [number, number][]) => {
        if (!map) return;
        const lineData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} }],
        };

        if (map.getSource("polygon-line")) {
            (map.getSource("polygon-line") as GeoJSONSource).setData(lineData);
        } else {
            map.addSource("polygon-line", { type: "geojson", data: lineData });
            map.addLayer({
                id: "polygon-line",
                type: "line",
                source: "polygon-line",
                paint: {
                    "line-color": config.defaultAOIColor,
                    "line-width": 3,
                    "line-dasharray": [2, 1], // Dashed stroke
                },
            });
        }
    };

    const drawPolygon = (coords: [number, number][]) => {
        if (!map) return;
        const polygonData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} }],
        };

        removeLine();
        if (map.getSource("polygon")) {
            (map.getSource("polygon") as GeoJSONSource).setData(polygonData);
        } else {
            map.addSource("polygon", { type: "geojson", data: polygonData });
            map.addLayer({
                id: "polygon-fill",
                type: "fill",
                source: "polygon",
                paint: {
                    "fill-color": config.defaultAOIColor,
                    "fill-opacity": 0, // Semi-transparent pink fill
                },
            });

            map.addLayer({
                id: "polygon-border",
                type: "line",
                source: "polygon",
                paint: {
                    "line-color": config.defaultAOIColor,
                    "line-width": 4,
                    "line-opacity": 1, // Transparent border
                },
            });
        }

        map.moveLayer("polygon-fill");
        map.moveLayer("polygon-border")
    };

    const generateRectangle = (start: [number, number], end: [number, number]): [number, number][] => {
        const [x1, y1] = start;
        const [x2, y2] = end;
        return [[x1, y1], [x2, y1], [x2, y2], [x1, y2], [x1, y1]];
    };

    const removeLine = () => {
        if (map?.getLayer("polygon-line")) {
            map.removeLayer("polygon-line");
            map.removeSource("polygon-line");
        }
    };

    const removeShapes = () => {
        setPolygon([]);
        if (map?.getLayer("polygon-fill")) {
            map.removeLayer("polygon-fill");

        }
        if (map?.getLayer("polygon-border")) {
            map.removeLayer("polygon-border");
            map.removeSource("polygon");
        }
        removeLine();
        stopDrawing();
    };


    useEffect(() => {
        if (!map) return;

        const zoomToPolygon = (PolygonCoord: [number, number][]) => {
            const bounds = new LngLatBounds();
            PolygonCoord.forEach(coord => {
                bounds.extend(coord);
            });
            // Zoom to fit the polygon
            map.fitBounds(bounds, {
                padding:400 // Optional: add padding around the polygon
            });
        };

        if(polygon.length >= 3 && !isDrawing) {
            if (polygon[0][0] === polygon[polygon.length - 1][0] && polygon[0][1] === polygon[polygon.length - 1][1]) {
                drawPolygon(polygon);
                zoomToPolygon(polygon);
            }
        };


    }, [polygon])

    return (
        <div className="flex items-center justify-center gap-1 py-1">
            {/* Polygon Tool */}
            <div className="relative group">
                <button
                    onClick={() => startDrawing("polygon")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${drawMode === "polygon" ? 'bg-yellow-600' : 'bg-maincolor'} hover:bg-greenmaincolor transition-colors duration-200 shadow-xl`}
                >
                    <Pentagon color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                        Draw Polygon
                    </span>
                </button>
            </div>

            {/* Rectangle Tool */}
            <div className="relative group">
                <button
                    onClick={() => startDrawing("rectangle")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${drawMode === "rectangle" ? 'bg-yellow-600' : 'bg-maincolor'} hover:bg-greenmaincolor transition-colors duration-200 shadow-xl`}
                >
                    <Square color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                        Draw Rectangle
                    </span>

                </button>

            </div>

            {/* Transform Tool */}
            {/* <div className="relative group">
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-maincolor hover:bg-greenmaincolor transition-colors duration-200 shadow-xl"
                >
                    <Tangent color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                        Transform
                    </span>
                </button>

            </div> */}

            {/* Delete Tool */}
            <div className="relative group">
                <button
                    onClick={removeShapes}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-maincolor hover:bg-red-500 transition-colors duration-200 shadow-xl"
                >
                    <Trash2 color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                        Delete
                    </span>
                </button>

            </div>
        </div>


    );
};

export default DrawTool;
