import React, { createContext, useContext, useState } from "react";




type Config = {
    isFilterOpen: boolean;
}

type ConfigContextType = {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
  };
  
  
const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("Polygon must be used within PolygonProvider");
  }
  return context;
};

const initConfig: Config = {
    isFilterOpen: false,
}

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(initConfig);


  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};
