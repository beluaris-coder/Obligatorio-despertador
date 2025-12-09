import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";

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

  // 👉 Ejecutar escena: agrega al historial + marca enEjecucion = true
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

  // 👉 Detener escena: solo enEjecucion = false
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
      {/* Header: título + volver */}
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-violet-500 font-medium"
        >
          ← Volver
        </button>
        <h1 className="text-lg font-semibold text-center flex-1">
          {nombreEscena}
        </h1>
        <span className="w-10" /> {/* para equilibrar el flex */}
      </header>

      {/* Estado actual */}
      <section className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between">
        <span className="text-xs text-gray-600">Estado actual</span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            enEjecucion
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {enEjecucion ? "En ejecución" : "Detenida"}
        </span>
      </section>

      {/* Descripción */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-1">Descripción</h2>
        <p className="text-sm text-gray-700">{descripcion}</p>
      </section>

      {/* Días y horarios programados */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-2">
          Días y horarios programados
        </h2>
        {diasHorarios.length === 0 ? (
          <p className="text-sm text-gray-500">No hay horarios definidos.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1">
            {diasHorarios.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        )}
      </section>

      {/* Listado de acciones */}
      <section className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-2">
          Acciones asociadas al cubito
        </h2>
        {acciones.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay acciones configuradas para esta escena.
          </p>
        ) : (
          <ul className="space-y-2">
            {acciones.map((accion, index) => (
              <li
                key={index}
                className="text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2"
              >
                <p className="font-medium">
                  {capitalizar(accion.funcionalidad) ||
                    "Funcionalidad sin nombre"}
                </p>

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
          <p className="text-sm text-gray-500">
            Esta escena aún no se ha ejecutado.
          </p>
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
                <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700 capitalize">
                  {item.modo || "manual"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Botones de acción */}
      <section className="mt-2 flex flex-col gap-2">
        <button
          onClick={handleEjecutar}
          disabled={isExecuting || enEjecucion}
          className="w-full py-2 rounded-full bg-violet-500 text-white text-sm font-semibold disabled:opacity-60"
        >
          {isExecuting
            ? "Ejecutando..."
            : enEjecucion
            ? "Ya está en ejecución"
            : "Ejecutar escena"}
        </button>

        {enEjecucion && (
          <button
            onClick={handleDetener}
            disabled={isStopping}
            className="w-full py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold disabled:opacity-60"
          >
            {isStopping ? "Deteniendo..." : "Detener escena"}
          </button>
        )}

        <button
          onClick={handleEditar}
          className="w-full py-2 rounded-full border border-violet-200 text-violet-600 text-sm font-semibold"
        >
          Editar escena
        </button>

        <button
          onClick={() => eliminarEscena()}
          disabled={isDeleting}
          className="w-full py-2 rounded-full bg-red-50 text-red-600 text-sm font-semibold disabled:opacity-50"
        >
          Eliminar escena
        </button>
      </section>
    </section>
  );
};

export default DetalleEscena;
