import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IMAGENES_ESCENAS, API_URL } from "../helpers/constants";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import ListadoFuncionalidades from "./ListadoFuncionalidades";

const AgregarEscena = () => {
  const { id } = useParams();
  const esEdicion = Boolean(id);

  const [step, setStep] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [diasHorariosTexto, setDiasHorariosTexto] = useState("");
  const [acciones, setAcciones] = useState([
    { funcionalidad: "", parametros: {} },
  ]);
  const [errorLocal, setErrorLocal] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
  const {
    data: funcionalidades = {},
    isLoading: isLoadingFuncionalidades,
    error: errorFuncionalidades,
  } = useQuery({
    queryKey: ["funcionalidades"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/funcionalidades.json`);
      if (!res.ok) throw new Error("Error al cargar funcionalidades");
      return res.json();
    },
  });

  useEffect(() => {
    if (escenaExistente) {
      setTitulo(escenaExistente.titulo || "");
      setDescripcion(escenaExistente.descripcion || "");
      setDiasHorariosTexto((escenaExistente.diasHorarios || []).join("\n"));
      setAcciones(
        escenaExistente.acciones?.length
          ? escenaExistente.acciones.map((a) => ({
              funcionalidad: a.funcionalidad || "",
              parametros: a.parametros || {},
            }))
          : [{ funcionalidad: "", parametros: {} }]
      );
    }
  }, [escenaExistente]);

  const { mutate: guardarEscena, isPending } = useMutation({
    mutationFn: async (escenaAGuardar) => {
      const url = esEdicion
        ? `${API_URL}/escenas/${id}.json`
        : `${API_URL}/escenas.json`;
      const method = esEdicion ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(escenaAGuardar),
      });
      if (!res.ok) throw new Error("Error al guardar la escena");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escenas"] });
      if (esEdicion) {
        queryClient.invalidateQueries({ queryKey: ["escena", id] });
        navigate(`/escena/${id}`);
      } else {
        navigate("/");
      }
    },
  });

  const handleSeleccionarFuncionalidad = (
    index,
    funcionalidadID,
    funcionalidadesData
  ) => {
    const definicion =
      funcionalidadesData?.[funcionalidadID]?.parametros || {};

    const nuevosParametros = {};
    Object.keys(definicion).forEach((p) => {
      nuevosParametros[p] = "";
    });

    setAcciones((prev) =>
      prev.map((a, i) =>
        i === index
          ? { funcionalidad: funcionalidadID, parametros: nuevosParametros }
          : a
      )
    );
  };

  const handleChangeAccionParametro = (index, parametro, valor) => {
    setAcciones((prev) =>
      prev.map((accion, i) =>
        i === index
          ? {
              ...accion,
              parametros: { ...accion.parametros, [parametro]: valor },
            }
          : accion
      )
    );
  };

  const handleAgregarAccion = () => {
    setAcciones((prev) => [
      ...prev,
      { funcionalidad: "", parametros: {} },
    ]);
  };

  const handleEliminarAccion = (index) => {
    setAcciones((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === 1) {
      if (!titulo.trim()) {
        setErrorLocal("La escena debe tener un nombre.");
        return;
      }
      setErrorLocal("");
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrorLocal("");
    setStep((s) => s - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const diasHorarios = diasHorariosTexto
      .split("\n")
      .map((t) => t.trim())
      .filter(Boolean);

    const accionesLimpias = acciones.filter(
      (a) => a.funcionalidad.trim() !== ""
    );

    if (accionesLimpias.length === 0) {
      setErrorLocal("Agregá al menos una acción para la escena.");
      return;
    }

    // Validar que todos los parámetros estén completos
    const faltanParametros = accionesLimpias.some((a) =>
      Object.values(a.parametros || {}).some(
        (v) => v === "" || v === null || v === undefined
      )
    );

    if (faltanParametros) {
      setErrorLocal(
        "Completá todos los parámetros de las funcionalidades."
      );
      return;
    }

    let escenaAGuardar;

    if (esEdicion && escenaExistente) {
      // Conservar campos existentes (como imagenIndex, historial, enEjecucion)
      escenaAGuardar = {
        ...escenaExistente,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        diasHorarios,
        acciones: accionesLimpias,
      };
    } else {
      // Nueva escena: generar imagenIndex aleatorio UNA sola vez
      const imagenIndex = Math.floor(Math.random() * IMAGENES_ESCENAS.length);

      escenaAGuardar = {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        diasHorarios,
        acciones: accionesLimpias,
        imagenIndex,
        enEjecucion: false,
      };
    }

    setErrorLocal("");
    guardarEscena(escenaAGuardar);
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
        <Message
          variant="error"
          message={errorEscena.message || "Error al cargar la escena"}
        />
      </section>
    );
  }



  return (
    <section className="p-4 pb-24 flex flex-col gap-4">
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-semibold">
          {esEdicion ? "Editar escena" : "Nueva escena"}
        </h1>
        <span className="text-xs text-gray-500">
          Paso {step} de 2
        </span>
      </header>

      <div className="flex items-center gap-2 mb-2">
        <div
          className={`flex-1 h-1 rounded-full ${
            step >= 1 ? "bg-violet-400" : "bg-gray-200"
          }`}
        />
        <div
          className={`flex-1 h-1 rounded-full ${
            step >= 2 ? "bg-violet-400" : "bg-gray-200"
          }`}
        />
      </div>

      {errorLocal && (
        <Message variant="error" message={errorLocal} />
      )}

      {errorFuncionalidades && (
        <Message
          variant="error"
          message={
            errorFuncionalidades.message || "Error al cargar funcionalidades"
          }
        />
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* PASO 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Nombre de la escena
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="Ej: Despertar suave"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Descripción
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                rows={3}
                placeholder="Ej: Enciende luces y música de manera progresiva."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Días y horarios programados
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Escribí un día y horario por línea. Ej:
                <br />
                <span className="font-mono">Lunes 07:00</span>,{" "}
                <span className="font-mono">Martes 07:30</span>
              </p>
              <textarea
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
                rows={3}
                placeholder={"Lunes 07:00\nMartes 07:30"}
                value={diasHorariosTexto}
                onChange={(e) => setDiasHorariosTexto(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                Acciones de los dispositivos
              </h2>
              <button
                type="button"
                onClick={handleAgregarAccion}
                className="text-xs text-violet-600 font-semibold"
              >
                + Agregar acción
              </button>
            </div>

            {isLoadingFuncionalidades && (
              <p className="text-xs text-gray-400">
                Cargando funcionalidades...
              </p>
            )}

            {acciones.map((accion, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    Acción #{index + 1}
                  </p>
                  {acciones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarAccion(index)}
                      className="text-xs text-red-500"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-600">
                    Funcionalidad
                  </label>

                  <ListadoFuncionalidades
                    value={accion.funcionalidad}
                    onChange={(nuevoValor) =>
                      handleSeleccionarFuncionalidad(
                        index,
                        nuevoValor,
                        funcionalidades
                      )
                    }
                  />

                  {/* Parámetros dinámicos */}
                  {accion.funcionalidad &&
                    funcionalidades &&
                    funcionalidades[accion.funcionalidad] && (
                      <div className="mt-3 flex flex-col gap-3">
                        {Object.entries(
                          funcionalidades[accion.funcionalidad].parametros
                        ).map(([paramID, def]) => (
                          <div
                            key={paramID}
                            className="flex flex-col gap-1"
                          >
                            <label className="text-xs text-gray-600">
                              {paramID.charAt(0).toUpperCase() +
                                paramID.slice(1)}
                            </label>

                            {def.tipo === "number" && (
                              <input
                                type="number"
                                min={def.min}
                                max={def.max}
                                className="border rounded-lg px-3 py-1.5 text-sm"
                                value={accion.parametros?.[paramID] || ""}
                                onChange={(e) =>
                                  handleChangeAccionParametro(
                                    index,
                                    paramID,
                                    e.target.value
                                  )
                                }
                              />
                            )}

                            {def.tipo === "string" && (
                              <input
                                type="text"
                                className="border rounded-lg px-3 py-1.5 text-sm"
                                value={accion.parametros?.[paramID] || ""}
                                onChange={(e) =>
                                  handleChangeAccionParametro(
                                    index,
                                    paramID,
                                    e.target.value
                                  )
                                }
                              />
                            )}

                            {def.tipo === "select" && (
                              <select
                                className="border rounded-lg px-3 py-1.5 text-sm"
                                value={accion.parametros?.[paramID] || ""}
                                onChange={(e) =>
                                  handleChangeAccionParametro(
                                    index,
                                    paramID,
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">
                                  Seleccioná una opción
                                </option>
                                {def.valores.map((v) => (
                                  <option key={v} value={v}>
                                    {v}
                                  </option>
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
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-2 rounded-full border border-gray-200 text-sm"
            >
              Volver
            </button>
          )}

          {step < 2 && (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-2 rounded-full bg-violet-500 text-white text-sm font-semibold"
            >
              Siguiente
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2 rounded-full bg-violet-500 text-white text-sm font-semibold disabled:opacity-50"
            >
              {isPending
                ? esEdicion
                  ? "Guardando cambios..."
                  : "Guardando..."
                : esEdicion
                ? "Guardar cambios"
                : "Guardar escena"}
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default AgregarEscena;
