import React, { useState, useEffect, useRef } from 'react';
import { Waypoints, Save, Ruler, Settings } from 'lucide-react';
import DrawTool from '../widget/DrawPolygon';
import UploadDownloadPolygon from '../widget/UploadDownloadPolygon';
import SettingsTools from '../widget/SettingsTools';
import MeasureTool from '../widget/MeasureTool';

export default function ToolsContainer() {
    const [active, setActive] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const settingsRef = useRef<HTMLDivElement | null>(null); // NEW: Separate ref for modal

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 937);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    function handleClick(name: string) {
        setActive(active === name ? null : name);
    }

    // Close menu when clicking outside (but NOT when clicking inside the modal)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current && !containerRef.current.contains(event.target as Node) && // Outside tools
                settingsRef.current && !settingsRef.current.contains(event.target as Node) // Outside settings modal
            ) {
                setActive(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const Tools = [
        { icon: <Waypoints color="white" className="drawtool" size={22} />, name: 'drawtool', content: <DrawTool /> },
        { icon: <Save color="white" size={22} />, name: 'save', content: <UploadDownloadPolygon /> },
        { icon: <Ruler color="white" size={22} />, name: 'measure', content: <MeasureTool /> },
        { icon: <Settings color="white" size={22} />, name: 'settings', content: null },
    ];

    // console.log(active)

    return (
        <>
            <div
                ref={containerRef} // Attach ref to container
                className={`flex ${isMobile ? "flex-col fixed right-4 top-1/4 z-10" : "flex-row"} items-center justify-center gap-2 py-1`}
            >
                {Tools.map((obj, idx) => (
                    <div key={idx} className={`relative`} onClick={() => handleClick(obj.name)}>
                        {/* Button */}
                        <button
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                active === obj.name ? "bg-secondarycolor" : "hover:bg-greensecondarycolor"
                            } bg-maincolor transition-colors duration-200`}
                        >
                            {obj.icon}
                        </button>

                        {/* Content (Dropdown) */}
                        <div
                            className={`absolute ${
                                isMobile ? "right-full mr-2 top-0" : "left-1/2 -translate-x-1/2 pt-1"
                            } transition-opacity duration-200 ${
                                active === obj.name ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                        >
                            {obj.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Separate Settings Modal (Outside Floating Menu) */}
            <div ref={settingsRef}>
                <SettingsTools isOpen={active === 'settings'} onClose={() => setActive(null)} />
            </div>
        </>
    );
}
