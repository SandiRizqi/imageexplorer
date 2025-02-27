import React, { useState } from 'react';
import { Waypoints, Hand, Save, Ruler, Settings } from 'lucide-react';
import DrawTool from '../widget/DrawPolygon';
import UploadDownloadPolygon from '../widget/UploadDownloadPolygon';


export default function ToolsContainer() {
    const [active, setActive] = useState<string | null>(null);



    const Tools = [
        {
            icon: <Hand color="white" size={22} />,
            name: 'drag',
            content: null
        },
        {
            icon: <Waypoints color="white" size={22} />,
            name: 'drawtool',
            content: <DrawTool />
        },
        {
            icon: <Save color="white" size={22} />,
            name: 'save',
            content: <UploadDownloadPolygon />
        },
        {
            icon: <Ruler color="white" size={22} />,
            name: 'measure',
            content: null
        },
        {
            icon: <Settings color="white" size={22} />,
            name: 'settings',
            content: null
        }
    ];



    return (
        <div className="flex items-center justify-center gap-1 py-1" onMouseLeave={() => setTimeout(() => setActive(null), 500)}>
            {Tools.map((obj, idx) => (
                <div
                    key={idx}
                    className="relative"
                    onClick={() => setActive(obj.name)}
                >
                    {/* Button */}
                    <button className={`flex items-center justify-center w-10 h-10 rounded-full ${active === obj.name ? "bg-gray-500" : "hover:bg-gray-600"} bg-gray-700 transition-colors duration-200`}>
                        {obj.icon}
                    </button>

                    <div
                        className={`absolute left-1/2 -translate-x-1/2 pt-1 transition-opacity duration-200 ${active === obj.name ? "opacity-100 visible" : "opacity-0 invisible"
                            }`}
                    >
                        {obj.content}
                    </div>
                </div>
            ))}
        </div>
    );
}
