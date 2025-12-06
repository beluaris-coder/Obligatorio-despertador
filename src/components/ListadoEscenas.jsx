import { API_URL } from "../helpers/constants";
import CardEscena from "./CardEscena";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const { search } = props;

  //tanstack query
  const { data: escenas = [], isLoading, error } = useQuery({
    queryKey: ["escenas", search],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/escenas.json`);
      if (!res.ok) throw new Error("Error al cargar escenas");
      const data = await res.json();
      if (!data) return [];
      return Object.entries(data).map(([id, value]) => ({ id, ...value }));
    },
  });


  return (
    <>
      {isLoading && <Loader />}

      <article className="flex flex-wrap gap-2 w-full">
        {escenas.map((escena) => (
          <div key={escena.id}>
            <CardEscena id={escena.id} titulo={escena.titulo} />
          </div>
        ))}
      </article>

      {escenas.length === 0 && !error && !isLoading && (
        <Message variant="info" message="No hay escenas disponibles, agregue una para comenzar" />
      )}
      {error && <Message variant="error" message={error.message || "Error de carga"} />}
    </>
  );
};

export default ListadoEscenas;
