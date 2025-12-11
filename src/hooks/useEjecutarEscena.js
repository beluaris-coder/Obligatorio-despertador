// useEjecutarEscena.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL, DIAS_SEMANA } from "../helpers/constants";
import { useEscenasStore } from "../store/escenasStore";

export const useEjecutarEscena = (escena, id) => {
  const queryClient = useQueryClient();
  const updateEscena = useEscenasStore((s) => s.updateEscena);

  const { mutate: ejecutarEscena, isPending: isExecuting } = useMutation({
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

      const historialActual = Array.isArray(escena?.historial)
        ? escena.historial
        : [];
      const historialActualizado = [...historialActual, nuevoRegistro];

      await fetch(`${API_URL}/escenas/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          historial: historialActualizado,
          enEjecucion: true,
        }),
      });

      return { historialActualizado };
    },
    onSuccess: (data) => {
      // marcar en ejecución localmente
      updateEscena(id, {
        historial: data.historialActualizado,
        enEjecucion: true,
      });
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
      queryClient.invalidateQueries({ queryKey: ["escena", id] });

      // ⬇️ AUTO-APAGADO SEGÚN DURACIÓN (en minutos)
      const duracionMinutos = Number(escena?.duracion) || 0;

      // Si es 0 → solo se detiene manualmente
      if (duracionMinutos <= 0) return;

      const ms = duracionMinutos * 60 * 1000;

      setTimeout(async () => {
        try {
          await fetch(`${API_URL}/escenas/${id}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ enEjecucion: false }),
          });

          updateEscena(id, { enEjecucion: false });
          queryClient.invalidateQueries({ queryKey: ["escenas"] });
          queryClient.invalidateQueries({ queryKey: ["escena", id] });
        } catch (err) {
          console.error("Error al auto-detener escena (manual):", err);
        }
      }, ms);
    },
  });

  return { ejecutarEscena, isExecuting };
};
