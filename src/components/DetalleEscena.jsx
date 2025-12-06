import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "../helpers/constants";
import DetallesMedio from "./DetallesMedio";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import IconButton from "./Shared/IconButton";
import HeaderEscena from "./HeaderEscena";

const DetalleEscena = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { data: escena, isLoading } = useQuery({
    queryKey: ["escena", id],
    queryFn: () => fetch(`${API_URL}/${id}`).then(res => res.json())
  })

  //eliminar escena
  const { mutate: eliminarEscena, isPending: isPendingEliminar } = useMutation({
    mutationFn: () => fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    }).then((res) => res.json()),
    onSuccess: () => navigate("/")
  })

  //editar escena - marcar como favorito
  const {
    //valores, funciones, booleanos
    mutate: marcarFavorito, isPending: isPendingEditar} = useMutation({
    //parametro y funcion
    mutationFn: () => fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        esFav: !escena.esFav,
      })
    }).then((res) => res.json()),
     onSuccess: queryClient.invalidateQueries({queryKey:["escena", id] })
  })

  if (isLoading) return <Loader />

  if (!escena && !isLoading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <Message variant="error" message="Escena no encontrada" />
      </div>
    );
  }


  return (
    <section>
      <div className="relative">
        <img
          src={otrosDetalles.bannerImg}
          alt="Portada de la escena"
          className="w-full h-96 object-cover"
        />
        <div className="fixed top-2 left-0 w-full flex justify-end gap-2 px-3">
          <div className="mr-auto">
            <IconButton onClick={() => navigate(-1)} icon="arrow_back" />
          </div>
          <IconButton onClick={() => marcarFavorito()} disabled={isPendingEditar} icon="bookmark" />
          <IconButton onClick={eliminarEscena} icon="delete" disabled={isPendingEliminar} />
        </div>
        <HeaderEscena
          titulo={escena.title}
          categoria={escena?.tags?.[0]}
          {...otrosDetalles}
        />
      </div>

      <main className="bg-white text-black p-4 rounded-t-2xl mt-5 relative z-10">
        <DetallesMedio {...otrosDetalles.media} />
        <p className="text-sm">{escena.body} </p>
      </main>
    </section>
  );
};

export default DetalleEscena;
