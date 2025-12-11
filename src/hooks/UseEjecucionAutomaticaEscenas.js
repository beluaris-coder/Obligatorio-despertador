// UseEjecucionAutomaticaEscenas.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { DIAS_SEMANA, API_URL } from "../helpers/constants";

const esMomentoDeEjecutar = (escena, ahora) => {
  if (!Array.isArray(escena.diasHorarios) || escena.diasHorarios.length === 0) {
    return false;
  }

  const diaActualTexto = DIAS_SEMANA[ahora.getDay()];
  const horaActual = ahora.getHours();
  const minutoActual = ahora.getMinutes();

  return escena.diasHorarios.some((linea) => {
    if (!linea) return false;

    const [diaTexto, horaTexto] = linea.split(" ");
    if (!diaTexto || !horaTexto) return false;

    if (diaTexto !== diaActualTexto) return false;

    const [hhStr, mmStr] = horaTexto.split(":");
    const hh = Number(hhStr);
    const mm = Number(mmStr);

    if (Number.isNaN(hh) || Number.isNaN(mm)) return false;

    return hh === horaActual && mm === minutoActual;
  });
};

export const useEjecucionAutomaticaEscenas = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const intervalo = setInterval(async () => {
      try {
        const ahora = new Date();

        const res = await fetch(`${API_URL}/escenas.json`);
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        const escenas = Object.entries(data).map(([id, val]) => ({
          id,
          ...val,
        }));

        for (const escena of escenas) {
          if (escena.enEjecucion) continue;
          if (!esMomentoDeEjecutar(escena, ahora)) continue;

          // Si tiene juego matemático → ir al juego
          const accionJuego = escena.acciones?.find(
            (a) => a.funcionalidad === "juego_matematico"
          );

          if (accionJuego) {
            const dificultad = accionJuego.parametros?.dificultad || "facil";
            navigate(`/juego-matematico?dificultad=${dificultad}`);
          }

          // Historial
          const fechaLegible = ahora.toLocaleString("es-UY", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          const diaTexto = DIAS_SEMANA[ahora.getDay()];
          const historialAnterior = Array.isArray(escena.historial)
            ? escena.historial
            : [];

          const nuevoRegistro = {
            fecha: fechaLegible,
            dia: diaTexto,
            modo: "automático",
          };

          // Marcar en ejecución + agregar historial en Firebase
          await fetch(`${API_URL}/escenas/${escena.id}.json`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              enEjecucion: true,
              historial: [...historialAnterior, nuevoRegistro],
            }),
          });

          queryClient.invalidateQueries({ queryKey: ["escenas"] });
          queryClient.invalidateQueries({ queryKey: ["escena", escena.id] });

          // ⬇️ AUTO-APAGADO SEGÚN DURACIÓN (en minutos)
          const duracionMinutos = Number(escena?.duracion) || 0;
          if (duracionMinutos > 0) {
            const ms = duracionMinutos * 60 * 1000;

            setTimeout(async () => {
              try {
                await fetch(`${API_URL}/escenas/${escena.id}.json`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ enEjecucion: false }),
                });

                queryClient.invalidateQueries({ queryKey: ["escenas"] });
                queryClient.invalidateQueries({
                  queryKey: ["escena", escena.id],
                });
              } catch (err) {
                console.error(
                  "Error auto-deteniendo escena (automática):",
                  err
                );
              }
            }, ms);
          }
        }
      } catch (err) {
        console.error("Error en ejecución automática:", err);
      }
    }, 30 * 1000);

    return () => clearInterval(intervalo);
  }, [navigate, queryClient]);
};
