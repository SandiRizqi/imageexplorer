import React from "react";
import { useState } from "react";
import DatasetSelector from "./DatasetSelector";
import { useConfig } from "../context/ConfigProvider";
import { usePolygon } from "../context/PolygonProvider";
import LoadingScreen from "../LoadingScreen";
import { useMap } from "../context/MapProvider";
import axios from "axios";
import Alert from "../Alert";
import { checkTotalArea } from "../Tools";
import UploadAOIPolygon from "../widget/UploadAOIPolygon";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

// type selectedMode = string | null;
type DatasetFilterProps = {
  onLoading: (loading: boolean) => void; // Function that takes a boolean and returns void
};

export default function DatasetFilter({ onLoading }: DatasetFilterProps) {
  const { map } = useMap();
  // const [selected, setSelected] = useState<selectedMode>(null);
  const {
    config,
    setConfig,
    filters,
    setFilters,
    resetFilter,
    selectedItem,
    setImageResults,
    clearResults // <- Tambahkan ini
  } = useConfig();
  const { language } = useLanguage();
  const t = translations[language];
  const { polygon } = usePolygon();
  const [isOpenDataSelector, setIsOpenDataSelector] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const defaultStartDate = new Date(filters.startDate)
    .toISOString()
    .split("T")[0];
  const defaultEndDate = new Date(filters.endDate).toISOString().split("T")[0];
  const [Error, setError] = useState<string | null>(null);

  const handleChangeDate = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ): void => {
    const selectedDate = new Date(e.target.value); // Parse as local time
    selectedDate.setHours(selectedDate.getHours() + 7); // Adjust to UTC+7
    const formattedDate = selectedDate.toISOString().split(".")[0];

    setFilters((prev) => {
      const startDate = new Date(
        prev.dateFilter[0]?.startDate || formattedDate
      );
      const endDate = new Date(prev.dateFilter[0]?.endDate || formattedDate);

      // Update the corresponding date in the filter
      if (key === "startDate") {
        startDate.setTime(selectedDate.getTime());
      } else if (key === "endDate") {
        endDate.setTime(selectedDate.getTime());
      }

      // Check if the date range exceeds 10 years
      const tenYearsInMs = 20 * 365 * 24 * 60 * 60 * 1000; // 10 years in milliseconds
      if (endDate.getTime() - startDate.getTime() > tenYearsInMs) {
        setError(t.errorDateRange);
        return prev; // Prevent updating the state
      }

      return {
        ...prev,
        [key]: formattedDate,
        dateFilter: [{ ...prev.dateFilter[0], [key]: formattedDate }],
      };
    });
  };

  function handleChangeSlider(
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ): void {
    setFilters((prev) => ({ ...prev, [key]: parseInt(e.target.value) }));
  }

  // Function to handle selection
  // const handleCheckboxChange = (value: selectedMode) : void => {
  //     setSelected(selected === value ? null : value);
  // };

  const removeImagePreview = (id: string) => {
    if (map?.getLayer(id)) {
      map.removeLayer(id);
      map.removeSource(id);
    }
  };

  const handleReset = () => {
    selectedItem.forEach((item) => {
      removeImagePreview(item);
    });
    setImageResults([]);
    setConfig({ ...config, isFilterOpen: false });
  };

  // Tambahkan fungsi handleFullReset
  const handleFullReset = () => {
    // Hapus preview image untuk setiap selected item
    selectedItem.forEach((item) => {
      removeImagePreview(item);
    });

    // Reset filter state
    resetFilter();

    // Clear image results dan selected items
    clearResults();
  };

  const handleSubmit = async () => {
    if (polygon.length < 3) {
      setError(
        t.errorPolygon
      );
      return;
    }

    const totalArea = checkTotalArea(polygon);

    if (totalArea > 5000) {
      setError(t.errorArea);
      return;
    }

    handleReset();

    const data = { ...filters, coords: polygon };

    try {
      setLoading(true);
      onLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/search`,
        data,
        config
      );

      clearResults();
      setImageResults(response.data["results"]);
      return; // Return data if needed for further processing
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      } else {
        setError(t.errorServer);
      }
      setConfig((prev) => ({ ...prev, isFilterOpen: true }));
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      {loading && <LoadingScreen />}
      <div className="flex-grow space-y-4 mt-2 mb-4">
        {/* Date Inputs */}

        <div className="mt-2">
          <UploadAOIPolygon />
        </div>

        <DatasetSelector
          isOpen={isOpenDataSelector}
          onClose={() => setIsOpenDataSelector(false)}
        />

        {/* Footer - Stays at Bottom */}
        <div className="mt-2 pb-2">
          <button
            className="bg-greenmaincolor text-gray-800 shadow-md text-sm font-semibold w-full py-2 rounded-md hover:bg-greensecondarycolor dataset-filter"
            onClick={() => setIsOpenDataSelector(true)}
          >
            {t.selectImageries}
          </button>
          <span className="text-white text-xs flex p-1 mt-2 flex-row w-full justify-center">
            {filters.satellites.length} of 58 {t.datasetsSelected}
          </span>
          {/* <div className="flex justify-end text-sm mt-4">
                    <div></div>
                    <button className="text-gray-300 bg-red-600 py-2 px-4 rounded-md hover:bg-red-500 mx-4" onClick={resetFilter}>RESET</button>
                    <button className="bg-greensecondarycolor px-4 py-2 rounded-md text-white hover:bg-greensecondarycolor2 apply-search" onClick={handleSubmit}>APPLY</button>
                </div> */}
        </div>

        <hr className="border-gray-600" />

        <div className="flex justify-between filter-daterange">
          <div className="flex flex-col w-1/2 pr-2">
            <label className="text-sm text-gray-400">{t.startDate}</label>
            <input
              type="date"
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style"
              value={defaultStartDate}
              onChange={(e) => handleChangeDate(e, "startDate")}
            />
          </div>
          <div className="flex flex-col w-1/2 pl-2">
            <label className="text-sm text-gray-400">{t.endDate}</label>
            <input
              type="date"
              className="bg-gray-700 text-white rounded-md px-2 py-1 text-sm input-style"
              value={defaultEndDate}
              onChange={(e) => handleChangeDate(e, "endDate")}
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="flex-grow flex flex-col justify-between space-y-1">
          <div className="filter-cloudcover">
            <label className="text-sm text-gray-400 flex justify-between">
              {t.cloudCover}{" "}
              <span className="text-gray-300">{filters.cloudcover_max}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              className="w-full accent-greenmaincolor h-[5px]"
              value={filters.cloudcover_max}
              onChange={(e) => handleChangeSlider(e, "cloudcover_max")}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 flex justify-between">
              {t.offNadir}{" "}
              <span className="text-gray-300">{filters.offnadir_max}°</span>
            </label>
            <input
              type="range"
              min="0"
              max="60"
              className="w-full accent-greenmaincolor h-[5px]"
              value={filters.offnadir_max}
              onChange={(e) => handleChangeSlider(e, "offnadir_max")}
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 flex justify-between">
              {t.resolution}{" "}
              <span className="text-gray-300">{filters.resolution_max} m</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              className="w-full accent-greenmaincolor h-[5px]"
              value={filters.resolution_max}
              onChange={(e) => handleChangeSlider(e, "resolution_max")}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-maincolor pt-3 pb-3 mt-auto border-t border-gray-700">
        <div className="flex justify-end gap-2 xs:gap-3 text-sm ">
          <button
            className="text-white bg-red-600 py-1.5 xs:py-2 px-4 xs:px-6 md:px-8 rounded hover:bg-red-500 transition font-semibold"
            onClick={handleFullReset} // <- Ganti ini
          >
            {t.reset}
          </button>
          <button
            className="bg-greensecondarycolor px-4 xs:px-6 md:px-8 py-1.5 xs:py-2 rounded text-white hover:bg-greensecondarycolor2 transition font-semibold apply-search"
            onClick={handleSubmit}
          >
            {t.apply}
          </button>
        </div>
      </div>
      {Error && (
        <Alert category={"error"} message={Error} setClose={setError} />
      )}
    </>
  );
}