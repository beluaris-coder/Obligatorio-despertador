import { API_URL } from "../helpers/constants";
import Noticia from "./Noticia";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoEscenas = (props) => {
  const { selectedCategory, search } = props;

  //tanstack query
  const {data:noticias, isLoading, error} = useQuery({
    queryKey: ["noticias", search],
    queryFn: ()=> fetch(`${API_URL}/search?q=${search}`).then(res => res.json())
  })
  
  const noticiasFiltradas = noticias?.posts?.filter(
    (noticia) => !selectedCategory || noticia.tags[0] === selectedCategory
  );

  return (
    <>
      {isLoading && <Loader />}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {noticiasFiltradas?.map((noticia) => (
          <Noticia
            key={noticia.id}
            id={noticia.id}
            titulo={noticia.title}
            categoria={noticia.tags[0]}
          />
        ))}
      </section>
      {noticiasFiltradas?.length === 0 && !error && !isLoading && (
        <Message variant="info" message="No hay noticias disponibles" />
      )}
      {error && (
        <Message variant="error" message={error.message} />
      )}
    </>
  );
};

export default ListadoEscenas;
