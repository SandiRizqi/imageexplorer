import React from 'react';
import { useState, useEffect } from 'react';
import { ScatterplotLayer } from "@deck.gl/layers";
import MapInstance from '../app/components/MapInstance';
import Sidebar from '../app/components/sidebar/Sidebar';
import AuthModal from '../app/components/auth/AuthModal';
import { ConfigProvider } from '../app/components/context/ConfigProvider';
import { MapProvider } from '../app/components/context/MapProvider';
import { PolygonProvider } from '../app/components/context/PolygonProvider';
import DeckGLOverlay from '../app/components/DeckGLOverlay';
import ToolsContainer from '../app/components/container/ToolsContainer';
import MapFooter from '../app/components/MapFooter';
import { Menu } from 'lucide-react';
import logo from '../app/components/assets/logo_ie.webp';
import Image from 'next/image';



export default function MapPage() {
    const [menuOpen, setMenuOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    const mapView = {
        center: [106.8456, -6.2088] as [number, number], // Jakarta
        zoom: 10,
        pitch: 0,
        bearing: 0,
    };

    const deckProps = {
        layers: [
            new ScatterplotLayer({
                id: "scatterplot-layer",
                data: [{ position: [106.8456, -6.2088], size: 0 }],
                getPosition: (d) => d.position,
                getRadius: (d) => d.size,
                getFillColor: [255, 0, 0, 255],
            }),
        ],
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile if width ≤ 768px
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <div>
            <ConfigProvider>
                <MapProvider>
                    <PolygonProvider>
                        <div className="relative w-screen h-screen">
                            {/* Sidebar */}
                            <Sidebar isMobile={isMobile} menuOpen={menuOpen} />
                            {/* Navbar */}
                            <div
                                className={`absolute top-0 left-0 bg-[#262a59] h-[50px] text-white flex items-center justify-between z-10 transition-all duration-300 pr-2 shadow-xl`} // Added shadow-lg
                                style={{
                                    width: menuOpen && !isMobile ? "calc(100% - 400px)" : "100%",
                                    marginLeft: menuOpen && !isMobile ? "400px" : "0",
                                }}
                            >
                                <div className='flex flex-row items-center pl-4'>
                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="text-white focus:outline-none mr-8"
                                    >
                                        <Menu />
                                    </button>
                                    <Image src={logo} alt="Logo" width={50} height={50} className='mr-8' />
                                    <ToolsContainer />
                                </div>



                                {/* Login/Signup Button */}
                                <AuthModal />
                            </div>

                            {/* Map Container */}
                            <div
                                className={`transition-all duration-300 h-screen`}
                                style={{
                                    width: menuOpen && !isMobile ? "calc(100% - 400px)" : "100%",
                                    marginLeft: menuOpen && isMobile ? "0" : menuOpen ? "400px" : "0",
                                }}
                            >
                                <MapInstance
                                    id="map"
                                    mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                                    mapView={mapView}
                                />
                                <DeckGLOverlay {...deckProps} />
                                <MapFooter style={{
                                    width: menuOpen && !isMobile ? "calc(100% - 400px)" : "100%",
                                    marginLeft: menuOpen && !isMobile ? "400px" : "0",
                                }} />
                            </div>
                        </div>
                    </PolygonProvider>
                </MapProvider>
            </ConfigProvider>
        </div>
    )
}
