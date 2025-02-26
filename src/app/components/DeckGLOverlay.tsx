"use client";

import { useEffect, useRef } from "react";
import { useMap } from "./context/MapProvider";
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox";
import type { IControl } from "maplibre-gl";

const DeckGLOverlay: React.FC<MapboxOverlayProps> = (props) => {
  const { map } = useMap();
  const overlayRef = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    if (!map) return;

    // Remove existing overlay before adding a new one
    if (overlayRef.current) {
      map.removeControl(overlayRef.current as unknown as IControl);
    }

    // Create and add overlay
    const overlay = new MapboxOverlay(props);
    map.addControl(overlay as unknown as IControl);
    overlayRef.current = overlay;

    return () => {
      if (overlayRef.current) {
        map.removeControl(overlayRef.current as unknown as IControl);
      }
    };
  }, [map, props]);

  return null;
};

export default DeckGLOverlay;
