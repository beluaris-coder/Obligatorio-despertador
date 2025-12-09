import { API_URL } from "../helpers/constants";
import SeccionEscenaDash from "./SeccionEscenaDash";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const search = props.search || "";

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

  // Clasificación simple:
  // - enEjecucion === true  -> En ejecución
  // - !enEjecucion && tiene diasHorarios -> Próximas
  // - !enEjecucion && !tiene diasHorarios -> Sin programar (inactivas)
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
          <SeccionEscenaDash
            tituloSeccion="Escenas en ejecución"
            tipoEscena={escenasEnEjecucion}
            mensaje="No hay escenas ejecutándose en este momento."
          />

          <SeccionEscenaDash
            tituloSeccion="Próximas a ejecutarse"
            tipoEscena={escenasProximas}
            mensaje="No hay escenas programadas para ejecutarse."
          />

          <SeccionEscenaDash
            tituloSeccion="Escenas sin programar"
            tipoEscena={escenasNoEjecutadas}
            mensaje="Todas tus escenas están en ejecución o programadas."
          />
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
