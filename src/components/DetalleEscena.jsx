import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import DetallesMedio from "./DetallesMedio";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import IconButton from "./Shared/IconButton";
import HeaderEscena from "./HeaderEscena";

const DetalleEscena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { data: escena, isLoading, error, } = useQuery({
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

  const handleEjecutar = () => {
    alert("Escena ejecutada (demo)");
  };

  const handleEditar = () => {
    navigate(`/escena/${id}/editar`);
  };


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
          Acciones asociadas a dispositivos
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
                  {accion.dispositivo || "Dispositivo sin nombre"}
                </p>
                <p>
                  Acción:{" "}
                  <span className="font-medium">
                    {accion.accion || "Sin acción"}
                  </span>
                </p>
                {accion.detalle && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {accion.detalle}
                  </p>
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
          className="w-full py-2 rounded-full bg-violet-500 text-white text-sm font-semibold"
        >
          Ejecutar escena
        </button>

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
