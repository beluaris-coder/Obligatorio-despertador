import { FaLightbulb, FaMusic, FaQuestionCircle } from "react-icons/fa";
import { capitalizar } from "../helpers/text";
import  IconButton from "./Shared/IconButton";

const iconosPorAccion = {
  luz: (
    <IconButton variante="small" icon={FaLightbulb} />
  ),
  musica: (
    <IconButton variante="small" icon={FaMusic} />
  ),
};

const BloqueAcciones = ({ acciones }) => {
  
    return (
    <article className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-2"> Acciones asociadas al cubito </h2>

      {acciones.length === 0 ? (
        <p className="text-sm text-gray-500">  No hay acciones configuradas para esta escena. </p>
      ) : (
        <ul className="space-y-2">
          {acciones.map((accion, index) => {
            const icono = iconosPorAccion[accion.funcionalidad] || <FaQuestionCircle className="text-gray-400" />

            return (
              <li
                key={index}
                className="text-sm text-gray-700 border border-gray-100 rounded-lg px-3 py-2"
              >
                {/* Título con icono */}
                <div className="flex items-center gap-2">
                  {icono}
                  <p className="font-medium"> {capitalizar(accion.funcionalidad)} </p>
                </div>

                {/* Parámetros */}
                {accion.parametros &&
                Object.keys(accion.parametros).length > 0 ? (
                  <ul className="mt-1 ml-6 text-xs text-gray-600">
                    {Object.entries(accion.parametros).map(
                      ([param, valor]) => (
                        <li key={param}> <strong>{capitalizar(param)}:</strong> {valor} </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-1 ml-6 text-xs text-gray-400"> Sin parámetros </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
};

export default BloqueAcciones;
