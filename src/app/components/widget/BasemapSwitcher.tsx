import React, { useState } from "react";
import { useMap } from "../context/MapProvider";
import carto from '../assets/crto_map.webp';
import smmap  from '../assets/sm_map.webp';
import Image from "next/image";

const basemaps = [
  {
    name: "Satellite Imagery",
    style: "https://api.maptiler.com/maps/satellite/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: smmap,
  },
  {
    name: "OSM Bright",
    style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
    thumbnail: carto,
  },
];

const BasemapSwitcher: React.FC = () => {
  const { map } = useMap();
  const [activeBasemap, setActiveBasemap] = useState(basemaps[1].style);
  const [isExpanded, setIsExpanded] = useState(false);

  const changeBasemap = (style: string) => {
    if (map) {
      map.setStyle(style, { diff: true });
      setActiveBasemap(style);
      setIsExpanded(false); // Tutup opsi setelah memilih
    }
  };

  return (
    <div
      className="absolute bottom-8 right-4 flex flex-col items-end bg-white p-1 rounded-lg shadow-md transition-all bg-opacity-30"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Saat tidak di-hover, hanya tombol aktif yang terlihat */}
      {!isExpanded ? (
        <button className="w-16 h-16 border  rounded-md overflow-hidden shadow-lg">
          <Image
            src={basemaps.find((b) => b.style === activeBasemap)?.thumbnail || ""}
            alt="Active Basemap"
            className="w-full h-full object-cover"
          />
        </button>
      ) : (
        /* Saat hover atau klik, semua opsi muncul */
        <div className="flex flex-col gap-2">
          {basemaps.map((basemap, index) => (
            <button
              key={index}
              onClick={() => changeBasemap(basemap.style)}
              className={`w-16 h-16 border rounded-md overflow-hidden transition-all duration-300 ${
                activeBasemap === basemap.style
                  ? "shadow-lg"
                  : "border-gray-300"
              }`}
            >
              <Image
                src={basemap.thumbnail}
                alt={basemap.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BasemapSwitcher;
