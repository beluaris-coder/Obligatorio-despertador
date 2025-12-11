import { useQuery } from "@tanstack/react-query";

import { API_URL, DIAS_SEMANA } from "../helpers/constants";
import { useEscenasStore } from "../store/escenasStore";
import SeccionEscenaDash from "./SeccionEscenaDash";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";

const minutosHastaProximaEjecucion = (escena) => {
  if (!Array.isArray(escena.diasHorarios) || escena.diasHorarios.length === 0) {
    return null;
  }

  const ahora = new Date();
  const diaActual = ahora.getDay();

  let mejorDiff = null; 

  for (const linea of escena.diasHorarios) {
    if (!linea) continue;

    const [diaTexto, horaTexto] = linea.split(" ");
    if (!diaTexto || !horaTexto) continue;

    const idxDia = DIAS_SEMANA.indexOf(diaTexto);
    if (idxDia === -1) continue;

    const [hhStr, mmStr] = horaTexto.split(":");
    const hh = Number(hhStr);
    const mm = Number(mmStr);
    if (Number.isNaN(hh) || Number.isNaN(mm)) continue;

    const proxima = new Date(ahora);
    proxima.setHours(hh, mm, 0, 0);

    let diffDias = idxDia - diaActual;
    if (diffDias < 0) diffDias += 7;

    proxima.setDate(proxima.getDate() + diffDias);

    if (proxima <= ahora) {
      proxima.setDate(proxima.getDate() + 7);
    }

    const diffMin = (proxima - ahora) / 60000;

    if (mejorDiff === null || diffMin < mejorDiff) {
      mejorDiff = diffMin;
    }
  }

  return mejorDiff;
};

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
    ? escenas.filter((escena) =>
        escena.titulo?.toLowerCase().includes(normalizado)
      )
    : escenas;


  const escenasConTiempo = escenasFiltradas.map((e) => ({
    ...e,
    minutosHastaEjecucion: minutosHastaProximaEjecucion(e),
  }));

  const escenasEnEjecucion = escenasConTiempo.filter(
    (e) => e.enEjecucion === true
  );


  const escenasProximas = escenasConTiempo.filter((e) => {
    return (
      !e.enEjecucion &&
      e.minutosHastaEjecucion !== null &&
      e.minutosHastaEjecucion < 60
    );
  });


  const escenasNoEjecutadas = escenasConTiempo.filter((e) => {
    const esProxima =
      e.minutosHastaEjecucion !== null && e.minutosHastaEjecucion < 60;
    return !e.enEjecucion && !esProxima;
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
            mensaje="No hay escenas programadas para ejecutarse en la próxima hora."
          />

          <SeccionEscenaDash
            tituloSeccion="Mis escenas"
            tipoEscena={escenasNoEjecutadas}
            mensaje="Todas tus escenas están en ejecución o programadas."
          />
        </div>
      )}

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
