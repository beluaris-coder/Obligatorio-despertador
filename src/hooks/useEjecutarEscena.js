import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL, DIAS_SEMANA } from "../helpers/constants";
import { useEscenasStore } from "../store/escenasStore";

//Hook para ejecutar y detener escenas
 
let stopsProgramados = {};

export const useEjecutarEscena = (escena, id) => {
  const queryClient = useQueryClient();
  const updateEscena = useEscenasStore((s) => s.updateEscena);

  // detener remotamente una escena
  const stopRemoto = async (escenaId = id) => {
    if (!escenaId) return;
    try {
      await fetch(`${API_URL}/escenas/${escenaId}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enEjecucion: false, ejecucionHasta: null }),
      });
    } catch (err) {
      console.error("stopRemoto error:", err);
    }

    // actualizar store localmente y limpiar timeout si existe
    try {
      updateEscena(escenaId, { enEjecucion: false, ejecucionHasta: null });
    } catch (e) {}

    if (stopsProgramados[escenaId]) {
      clearTimeout(stopsProgramados[escenaId]);
      delete stopsProgramados[escenaId];
    }
    queryClient.invalidateQueries({ queryKey: ["escenas"] });
    queryClient.invalidateQueries({ queryKey: ["escena", escenaId] });
  };

  const scheduleStopLocal = (escenaId, duracionMinutos, ejecucionHastaTs = null) => {
    if (!escenaId) return;
    if (stopsProgramados[escenaId]) {
      clearTimeout(stopsProgramados[escenaId]);
      delete stopsProgramados[escenaId];
    }
    if (!duracionMinutos || duracionMinutos <= 0) return;

    // si nos pasó un timestamp, calcule remaining
    const ms = ejecucionHastaTs ? Math.max(0, ejecucionHastaTs - Date.now()) : duracionMinutos * 60 * 1000;
    if (ms <= 0) {
      // ya venció -> detener ahora
      stopRemoto(escenaId).catch(() => {});
      return;
    }

    stopsProgramados[escenaId] = setTimeout(() => {
      stopRemoto(escenaId).catch(() => {});
    }, ms);
  };

  // mutation para ejecutar
  const mutation = useMutation({
    mutationFn: async (modo = "manual") => {
      const ahora = new Date();
      const fecha = ahora.toLocaleString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      const dia = DIAS_SEMANA[ahora.getDay()];
      const nuevoRegistro = { fecha, dia, modo };

      const historialActual = Array.isArray(escena?.historial) ? escena.historial : [];
      const historialActualizado = [...historialActual, nuevoRegistro];

      const duracionMinutos = Number.isFinite(+escena?.duracion) ? Number(escena.duracion) : 0;
      const ejecucionHasta = duracionMinutos > 0 ? Date.now() + duracionMinutos * 60 * 1000 : null;

      await fetch(`${API_URL}/escenas/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          historial: historialActualizado,
          enEjecucion: true,
          ejecucionHasta,
        }),
      });

      return { historialActualizado, ejecucionHasta, duracionMinutos };
    },
    onSuccess: (data) => {
      updateEscena(id, {
        historial: data.historialActualizado,
        enEjecucion: true,
        ejecucionHasta: data.ejecucionHasta,
      });

      if ((data.duracionMinutos || 0) > 0) {
        scheduleStopLocal(id, data.duracionMinutos, data.ejecucionHasta);
      }

      queryClient.invalidateQueries({ queryKey: ["escenas"] });
      queryClient.invalidateQueries({ queryKey: ["escena", id] });
    },
  });

  const ejecutarEscena = (modo = "manual") => mutation.mutate(modo);
  const isExecuting = mutation.isLoading;

  // alias por compatibilidad
  const stopRemote = stopRemoto;

  return { ejecutarEscena, isExecuting, stopRemoto, stopRemote, scheduleStopLocal };
};
