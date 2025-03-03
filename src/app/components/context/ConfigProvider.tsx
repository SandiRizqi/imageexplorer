import React, { createContext, useContext, useState } from "react";

interface DateFilter {
    startDate: string;
    endDate: string;
}

interface Filters {
    cloudcover_max: number;
    offnadir_max: number;
    resolution_min: number;
    resolution_max: number;
    dem: boolean;
    coords: [number, number][];
    seasonal: boolean;
    monthly: boolean;
    dateRange: boolean;
    dateFilter: DateFilter[];
    stereo: boolean;
    lazyLoad: boolean;
    sar: boolean;
    pageNum: number;
    persistentScenes: [];
    startDate: string;
    endDate: string;
    satellites: string[];
}



interface Config {
    isFilterOpen: boolean;
    defaultAOIColor: string;
    defaultAOIPreviewColow: string;
}

type ConfigContextType = {
    config: Config;
    setConfig: React.Dispatch<React.SetStateAction<Config>>;
    filters: Filters,
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
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
    defaultAOIColor: "#FF2C2C",
    defaultAOIPreviewColow: "#2a9df4"

}

const tenYearsAgo = new Date();
tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 5);
const defaultStartDate = tenYearsAgo.toISOString().split(".")[0];// Remove Z
const defaultEndDate = new Date().toISOString().split(".")[0];

const initFilters: Filters = {
    cloudcover_max: 50,
    offnadir_max: 50,
    resolution_min: 0,
    resolution_max: 2,
    dem: false,
    coords: [],
    seasonal: false,
    monthly: false,
    dateRange: true,
    dateFilter: [
        { startDate: defaultStartDate, endDate: defaultEndDate }
    ],
    stereo: false,
    lazyLoad: false,
    sar: false,
    pageNum: 0,
    persistentScenes: [],
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    satellites: ["ALOS","J14","J15","J1N","J1V","K2","K3","K3A","KZ1","KZ2","LS-13","LS4/5","LS_TM","LS7","LS8","PS","PNEO","P1","QB","REO","RES","SP1","SP2","SP3","SP4","SP5","SP6","WV1","WV2","WV3","WV3_SWIR","WV4"]
}

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>(initConfig);
    const [filters, setFilters] = useState<Filters>(initFilters);


    return (
        <ConfigContext.Provider value={{ config, setConfig, filters, setFilters }}>
            {children}
        </ConfigContext.Provider>
    );
};
