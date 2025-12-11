import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { IMAGENES_ESCENAS, API_URL } from "../helpers/constants";
import { parsearDiasHorarios, limpiarAcciones, validarEscena, validarPaso2 } from "../helpers/escenas";
import { useEscenaForm } from "../hooks/useEscenaForm";
import Paso1Form from "./Paso1Form";
import Paso2Form from "./Paso2Form";
import Message from "./Shared/Message";
import Loader from "./Shared/Loader";
import HeaderForm from "./HeaderForm";
import Button from "./Shared/Button";
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

  // Cargar lista de funcionalidades desde Firebase
  const { data: funcionalidades = {}, isLoading: isLoadingFuncionalidades, error: errorFuncionalidades } = useQuery({
    queryKey: ["funcionalidades"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/funcionalidades.json`);
      if (!res.ok) throw new Error("Error al cargar funcionalidades");
      return res.json();
    },
  });

  //Manejo del form (hook)
  const { step, titulo, setTitulo, descripcion, setDescripcion, horarios, setHorarios, duracion, setDuracion, acciones, errorLocal, setErrorLocal, nextStep, prevStep,
    handleSeleccionarFuncionalidad, handleChangeAccionParametro, handleAgregarAccion, handleEliminarAccion } = useEscenaForm(escenaExistente);

  //Submit final (para crear o editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const diasHorarios = parsearDiasHorarios(horarios);
    const accionesLimpias = limpiarAcciones(acciones);

    // Validar Paso 2
    const errorPaso2 = validarPaso2(acciones);
    if (errorPaso2) {
      setErrorLocal(errorPaso2);
      return;
    }

    // Validar escena completa
    const error = validarEscena(titulo, diasHorarios, accionesLimpias);
    if (error) {
      setErrorLocal(error);
      return;
    }

    //Asignar imagen aleatoria o mantener la existente
    const imagen = escenaExistente?.imagen || IMAGENES_ESCENAS[Math.floor(Math.random() * IMAGENES_ESCENAS.length)];

    // Objeto a guardar en Firebase
    const escenaAGuardar = { titulo: titulo.trim(), descripcion: descripcion.trim(), diasHorarios, acciones: accionesLimpias, imagen, duracion: Number.isFinite(+duracion) ? Number(duracion) : 0};

    setErrorLocal("");

    try {
      // Edición
      if (esEdicion) {
        await fetch(`${API_URL}/escenas/${id}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(escenaAGuardar),
        });

        updateEscena(id, escenaAGuardar); // update local
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
          addEscena({ id: newId, ...escenaAGuardar }); // update local
        }

        navigate("/");
      }

    } catch (err) {
      setErrorLocal(err.message || "Error al guardar la escena");
    }
  };

  //Estados de carga y errores
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
          <Paso1Form
            titulo={titulo}
            setTitulo={setTitulo}
            descripcion={descripcion}
            setDescripcion={setDescripcion}
            horarios={horarios}
            setHorarios={setHorarios}
            duracion={duracion}
            setDuracion={setDuracion}
          />
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <Paso2Form
            acciones={acciones}
            funcionalidades={funcionalidades}
            isLoadingFuncionalidades={isLoadingFuncionalidades}
            handleAgregarAccion={handleAgregarAccion}
            handleEliminarAccion={handleEliminarAccion}
            handleSeleccionarFuncionalidad={handleSeleccionarFuncionalidad}
            handleChangeAccionParametro={handleChangeAccionParametro}
          />
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
            <Button type="submit" variante="primario" label={esEdicion ? "Guardar cambios" : "Guardar escena"} />
          )}
        </div>
      </form>
    </section>
  );
};

export default FormEscena;
