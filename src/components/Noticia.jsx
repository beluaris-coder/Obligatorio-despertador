import { Link } from "react-router-dom";

const Noticia = (props) => {
  const {
    id,
    titulo,
    categoria,
    img = "https://thecapecurrent.com/wp-content/uploads/2023/07/play-volley.jpg",
    imgPerfil,
    autor = "Carlos Perez",
    fecha = new Date().toLocaleDateString(),
  } = props;
  return (
    <Link
      className="flex gap-2 hover:bg-gray-50 rounded-md"
      to={`/noticia/${id}`}
    >
      <img
        src={img}
        alt={titulo}
        className="rounded-lg w-32 h-32 object-cover"
      />
      <div className="flex flex-col gap-1 justify-center">
        <p className="text-gray-400 text-xs capitalize">{categoria}</p>
        <h2>{titulo}</h2>
        <div className="flex items-center gap-1">
          <div className="bg-gray-200 rounded-full w-5 h-5 shrink-0">
            {imgPerfil && (
              <img
                src={imgPerfil}
                alt={autor}
                className="rounded-full w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-xs text-gray-400">
            {autor} - {fecha}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Noticia;
