import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import SelectorHorarios from "./SelectorHorarios";
import { IMAGENES_ESCENAS, API_URL } from "../helpers/constants";
import { parsearDiasHorarios, limpiarAcciones, validarEscena } from "../helpers/escenas";
import { useEscenaForm } from "../hooks/useEscenaForm";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import ListadoFuncionalidades from "./ListadoFuncionalidades";
import HeaderForm from "./HeaderForm";
import InputText from "./Shared/InputTxt";
import InputTextarea from "./Shared/InputTxtArea";
import Button from "./Shared/Button";
import TextButton from "./Shared/TextButton";
import { useEscenasStore } from "../store/escenasStore";

const FormEscena = () => {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const { addEscena, updateEscena } = useEscenasStore();

  // Escena existente (para edición)
  const { data: escenaExistente, isLoading: isLoadingEscena, error: errorEscena } = useQuery({
    enabled: esEdicion,
    queryKey: ["escena", id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/escenas/${id}.json`);
      if (!res.ok) throw new Error("Error al cargar la escena");
      const data = await res.json();
      if (!data) throw new Error("Escena no encontrada");
      return data;
    },
  });

  // Funcionalidades desde Firebase
  const { data: funcionalidades = {}, isLoading: isLoadingFuncionalidades, error: errorFuncionalidades } = useQuery({
    queryKey: ["funcionalidades"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/funcionalidades.json`);
      if (!res.ok) throw new Error("Error al cargar funcionalidades");
      return res.json();
    },
  });

  const { step, titulo, setTitulo, descripcion, setDescripcion, horarios, setHorarios, acciones, setAcciones, errorLocal, setErrorLocal, nextStep, prevStep,
    handleSeleccionarFuncionalidad, handleChangeAccionParametro, handleAgregarAccion, handleEliminarAccion } = useEscenaForm(escenaExistente);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const diasHorarios = parsearDiasHorarios(horarios);
    const accionesLimpias = limpiarAcciones(acciones);

    // Validar
    const error = validarEscena(titulo, diasHorarios, accionesLimpias);
    if (error) {
      setErrorLocal(error);
      return;
    }

    const imagen = escenaExistente?.imagen || IMAGENES_ESCENAS[Math.floor(Math.random() * IMAGENES_ESCENAS.length)];

    const escenaAGuardar = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      diasHorarios,
      acciones: accionesLimpias,
      imagen,
    };

    setErrorLocal("");

    try {
      if (esEdicion) {
        // Editar
        await fetch(`${API_URL}/escenas/${id}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(escenaAGuardar),
        });
        updateEscena(id, escenaAGuardar);
        navigate(`/escena/${id}`);
      } else {
        // Crear
        const res = await fetch(`${API_URL}/escenas.json`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(escenaAGuardar),
        });
        const data = await res.json();
        const newId = data?.name;
        if (newId) {
          const nueva = { id: newId, ...escenaAGuardar };
          addEscena(nueva);
        }
        navigate("/");
      }
    } catch (err) {
      setErrorLocal(err.message || "Error al guardar la escena");
    }
  };

  if (esEdicion && isLoadingEscena) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (esEdicion && errorEscena) {
    return (
      <section className="p-4">
        <Message variant="error" message={errorEscena.message || "Error al cargar la escena"} />
      </section>
    );
  }

  return (
    <section className="p-4 pb-24 flex flex-col gap-4">
      <HeaderForm esEdicion={esEdicion} step={step} />

      {errorLocal && <Message variant="error" message={errorLocal} />}
      {errorFuncionalidades && <Message variant="error" message={errorFuncionalidades.message || "Error al cargar funcionalidades"} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* PASO 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <InputText label="Nombre de la escena" placeholder="Ej: Despertar suave" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <InputTextarea label="Descripción" placeholder="Ej: Enciende luces y música..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <label className="text-sm font-semibold">Días y horarios programados</label>
              <p className="text-xs text-gray-500 mb-1">Elegí uno o varios días de la semana y un horario para ejecutar esta escena.</p>
              <SelectorHorarios value={horarios} onChange={setHorarios} />
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Acciones de los dispositivos</h2>
              <TextButton label="Agregar acción" onClick={handleAgregarAccion} variante="agregar" />
            </div>

            {isLoadingFuncionalidades && <p className="text-xs text-gray-400">Cargando funcionalidades...</p>}

            {acciones.map((accion, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Acción #{index + 1}</p>
                  {acciones.length > 1 && <TextButton label="Eliminar" variante="eliminar" onClick={() => handleEliminarAccion(index)} />}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">Funcionalidad</label>
                  <ListadoFuncionalidades value={accion.funcionalidad} onChange={(nuevoValor) => handleSeleccionarFuncionalidad(index, nuevoValor, funcionalidades)} />

                  {accion.funcionalidad && funcionalidades?.[accion.funcionalidad] && (
                    <div className="mt-3 flex flex-col gap-3">
                      {Object.entries(funcionalidades[accion.funcionalidad].parametros).map(([paramID, def]) => (
                        <div key={paramID} className="flex flex-col gap-1">
                          <label className="text-xs text-gray-600">{paramID.charAt(0).toUpperCase() + paramID.slice(1)}</label>

                          {def.tipo === "number" && (
                            <input type="number" min={def.min} max={def.max} className="border rounded-lg px-3 py-1.5 text-sm"
                              value={accion.parametros?.[paramID] || ""} onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)} />
                          )}

                          {def.tipo === "string" && (
                            <input type="text"  className="border rounded-lg px-3 py-1.5 text-sm" value={accion.parametros?.[paramID] || ""} onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)} />
                          )}

                          {def.tipo === "select" && (
                            <select className="border rounded-lg px-3 py-1.5 text-sm" value={accion.parametros?.[paramID] || ""}
                              onChange={(e) => handleChangeAccionParametro(index, paramID, e.target.value)}>
                              <option value="">Seleccioná una opción</option>
                              {def.valores.map((v) => (
                                <option key={v} value={v}>{v} </option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BOTONES */}
        <div className="flex gap-2 mt-2">
          {step > 1 && (
            <Button label="Volver" onClick={prevStep} variante="secundario" type="button" />
          )}
          {step < 2 && (
            <Button label="Siguiente" onClick={nextStep} variante="primario" type="button" />
          )}
          {step === 2 && (
            <Button type="submit" variante="primario" label={esEdicion ? "Guardar cambios" : "Guardar escena"}/>
          )}
        </div>
      </form>
    </section>
  );
};

export default FormEscena;
