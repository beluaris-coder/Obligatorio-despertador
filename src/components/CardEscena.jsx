import { Link } from "react-router-dom";
import { IMAGENES_ESCENAS } from "../helpers/constants";
import { MdPlayArrow } from "react-icons/md";

const CardEscena = (props) => {
  const { id, titulo, imagenIndex } = props;

  const indexValido =
    Number.isInteger(imagenIndex) && IMAGENES_ESCENAS.length > 0
      ? Math.abs(imagenIndex) % IMAGENES_ESCENAS.length
      : 0;

  const img = IMAGENES_ESCENAS[indexValido] || IMAGENES_ESCENAS[0];

  
  return (
    <Link
      to={`/escena/${id}`}
      className="relative w-32 h-24 rounded-xl overflow-hidden shadow-sm flex items-end bg-cover bg-center"
      style={{backgroundImage: `url(${img})`}}
    >
      <div className="absolute top-1 left-1 px-2 py-1 rounded-md text-xs font-semibold text-gray-800">
        {titulo}
      </div>

      <div className="absolute bottom-2 right-2 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow">
        <MdPlayArrow className="text-gray-600 text-xl" />
      </div>
    </Link>
  );
};

export default CardEscena;
