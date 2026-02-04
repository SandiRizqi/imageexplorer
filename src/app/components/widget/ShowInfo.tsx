import React from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ImageItem } from "../types";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

interface ImageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageData: ImageItem | null;
}

const ShowImageInfo: React.FC<ImageDetailModalProps> = ({
  isOpen,
  onClose,
  imageData,
}) => {
  const { language } = useLanguage();
  const t = translations[language];

  if (!imageData) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <DialogPanel className="bg-maincolor rounded-md w-[90%] max-w-md p-4 text-white relative">
        {/* Image Positioned at Top-Right */}
        {/* <div className="absolute top-3 right-3">
                    <Image
                        src={imageData.preview_url || ''}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                </div> */}

        {/* Title */}
        <DialogTitle className="text-lg font-semibold mb-3">
          {imageData.collection_vehicle_short}
        </DialogTitle>

        {/* Key Information */}
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-600 shadow-lg">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-gray-600">
              <tr className="bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300 w-2/5">
                  {t.date}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.collection_date}
                </td>
              </tr>
              <tr className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.time}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.acq_time || "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.resolution.replace(":", "")}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.resolution || "N/A"}
                </td>
              </tr>
              <tr className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.cloudCover.replace(":", "")}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.cloud_cover_percent}%
                </td>
              </tr>
              <tr className="bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.sensorName}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5 break-words">
                  {imageData.satellite ||
                    imageData.collection_vehicle_short ||
                    "N/A"}
                </td>
              </tr>
              <tr className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.imageBandType}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.imageBand || "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.bandCount}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.imageBandCount || "N/A"}
                </td>
              </tr>
              <tr className="hover:bg-gray-700/50 transition-colors">
                <td className="px-3 sm:px-4 py-2.5 font-semibold text-gray-300">
                  {t.sunAzimuth}<span className="ml-auto float-right">:</span>
                </td>
                <td className="px-3 sm:px-4 py-2.5">
                  {imageData.sun_az || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-700 rounded-md hover:bg-red-600 transition px-3 py-1"
          >
            {t.close}
          </button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default ShowImageInfo;
