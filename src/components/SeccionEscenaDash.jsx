import CardEscena from "./CardEscena";

const SeccionEscenaDash = (props) => {
  const { tituloSeccion, tipoEscena, mensaje } = props;

  return (
    <section>
      <h2 className="text-[0.95rem] font-semibold mb-3"> {tituloSeccion} </h2>

      {tipoEscena.length === 0 ? (
        <p className="text-xs text-gray-500"> {mensaje} </p>
      ) : (
        <article className="flex flex-wrap gap-3 w-full justify-between md:justify-start">
          {tipoEscena.map((escena) => (
            <div
              key={escena.id}
              className="w-[calc(50%-0.375rem)] md:w-auto"
            >
              <CardEscena id={escena.id} />
            </div>
          ))}
        </article>


      )}
    </section>
  );
};

export default SeccionEscenaDash;
