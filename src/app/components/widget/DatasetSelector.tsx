import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { Folder, ChevronDown, ChevronUp, CheckSquare, Square } from "lucide-react";

interface Dataset {
  name: string;
  checked: boolean;
}

interface DatasetCategory {
  name: string;
  datasets: Dataset[];
}

const datasetCategories: DatasetCategory[] = [
  {
    name: "Maxar-DigitalGlobe",
    datasets: [
      { name: "GeoEye-1 (GE1) - 40cm 4-band", checked: true },
      { name: "IKONOS (IK) - 80cm 4-band", checked: true },
      { name: "Legion (LG) - 30cm 8-band", checked: true },
      { name: "QuickBird (QB) - 60cm 4-band", checked: true },
      { name: "WorldView-1 (WV1) - 50cm Pan", checked: true },
      { name: "WorldView-2 (WV2) - 40cm 8-band", checked: true },
      { name: "WorldView-3 (WV3) - 30cm 8-band", checked: true },
      { name: "WorldView-3 SWIR (WV3_SWIR) - 3.7m 8-band SWIR", checked: false },
      { name: "WorldView-4 (WV4) - 30cm 4-band", checked: true },
    ],
  },
  {
    name: "Maxar-DigitalGlobe",
    datasets: [
      { name: "GeoEye-1 (GE1) - 40cm 4-band", checked: true },
      { name: "IKONOS (IK) - 80cm 4-band", checked: true },
      { name: "Legion (LG) - 30cm 8-band", checked: true },
      { name: "QuickBird (QB) - 60cm 4-band", checked: true },
      { name: "WorldView-1 (WV1) - 50cm Pan", checked: true },
      { name: "WorldView-2 (WV2) - 40cm 8-band", checked: true },
      { name: "WorldView-3 (WV3) - 30cm 8-band", checked: true },
      { name: "WorldView-3 SWIR (WV3_SWIR) - 3.7m 8-band SWIR", checked: false },
      { name: "WorldView-4 (WV4) - 30cm 4-band", checked: true },
    ],
  },{
    name: "Maxar-DigitalGlobe",
    datasets: [
      { name: "GeoEye-1 (GE1) - 40cm 4-band", checked: true },
      { name: "IKONOS (IK) - 80cm 4-band", checked: true },
      { name: "Legion (LG) - 30cm 8-band", checked: true },
      { name: "QuickBird (QB) - 60cm 4-band", checked: true },
      { name: "WorldView-1 (WV1) - 50cm Pan", checked: true },
      { name: "WorldView-2 (WV2) - 40cm 8-band", checked: true },
      { name: "WorldView-3 (WV3) - 30cm 8-band", checked: true },
      { name: "WorldView-3 SWIR (WV3_SWIR) - 3.7m 8-band SWIR", checked: false },
      { name: "WorldView-4 (WV4) - 30cm 4-band", checked: true },
    ],
  },
  {
    name: "Maxar-DigitalGlobe",
    datasets: [
      { name: "GeoEye-1 (GE1) - 40cm 4-band", checked: true },
      { name: "IKONOS (IK) - 80cm 4-band", checked: true },
      { name: "Legion (LG) - 30cm 8-band", checked: true },
      { name: "QuickBird (QB) - 60cm 4-band", checked: true },
      { name: "WorldView-1 (WV1) - 50cm Pan", checked: true },
      { name: "WorldView-2 (WV2) - 40cm 8-band", checked: true },
      { name: "WorldView-3 (WV3) - 30cm 8-band", checked: true },
      { name: "WorldView-3 SWIR (WV3_SWIR) - 3.7m 8-band SWIR", checked: false },
      { name: "WorldView-4 (WV4) - 30cm 4-band", checked: true },
    ],
  },
  {
    name: "Airbus Defense and Space",
    datasets: [
        {name: "Pléiades Neo 3/4 (PNEO) - 30-cm 6-band", checked:true}
    ],
  },
  {
    name: "Planet",
    datasets: [
        {name: "PlanetScope Scene (PS) - 3-m 3, 4 or 8-band", checked: false},
        {name: "RapidEye OrthoTile (REO) - 5-m 5-band", checked: false}
    ],
  },
  {
    name: "BlackSky",
    datasets: [],
  },
];

interface DatasetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatasetSelector({ isOpen, onClose }: DatasetSelectorModalProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedDatasets, setSelectedDatasets] = useState(datasetCategories);

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleDataset = (categoryIndex: number, datasetIndex: number) => {
    const updated = [...selectedDatasets];
    updated[categoryIndex].datasets[datasetIndex].checked = !updated[categoryIndex].datasets[datasetIndex].checked;
    setSelectedDatasets(updated);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <DialogPanel className="bg-gray-900 p-6 rounded-md text-white w-[90%] max-w-3xl max-h-[90%] flex flex-col">
        
        {/* Fixed Title */}
        <div className="sticky top-0 bg-gray-900 pb-4 z-10">
          <DialogTitle className="text-lg font-bold text-yellow-400 text-center">Dataset Selector</DialogTitle>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {selectedDatasets.map((category, categoryIndex) => (
            <div key={category.name} className="bg-gray-800 rounded-md p-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection(category.name)}
              >
                <div className="flex items-center space-x-2">
                  <Folder className="text-yellow-400 w-5 h-5" />
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
                    category.datasets.map((dataset, datasetIndex) => (
                      <div
                        key={dataset.name}
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => toggleDataset(categoryIndex, datasetIndex)}
                      >
                        {dataset.checked ? (
                          <CheckSquare className="text-yellow-400 w-5 h-5" />
                        ) : (
                          <Square className="text-gray-500 w-5 h-5" />
                        )}
                        <span className="text-sm">{dataset.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No datasets available</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-gray-900 pt-4 z-10">
          <div className="flex justify-end">
            <button onClick={onClose} className="bg-gray-600 px-3 py-1">
              Close
            </button>
          </div>
        </div>
        
      </DialogPanel>
    </Dialog>

  );
}
