import React, { useEffect, useState } from 'react';
import { useMap } from './context/MapProvider';
import { usePolygon } from './context/PolygonProvider';
import { MapMouseEvent } from 'maplibre-gl';
import * as turf from "@turf/turf";
import Alert from './Alert';
import { useLanguage } from './context/LanguageProvider';
import { translations } from '../translations';

type MapFooterProps = React.HTMLAttributes<HTMLDivElement>;

const MapFooter: React.FC<MapFooterProps> = (props) => {
    const { map } = useMap();
    const { polygon } = usePolygon();
    const [totalArea, setTotalArea] = useState<number>(0);
    const [cursorCoords, setCursorCoords] = useState<[number, number] | null>(null);
    const [Error, setError] = useState<string | null>(null);
    const { language } = useLanguage();
    const t = translations[language];

    useEffect(() => {
        if (!map) return;

        // Handle mouse move to get cursor coordinates
        const updateCursor = (e: MapMouseEvent) => {
            setCursorCoords([e.lngLat.lng, e.lngLat.lat]);
        };

        map.on("mousemove", updateCursor);
        return () => {
            map.off("mousemove", updateCursor);
        };
    }, [map]);


    useEffect(() => {
        if (polygon.length >= 3) {
            // Check if first and last coordinates are the same (to ensure it's closed)
            const isClosed =
                polygon[0][0] === polygon[polygon.length - 1][0] &&
                polygon[0][1] === polygon[polygon.length - 1][1];

            if (isClosed) {
                // Convert polygon coordinates to Turf format
                const turfPolygon = turf.polygon([polygon]);
                // Calculate the area in square meters
                const area = turf.area(turfPolygon);
                const kmarea = area / 1000000;
                setTotalArea(kmarea);
                if (kmarea > 5000) {
                    setError(t.errorArea);
                }
            }
        } else {
            setTotalArea(0);
        }
    }, [polygon]);

    return (
        <div
            className="absolute bottom-0 right-0 w-full bg-maincolor text-white text-xs px-4 py-1 flex justify-between items-center"
            {...props} // Spread props for flexibility
        >
            <span className='text-gray-300'>V.{process.env.NEXT_PUBLIC_VERSION}</span>
            <div className='flex gap-5'>
                <div>{totalArea.toFixed(2)} km²</div>
                {cursorCoords && `${t.long} : ${cursorCoords[0].toFixed(5)}  ${t.lat}: ${cursorCoords[1].toFixed(5)}`}
            </div>
            {Error && <Alert category={"error"} message={Error} setClose={setError} />}
        </div>
    );
};

export default MapFooter;
