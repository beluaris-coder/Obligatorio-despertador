const BloqueLista = ({ titulo, items, mensaje = "No hay datos." }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-2">{titulo}</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{mensaje}</p>
      ) : (
        <ul className="text-sm text-gray-700 space-y-1">
          {items.map((item, index) => (
            <li key={index}>• {item}</li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BloqueLista;
