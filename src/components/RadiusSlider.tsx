"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RadiusSlider({ currentRadius }: { currentRadius: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(currentRadius);

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("radius", String(value));
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-4 bg-white border rounded-xl px-5 py-3">
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Radio de match:
      </label>
      <input
        type="range"
        min={1}
        max={50}
        step={1}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="flex-1 accent-blue-600"
      />
      <span className="text-sm font-bold text-blue-600 w-16 text-right">{value} km</span>
      {value !== currentRadius && (
        <button
          onClick={apply}
          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Aplicar
        </button>
      )}
    </div>
  );
}
