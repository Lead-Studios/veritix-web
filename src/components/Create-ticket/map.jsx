"use client";

import { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

// Fix the default icon issue in Leaflet with Next.js
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  });
};

// Component to handle map events and marker placement
function MapController({ setCoordinates }) {
  const map = useMap();

  // Handle map click events to place marker
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);
    },
  });

  return null;
}

// Component to recenter the map when center prop changes
function ChangeView({ center }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
}

export default function Map({ center, setCoordinates }) {
  const markerRef = useRef(null);

  useEffect(() => {
    fixLeafletIcon();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="map-tiles"
      />
      <Marker
        position={center}
        draggable={true}
        ref={markerRef}
        eventHandlers={{
          dragend: () => {
            const marker = markerRef.current;
            if (marker) {
              const position = marker.getLatLng();
              setCoordinates([position.lat, position.lng]);
            }
          },
        }}
      />
      <ChangeView center={center} />
      <MapController setCoordinates={setCoordinates} />
    </MapContainer>
  );
}
