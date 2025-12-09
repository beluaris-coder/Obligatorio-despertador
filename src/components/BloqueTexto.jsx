const BloqueTexto = (props) => {
  const { titulo, texto } = props;

  return (
    <section className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-1"> {titulo} </h2>
      <p className="text-sm text-gray-700"> {texto} </p>
    </section>
  );
};

export default BloqueTexto;
