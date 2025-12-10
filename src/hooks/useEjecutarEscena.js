import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../helpers/constants";
import { useEscenasStore } from "../store/escenasStore";
import { DIAS_SEMANA } from "../helpers/constants";

export const useEjecutarEscena = (escena, id) => {
    const queryClient = useQueryClient();
    const updateEscena = useEscenasStore((s) => s.updateEscena);

    const { mutate: ejecutarEscena, isPending: isExecuting } = useMutation({
        // 👇 recibe "modo", por defecto "manual"
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
            updateEscena(id, {
                historial: data.historialActualizado,
                enEjecucion: true,
            });
            queryClient.invalidateQueries({ queryKey: ["escenas"] });
            queryClient.invalidateQueries({ queryKey: ["escena", id] });
        },
    });

    return { ejecutarEscena, isExecuting };
};
