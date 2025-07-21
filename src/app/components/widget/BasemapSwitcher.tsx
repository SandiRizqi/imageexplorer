import React, { useState } from "react";
// import { LayerSpecification, SourceSpecification } from "maplibre-gl";
import { useMap } from "../context/MapProvider";
import carto from '../assets/crto_map.webp';
import smmap from '../assets/sm_map.webp';
import Image from "next/image";
import WhatsAppButton from "../WhatsappButton";
import FeedbackButton from "../FeedbackButton";

const basemaps = [
  {
    name: "Satellite Imagery",
    style: "https://api.maptiler.com/maps/satellite/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: smmap,
  },
  {
    name: "OSM",
    style: "https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL",
    thumbnail: carto,
  },
];

const BasemapSwitcher: React.FC = () => {
  const { map } = useMap();
  const [activeBasemap, setActiveBasemap] = useState(basemaps[1].style);
  const [isExpanded, setIsExpanded] = useState(false);



//   const getLayersList = () => {
//     if (!map) return [];
    
//     try {
//         const style = map.getStyle(); 
//         console.log(style)   
//         return style.layers || []
//     } catch  {
//         return []
//     }
// };

const changeBasemap = (style: string) => {
  if (!map) return;

  // const polygonLayers: LayerSpecification[] | [] = getLayersList();
  //     const filteredLayers: LayerSpecification[] = polygonLayers.filter(
  //         layer => layer.id === "polygon-fill" || layer.id === "polygon-border"
  //     );
  // const polySource = map.getStyle().sources?.polygon;

  
  // map.once('style.load', () => {
  //   console.log(polySource)
  //   if (polySource) {
  //     if (!map.getSource("polygon")) {
  //       map.addSource("polygon", polySource);
  //     };
  
  //     filteredLayers.forEach(layer => {
  //       try {
  //         if (!map.getLayer(layer.id)) {
  //           map.addLayer(layer);
  
  //         }
  //         // Always move to top regardless if it was just added or already existed
  //         map.moveLayer(layer.id);
  //       } catch (error) {
  //         console.error(`[2025-03-18 02:49:54] Error handling layer ${layer.id}:`, error);
  //       }
  //     });
  //   }
  // })


  // Set the new style
  map.setStyle(style, { diff: false });
  setActiveBasemap(style);
  setIsExpanded(false);
};






return (
  <div className="absolute bottom-8 right-4 flex flex-col items-end gap-2">

    <FeedbackButton />
    {/* WhatsApp Component */}
    <WhatsAppButton 
    phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
    message={process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE}
    />

    {/* Basemap Switcher */}
    <div
      className="flex flex-col items-end bg-white p-1 rounded-lg shadow-md transition-all bg-opacity-30"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {!isExpanded ? (
        <button className="w-16 h-16 border rounded-md overflow-hidden shadow-lg">
          <Image
            src={basemaps.find((b) => b.style === activeBasemap)?.thumbnail || ""}
            alt="Active Basemap"
            className="w-full h-full object-cover"
          />
        </button>
      ) : (
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
  </div>
);
};

export default BasemapSwitcher;
