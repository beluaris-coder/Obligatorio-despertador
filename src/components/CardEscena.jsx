import { Link } from "react-router-dom";
import { IMAGENES_ESCENAS } from "../helpers/constants";

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
      className="relative w-32 h-24 rounded-xl overflow-hidden shadow-md flex items-end"
      style={{
        backgroundImage: `url(${img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute top-1 left-1 text-gray-50 px-2 py-1 rounded-md text-xs font-semibold bg-black/40">
        {titulo}
      </div>

      <div className="absolute bottom-2 right-2 bg-white/90 w-8 h-8 rounded-full flex items-center justify-center shadow">
        <span className="material-symbols-outlined text-gray-600 text-xl">
          play_arrow
        </span>
      </div>
    </Link>
  );
};

export default CardEscena;
