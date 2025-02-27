import { Upload, Download } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { GeoJSONSource } from 'maplibre-gl';
import * as shapefile from "shapefile";
import JSZip from "jszip";
import { DOMParser } from "@xmldom/xmldom";
import { useMap } from '../context/MapProvider';
import * as toGeoJSON from "@tmcw/togeojson";


interface PolygonUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (coordinates: [number, number][]) => void;
}

const PolygonUploadModal: React.FC<PolygonUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const fileType = file.name.split(".").pop()?.toLowerCase();

    try {
      let coordinates: [number, number][] = [];

      if (fileType === "geojson") {
        const text = await file.text();
        const geojson = JSON.parse(text);
        coordinates = extractCoordinates(geojson);
      } else if (fileType === "kml" || fileType === "kmz") {
        const text = await readFileAsText(file);
        const kml = new DOMParser().parseFromString(text, "text/xml") as unknown as Document;
        const geojson = toGeoJSON.kml(kml);
        coordinates = extractCoordinates(geojson);
      } else if (fileType === "zip") {
        coordinates = await parseShapefileZip(file);
      } else {
        setError("Unsupported file format.");
      }

      onUpload(coordinates);
      setError(null);
    } catch (err) {
      setError("Error processing file: " + (err as Error).message);
    }
  };


  useEffect(() => {
    setError(null);
  },[isOpen])


  

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <DialogPanel className="bg-gray-900 p-6 rounded-lg w-96 text-white">
        <DialogTitle className="text-lg font-bold text-yellow-400">Upload Polygon</DialogTitle>
        <p className="text-sm my-2">Upload a KML, KMZ, GeoJSON, or SHP (zipped) file.</p>

        <Dropzone onDrop={onDrop} />

        {error && <p className="text-red-400 mt-2">{error}</p>}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-600 px-3 py-1 rounded">
            Close
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

const Dropzone: React.FC<{ onDrop: (files: File[]) => void }> = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-500 p-4 flex flex-col items-center cursor-pointer h-[150px] justify-center"
    >
      <input {...getInputProps()} />
      <span className="text-gray-400">Drag and drop or click to upload</span>
    </div>
  );
};

const extractCoordinates = (geojson: any): [number, number][] => {
    if (!geojson.features || geojson.features.length === 0) return [];
    
    return geojson.features
      .filter((feature: any) => feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon")
      .flatMap((feature: any) =>
        feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates.flat() // Flatten Polygon (single array)
          : feature.geometry.coordinates.flat(2) // Deep flatten MultiPolygon (nested arrays)
      );
  };

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

const parseShapefileZip = async (file: File): Promise<[number,number][]> => {
  const zip = new JSZip();
  const unzipped = await zip.loadAsync(file);
  const shpFile = Object.keys(unzipped.files).find((name) => name.endsWith(".shp"));
  const dbfFile = Object.keys(unzipped.files).find((name) => name.endsWith(".dbf"));

  if (!shpFile || !dbfFile) throw new Error("Missing .shp or .dbf file in ZIP.");

  const shpBuffer = await unzipped.files[shpFile].async("arraybuffer");
  const dbfBuffer = await unzipped.files[dbfFile].async("arraybuffer");

  const geojson = await shapefile.read(shpBuffer, dbfBuffer);
  return extractCoordinates(geojson);
};





type Mode = "upload" | "download" | null;


export default function UploadDownloadPolygon() {
    const [mode, setMode] = useState<Mode>(null);
    const {map} = useMap();

    const drawPolygon = (coords: [number, number][]) => {
            if (!map) return;
            const polygonData: GeoJSON.FeatureCollection = {
                type: "FeatureCollection",
                features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [coords] }, properties: {} }],
            };
    
            if (map.getSource("polygon")) {
                (map.getSource("polygon") as GeoJSONSource).setData(polygonData);
            } else {
                map.addSource("polygon", { type: "geojson", data: polygonData });
                map.addLayer({
                    id: "polygon-fill",
                    type: "fill",
                    source: "polygon",
                    paint: {
                        "fill-color": "red",
                        "fill-opacity": 0, // Semi-transparent pink fill
                    },
                });
    
                map.addLayer({
                    id: "polygon-border",
                    type: "line",
                    source: "polygon",
                    paint: {
                        "line-color": "red",
                        "line-width": 4,
                        "line-opacity": 1, // Transparent border
                    },
                });
            }
    };


    function handleUpload(coords: [number, number][]) {
        if (!map) return;
        const bounds = coords.reduce(
            (bbox, coord) => {
                return [
                    [Math.min(bbox[0][0], coord[0]), Math.min(bbox[0][1], coord[1])], // Min values
                    [Math.max(bbox[1][0], coord[0]), Math.max(bbox[1][1], coord[1])], // Max values
                ];
            },
            [
                [Infinity, Infinity], // Min lng, lat
                [-Infinity, -Infinity], // Max lng, lat
            ]
        );
    
        map.fitBounds(bounds as [[number, number], [number, number]], {
            padding: 300, // Add padding for visibility
            duration: 1000, // Smooth animation
        });
        setMode(null);
        drawPolygon(coords);

    }



  return (
    <div className="flex items-center justify-center gap-1 py-1" >
            {/* Polygon Tool */}
            <div className="relative group">
                <button
                    onClick={() => setMode("upload")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${mode === "upload" ? 'bg-yellow-600' : 'bg-gray-700'} hover:bg-yellow-500 transition-colors duration-200 shadow-xl`}
                >
                    <Upload color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-gray-700 text-xs rounded px-2 py-1 whitespace-nowrap">
                        Upload Polygon
                    </span>
                </button>
            </div>

            {/* Rectangle Tool */}
            <div className="relative group">
                <button
                    onClick={() => setMode("download")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${mode === "download" ? 'bg-yellow-600' : 'bg-gray-700'} hover:bg-yellow-500 transition-colors duration-200 shadow-xl`}
                >
                    <Download color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-gray-700 text-xs rounded px-2 py-1 whitespace-nowrap">
                        Download Polygon
                    </span>

                </button>

            </div>

          <PolygonUploadModal
              isOpen={mode === "upload"}
              onClose={() => setMode(null)}
              onUpload={(coords) => {
                  handleUpload(coords);
              }}
          />

        </div>
  )
}
