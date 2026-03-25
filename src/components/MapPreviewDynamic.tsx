"use client";

import dynamic from "next/dynamic";

const MapPreview = dynamic(() => import("./MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
      Cargando mapa...
    </div>
  ),
});

export default MapPreview;
