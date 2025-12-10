import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import { useEjecutarEscena } from "../hooks/useEjecutarEscena";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import Button from "./Shared/Button";
import TextButton from "./Shared/TextButton";
import BloqueHistorial from "./BloqueHistorial";
import BloqueEstado from "./BloqueEstado";
import BloqueTexto from "./BloqueTexto";
import BloqueLista from "./BloqueLista";
import BloqueAcciones from "./BloqueAcciones";

const DetalleEscena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: escena, isLoading, error } = useQuery({
    queryKey: ["escena", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/escenas.json`);
      if (!res.ok) throw new Error("Error al cargar escena");
      const data = await res.json();
      const escenaSeleccionada = data?.[id];

      if (!escenaSeleccionada) {
        throw new Error("Escena no encontrada");
      }
      return { id, ...escenaSeleccionada };
    },
  });

  const nombreEscena = escena?.nombre || escena?.titulo || "Escena sin nombre";
  const descripcion = escena?.descripcion || escena?.body || "Sin descripción";
  const diasHorarios = escena?.diasHorarios || [];
  const acciones = escena?.acciones || [];
  const historial = escena?.historial || [];
  const enEjecucion = escena?.enEjecucion || false;

  // Ejecutar escena: usando hook
  const { ejecutarEscena, isExecuting } = useEjecutarEscena(escena, id);

  //Detener escena
  const { mutate: detenerEscena, isPending: isStopping } = useMutation({
    mutationFn: async () => {
      await fetch(`${API_URL}/escenas/${id}.json`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enEjecucion: false,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escena", id] });
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
    },
  });

  //Eliminar escena
  const { mutate: eliminarEscena, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      await fetch(`${API_URL}/escenas/${id}.json`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
      navigate("/");
    },
  });

  const handleEjecutar = () => ejecutarEscena();
  const handleDetener = () => detenerEscena();
  const handleEditar = () => navigate(`/escena/${id}/editar`);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="error" message={error.message || "Error al cargar la escena"} />;
  


  return (
    <section className="p-4 pb-24 flex flex-col gap-4">

      <header className="flex items-center justify-between">
        <TextButton label="Volver" onClick={() => navigate(-1)} variante="volver" />
        <h1 className="text-lg font-semibold text-center flex-1">{nombreEscena}</h1>
        <span className="w-10" />
      </header>

      <BloqueEstado
        titulo="Estado actual"
        pillLabel={enEjecucion ? "En ejecución" : "Detenida"}
        pillVariante={enEjecucion ? "success" : "neutral"}
      />

      <BloqueTexto titulo="Descripción" texto={descripcion} />

      <BloqueLista
        titulo="Días y horarios programados"
        items={diasHorarios}
        mensaje="No hay horarios definidos."
      />

      <BloqueAcciones acciones={acciones} />
      <BloqueHistorial historial={historial} />

      <article className="mt-2 flex flex-col gap-2">
        {!enEjecucion && (
          <Button variante="primario" onClick={handleEjecutar} disabled={isExecuting} label={isExecuting ? "Ejecutando..." : "Ejecutar escena"}/>
        )}
        {enEjecucion && (
          <Button onClick={handleDetener} disabled={isStopping} label={isStopping ? "Deteniendo..." : "Detener escena"} />
        )}
        <Button label="Editar escena" variante="secundario" onClick={handleEditar} />
        <Button label="Eliminar escena" variante="peligro" onClick={eliminarEscena} disabled={isDeleting} />
      </article>

    </section>
  );
};

export default DetalleEscena;
