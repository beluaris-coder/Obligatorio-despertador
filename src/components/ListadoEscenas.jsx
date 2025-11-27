import { API_URL } from "../helpers/constants";
import Escena from "./Escena";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const { selectedCategory, search } = props;

  //tanstack query
  const {data:escenas, isLoading, error} = useQuery({
    queryKey: ["escenas", search],
    queryFn: ()=> fetch(`${API_URL}/search?q=${search}`).then(res => res.json())
  })
  
  const escenasFiltradas = escenas?.posts?.filter(
    (escenas) => !selectedCategory || escenas.tags[0] === selectedCategory
  );

  return (
    <>
      {isLoading && <Loader />}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {escenasFiltradas?.map((escena) => (
          <Escena
            key={escena.id}
            id={escena.id}
            titulo={escena.title}
            categoria={escena.tags[0]}
          />
        ))}
      </section>
      {escenasFiltradas?.length === 0 && !error && !isLoading && (
        <Message variant="info" message="No hay escenas disponibles" />
      )}
      {error && (
        <Message variant="error" message={error.message} />
      )}
    </>
  );
};

export default ListadoEscenas;
