import { useState, useEffect } from "react";
import { validarPaso1, validarPaso2 } from "../helpers/escenas";

export const useEscenaForm = (escenaExistente) => {
  const [step, setStep] = useState(1);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [horarios, setHorarios] = useState([{ dia: "", hora: "" }]);
  const [acciones, setAcciones] = useState([{ funcionalidad: "", parametros: {} }]);
  const [errorLocal, setErrorLocal] = useState("");

  useEffect(() => {
    if (!escenaExistente) return;

    setTitulo(escenaExistente.titulo || "");
    setDescripcion(escenaExistente.descripcion || "");

    const parsedHorarios = (escenaExistente.diasHorarios || []).map((linea) => {
      if (!linea) return { dia: "", hora: "" };
      const [dia, hora] = linea.split(" ");
      return { dia, hora };
    });

    setHorarios(parsedHorarios.length ? parsedHorarios : [{ dia: "", hora: "" }]);

    setAcciones(
      escenaExistente.acciones?.length
        ? escenaExistente.acciones.map((a) => ({
            funcionalidad: a.funcionalidad || "",
            parametros: a.parametros || {},
          }))
        : [{ funcionalidad: "", parametros: {} }]
    );
  }, [escenaExistente]);

  const nextStep = () => {
    if (step === 1) {
      const error = validarPaso1(titulo, horarios);
      if (error) {
        setErrorLocal(error);
        return;
      }
    }
    setErrorLocal("");
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setErrorLocal("");
    setStep((s) => s - 1);
  };

  const handleSeleccionarFuncionalidad = (index, funcionalidadID, funcionalidadesData) => {
    const definicion = funcionalidadesData?.[funcionalidadID]?.parametros || {};
    const nuevosParametros = {};
    Object.keys(definicion).forEach((p) => {
      nuevosParametros[p] = "";
    });
    setAcciones((prev) => prev.map((a, i) => (i === index ? { funcionalidad: funcionalidadID, parametros: nuevosParametros } : a)));
  };

  const handleChangeAccionParametro = (index, parametro, valor) => {
    setAcciones((prev) => prev.map((accion, i) => (i === index ? { ...accion, parametros: { ...accion.parametros, [parametro]: valor } } : accion)));
  };

  const handleAgregarAccion = () => setAcciones((prev) => [...prev, { funcionalidad: "", parametros: {} }]);
  const handleEliminarAccion = (index) => setAcciones((prev) => prev.filter((_, i) => i !== index));

  return {
    step,
    setStep,
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    horarios,
    setHorarios,
    acciones,
    setAcciones,
    errorLocal,
    setErrorLocal,
    nextStep,
    prevStep,
    handleSeleccionarFuncionalidad,
    handleChangeAccionParametro,
    handleAgregarAccion,
    handleEliminarAccion,
  };
};