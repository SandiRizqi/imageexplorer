'use client'
import React from 'react';
import { useState, useEffect, Suspense } from 'react';
// import { ScatterplotLayer } from "@deck.gl/layers";
import MapInstance from '../app/components/MapInstance';
import Sidebar from '../app/components/sidebar/Sidebar';
import AuthModal from '../app/components/auth/AuthModal';
import LoadingScreen from '../app/components/LoadingScreen';
import { ConfigProvider } from '../app/components/context/ConfigProvider';
import { MapProvider } from '../app/components/context/MapProvider';
import { PolygonProvider } from '../app/components/context/PolygonProvider';
// import DeckGLOverlay from '../app/components/DeckGLOverlay';
import ToolsContainer from '../app/components/container/ToolsContainer';
import MapFooter from '../app/components/MapFooter';
import { Menu } from 'lucide-react';
// import logo from '../app/components/assets/SIE.png';
// import Image from 'next/image';
import BasemapSwitcher from '../app/components/widget/BasemapSwitcher';
import Cart from '../app/components/widget/Cart';
import SearchLocation from '../app/components/widget/SeachLocation';
import DashboardSwitcher from './components/widget/DashboardSwitcher';
import WelcomePopup from './components/WelcomePopup';





const mapView = {
    center: [106.8456, -6.2088] as [number, number], // Jakarta
    zoom: 10,
    pitch: 0,
    bearing: 0,
};



export default function MapPage() {
    const [menuOpen, setMenuOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);


    

    // const deckProps = {
    //     layers: [
    //         new ScatterplotLayer({
    //             id: "scatterplot-layer",
    //             data: [{ position: [106.8456, -6.2088], size: 0 }],
    //             getPosition: (d) => d.position,
    //             getRadius: (d) => d.size,
    //             getFillColor: [255, 0, 0, 255],
    //         }),
    //     ],
    // };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile if width ≤ 768px
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <Suspense fallback={<LoadingScreen />}>
            <WelcomePopup />
            
            <ConfigProvider>
                <MapProvider>
                    <PolygonProvider>
                        <div className="relative w-screen h-screen">
                            {/* Sidebar */}
                            <Sidebar isMobile={isMobile} menuOpen={menuOpen} onClose={() => setMenuOpen(false)}/>
                            {/* Navbar */}
                            <div
                                className={`absolute top-0 left-0 bg-maincolor h-[50px] text-white flex items-center justify-between z-10 transition-all duration-300 pr-2 shadow-xl`} // Added shadow-lg
                                style={{
                                    width: isMobile ? "100%" : menuOpen ? "calc(100% - 400px)" : "100%",
                                    marginLeft: isMobile ? "0" : menuOpen ? "400px" : "0",
                                }}
                            >
                                <div className='flex flex-row items-center pl-4'>
                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => setMenuOpen(!menuOpen)}
                                        className="text-white focus:outline-none mr-4"
                                    >
                                        <Menu />
                                    </button>
                                    <DashboardSwitcher />
                                    {!isMobile && <SearchLocation />}
                                    <ToolsContainer />
                                </div>



                                {/* Login/Signup Button */}
                                <div className="flex items-center gap-4">
                                    <Cart isMobile={isMobile} />
                                    <AuthModal />
                                </div>
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
                                    mapStyle="https://api.maptiler.com/maps/streets/style.json?key=whs17VUkPAj2svtEn9LL"
                                    mapView={mapView}
                                />
                                {/* <DeckGLOverlay {...deckProps} /> */}
                                <BasemapSwitcher />
                                <MapFooter style={{
                                    width: menuOpen && !isMobile ? "calc(100% - 400px)" : "100%",
                                    marginLeft: menuOpen && !isMobile ? "400px" : "0",
                                }} />
                            </div>
                        </div>
                    </PolygonProvider>
                </MapProvider>
            </ConfigProvider>
           
        </Suspense>
    )
}
