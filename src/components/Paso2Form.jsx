import { labelFuncionalidad } from "../helpers/text";
import ListadoFuncionalidades from "./ListadoFuncionalidades";
import TextButton from "./Shared/TextButton";

const Paso2Form = (props) => {
  const { acciones, funcionalidades, isLoadingFuncionalidades, handleAgregarAccion, handleEliminarAccion, handleSeleccionarFuncionalidad, handleChangeAccionParametro } = props;

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Acciones de los dispositivos</h2>
        <TextButton label="Agregar acción" onClick={handleAgregarAccion} variante="agregar" type="button" />
      </div>

      {isLoadingFuncionalidades && (
        <p className="text-xs text-gray-400"> Cargando funcionalidades... </p>
      )}

      {acciones.map((accion, index) => {
        const definicionFunc = accion.funcionalidad ? funcionalidades?.[accion.funcionalidad] : null;
        const tieneParametros = definicionFunc && definicionFunc.parametros && Object.keys(definicionFunc.parametros).length > 0;

        return (
          <div key={index} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2">
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">Acción #{index + 1}</p>
              {acciones.length > 1 && (
                <TextButton label="Eliminar" variante="eliminar" onClick={() => handleEliminarAccion(index)} />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600">Funcionalidad</label>
              <ListadoFuncionalidades value={accion.funcionalidad} onChange={(nuevoValor) => handleSeleccionarFuncionalidad(index, nuevoValor, funcionalidades)}/>

              {definicionFunc && (
                <div className="mt-3 flex flex-col gap-3">
                  {tieneParametros ? (
                    Object.entries(definicionFunc.parametros).map(
                      ([paramID, def]) => (
                        <div key={paramID} className="flex flex-col gap-1">
                          <label className="text-xs text-gray-600">
                            {labelFuncionalidad(paramID)}
                            {def.unidad ? ` (${def.unidad})` : ""}
                          </label>

                          {def.tipo === "number" && (
                            <input type="number" min={def.min} max={def.max} className="border rounded-lg px-3 py-1.5 text-sm" value={accion.parametros?.[paramID] || ""}
                              onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)}
                            />
                          )}

                          {def.tipo === "string" && (
                            <input type="text" className="border rounded-lg px-3 py-1.5 text-sm" value={accion.parametros?.[paramID] || ""}
                              onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)}/>
                          )}

                          {def.tipo === "color" && (
                            <input type="color" value={accion.parametros?.[paramID] || "#ffffff"} onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)}/>
                          )}

                          {def.tipo === "select" && (
                            <select className="border rounded-lg px-3 py-1.5 text-sm" value={accion.parametros?.[paramID] || ""}
                              onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)}>
                              <option value="">Seleccioná una opción</option>
                              {def.valores.map((v) => (
                                <option key={v} value={v}>
                                  {labelFuncionalidad(v)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-xs text-gray-500"> Esta funcionalidad no requiere parámetros adicionales.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Paso2Form;
