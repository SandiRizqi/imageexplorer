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
    resetFilter:  () => void;
    imageResult: ResultItem[];
    setImageResults: React.Dispatch<React.SetStateAction<ResultItem[]>>;
    selectedItem: string[];
    setSelectedItem: React.Dispatch<React.SetStateAction<string[]>>;
};


interface Coordinates {
    x: number;
    y: number;
  }

interface ResultItem {
    acq_time: string;
    alt_productid: string;
    api: string | null;
    azimuth_angle: number | null;
    bottomright: Coordinates;
    cloud_cover_percent: number;
    collection_date: string; // Format: MM-DD-YYYY
    collection_vehicle_short: string;
    color: boolean;
    data_type: string | null;
    imageBand: string;
    imageBandCount: number | null;
    js_api: string | null;
    js_date: string; // Format: MM-DD-YYYY
    js_resolution: number;
    length_factor: number;
    look_direction: string | null;
    max_off_nadir: number;
    max_pan_res: number;
    min_off_nadir: number;
    min_pan_res: number;
    mission: string | null;
    multi_res: string | null;
    objectid: string;
    offnadir: number;
    order_id: string;
    orientation_angle: number | null;
    path_direction: number | null;
    polarization_channels: string | null;
    preview_url: string;
    renderOrigin: string | null;
    resolution: string;
    satellite: string | null;
    scan_direction: string | null;
    stereo_pair: string | null;
    sun_az: number;
    sun_elev: number;
    target_az: number | null;
    target_az_max: number | null;
    target_az_min: number | null;
    topleft: Coordinates;
}





const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("Polygon must be used within PolygonProvider");
    }
    return context;
};

// const savedColor = localStorage.getItem("aoiColor");

const initConfig: Config = {
    isFilterOpen: true,
    defaultAOIColor: "#f218ca",
    defaultAOIPreviewColow: "#2a9df4"

}

const tenYearsAgo = new Date();
tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 5);
const defaultStartDate = tenYearsAgo.toISOString().split(".")[0];// Remove Z
const defaultEndDate = new Date().toISOString().split(".")[0];

const initFilters: Filters = {
    cloudcover_max: 50,
    offnadir_max: 30,
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
    satellites: ["ALOS","J14","J15",
        "K2","K3","K3A","KZ1","KZ2","LS-13","LS4/5","LS_TM","LS7",
        "LS8","PS","PNEO","P1","QB","REO","RES","SP1","SP2","SP3","SP4",
        "SP5","SP6","WV1","WV2","WV3","WV4"]
}

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<Config>(initConfig);
    const [filters, setFilters] = useState<Filters>(initFilters);
    const [imageResult, setImageResult] = useState<ResultItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<string[]>([])

    const setImageResults: React.Dispatch<React.SetStateAction<ResultItem[]>> = (data) => {
        setImageResult((prev) => {
            const sortedData = [...(typeof data === "function" ? data(prev) : data)];
            sortedData.sort(
                (a, b) => new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime()
            );
            return sortedData;
        });
    };

    const resetFilter = () => {
        setFilters(initFilters);
        setSelectedItem([]);
    }


    return (
        <ConfigContext.Provider value={{ 
            config, setConfig, 
            filters, setFilters, 
            resetFilter, 
            imageResult, setImageResults, 
            selectedItem, setSelectedItem }}>
            {children}
        </ConfigContext.Provider>
    );
};
