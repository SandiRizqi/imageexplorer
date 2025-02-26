import React from 'react';
import { useState, useEffect } from 'react';
import { ScatterplotLayer } from "@deck.gl/layers";
import MapInstance from '../app/components/MapInstance';
import Sidebar from '../app/components/sidebar/Sidebar';
import AuthModal from '../app/components/auth/AuthModal';
import { MapProvider } from '../app/components/context/MapProvider';
import DeckGLOverlay from '../app/components/DeckGLOverlay';
import DrawPolygon from '../app/components/DrawPolygon';
import { Menu } from 'lucide-react';



export default function MapPage() {
    const [menuOpen, setMenuOpen] = useState(false);
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
                data: [{ position: [106.8456, -6.2088], size: 100 }],
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
            <MapProvider>
                <div className="relative w-screen h-screen">
                    {/* Sidebar */}
                    <Sidebar isMobile={isMobile} menuOpen={menuOpen} />
                    {/* Navbar */}
                    <div
                        className={`absolute top-0 left-0 bg-gray-800 text-white flex items-center justify-between z-10 transition-all duration-300 pr-2 shadow-lg`} // Added shadow-lg
                        style={{
                            width: menuOpen && !isMobile ? "calc(100% - 400px)" : "100%",
                            marginLeft: menuOpen && !isMobile ? "400px" : "0",
                        }}
                    >
                        {/* Toggle Button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white px-4  focus:outline-none "
                        >
                            <Menu/>
                        </button>

                        <DrawPolygon />

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
                            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                            mapView={mapView}
                        />
                        <DeckGLOverlay {...deckProps} />
                    </div>
                </div>
            </MapProvider>

        </div>
    )
}
