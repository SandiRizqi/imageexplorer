"use client";
import { useState } from "react";
import { LocationData } from "../types";
import { useMap } from "../context/MapProvider";
import { LngLatBounds } from "maplibre-gl";


const SearchLocation = () => {
    const {map} = useMap();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);


  const zoomToPolygon = (location: LocationData) => {
    if(!map) return;
    if (!location.boundingbox) return;
  
    const bounds = new LngLatBounds(
      [parseFloat(location.boundingbox[2]), parseFloat(location.boundingbox[0])], // Southwest [lng, lat]
      [parseFloat(location.boundingbox[3]), parseFloat(location.boundingbox[1])]  // Northeast [lng, lat]
    );
  
    map.fitBounds(bounds, {
      padding: 100, // Optional: add padding around the polygon
    });
  };

  // Fungsi untuk mencari kota dari Nominatim API
  const fetchCities = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&countrycodes=id`);
    const data = await res.json();
    setSuggestions(data);
  };

  // Handle input perubahan
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchCities(value);
  };

  // Handle pemilihan kota dari dropdown
  const handleSelectCity = (city: LocationData) => {
    setSearchTerm(city.display_name);
    setSuggestions([]);
    zoomToPolygon(city);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input Pencarian */}
      <input
        type="text"
        className="w-full bg-maincolor text-gray-300 placeholder-gray-500 border-b border-white focus:outline-none focus:border-yellow-500 px-2 py-2"
        placeholder="Search"
        value={searchTerm}
        onChange={handleInputChange}
      />

      {/* Dropdown Hasil Pencarian */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full bg-secondarycolor text-white mt-1  shadow-md z-10 max-h-[500px] overflow-y-auto">
          {suggestions.map((city) => (
            <li
              key={city.place_id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-600"
              onClick={() => handleSelectCity(city)}
            >
              {city.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;
