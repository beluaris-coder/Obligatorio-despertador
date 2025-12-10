import { FaLightbulb, FaMusic, FaQuestionCircle, FaClock, FaWindowMaximize, FaSprayCan, FaCalculator, FaBed, FaWaveSquare, FaMobileAlt  } from "react-icons/fa";
import { capitalizar } from "../helpers/text";
import  IconButton from "./Shared/IconButton";

const iconosPorAccion = {
  luz: (
    <IconButton variante="small" icon={FaLightbulb} bgColor="bg-yellow-50" textColor="text-yellow-500" />
  ),
  luz_del_cuarto: (
    <IconButton variante="small" icon={FaLightbulb} bgColor="bg-yellow-50" textColor="text-yellow-500" />
  ),
  musica: (
    <IconButton variante="small" icon={FaMusic} />
  ),
  alarma: (
    <IconButton variante="small" icon={FaClock} />
  ),
  subir_persianas: (
    <IconButton variante="small" icon={FaWindowMaximize} />
  ),
  aroma: (
    <IconButton variante="small" icon={FaSprayCan} bgColor="bg-pink-100" textColor="text-pink-500" />
  ),
  juego_matematico: (
    <IconButton variante="small" icon={FaCalculator} bgColor="bg-rose-100" textColor="text-rose-500" />
  ),
  calientacamas: (
    <IconButton variante="small" icon={FaBed} bgColor="bg-orange-100" textColor="text-orange-500" />
  ),
  vibracion: (
    <IconButton variante="small" icon={FaWaveSquare} />
  ),
  sacudir_para_apagar: (
    <IconButton variante="small" icon={FaMobileAlt} />
  )

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
