import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MdDeleteSweep, MdExpandLess, MdExpandMore } from "react-icons/md";

import { API_URL } from "../helpers/constants";
import BloqueCardConfig from "./BloqueCardConfig";
import Message from "./Shared/Message";
import Button from "./Shared/Button";


const ResetAppConfigSection = () => {
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: resetearApp, isPending, error } = useMutation({
    mutationFn: async () => {
      // Borrar escenas en Firebase
      await fetch(`${API_URL}/escenas.json`, { method: "DELETE" });

      // Limpiar cosas del localStorage relacionadas a escenas / imágenes
      Object.keys(localStorage)
        .filter((k) => k.startsWith("escena_") || k.startsWith("imagenEscena_"))
        .forEach((k) => localStorage.removeItem(k));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
      setMostrarConfirmacion(false);
    },
  });


  return (
    <BloqueCardConfig titulo="Aplicación" defaultAbierto={true}>
      <button type="button" onClick={() => setMostrarConfirmacion((prev) => !prev)} className="w-full flex items-center justify-between py-2">

        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <MdDeleteSweep className="w-4 h-4" />
          </span>
          <div className="text-left">
            <p className="text-sm font-medium text-red-600"> Resetear aplicación</p>
            <p className="text-xs text-gray-500"> Elimina todas las escenas y configuraciones.</p>
          </div>
        </div>

        {mostrarConfirmacion ? (<MdExpandLess className="text-gray-400" />) : (<MdExpandMore className="text-gray-400" />)}
      </button>

      {mostrarConfirmacion && (
        <div className="mt-3 rounded-lg border border-red-100 bg-red-50/40 p-3 flex flex-col gap-2">
          <p className="text-xs text-red-700"> Esta acción eliminará todas tus escenas. No se puede deshacer.</p>
          {error && (
            <Message variant="error" message={error.message || "Ocurrió un error al resetear la app."} />
          )}
          <div className="flex gap-2 mt-1">
            <Button label="Cancelar" type="button" variante="neutro" onClick={() => setMostrarConfirmacion(false)} />
            <Button label={isPending ? "Reseteando..." : "Confirmar reset"} type="button" variante="peligro-solido" disabled={isPending} onClick={() => resetearApp()} />
          </div>
        </div>
      )}
    </BloqueCardConfig>
  );
};

export default ResetAppConfigSection;
