import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { Folder, ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";
import { useConfig } from "../context/ConfigProvider";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

interface Dataset {
    name: string;
    value: string;
}

interface DatasetCategory {
    name: string;
    datasets: Dataset[];
}

const datasetCategories: DatasetCategory[] = [
    {
        name: "Maxar-DigitalGlobe",
        datasets: [
            { name: "GeoEye-1 (GE1) - 40cm 4-band", value: "GE1" },
            { name: "IKONOS (IK) - 80cm 4-band", value: "IK" },
            { name: "Legion (LG) - 30cm 8-band", value: "LG" },
            { name: "QuickBird (QB) - 60cm 4-band", value: "QB" },
            { name: "WorldView-1 (WV1) - 50cm Pan", value: "WV1" },
            { name: "WorldView-2 (WV2) - 40cm 8-band", value: "WV2" },
            { name: "WorldView-3 (WV3) - 30cm 8-band", value: "WV3" },
            { name: "WorldView-3 SWIR (WV3_SWIR) - 3.7m 8-band SWIR", value: "WV3_SWIR" },
            { name: "WorldView-4 (WV4) - 30cm 4-band", value: "WV4" },
        ],
    },
    {
        name: "Airbus Defense and Space",
        datasets: [
            { name: "Pléiades Neo 3/4 (PNEO) - 30-cm 6-band", value: "PNEO" },
            { name: "Pléiades-1 (P1) - 50-cm 4-band", value: "P1" },
            { name: "SPOT 1 (SP1) - 10-m 3-band", value: "SP1" },
            { name: "SPOT 2 (SP2) - 10-m 3-band", value: "SP2" },
            { name: "SPOT 3 (SP3) - 10-m 3-band", value: "SP3" },
            { name: "SPOT 4 (SP4) - 10-m 3-band + 20-m SWIR", value: "SP4" },
            { name: "SPOT 5 (SP5) - 2.5-m 3-band + 20-m SWIR", value: "SP5" },
            { name: "SPOT 6/7 (SP6) - 1.5-m 4-band", value: "SP6" },
            { name: "TerraSAR-X Staring SpotLight (TST) - up to 25-cm X-band SAR", value: "TST" },
            { name: "TerraSAR-X High Resolution SpotLight (THS) - up to 1-m X-band SAR", value: "THS" },
            { name: "TerraSAR-X SpotLight (TSL) - up to 2-m X-band SAR", value: "TSL" },
            { name: "TerraSAR-X StripMap (TSM) - up to 3-m X-band SAR", value: "TSM" },
            { name: "TerraSAR-X ScanSAR (TSC) - up to 18.5-m X-band SAR", value: "TSC" },
            { name: "TerraSAR-X Wide ScanSAR (TWSC) - up to 30-m X-band SAR", value: "TWSC" },
            { name: "WorldDEM Neo (WDN) - 5-m DEM", value: "WDN" },
            { name: "WorldDEM (WD) - 12-m DEM", value: "WD" },

        ],
    },
    {
        name: "Planet",
        datasets: [
            { name: "PlanetScope Scene (PS) - 3-m 3, 4 or 8-band", value: "PS" },
            { name: "RapidEye OrthoTile (REO) - 5-m 5-band", value: "REO" },
            { name: "RapidEye Scene (RES) - 6.5-m 5-band", value: "RES" },
            { name: "SkySat Collect (SKYC) - 50-cm 4-band", value: "SKYC" },
            { name: "SkySat Tile (SKY) - 50-cm 4-band", value: "SKY" }
        ],
    },
    {
        name: "Jilin Satellite",
        datasets: [
            { name: "Jilin-1 4-Band (J14) - 30-cm to 1.06-m 4-band", value: "J14" },
            { name: "Jilin-1 5-Band (J15) - 92-cm 5-band", value: "J15" },
            { name: "Jilin-1 Night (J1N) - nighttime 92-cm to 1.2-m 3-band", value: "J1N" },
            { name: "Jilin-1 Video (J1V) - video 92-cm to 1.2-m 3-band", value: "J1V" },
        ],
    },
    {
        name: "SpaceWill",
        datasets: [
            { name: "GaoFen-1 High Res (GF1H) - 2-m 4-band", value: "GF1H" },
            { name: "GaoFen-1 Low Res (GF1L) - 16-m 4-band", value: "GF1L" },
            { name: "GaoFen-2 (GF2) - 80-cm 4-band", value: "GF2" },
            { name: "SuperView-1 (SV1) - 50-cm 4-band", value: "SV1" },
            { name: "SuperView-2 (SV2) - 40-cm 4-band", value: "SV2" },
            { name: "SuperView-Neo (SVN) - 30-cm 4-band; 50-cm 8-band", value: "SVN" },
            { name: "ZiYuan-3 (ZY3) - 2.1-m 4-band Mono; 2.5-m/3.5-m Pan Stereo", value: "ZY3" },
        ],
    },
    {
        name: "Hexagon",
        datasets: [
            { name: "Digital Aerial Imagery (HEX) - 15-cm to 30-cm color/CIR mono", value: "HEX" },
            { name: "Digital Aerial Imagery DEM (HEXD) - 20-cm and up", value: "HEXD" },
        ],
    },
    {
        name: "21AT",
        datasets: [
            { name: "BJ3A (BJ3A) - 50-cm 4-band", value: "BJ3A" },
            { name: "BJ3N (BJ3N) - 30-cm 4-band", value: "BJ3N" },
            { name: "TripleSat (TS) - 80-cm 4-band", value: "TS" },
        ],
    },
    {
        name: "KOMSAT",
        datasets: [
            { name: "KOMPSAT-2 (K2) - 1-m 4-band", value: "K2" },
            { name: "KOMPSAT-3 (K3) - 70-cm 4-band", value: "K3" },
            { name: "KOMPSAT-3A (K3A) - 40-cm 4-band", value: "K3A" },
        ],
    },
    {
        name: "GEOSAT",
        datasets: [
            { name: "GEOSAT-1 (GS1) - 22-m 3-band CIR only", value: "GS1" },
            { name: "GEOSAT-2 (GS2) - 75-cm 4-band", value: "GS2" },
        ],
    },
    {
        name: "ALOS",
        datasets: [
            { name: "ALOS (ALOS) - 2.5-m Pan Mono/Stereo", value: "ALOS" },
        ],
    },
    {
        name: "NARLabs/FORMOSAT",
        datasets: [
            { name: "FORMOSAT-2 (FS2) - 2-m 4-band", value: "FS2" },
            { name: "FORMOSAT-5 (FS5) - 2-m 4-band", value: "FS5" },
        ],
    },
    {
        name: "USGS/NASA",
        datasets: [
            { name: "Landsat 1-3 (LS-13) - 40-m 5-band", value: "LS-13" },
            { name: "Landsat 4-5 MMS (LS4/5) - 57-m x 79-m 4-band", value: "LS4/5" },
            { name: "Landsat 4-5 TM (LS_TM) - 30-m 7-band", value: "LS_TM" },
            { name: "Landsat 7 (LS7) - 15-m 7-band", value: "LS7" },
            { name: "Landsat 8 (LS8) - 15-m 7-band", value: "LS8" },
        ],
    },
    {
        name: "KGS Space Technologies",
        datasets: [
            { name: "KazEOSat-1 (KZ1) - 1-m 4-band", value: "KZ1" },
            { name: "KazEOSat-2 (KZ2) - 6.5-m 5-band", value: "KZ2" },
        ],
    },
];



interface DatasetSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DatasetSelector({ isOpen, onClose }: DatasetSelectorModalProps) {
    const { filters, setFilters } = useConfig();
    const { language } = useLanguage();
    const t = translations[language];
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const handleClick = (datasetValue: string) => {
        setFilters((prevFilters) => {
            const selected = new Set(prevFilters.satellites);

            if (selected.has(datasetValue)) {
                selected.delete(datasetValue); // Remove if already selected
            } else {
                selected.add(datasetValue); // Add if not selected
            }

            return {
                ...prevFilters,
                satellites: Array.from(selected), // Convert Set back to an array
            };
        });
    };



    const toggleSection = (category: string) => {
        setExpandedSections((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };



    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <DialogPanel className="bg-maincolor p-6 rounded-md text-white w-[90%] max-w-3xl max-h-[90%] flex flex-col">

                {/* Fixed Title */}
                <div className="sticky top-0 bg-maincolor pb-4 z-10">
                    <DialogTitle className="text-lg font-bold text-white text-center">{t.satelliteImageryDatasets}</DialogTitle>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto space-y-2">
                    {datasetCategories.map(category => (
                        <div key={category.name} className="bg-secondarycolor rounded-md p-2">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection(category.name)}
                            >
                                <div className="flex items-center space-x-2">
                                    <Folder className="text-greensecondarycolor w-5 h-5" />
                                    <span>{category.name}</span>
                                </div>
                                {expandedSections[category.name] ? (
                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                )}
                            </div>

                            {expandedSections[category.name] && (
                                <div className="mt-2 space-y-1 pl-5">
                                    {category.datasets.length > 0 ? (
                                        category.datasets.map((dataset, datasetIndex) => {
                                            const isChecked = filters.satellites.includes(dataset.value);

                                            return (
                                                <div
                                                    key={datasetIndex}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                    onClick={() => handleClick(dataset.value)}
                                                >
                                                    {isChecked ? (
                                                        <CheckSquare className="text-greensecondarycolor w-5 h-5" />
                                                    ) : (
                                                        <Square className="text-gray-500 w-5 h-5" />
                                                    )}
                                                    <span className="text-sm">{dataset.name}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-400 text-sm">{t.noDatasets}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Fixed Footer */}
                <div className="sticky bottom-0 bg-maincolor pt-4 z-10">
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-gray-700 rounded-md hover:bg-red-600 transition px-3 py-1">
                            {t.close}
                        </button>
                    </div>
                </div>

            </DialogPanel>
        </Dialog >

    );
}
