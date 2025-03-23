import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { useMap } from "./context/MapProvider";
import "maplibre-gl/dist/maplibre-gl.css";




export type ViewOptions = {
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
};

export type MapInstanceProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  mapStyle?: string;
  mapView?: ViewOptions;
};

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-sm">Loading, please wait...</p>
      </div>
    </div>
  );
};

const MapInstance: React.FC<MapInstanceProps> = ({ id, className, style, mapStyle, mapView }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { map, setMap } = useMap();







  useEffect(() => {
    if (!mapContainerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle || "https://demotiles.maplibre.org/style.json",
      center: mapView?.center || [0, 0],
      zoom: mapView?.zoom || 3,
      pitch: mapView?.pitch || 0,
      bearing: mapView?.bearing || 0,
      attributionControl: false, 
    });

    setMap(mapInstance);


    return () => mapInstance.remove();
  }, [mapStyle, mapView?.bearing, mapView?.center, mapView?.pitch, mapView?.zoom, setMap]);

  useEffect(() => {
    if(!map) return;
    
    if (map && mapView) {
      map.jumpTo(mapView);
      map.on("load", setLoaded)
    }

    
    
    

  }, [map]);

  useEffect(() => {
    if (map && mapStyle) {
      map.setStyle(mapStyle);
    }
  }, [mapStyle, map]);



  useEffect(() => {
        if (map) {
            const handleResize = () => {
                map.resize();
            };

            handleResize(); // Initial check
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);


  




  function setLoaded () {
    setIsLoading(false);
  }



  return <div id={id} className={`absolute w-full h-full ${className}`} ref={mapContainerRef} style={style}>
    {isLoading && <LoadingScreen />}
  </div>;
};

export default MapInstance;
