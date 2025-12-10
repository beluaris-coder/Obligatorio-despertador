import { useQuery } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import { useEscenasStore } from "../store/escenasStore";
import SeccionEscenaDash from "./SeccionEscenaDash";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";


const ListadoEscenas = ({ search = "" }) => {
  const { escenas, setEscenas } = useEscenasStore();

  const { isLoading, error } = useQuery({
    queryKey: ["escenas"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/escenas.json`);
      if (!res.ok) throw new Error("Error al cargar escenas");
      const data = await res.json();
      if (!data) return [];
      const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setEscenas(arr);
      return arr;
    },
  });

  const normalizado = search.trim().toLowerCase();

  const escenasFiltradas = normalizado
    ? escenas.filter((escena) => escena.titulo?.toLowerCase().includes(normalizado))
    : escenas;

  const escenasEnEjecucion = escenasFiltradas.filter((e) => e.enEjecucion === true);

  const escenasProximas = escenasFiltradas.filter((e) => {
    const tieneHorarios = Array.isArray(e.diasHorarios) && e.diasHorarios.length > 0;
    return !e.enEjecucion && tieneHorarios;
  });

  const escenasNoEjecutadas = escenasFiltradas.filter((e) => {
    const tieneHorarios = Array.isArray(e.diasHorarios) && e.diasHorarios.length > 0;
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
      {!isLoading && !error && escenas.length > 0 && escenasFiltradas.length === 0 && (
        <Message variant="info" message="No se encontraron escenas que coincidan con la búsqueda" />
      )}

      {!isLoading && !error && escenas.length === 0 && <Message variant="info" message="No hay escenas disponibles, agregá una para comenzar" />}

      {error && <Message variant="error" message={error.message} />}

    </>
  );
};

export default ListadoEscenas;
