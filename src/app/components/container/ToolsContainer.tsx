import React, { useState, useEffect, useRef } from 'react';
import { Waypoints, Settings, HardDriveUpload, Images } from 'lucide-react';
import DrawTool from '../widget/DrawPolygon';
import UploadDownloadPolygon from '../widget/UploadDownloadPolygon';
import SettingsTools from '../widget/SettingsTools';
import MeasureTool from '../widget/MeasureTool';
import SatelliteImageCatalog from '../widget/SatelliteImageCatalog';
import ModalPortal from '../widget/ModalPortal';
// import UploadAOIPolygon from '../widget/UploadAOIPolygon';
import { useLanguage } from '../context/LanguageProvider';
import { translations } from '../../translations';

export default function ToolsContainer() {
    const [active, setActive] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const settingsRef = useRef<HTMLDivElement | null>(null); // NEW: Separate ref for modal
    const catalogRef = useRef<HTMLDivElement>(null); // NEW: ref for catalog modal
    const { language } = useLanguage();
    const t = translations[language];


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
                containerRef.current && !containerRef.current.contains(event.target as Node) &&
                settingsRef.current && !settingsRef.current.contains(event.target as Node) &&
                catalogRef.current && !catalogRef.current.contains(event.target as Node) // NEW: Outside catalog modal
            ) {
                setActive(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const Tools = [
        { icon: <Waypoints color="white" className="drawtool" size={22} />, name: 'drawtool', content: <DrawTool /> },
        { icon: <HardDriveUpload color="white" size={22} />, name: 'save', content: <UploadDownloadPolygon /> },
        { icon: <MeasureTool />, name: 'measure' },
        { icon: <Settings color="white" size={22} />, name: 'settings', content: null },
        { icon: <Images color="white" size={22} />, name: 'catalog', content: null, title: 'catalog' },
        // { icon: <UploadAOIPolygon />, name: 'uploadaoi', content: null },
    ];

    // console.log(active)

    return (
        <>
            <div
                ref={containerRef} // Attach ref to container
                className={`flex ${isMobile ? "flex-col fixed right-4 top-1/4 z-10" : "flex-row"} items-center justify-center gap-2 py-1`}
            >
                {Tools.map((obj, idx) => (
                    <div key={idx} className={`relative ${obj.name === 'catalog' ? 'group' : ''}`} onClick={() => handleClick(obj.name)}>
                        {/* Button */}
                        <button
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${active === obj.name ? "bg-secondarycolor" : "hover:bg-greensecondarycolor"
                                } bg-maincolor transition-colors duration-200`}
                        >
                            {obj.icon}
                        </button>

                        {obj.name === 'catalog' && (
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 hidden group-hover:block text-[#262a59] text-xs rounded px-2 py-1 whitespace-nowrap">
                                {t.catalogTooltip}
                            </span>
                        )}

                        {/* Content (Dropdown) */}
                        <div
                            className={`absolute ${isMobile ? "right-full mr-2 top-0" : "left-1/2 -translate-x-1/2 pt-1"
                                } transition-opacity duration-200 ${active === obj.name ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                        >
                            {obj.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="whitespace-nowrap mx-2">
                Upload AOI
            </div> */}
            {/* Separate Settings Modal (Outside Floating Menu) */}
            <div ref={settingsRef}>
                <SettingsTools isOpen={active === 'settings'} onClose={() => setActive(null)} />
            </div>

            {/* Separate Catalog Modal (Outside Floating Menu) */}
            {/* <div ref={catalogRef}>
                {active === 'catalog' && (
                    <div className="fixed inset-0 z-1 flex items-center justify-center bg-black/50">
                        <div className="relative max-w-7xl w-full max-h-[90vh] overflow-auto">
                            <SatelliteImageCatalog onClose={() => setActive(null)} />
                        </div>
                    </div>
                )}
            </div> */}

            {/* Catalog Modal via Portal */}
            <ModalPortal>
                {active === 'catalog' && (
                    <div ref={catalogRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                        <div className="relative max-w-7xl w-full max-h-[90vh] overflow-auto z-[10000]">
                            <SatelliteImageCatalog onClose={() => setActive(null)} />
                        </div>
                    </div>
                )}
            </ModalPortal>

            {/* <UploadAOIPolygon /> */}
        </>
    );
}
