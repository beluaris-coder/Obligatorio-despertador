import { API_URL } from "../helpers/constants";
import CardEscena from "./CardEscena";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const  search  = props.search;

  //tanstack query
  const { data: escenas = [], isLoading, error } = useQuery({
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

  const escenasFiltradas = normalizado ? escenas.filter((escena) =>
    escena.titulo?.toLowerCase().includes(normalizado)
  ) : escenas;

  return (
    <>
      {isLoading && <Loader />}

      <article className="flex flex-wrap gap-2 w-full">
        {escenasFiltradas.map((escena) => (
          <div key={escena.id}>
            <CardEscena id={escena.id} titulo={escena.titulo} />
          </div>
        ))}
      </article>

      {isLoading && !error && escenas.length > 0 && escenasFiltradas.length === 0 && (
        <Message variant="info" message="No se encontraron escenas que coincidan con la búsqueda" />
      )}


      {!isLoading && !error && escenas.length === 0 && (
        <Message
          variant="info"
          message="No hay escenas disponibles, agregue una para comenzar"
        />
      )}

      {error && <Message variant="error" message={error.message} />}
    </>
  );
};

export default ListadoEscenas;
