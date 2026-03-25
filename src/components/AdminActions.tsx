"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface RouteActionProps {
  routeId: string;
  currentStatus: string;
}

export function RouteActions({ routeId, currentStatus }: RouteActionProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    await fetch("/api/admin/routes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeIds: [routeId], status }),
    });
    router.refresh();
    setLoading(false);
  };

  if (loading) {
    return <span className="text-xs text-gray-400">Actualizando...</span>;
  }

  return (
    <div className="flex gap-1.5">
      {currentStatus === "active" && (
        <button onClick={() => updateStatus("archived")}
          className="text-xs px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 font-medium transition-colors">
          Archivar
        </button>
      )}
      {currentStatus === "archived" && (
        <button onClick={() => updateStatus("active")}
          className="text-xs px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 font-medium transition-colors">
          Restaurar
        </button>
      )}
      {currentStatus === "matched" && (
        <button onClick={() => updateStatus("active")}
          className="text-xs px-2.5 py-1 bg-orange-100 text-orange-800 rounded-md hover:bg-orange-200 font-medium transition-colors">
          Deshacer match
        </button>
      )}
    </div>
  );
}

interface MatchActionsProps {
  routeAId: string;
  routeBId: string;
}

export function MatchActions({ routeAId, routeBId }: MatchActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markMatched = async () => {
    setLoading(true);
    await fetch("/api/admin/routes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ routeIds: [routeAId, routeBId], status: "matched" }),
    });
    router.refresh();
    setLoading(false);
  };

  if (loading) {
    return <span className="text-xs text-gray-400">Actualizando...</span>;
  }

  return (
    <button onClick={markMatched}
      className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors">
      Confirmar Match
    </button>
  );
}
