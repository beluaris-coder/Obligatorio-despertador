import Pill from "./Shared/Pill";

const BloqueEstado = (props) => {
  const { titulo, pillLabel, pillVariante } = props;

  return (
    <section className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between">
      <h2 className="text-sm font-semibold mb-1"> {titulo} </h2>
      <Pill label={pillLabel} variante={pillVariante}/>
    </section>
  );
};

export default BloqueEstado;
