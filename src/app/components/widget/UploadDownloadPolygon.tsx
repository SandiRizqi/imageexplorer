import { Upload, Download } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { GeoJSONSource } from 'maplibre-gl';
import * as shapefile from "shapefile";
import { DOMParser } from "@xmldom/xmldom";
import { useMap } from '../context/MapProvider';
import { usePolygon } from '../context/PolygonProvider';
import { useConfig } from '../context/ConfigProvider';
import shpwrite from "@mapbox/shp-write";
import JSZip from 'jszip';
import { Geometry, Feature, FeatureCollection, GeoJsonProperties, Polygon, MultiPolygon } from 'geojson';
import * as toGeoJSON from "@tmcw/togeojson";


interface PolygonDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
  }



 

const PolygonDownloadModal: React.FC<PolygonDownloadModalProps> = ({ isOpen, onClose }) => {
    const [fileName, setFileName] = useState("");
    const [format, setFormat] = useState<string>("");
    const {polygon} = usePolygon();
    const [error, setError] = useState("");
    

    const convertGeoJSONtoKML = (geojson: GeoJSON.FeatureCollection): string => {
        const header = `<?xml version="1.0" encoding="UTF-8"?>
          <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>`;
      
        const footer = `</Document></kml>`;
      
        const placemarks = geojson.features.map((feature) => {
          if (feature.geometry.type !== "Polygon") return "";
      
          const coordinates = (feature.geometry.coordinates as number[][][])[0]
            .map((coord) => coord.join(","))
            .join(" ");
      
          return `
            <Placemark>
              <Polygon>
                <outerBoundaryIs>
                  <LinearRing>
                    <coordinates>${coordinates}</coordinates>
                  </LinearRing>
                </outerBoundaryIs>
              </Polygon>
            </Placemark>`;
        });
      
        return header + placemarks.join("\n") + footer;
      };

    function downloadBlob (url: string, format: string) {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName}.${format}`; // Set the file name
        document.body.appendChild(a); // Append to DOM (not necessary but ensures click works)
        a.click(); // Trigger download
        document.body.removeChild(a); // Clean up
        URL.revokeObjectURL(url);

    }
    


    const downloadGeoJSON = () => {
        const polygonData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [polygon] }, properties: {} }],
        };
        const blob = new Blob([JSON.stringify(polygonData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        downloadBlob(url, 'geojson');
        
      };
 

      const downloadKML = () => {
        const polygonData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [polygon] }, properties: {} }],
        };
        const kmlData = convertGeoJSONtoKML(polygonData);
        const blob = new Blob([kmlData], { type: "application/vnd.google-earth.kml+xml" });
        const url = URL.createObjectURL(blob);
        downloadBlob(url, 'kml')
      };

    const downloadZIP = async () => {
        const polygonData: GeoJSON.FeatureCollection = {
            type: "FeatureCollection",
            features: [{ type: "Feature", geometry: { type: "Polygon", coordinates: [polygon] }, properties: {} }],
        };
        const options: shpwrite.ZipOptions = {
            outputType: "blob",
            compression: "STORE",
          };
        const blob = await shpwrite.zip(polygonData, options) as Blob;
        const url = URL.createObjectURL(blob);
        downloadBlob(url, 'zip')
    };
    
      

    const handleDownload = () => {
        if (!fileName.trim() || !format) {
          setError("Please enter a filename and select a format.");
          return;
        }
        setError(""); // Clear errors
        if (format === "geojson") downloadGeoJSON();
        else if (format === "kml") downloadKML();
        else if (format === "zip") downloadZIP();
        else setError("Choose the file format.")
      };

    useEffect(() => {
        setFileName("");
        setFormat("");
        setError("");
    },[isOpen])
 


    return (
        <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <DialogPanel className="bg-maincolor p-6 rounded-md text-center text-white w-[90%] max-w-md">
                <DialogTitle className="text-lg font-bold text-yellow-400">Save Your Polygon</DialogTitle>
                <p className="text-sm my-2 text-xs">Choose which format you would like to receive and your download will begin immediately.</p>
                <br />
                <form className="mt-4 text-sm">
                    <div className="flex space-x-2">
                        <input type="text" placeholder="Filename *" className="input-style w-1/2" value={fileName} onChange={(e) => setFileName(e.target.value)} required />
                    </div>
                    <div className="flex flex-col mb-3">
                        <select
                            className="bg-maincolor text-gray-200 py-2  input-style"
                            required
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                        >
                            <option value="" disabled>Select format</option>
                            <option value="geojson" className='text-gray-200'>GeoJSON</option>
                            <option value="kml" className='text-gray-200'>KML/KMZ</option>
                            <option value="zip" className='text-gray-200'>Shapefile (ZIP)</option>
                        </select>
                    </div>

                </form>
                {error && <p className="text-red-500 text-xs">{error}</p>}

                <div className="flex justify-end mt-4">
                    <button onClick={handleDownload} className="bg-yellow-600 px-3 py-1 rounded-sm">
                        Download
                    </button>
                </div>
            </DialogPanel>
        </Dialog>
    )
}



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
        const rawGeojson = toGeoJSON.kml(kml);
        const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
            type: "FeatureCollection",
            features: rawGeojson.features.filter((feature) : feature is Feature<Geometry, GeoJsonProperties> => feature.geometry !== null),
        };
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
      <DialogPanel className="bg-maincolor p-6 rounded-md text-center text-white w-[90%] max-w-md">
        <DialogTitle className="text-lg font-bold text-yellow-400">Upload Polygon</DialogTitle>
        <p className="text-sm my-2 text-xs">You can define an area by uploading a KML/KMZ, GeoJSON or zipped shapefile.</p>
        <p className="text-sm my-2 text-xs">All files must contain a single polygon.</p>

        <Dropzone onDrop={onDrop} />

        {error && <p className="text-red-400 mt-2 text-xs">{error}</p>}

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-yellow-600 px-3 py-1 rounded-sm">
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

const extractCoordinates = (geojson: FeatureCollection<Geometry, GeoJsonProperties>): [number, number][] => {
    if (!geojson.features || geojson.features.length === 0) return [];
    
    return geojson.features
      .filter((feature) : feature is Feature<Polygon | MultiPolygon, GeoJsonProperties> => feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon")
      .flatMap((feature) =>
        feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates.flat() as [number,number][]
          : feature.geometry.coordinates.flat(2) as [number,number][]
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
  const {config} = useConfig();
    const [mode, setMode] = useState<Mode>(null);
    const [isPolygon, setIsPolygon] = useState<boolean>(false);
    const {polygon, setPolygon} = usePolygon();
    const {map} = useMap();


    useEffect(() => {
        if(polygon.length > 2) {
            setIsPolygon(true);
        } else {
            setIsPolygon(false);
        }

    }, [polygon])
   

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
                        "fill-color": config.defaultAOIColor,
                        "fill-opacity": 0, // Semi-transparent pink fill
                    },
                });
    
                map.addLayer({
                    id: "polygon-border",
                    type: "line",
                    source: "polygon",
                    paint: {
                        "line-color": config.defaultAOIColor,
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
        setPolygon(coords);
        drawPolygon(coords);

    }



  return (
    <div className="flex items-center justify-center gap-1 py-1" >
            {/* Polygon Tool */}
            <div className="relative group">
                <button
                    onClick={() => setMode("upload")}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${mode === "upload" ? 'bg-yellow-600' : 'bg-maincolor'} hover:bg-yellow-500 transition-colors duration-200 shadow-xl`}
                >
                    <Upload color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                        Upload Polygon
                    </span>
                </button>
            </div>

            {/* Rectangle Tool */}
            <div className="relative group">
                <button
                    onClick={() => setMode("download")}
                    disabled={!isPolygon}
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${mode === "download" ? 'bg-yellow-600' : 'bg-maincolor' } ${isPolygon ? "hover:bg-yellow-500 bg-maincolor" : "bg-white"} transition-colors duration-200 shadow-xl`}
                >
                    <Download color="white" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block  text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
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

          <PolygonDownloadModal
              isOpen={mode === "download"}
              onClose={() => setMode(null)}

          />

        </div>
  )
}
