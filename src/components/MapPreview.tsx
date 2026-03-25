"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix Leaflet default marker icons in Next.js
const originIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPreviewProps {
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}

function FitBounds({
  originLat,
  originLng,
  destinationLat,
  destinationLng,
}: MapPreviewProps) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];
    if (originLat && originLng) points.push([originLat, originLng]);
    if (destinationLat && destinationLng)
      points.push([destinationLat, destinationLng]);

    if (points.length === 2) {
      map.fitBounds(points, { padding: [50, 50] });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [map, originLat, originLng, destinationLat, destinationLng]);

  return null;
}

export default function MapPreview({
  originLat,
  originLng,
  destinationLat,
  destinationLng,
}: MapPreviewProps) {
  // Default center: Santiago, Chile
  const center: [number, number] = [
    originLat || -33.45,
    originLng || -70.65,
  ];

  return (
    <MapContainer
      center={center}
      zoom={11}
      className="h-64 w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds
        originLat={originLat}
        originLng={originLng}
        destinationLat={destinationLat}
        destinationLng={destinationLng}
      />
      {originLat && originLng && (
        <Marker position={[originLat, originLng]} icon={originIcon}>
          <Popup>Origen</Popup>
        </Marker>
      )}
      {destinationLat && destinationLng && (
        <Marker
          position={[destinationLat, destinationLng]}
          icon={destinationIcon}
        >
          <Popup>Destino</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
