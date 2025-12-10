import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const BloqueCardConfig = ({ titulo, children, defaultAbierto = true }) => {
  const [abierto, setAbierto] = useState(defaultAbierto);

  return (
    <section className="bg-white rounded-xl shadow-sm">
      {/* Header del bloque */}
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <h2 className="text-sm font-semibold">{titulo}</h2>
        {abierto ? (
          <MdExpandLess className="text-gray-400" />
        ) : (
          <MdExpandMore className="text-gray-400" />
        )}
      </button>

      {/* Contenido interno (se muestra/oculta) */}
      {abierto && (
        <div className="border-t border-gray-100 px-4 py-2 flex flex-col gap-1">
          {children}
        </div>
      )}
    </section>
  );
};

export default BloqueCardConfig;
