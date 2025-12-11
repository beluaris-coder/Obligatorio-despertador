import Button from "./Shared/Button";

const tituloPorDificultad = (dificultad) => {
  if (dificultad === "media") return "Desafío medio";
  if (dificultad === "dificil") return "Desafío difícil";
  return "Desafío fácil";
};

const CardJuegoMatematico = ({ dificultad, operacionTexto, respuesta, error, resuelto, onChangeRespuesta, onSubmit, onSalir }) => {

  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
      <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide"> {tituloPorDificultad(dificultad)} </p>

      <div className="text-center my-2">
        <p className="text-sm text-gray-600 mb-1"> Resolv&eacute; la siguiente operación: </p>
        <p className="text-3xl font-bold text-gray-900"> {operacionTexto} </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3 mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-600"> Tu respuesta </label>
          <input type="number" step="any" inputMode="decimal" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            value={respuesta} onChange={(e) => onChangeRespuesta(e.target.value)} disabled={resuelto}
          />
          {error && (
            <p className="text-xs text-red-500 mt-1"> {error} </p>
          )}
        </div>

        {!resuelto && (
          <Button type="submit" variante="primario" label="Comprobar" />
        )}

        {resuelto && (
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-sm text-green-600 font-medium text-center"> ¡Correcto! La alarma se apagó. </p>
            <Button type="button" variante="primario" label="Continuar" onClick={onSalir} />
          </div>
        )}
      </form>
    </div>
  );
};

export default CardJuegoMatematico;
