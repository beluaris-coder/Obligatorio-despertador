import { API_URL } from "../helpers/constants";
import CardEscena from "./CardEscena";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const search = props.search;

  const {
    data: escenas = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["escenas"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/escenas.json`);
      if (!res.ok) throw new Error("Error al cargar escenas");
      const data = await res.json();
      if (!data) return [];
      return Object.entries(data).map(([id, value]) => ({ id, ...value }));
    },
  });

  const normalizado = search.trim().toLowerCase();

  const escenasFiltradas = normalizado
    ? escenas.filter((escena) =>
        escena.titulo?.toLowerCase().includes(normalizado)
      )
    : escenas;

  // Clasificación
  const escenasEnEjecucion = escenasFiltradas.filter(
    (e) => e.enEjecucion === true
  );

  const escenasProximas = escenasFiltradas.filter((e) => {
    const tieneHorarios =
      Array.isArray(e.diasHorarios) && e.diasHorarios.length > 0;
    return !e.enEjecucion && tieneHorarios;
  });

  const escenasNoEjecutadas = escenasFiltradas.filter((e) => {
    const tieneHorarios =
      Array.isArray(e.diasHorarios) && e.diasHorarios.length > 0;
    return !e.enEjecucion && !tieneHorarios;
  });

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && !error && escenasFiltradas.length > 0 && (
        <div className="flex flex-col gap-6 w-full">
          {/* En ejecución */}
          <section>
            <h2 className="text-sm font-semibold mb-2">
              Escenas en ejecución
            </h2>
            {escenasEnEjecucion.length === 0 ? (
              <p className="text-xs text-gray-500">
                No hay escenas ejecutándose en este momento.
              </p>
            ) : (
              <article className="flex flex-wrap gap-2 w-full">
                {escenasEnEjecucion.map((escena) => (
                  <div key={escena.id}>
                    <CardEscena id={escena.id} titulo={escena.titulo} />
                  </div>
                ))}
              </article>
            )}
          </section>

          {/* Próximas a ejecutarse */}
          <section>
            <h2 className="text-sm font-semibold mb-2">
              Próximas a ejecutarse
            </h2>
            {escenasProximas.length === 0 ? (
              <p className="text-xs text-gray-500">
                No hay escenas programadas para ejecutarse.
              </p>
            ) : (
              <article className="flex flex-wrap gap-2 w-full">
                {escenasProximas.map((escena) => (
                  <div key={escena.id}>
                    <CardEscena id={escena.id} titulo={escena.titulo} />
                  </div>
                ))}
              </article>
            )}
          </section>

          {/* No ejecutadas */}
          <section>
            <h2 className="text-sm font-semibold mb-2">
              Escenas sin programar
            </h2>
            {escenasNoEjecutadas.length === 0 ? (
              <p className="text-xs text-gray-500">
                Todas tus escenas están en ejecución o programadas.
              </p>
            ) : (
              <article className="flex flex-wrap gap-2 w-full">
                {escenasNoEjecutadas.map((escena) => (
                  <div key={escena.id}>
                    <CardEscena id={escena.id} titulo={escena.titulo} />
                  </div>
                ))}
              </article>
            )}
          </section>
        </div>
      )}

      {/* Mensajes de estado */}
      {!isLoading &&
        !error &&
        escenas.length > 0 &&
        escenasFiltradas.length === 0 && (
          <Message
            variant="info"
            message="No se encontraron escenas que coincidan con la búsqueda"
          />
        )}

      {!isLoading && !error && escenas.length === 0 && (
        <Message
          variant="info"
          message="No hay escenas disponibles, agregá una para comenzar"
        />
      )}

      {error && (
        <Message
          variant="error"
          message={error.message || "Error al cargar escenas"}
        />
      )}
    </>
  );
};

export default ListadoEscenas;
