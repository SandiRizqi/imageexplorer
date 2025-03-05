import { useEffect, useState } from "react";
import { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import { useConfig } from "../context/ConfigProvider";

interface MeasureToolProps {
  isMeasure: boolean;
}

export default function MeasureTool({ isMeasure }: MeasureToolProps) {
  const { map } = useMap();
  const { config } = useConfig();
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Function to draw the line on the map
  const drawLine = (coords: [number, number][]) => {
    if (!map) return;

    const lineData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: { type: "LineString", coordinates: coords },
          properties: {},
        },
      ],
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
          "line-color": config.defaultAOIColor || "#ff0000",
          "line-width": 3,
          "line-dasharray": [2, 1],
        },
      });
    }
  };

  // Function to start the measurement tool
  const startMeasurement = () => {
    if (!map) return;
    map.getCanvas().style.cursor = "crosshair";
    setCoordinates([]); // Reset previous measurements
    setIsDrawing(true);
  };

  // Function to end measurement and finalize the shape
  const completeMeasurement = () => {
    if (!map) return;
    setIsDrawing(false);
    map.getCanvas().style.cursor = "grab"; // Reset cursor
  };

  // Remove line from map
  const removeLine = () => {
    if (!map) return;
    if (map.getLayer("measure-line")) {
      map.removeLayer("measure-line");
      map.removeSource("measure-line");
    }
  };

  // Handle click to add a point
  useEffect(() => {
    if (!map || !isMeasure) return;

    const handleClick = (e: MapMouseEvent) => {
        console.log("click")
      const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, newPoint]);
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      if (!isDrawing || coordinates.length === 0) return;
      drawLine([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);
    };

    const handleDoubleClick = () => {
        
      completeMeasurement();
      drawLine(coordinates); // Finalize the line
      removeLine();
      map.getCanvas().style.cursor = "grab"; // Reset cursor
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

  return null;
}
