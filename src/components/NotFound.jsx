import { Link } from "react-router-dom";
import { MdSearchOff, MdHome } from "react-icons/md";
import Button from "./Shared/Button";

const NotFound = () => {

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 bg-gray-50 text-center">
      {/* Icono grande */}
      <div className="w-20 h-20 rounded-full bg-violet-100 flex items-center justify-center mb-4">
        <MdSearchOff className="w-10 h-10 text-violet-500" />
      </div>

      <p className="text-xs font-semibold tracking-[0.2em] text-violet-500 uppercase mb-1"> Error 404 </p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2"> Página no encontrada </h1>
      <p className="text-sm text-gray-500 max-w-xs mb-6">
        La pantalla que estás buscando no existe o fue movida.
        Probá volver al panel principal para seguir configurando tus escenas.
      </p>

      {/* Botón principal */}
      <Link to="/" className="w-full max-w-xs">
        <Button type="button" variante="primario" label={
            <span className="flex items-center justify-center gap-2">
              <MdHome className="w-5 h-5" />
              Volver al dashboard
            </span>
          }
        />
      </Link>

      {/* Link secundario */}
      <Link to="/config" className="mt-3 text-xs text-violet-600 font-semibold hover:underline">
        Ir a configuración
      </Link>
    </section>
  );
};

export default NotFound;
