import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CardJuegoMatematico from "./CardJuegoMatematico";

// Generar una operación según la dificultad elegida
const generarOperacion = (dificultad) => {
  // media → multiplicación
  if (dificultad === "media") {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    return { texto: `${a} × ${b}`, resultado: a * b };
  }

  // dificil → división
  if (dificultad === "dificil") {
    const resultado = Math.floor(Math.random() * 20) + 2;
    const divisor = Math.floor(Math.random() * 8) + 2;
    const dividendo = resultado * divisor;
    return { texto: `${dividendo} ÷ ${divisor}`, resultado };
  }

  // fácil → suma
  const a = Math.floor(Math.random() * 20) + 1;
  const b = Math.floor(Math.random() * 20) + 1;
  return { texto: `${a} + ${b}`, resultado: a + b };
};

const JuegoMatematico = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const dificultad = params.get("dificultad") || "facil";

  const [respuesta, setRespuesta] = useState("");
  const [error, setError] = useState("");
  const [resuelto, setResuelto] = useState(false);

  // Genera una nueva operación cada vez que cambia la dificultad
  const operacion = useMemo(
    () => generarOperacion(dificultad),
    [dificultad]
  );

  // Manejar cambios en el input
  const handleChangeRespuesta = (valor) => {
    setRespuesta(valor);
    if (error) setError(""); // limpia error al volver a escribir
  };

  // Validación de la respuesta
  const handleSubmit = (e) => {
    e.preventDefault();
    if (resuelto) return; // si ya está resuelto lo ignora

    // convierto la respuesta a número
    const numero = Number(String(respuesta).replace(",", "."));

    if (Number.isNaN(numero)) {
      setError("Ingresá un número válido.");
      return;
    }

    if (numero !== operacion.resultado) {
      setError("Respuesta incorrecta. Probá de nuevo.");
      return;
    }

    setResuelto(true);
  };

  // Botón para volver al inicio
  const handleSalir = () => navigate("/");

  useEffect(() => {
    const handler = (e) => {
      if (!resuelto) {
        e.preventDefault();
        e.returnValue = ""; // necesario para Chrome
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [resuelto]);


  return (
    <section className="min-h-screen bg-gray-50 flex flex-col p-4 pb-8">
      <main className="flex-1 flex items-center justify-center">
        <CardJuegoMatematico
          dificultad={dificultad}
          operacionTexto={operacion.texto}
          respuesta={respuesta}
          error={error}
          resuelto={resuelto}
          onChangeRespuesta={handleChangeRespuesta}
          onSubmit={handleSubmit}
          onSalir={handleSalir}
        />
      </main>
    </section>
  );
};

export default JuegoMatematico;
