import Pill from "./Shared/Pill";

const BloqueHistorial = ({ historial }) => {

  return (
    <article className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-2">Historial de ejecución</h2>

      {historial.length === 0 ? (
        <p className="text-sm text-gray-500"> Esta escena aún no se ha ejecutado. </p>
      ) : (
        <ul className="text-sm text-gray-700 divide-y divide-gray-100">
          {historial.map((item, index) => (
            <li key={index} className="py-2 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.fecha}</p>
                {item.dia && (
                  <p className="text-xs text-gray-500">{item.dia}</p>
                )}
              </div>

              <Pill label={item.modo} />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
};

export default BloqueHistorial;
