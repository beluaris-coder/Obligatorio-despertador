import { Link } from "react-router-dom";
import { IMAGENES_ESCENAS } from "../helpers/constants";


const CardEscena = (props) => {
  const { id, titulo } = props;

  // Imagen random: se calcula cada vez que se renderiza el componente
  const randomIndex = Math.floor(Math.random() * IMAGENES_ESCENAS.length);
  const randomImg = IMAGENES_ESCENAS[randomIndex];


  return (
    <Link to={`/escena/${id}`}
      className="relative w-32 h-24 rounded-xl overflow-hidden shadow-md flex items-end"
      style={{
        backgroundImage: `url(${randomImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-1 left-1 text-gray-800 px-2 py-1 rounded-md text-m font-semibold">
        {titulo}
      </div>

      <div className="absolute bottom-2 right-2 bg-white/90 w-10 h-8 rounded-full flex items-center justify-center shadow">
        <span className="material-symbols-outlined text-gray-600">play_arrow</span>
      </div>
    </Link>
  );
};

export default CardEscena;
