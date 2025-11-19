import { useNavigate, useParams } from "react-router-dom";
import IconButton from "./Shared/IconButton";
import { API_URL, otrosDetalles } from "../helpers/constants";
import DetallesMedio from "./DetallesMedio";
import HeaderNoticia from "./HeaderNoticia";
import Message from "./Shared/Message";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./Shared/Loader";
// import { mockPosts } from "../helpers/mockData";

const DetalleNoticia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  // const noticia = mockPosts.find((post) => post.id === parseInt(id));
  const { data: noticia, isLoading } = useQuery({
    queryKey: ["noticia", id],
    queryFn: () => fetch(`${API_URL}/${id}`).then(res => res.json())
  })

  //eliminar noticia
  const { mutate: eliminarNoticia, isPending: isPendingEliminar } = useMutation({
    mutationFn: () => fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    }).then((res) => res.json()),
    onSuccess: () => navigate("/")
  })

  //editar noticia - marcar como favorito
  const {
    //valores, funciones, booleanos
    mutate: marcarFavorito, isPending: isPendingEditar} = useMutation({
    //parametro y funcion
    mutationFn: () => fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        esFav: !noticia.esFav,
      })
    }).then((res) => res.json()),
     onSuccess: queryClient.invalidateQueries({queryKey:["noticia", id] })
  })

  if (isLoading) return <Loader />

  if (!noticia && !isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Message variant="error" message="Noticia no encontrada" />
      </div>
    );
  }


  return (
    <section>
      <div className="relative">
        <img
          src={otrosDetalles.bannerImg}
          alt="Portada de la noticia"
          className="w-full h-96 object-cover"
        />
        <div className="fixed top-2 left-0 w-full flex justify-end gap-2 px-3">
          <div className="mr-auto">
            <IconButton onClick={() => navigate(-1)} icon="arrow_back" />
          </div>
          <IconButton onClick={() => marcarFavorito()} disabled={isPendingEditar} icon="bookmark" />
          <IconButton onClick={eliminarNoticia} icon="delete" disabled={isPendingEliminar} />
        </div>
        <HeaderNoticia
          titulo={noticia.title}
          categoria={noticia?.tags?.[0]}
          {...otrosDetalles}
        />
      </div>

      <main className="bg-white text-black p-4 rounded-t-2xl mt-[-20px] relative z-10">
        <DetallesMedio {...otrosDetalles.media} />
        <p className="text-sm">{noticia.body} </p>
      </main>
    </section>
  );
};

export default DetalleNoticia;
