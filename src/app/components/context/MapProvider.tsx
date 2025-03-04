import React, { createContext, useContext, useState } from "react";
import maplibregl from "maplibre-gl";


const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center  z-50">
            <div className="flex flex-col items-center">
                <div className="w-14 h-14 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    )
}


type MapContextType = {
  map: maplibregl.Map | null;
  setMap: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  loading: boolean;
  setLoadingMap: React.Dispatch<React.SetStateAction<boolean>>;
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [loading, setLoadingMap] = useState<boolean>(false);

  return (
    <MapContext.Provider value={{ map, setMap, loading, setLoadingMap }}>
      {children}
      {loading && <LoadingScreen />}
    </MapContext.Provider>
  );
};
