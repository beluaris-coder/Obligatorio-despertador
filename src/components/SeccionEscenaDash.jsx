import CardEscena from "./CardEscena";

const SeccionEscenaDash = (props) => {
  const { tituloSeccion, tipoEscena, mensaje } = props;

  return (
    <section>
      <h2 className="text-sm font-semibold mb-2"> {tituloSeccion} </h2>
      
      {tipoEscena.length === 0 ? (
        <p className="text-xs text-gray-500"> {mensaje} </p>
      ) : (
        <article className="flex flex-wrap gap-2 w-full">
          {tipoEscena.map((escena) => (
            <div key={escena.id}>
              <CardEscena
                id={escena.id}
                titulo={escena.titulo}
                imagenIndex={escena.imagenIndex}
                enEjecucion={escena.enEjecucion}
              />
            </div>
          ))}
        </article>
      )}
    </section>
  );
};

export default SeccionEscenaDash;
