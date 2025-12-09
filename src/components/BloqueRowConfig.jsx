// BloqueRowConfig.jsx
import React, { useState } from "react";
import { MdChevronRight } from "react-icons/md";

const BloqueRowConfig = ({
  icon: Icon,
  titulo,
  subtitulo,
  tieneToggle = false,
}) => {
  const [activo, setActivo] = useState(false);

  const handleToggleClick = (e) => {
    e.stopPropagation();
    setActivo((prev) => !prev);
  };

  return (
    <button
      type="button"
      className="w-full flex items-center justify-between py-2 text-left"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center text-violet-500">
            <Icon className="w-4 h-4" />
          </span>
        )}

        <div>
          <p className="text-sm font-medium">{titulo}</p>
          {subtitulo && <p className="text-xs text-gray-500">{subtitulo}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {tieneToggle ? (
          <div
            onClick={handleToggleClick}
            className={`w-9 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${
              activo ? "bg-violet-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                activo ? "translate-x-4" : ""
              }`}
            />
          </div>
        ) : (
          <MdChevronRight className="text-gray-400" />
        )}
      </div>
    </button>
  );
};

export default BloqueRowConfig;
