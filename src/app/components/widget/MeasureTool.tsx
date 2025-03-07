import { useEffect, useState } from "react";
import { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import { useConfig } from "../context/ConfigProvider";
import * as turf from "@turf/turf";

interface MeasureToolProps {
  isMeasure: boolean;
}

export default function MeasureTool({ isMeasure }: MeasureToolProps) {
  const { map } = useMap();
  const { config } = useConfig();
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);


  // Function to draw the shape dynamically
  const drawShape = (coords: [number, number][], temp?: [number, number]) => {
    if (!map) return;

    const finalCoords = temp ? [...coords, temp] : coords;

    const geojson: GeoJSON.Feature = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates:  finalCoords,
      },
      properties: {},
    };

    if (map.getSource("measure-shape")) {
      (map.getSource("measure-shape") as GeoJSONSource).setData({
        type: "FeatureCollection",
        features: [geojson],
      });
    } else {
      map.addSource("measure-shape", { type: "geojson", data: geojson });
      map.addLayer({
        id: "measure-shape",
        type:  "line",
        source: "measure-shape",
        paint: { "line-color": config.defaultAOIColor || "#ff0000", "line-width": 3, "line-dasharray": [2, 1] },
      });
    }
  };


  const drawLine = (coords: [number, number][]) => {
          if (!map) return;
          const lineData: GeoJSON.FeatureCollection = {
              type: "FeatureCollection",
              features: [{ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} }],
          };
  
          if (map.getSource("measure-line")) {
              (map.getSource("measure-line") as GeoJSONSource).setData(lineData);
          } else {
              map.addSource("measure-line", { type: "geojson", data: lineData });
              map.addLayer({
                  id: "measure-line",
                  type: "line",
                  source: "measure-line",
                  paint: {
                      "line-color": config.defaultAOIColor,
                      "line-width": 3,
                      "line-dasharray": [2, 1], // Dashed stroke
                  },
              });
          }
      };

  // Start measurement mode
  const startMeasurement = () => {
    if (!map) return;
    setCoordinates([]);
    setIsDrawing(true);
    map.getCanvas().style.cursor = "crosshair";
  };

  // Complete measurement
  const completeMeasurement = () => {
    if (!map) return;
    setIsDrawing(false);
    map.getCanvas().style.cursor = "grab";
  };

  // Remove drawn shape
  // const removeShape = () => {
  //   if (!map) return;
  //   if (map.getLayer("measure-shape")) {
  //     map.removeLayer("measure-shape");
  //     map.removeSource("measure-shape");
  //   }
  // };

  // Handle map events
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      console.log("clicked")
      const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, newPoint]);
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      console.log("moved")
      if (!isDrawing || coordinates.length === 0) return;
      drawLine([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);
    };

    const handleDoubleClick = () => {
      completeMeasurement();
      drawShape(coordinates); // Finalize the shape
      // removeShape();
      map.getCanvas().style.cursor = "grab";
    };

    startMeasurement();
    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.once("dblclick", handleDoubleClick);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("dblclick", handleDoubleClick);
    };
  }, [map, isMeasure, isDrawing]);

  // Calculate measurements using Turf.js
  let distance;
  let area;
  if (coordinates.length > 2) {
    const line = turf.lineString(coordinates);
    distance = turf.length(line, { units: "meters" });
    
  } else if (coordinates.length > 3) {
    const polygon = turf.polygon([coordinates]);
    area = turf.area(polygon);
  }

  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-md">
      {coordinates.length > 1 && <p>Distance: {distance?.toFixed(2)} meters</p>}
      {coordinates.length > 2 && <p>Area: {area?.toFixed(2)} square meters</p>}
    </div>
  );
}
