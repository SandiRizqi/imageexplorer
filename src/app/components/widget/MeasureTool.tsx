import { useEffect, useState } from "react";
import { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import { useConfig } from "../context/ConfigProvider";
import * as turf from "@turf/turf";
import { PencilRuler} from "lucide-react";
import { Marker } from "maplibre-gl";


// interface MeasureToolProps {
//   isMeasure: boolean;
// }

export default function MeasureTool() {
  const { map } = useMap();
  const { config } = useConfig();
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [marker, setMarker] = useState<Marker | null>(null);
  // const [distance, setDistance] = useState<number | null>(null);



  // Function to draw the shape dynamically
  // const drawShape = (coords: [number, number][], temp?: [number, number]) => {
  //   if (!map) return;

  //   const finalCoords = temp ? [...coords, temp] : coords;

  //   const geojson: GeoJSON.Feature = {
  //     type: "Feature",
  //     geometry: {
  //       type: "LineString",
  //       coordinates:  finalCoords,
  //     },
  //     properties: {},
  //   };

  //   if (map.getSource("measure-shape")) {
  //     (map.getSource("measure-shape") as GeoJSONSource).setData({
  //       type: "FeatureCollection",
  //       features: [geojson],
  //     });
  //   } else {
  //     map.addSource("measure-shape", { type: "geojson", data: geojson });
  //     map.addLayer({
  //       id: "measure-shape",
  //       type:  "line",
  //       source: "measure-shape",
  //       paint: { "line-color": config.defaultAOIColor || "#ff0000", "line-width": 3, "line-dasharray": [2, 1] },
  //     });
  //   }
  // };


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


    if (marker) {
      marker.remove();
      setMarker(null);
    }

  };

  // Complete measurement
  const completeMeasurement = () => {
    if (!map) return;
    setIsDrawing(false);
    map.getCanvas().style.cursor = "grab";
  };

  // Remove drawn shape
  const removeShape = () => {
    if (!map) return;
    if (map.getLayer("measure-shape")) {
      map.removeLayer("measure-shape");
      map.removeSource("measure-shape");
    }
    if (map.getLayer("measure-line")) {
      map.removeLayer("measure-line");
      map.removeSource("measure-line");
    }
  };

  // Handle map events
  useEffect(() => {
    if (!map) return;

    const handleClick = (e: MapMouseEvent) => {
      // console.log("clicked")
      const newPoint: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setCoordinates((prev) => [...prev, newPoint]);
    };

    const handleMouseMove = (e: MapMouseEvent) => {
      // console.log("moved")
      if (!isDrawing || coordinates.length === 0) return;


      // Hitung jarak menggunakan turf.js
      const line = turf.lineString([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);
      const calculatedDistance = turf.length(line, { units: "meters" });
      // setDistance(calculatedDistance);
      drawLine([...coordinates, [e.lngLat.lng, e.lngLat.lat]]);

      if (marker) {
        marker.setLngLat(e.lngLat);
        marker.getElement().innerHTML = `<div class="bg-white text-black text-xs px-2 py-1 rounded shadow-md">${calculatedDistance.toFixed(2)} m</div>`;
        marker.addTo(map);
    } else {
        const el = document.createElement("div");
        el.innerHTML = `<div class="bg-white text-black text-xs px-2 py-1 rounded shadow-md">${calculatedDistance.toFixed(2)} m</div>`;
        const newMarker = new Marker(el).setLngLat(e.lngLat)
        setMarker(newMarker);
    }

    };

    const handleDoubleClick = () => {
      completeMeasurement();
      // drawShape(coordinates); // Finalize the shape
      removeShape();
      map.getCanvas().style.cursor = "grab";
    };


    map.on("click", handleClick);
    map.on("mousemove", handleMouseMove);
    map.once("dblclick", handleDoubleClick);

    return () => {
      map.off("click", handleClick);
      map.off("mousemove", handleMouseMove);
      map.off("dblclick", handleDoubleClick);
    };
  }, [map, isDrawing,  coordinates]);

  // Calculate measurements using Turf.js
  
    
  // } else if (coordinates.length > 3) {
  //   const polygon = turf.polygon([coordinates]);
  //   area = turf.area(polygon);
  // }

  return (
    <div className="relative">
            <div className="flex items-center justify-center gap-1 py-1">
                <div className="relative group">
                    <button
                        onClick={() => startMeasurement()}
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${
                            isDrawing ? "bg-yellow-600" : "bg-maincolor"
                        } hover:bg-yellow-500 transition-colors duration-200 shadow-xl`}
                    >
                        <PencilRuler color="white" />
                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                            Distance
                        </span>
                    </button>
                </div>
            </div>

        </div>
  );
}
