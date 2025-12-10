import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardJuegoMatematico from "./CardJuegoMatematico";

const generarOperacion = (dificultad) => {
  if (dificultad === "media") {
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    return { texto: `${a} × ${b}`, resultado: a * b };
  }

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

  const operacion = useMemo(
    () => generarOperacion(dificultad),
    [dificultad]
  );

  const handleChangeRespuesta = (valor) => {
    setRespuesta(valor);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resuelto) return;

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

  const handleSalir = () => navigate("/");

  useEffect(() => {
    const handler = (e) => {
      if (!resuelto) {
        e.preventDefault();
        e.returnValue = "";
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
