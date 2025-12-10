import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../helpers/constants";

export const useEjecutarEscena = (escena, id) => {
  const queryClient = useQueryClient();

  const {
    mutate: ejecutarEscena,
    isPending: isExecuting,
  } = useMutation({
    mutationFn: async () => {
      const ahora = new Date();

      const fecha = ahora.toLocaleString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const dia = ahora.toLocaleString("es-UY", { weekday: "long" });

      const nuevoRegistro = { fecha, dia, modo: "manual" };

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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escena", id] });
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
    },
  });

  return { ejecutarEscena, isExecuting };
};
