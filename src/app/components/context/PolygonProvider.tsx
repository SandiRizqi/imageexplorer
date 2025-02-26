import React, { createContext, useContext, useState } from "react";

type PolygonContextType = {
    polygon: [number, number][];
    setPolygon: React.Dispatch<React.SetStateAction<[number, number][]>>;
  };
  
  
  const PolygonContext = createContext<PolygonContextType | undefined>(undefined);

export const usePolygon = () => {
  const context = useContext(PolygonContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};

export const PolygonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [polygon, setPolygon] = useState<[number, number][]>([]);

  return (
    <PolygonContext.Provider value={{ polygon, setPolygon }}>
      {children}
    </PolygonContext.Provider>
  );
};
