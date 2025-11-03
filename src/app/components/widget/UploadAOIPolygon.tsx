import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useDropzone } from "react-dropzone";
import JSZip from "jszip";
import * as shapefile from "shapefile";
import { DOMParser } from "@xmldom/xmldom";
import * as toGeoJSON from "@tmcw/togeojson";
import { Geometry, Feature, FeatureCollection, GeoJsonProperties, Polygon, MultiPolygon } from "geojson";
import { usePolygon } from "../context/PolygonProvider";
import { useMap } from "../context/MapProvider";
import { useConfig } from "../context/ConfigProvider";
import { GeoJSONSource } from "maplibre-gl";

const Dropzone: React.FC<{ onDrop: (files: File[]) => void }> = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-500 p-4 flex flex-col items-center cursor-pointer h-[150px] justify-center"
    >
      <input {...getInputProps()} />
      <span className="text-gray-400">Drag and drop or click to upload AOI</span>
    </div>
  );
};

export default function UploadAOIPolygon() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setPolygon } = usePolygon();
  const { map } = useMap();
  const { config } = useConfig();

  const extractCoordinates = (geojson: FeatureCollection<Geometry, GeoJsonProperties>): [number, number][] => {
    if (!geojson.features || geojson.features.length === 0) return [];
    if (geojson.features.length > 1) {
      setError("The file must contain only one polygon.");
      return [];
    }
    return geojson.features
      .filter((feature): feature is Feature<Polygon | MultiPolygon, GeoJsonProperties> =>
        ["Polygon", "MultiPolygon"].includes(feature.geometry.type)
      )
      .flatMap((feature) =>
        feature.geometry.type === "Polygon"
          ? feature.geometry.coordinates.flat() as [number, number][]
          : feature.geometry.coordinates.flat(2) as [number, number][]
      );
  };

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
          "fill-opacity": 0.2,
        },
      });
      map.addLayer({
        id: "polygon-border",
        type: "line",
        source: "polygon",
        paint: {
          "line-color": config.defaultAOIColor,
          "line-width": 3,
        },
      });
    }
  };

  const handleUpload = (coords: [number, number][]) => {
    setPolygon(coords);
    drawPolygon(coords);
    setIsOpen(false);
  };

  const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });

  const parseShapefileZip = async (file: File): Promise<[number, number][]> => {
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

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const fileType = file.name.split(".").pop()?.toLowerCase();

    try {
      let coords: [number, number][] = [];
      if (fileType === "geojson") {
        const text = await file.text();
        coords = extractCoordinates(JSON.parse(text));
      } else if (fileType === "kml" || fileType === "kmz") {
        const text = await readFileAsText(file);
        const kml = new DOMParser().parseFromString(text, "text/xml") as unknown as Document;
        const rawGeojson = toGeoJSON.kml(kml);
        const geojson: FeatureCollection<Geometry, GeoJsonProperties> = {
          type: "FeatureCollection",
          features: rawGeojson.features.filter((f): f is Feature<Geometry, GeoJsonProperties> => f.geometry !== null),
        };
        coords = extractCoordinates(geojson);
      } else if (fileType === "zip") {
        coords = await parseShapefileZip(file);
      } else {
        setError("Unsupported file format.");
      }

      if (coords.length > 0) {
        handleUpload(coords);
        setError(null);
      }
    } catch (err) {
      setError("Error processing file: " + (err as Error).message);
    }
  };

  return (
    <>
      {/* <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-maincolor hover:bg-greenmaincolor transition-colors duration-200 shadow-xl"
      >
        <Upload color="white" />
      </button> */}

      {/* <span className="whitespace-nowrap">UPLOAD AOI</span> */}
        <button
            className="bg-greenmaincolor px-2 py-2 rounded text-gray-800 shadow-md text-sm font-semibold mr-4
                        hover:bg-greensecondarycolor transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap w-full justify-center"
            onClick={() => setIsOpen(true)}
        >
            <Upload size="15"/><span>UPLOAD AOI</span>
        </button>


      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <DialogPanel className="bg-maincolor p-6 rounded-md text-center text-white w-[90%] max-w-md">
          <DialogTitle className="text-lg font-bold text-greensecondarycolor">Upload AOI</DialogTitle>
            <p className="text-sm my-2 text-xs">You can define an area by uploading a KML/KMZ, GeoJSON or zipped shapefile.</p>
            <p className="text-sm my-2 text-xs">All files must contain a single polygon.</p>
          <Dropzone onDrop={onDrop} />
          {error && <p className="text-red-400 mt-2 text-xs">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="bg-gray-600 text-white px-3 py-1 rounded-sm hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
