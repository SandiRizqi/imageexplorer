import React, { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useConfig } from "../context/ConfigProvider";

interface AOISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsTools: React.FC<AOISettingsModalProps> = ({ isOpen, onClose }) => {
    const {setConfig} = useConfig();
  const [color, setColor] = useState("#ff0000");
  const [borderWidth, setBorderWidth] = useState(2);

  // Load settings from localStorage when component mounts
  useEffect(() => {
    const savedColor = localStorage.getItem("aoiColor");
    const savedBorderWidth = localStorage.getItem("aoiBorderWidth");

    if (savedColor) setColor(savedColor);
    if (savedBorderWidth) setBorderWidth(Number(savedBorderWidth));
  }, []);

  // Save settings to localStorage
  const handleSave = () => {
    localStorage.setItem("aoiColor", color);
    localStorage.setItem("aoiBorderWidth", borderWidth.toString());
    setConfig(prev => ({...prev, defaultAOIColor: color}));
    onClose();
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <DialogPanel 
        className="bg-maincolor p-6 rounded-md text-center text-white w-[90%] max-w-md"
        onMouseDown={(e) => e.stopPropagation()} 
      >
        <DialogTitle className="text-lg font-bold text-greensecondarycolor">Settings</DialogTitle>
        <p className="text-sm my-2">Customize the appearance of your AOI.</p>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Left Column: Color Setting */}
          <div>
            <label className="block text-xs">AOI Color</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              className="w-full h-10 rounded-md  bg-white cursor-pointer input-style"
            />
          </div>

          {/* Right Column: Border Width Setting */}
          <div>
            <label className="block text-xs">Border Width</label>
            <input 
              type="number" 
              value={borderWidth} 
              min={1} 
              max={10} 
              onChange={(e) => setBorderWidth(Number(e.target.value))} 
              className="w-full p-2 rounded-md text-white input-style"
            />
          </div>
        </div>


        {/* Preview Box */}
        <div className="mt-4 flex justify-center">
          <div 
            className="w-24 h-24 rounded-md" 
            style={{
              backgroundColor: color, 
              border: `${borderWidth}px solid white`
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={handleSave} className="bg-greensecondarycolor px-3 py-1 text-white rounded-sm">Save</button>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default SettingsTools;
