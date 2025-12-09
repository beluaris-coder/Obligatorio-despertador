import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import Button from "./Shared/Button";
import BackButton from "./Shared/BackButton";
import Pill from "./Shared/Pill";
import BloqueEstado from "./BloqueEstado";
import BloqueTexto from "./BloqueTexto";
import BloqueLista from "./BloqueLista";

const DetalleEscena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: escena,
    isLoading,
    error,
  } = useQuery({
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
  const descripcion =
    escena?.descripcion || escena?.body || "Sin descripción";
  const diasHorarios = escena?.diasHorarios || [];
  const acciones = escena?.acciones || [];
  const historial = escena?.historial || [];
  const enEjecucion = escena?.enEjecucion || false;

  // Ejecutar escena: agrega al historial + marca enEjecucion = true
  const { mutate: ejecutarEscena, isPending: isExecuting } = useMutation({
    mutationFn: async () => {
      const ahora = new Date();

      const fecha = ahora.toLocaleString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const dia = ahora.toLocaleString("es-UY", {
        weekday: "long",
      });

      const nuevoRegistro = {
        fecha,
        dia,
        modo: "manual",
      };

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

  // Detener escena: solo enEjecucion = false
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

  const handleEjecutar = () => {
    ejecutarEscena();
  };

  const handleDetener = () => {
    detenerEscena();
  };

  const handleEditar = () => {
    navigate(`/escena/${id}/editar`);
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="p-4">
        <Message
          variant="error"
          message={error.message || "Error al cargar la escena"}
        />
      </div>
    );
  }

  const capitalizar = (texto) =>
    texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;




  return (
    <section className="p-4 pb-24 flex flex-col gap-4">

      <header className="flex items-center justify-between">
        <BackButton label="Volver" onClick={() => navigate(-1)} />
        <h1 className="text-lg font-semibold text-center flex-1">{nombreEscena}</h1>
        <span className="w-10" />
      </header>

      <BloqueEstado
        titulo="Estado actual"
        pillLabel={enEjecucion ? "En ejecución" : "Detenida"}
        pillVariante={enEjecucion ? "success" : "neutral"}
      />

      <BloqueTexto
        titulo="Descripción"
        texto={descripcion}
      />

      <BloqueLista
        titulo="Días y horarios programados"
        items={diasHorarios}
        mensaje="No hay horarios definidos."
      />

      {/* Listado de acciones */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-2"> Acciones asociadas al cubito </h2>
        {acciones.length === 0 ? (
          <p className="text-sm text-gray-500"> No hay acciones configuradas para esta escena. </p>
        ) : (
          <ul className="space-y-2">
            {acciones.map((accion, index) => (
              <li key={index} className="text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2">
                <p className="font-medium">{capitalizar(accion.funcionalidad)}</p>

                {accion.parametros &&
                  Object.keys(accion.parametros).length > 0 ? (
                  <ul className="mt-1 text-xs text-gray-600">
                    {Object.entries(accion.parametros).map(
                      ([param, valor]) => (
                        <li key={param}>
                          <strong>{capitalizar(param)}:</strong> {valor}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-xs text-gray-400">Sin parámetros</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historial de ejecución */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-2">Historial de ejecución</h2>
        {historial.length === 0 ? (
          <p className="text-sm text-gray-500"> Esta escena aún no se ha ejecutado.</p>
        ) : (
          <ul className="text-sm text-gray-700 divide-y divide-gray-100">
            {historial.map((item, index) => (
              <li key={index} className="py-2 flex justify-between">
                <div>
                  <p className="font-medium">{item.fecha}</p>
                  {item.dia && (
                    <p className="text-xs text-gray-500">{item.dia}</p>
                  )}
                </div>
                <Pill label={item.modo} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Botones de acción */}
      <section className="mt-2 flex flex-col gap-2">
        <Button variante="primario" onClick={handleEjecutar} disabled={isExecuting || enEjecucion}
          label={isExecuting ? "Ejecutando..." : enEjecucion ? "Ya está en ejecución" : "Ejecutar escena"} />

        {enEjecucion && (
          <Button onClick={handleDetener} disabled={isStopping} label={isStopping ? "Deteniendo..." : "Detener escena"} />
        )}

        <Button label="Editar escena" variante="secundario" onClick={handleEditar} />
        <Button label="Eliminar escena" variante="peligro" onClick={eliminarEscena} disabled={isDeleting} />
      </section>
    </section>
  );
};

export default DetalleEscena;
