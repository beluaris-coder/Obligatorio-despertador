import { Link } from "react-router-dom";
import { useState } from "react";
import { IMAGENES_ESCENAS } from "../helpers/constants";
import { useEjecutarEscena } from "../hooks/useEjecutarEscena";
import { MdPlayArrow } from "react-icons/md";
import IconButton from "./Shared/IconButton";

const CardEscena = (props) => {
  const { id, titulo, imagenIndex, enEjecucion } = props;
  const { ejecutarEscena } = useEjecutarEscena(null, id);

  const [animando, setAnimando] = useState(false);
  const [loading, setLoading] = useState(false);

  const indexValido =
    Number.isInteger(imagenIndex) && IMAGENES_ESCENAS.length > 0
      ? Math.abs(imagenIndex) % IMAGENES_ESCENAS.length : 0;

  const img = IMAGENES_ESCENAS[indexValido] || IMAGENES_ESCENAS[0];

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setAnimando(true);
    setLoading(true);
    ejecutarEscena();

    // animación click
    setTimeout(() => setAnimando(false), 150);

    // simular loader
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

      <IconButton icon={MdPlayArrow} onClick={handlePlay} loading={loading} animando={animando} disabled={enEjecucion}/>
    </Link>
  );
};

export default CardEscena;
