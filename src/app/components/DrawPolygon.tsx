import React, { useState, useEffect } from "react";
import { useMap } from "./context/MapProvider";
import { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { Square, Trash2, Pencil } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

type DrawMode = "polygon" | "rectangle" | null;

const DrawTool: React.FC = () => {
    const { map } = useMap();
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isDrawing, setIsDrawing] = useState<boolean>(false);
    const [polygonCoords, setPolygonCoords] = useState<[number, number][]>([]);
    const [drawMode, setDrawMode] = useState<DrawMode>(null);
    const [startPoint, setStartPoint] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (!map || !isDrawing) return;

        const handleClick = (e: MapMouseEvent) => {
            const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];

            if (drawMode === "polygon") {
                setPolygonCoords((prevCoords) => [...prevCoords, newPoint]);
            } else if (drawMode === "rectangle" && !startPoint) {
                setStartPoint(newPoint);
            } else if (drawMode === "rectangle" && startPoint) {
                drawPolygon(generateRectangle(startPoint, newPoint));
                stopDrawing();
            }
        };

        const handleMouseMove = (e: MapMouseEvent) => {
            if (drawMode === "polygon" && polygonCoords.length > 0) {
                drawLine([...polygonCoords, [e.lngLat.lng, e.lngLat.lat]]);
            } else if (drawMode === "rectangle" && startPoint) {
                drawLine(generateRectangle(startPoint, [e.lngLat.lng, e.lngLat.lat]));
            }
        };

        const stopDrawing = () => {
            if (drawMode === "polygon" && polygonCoords.length > 2) {
                drawPolygon([...polygonCoords, polygonCoords[0]]);
            }
            setIsDrawing(false);
            setStartPoint(null);
            setDrawMode(null);
        };

        map.on("click", handleClick);
        map.on("mousemove", handleMouseMove);
        map.once("dblclick", stopDrawing);

        return () => {
            map.off("click", handleClick);
            map.off("mousemove", handleMouseMove);
            map.off("dblclick", stopDrawing);
        };
    }, [map, isDrawing, drawMode, polygonCoords, startPoint]);

    const startDrawing = (mode: DrawMode) => {
        if (!map) return;
        removeShapes();
        setDrawMode(mode);
        setIsDrawing(true);
        setPolygonCoords([]);
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
                    "line-color": "pink",
                    "line-width": 3,
                    "line-dasharray": [4, 2], // Dashed stroke
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
                    "fill-color": "pink",
                    "fill-opacity": 0, // Semi-transparent pink fill
                },
            });

            map.addLayer({
                id: "polygon-border",
                type: "line",
                source: "polygon",
                paint: {
                    "line-color": "pink",
                    "line-width": 4,
                    "line-opacity": 1, // Transparent border
                },
            });
        }
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
        if (map?.getLayer("polygon-fill")) {
            map.removeLayer("polygon-fill");
            map.removeSource("polygon");
        }
        if (map?.getLayer("polygon-border")) {
            map.removeLayer("polygon-border");
            map.removeSource("polygon");
        }
        removeLine();
    };

    return (
        <div className="flex items-center justify-center gap-2 py-1">
    {/* Polygon Tool */}
    <div className="relative group">
        <button
            onClick={() => startDrawing("polygon")}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${drawMode === "polygon" ? 'bg-yellow-600' : 'bg-gray-700'} hover:bg-yellow-500 transition-colors duration-200`}
        >
            <Pencil color="white" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-500 text-white text-xs rounded px-2 py-1">
            Draw Polygon
        </span>
    </div>

    {/* Rectangle Tool */}
    <div className="relative group">
        <button
            onClick={() => startDrawing("rectangle")}
            className={`flex items-center justify-center w-10 h-10 rounded-full ${drawMode === "rectangle" ? 'bg-yellow-600' : 'bg-gray-700'} hover:bg-yellow-500 transition-colors duration-200`}
        >
            <Square color="white" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-500 text-white text-xs rounded px-2 py-1">
            Draw Rectangle
        </span>
    </div>

    {/* Transform Tool */}
    <div className="relative group">
        <button
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-yellow-500 transition-colors duration-200"
        >
            <div className="w-5 h-5 border-2 border-white flex items-center justify-center">
                <div className="w-1 h-1 bg-white"></div>
            </div>
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-500 text-white text-xs rounded px-2 py-1">
            Transform
        </span>
    </div>

    {/* Delete Tool */}
    <div className="relative group">
        <button
            onClick={removeShapes}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-red-500 transition-colors duration-200"
        >
            <Trash2 color="white" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-500 text-white text-xs rounded px-2 py-1">
            Delete Shapes
        </span>
    </div>
</div>

    
    );
};

export default DrawTool;
