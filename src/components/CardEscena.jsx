import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdPlayArrow } from "react-icons/md";

import { IMAGENES_ESCENAS } from "../helpers/constants";
import { useEjecutarEscena } from "../hooks/useEjecutarEscena";
import { useEscenasStore } from "../store/escenasStore";
import IconButtonPlay from "./Shared/IconButtonPlay";

const CardEscena = ({ id }) => {
  const navigate = useNavigate();

  const escena = useEscenasStore((s) => s.getEscena(id));
  const { ejecutarEscena } = useEjecutarEscena(escena, id);

  const [animando, setAnimando] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!escena) return null;

  const { titulo, imagenIndex, imagen, enEjecucion, acciones = [] } = escena;

  const indexValido =
    Number.isInteger(imagenIndex) && IMAGENES_ESCENAS.length > 0
      ? Math.abs(imagenIndex) % IMAGENES_ESCENAS.length
      : 0;

  const img =
    typeof imagen === "string" && imagen.length > 0
      ? imagen
      : IMAGENES_ESCENAS[indexValido] || IMAGENES_ESCENAS[0];

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || enEjecucion) return;

    // 👉 buscamos si tiene juego matemático
    const accionJuego = acciones.find(
      (a) => a.funcionalidad === "juego_matematico"
    );

    if (accionJuego) {
      const dificultad = accionJuego.parametros?.dificultad || "facil";

      // 1) registro en historial como "manual"
      ejecutarEscena("manual");

      // 2) voy al juego
      navigate(`/juego-matematico?dificultad=${dificultad}`);
      return;
    }

    // si no hay juego matemático, ejecuto la escena normal
    setAnimando(true);
    setLoading(true);

    ejecutarEscena("manual");

    setTimeout(() => setAnimando(false), 150);
    setTimeout(() => setLoading(false), 900);
  };

  return (
    <Link
      to={`/escena/${id}`}
      className="relative w-32 h-24 rounded-xl overflow-hidden shadow-sm flex items-end bg-cover bg-center"
      style={{ backgroundImage: `url(${img})` }}
    >
      <div className="absolute top-1 left-1 px-2 py-1 rounded-md text-xs font-semibold text-gray-800">
        {titulo}
      </div>

      <IconButtonPlay
        icon={MdPlayArrow}
        onClick={handlePlay}
        loading={loading}
        animando={animando}
        disabled={enEjecucion}
      />
    </Link>
  );
};

export default CardEscena;
