import React, { useState } from "react";
import { usePolygon } from "../context/PolygonProvider";
import { useConfig } from "../context/ConfigProvider";
import { saveConfig } from "../Tools";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { getSession } from "next-auth/react";

export default function SaveConfigButton() {
  const { polygon } = usePolygon();
  const { config, filters, imageResult, selectedItem } = useConfig();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [configID, setConfigID] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleSaveConfig = async () => {
    setError(null);
    setConfigID(null);
    setCopied(false);
    setLoading(true); // Start loading

    const session = await getSession();

    const configData = {
      userData: session?.user,
      filter: filters,
      polygon: polygon,
      results: imageResult,
      selected: selectedItem,
    };

    try {
      const savedConfigID = await saveConfig(
        configData,
        setError,
        config.configID
      );
      if (savedConfigID) {
        setConfigID(savedConfigID);
      }
    } catch {
      setError("Failed to save configuration.");
    }

    setLoading(false); // Stop loading
    setModalOpen(true); // Show modal whether success or error
  };

  const handleCopy = () => {
    if (configID) {
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    }
  };

  return (
    <>
      <button
        className="flex-1 bg-greenmaincolor text-gray-900 py-2 px-2 rounded-md text-sm font-semibold 
                        hover:bg-greensecondarycolor disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        onClick={handleSaveConfig}
        disabled={selectedItem.length <= 0 || loading}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 text-gray-900 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0H4z"
            ></path>
          </svg>
        ) : (
          "SAVE"
        )}
      </button>

      {/* Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <DialogPanel className="bg-maincolor text-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            <DialogTitle className="text-lg font-semibold text-greenmaincolor text-center">
              {error ? "Error" : "Configuration Saved"}
            </DialogTitle>

            <p className="mt-4 text-sm text-center">
              {error ? error : `Your configuration has been saved!`}
            </p>

            {configID && (
              <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-md mt-4">
                <span className="text-sm text-gray-300 truncate">{`${process.env.NEXT_PUBLIC_HOST}/?savedconfig=${configID}`}</span>
                <button
                  className="bg-greenmaincolor text-gray-800 px-3 py-1 text-xs rounded-md shadow-md hover:bg-greensecondarycolor"
                  onClick={handleCopy}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}

            <button
              className="w-full bg-greenmaincolor text-gray-800 py-2 mt-4 rounded-md shadow-md hover:bg-greensecondarycolor"
              onClick={() => setModalOpen(false)}
            >
              OK
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
