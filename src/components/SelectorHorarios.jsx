import React from "react";
import { DIAS_SEMANA } from "../helpers/constants";

const SelectorHorarios = ({ value, onChange }) => {
  const horarios = value && value.length ? value : [{ dia: "", hora: "" }];

  const handleChangeItem = (index, campo, nuevoValor) => {
    const nuevos = horarios.map((h, i) =>
      i === index ? { ...h, [campo]: nuevoValor } : h
    );
    onChange(nuevos);
  };

  const handleAdd = () => {
    onChange([...horarios, { dia: "", hora: "" }]);
  };

  const handleRemove = (index) => {
    const nuevos = horarios.filter((_, i) => i !== index);
    onChange(nuevos.length ? nuevos : [{ dia: "", hora: "" }]);
  };

  return (
    <div className="flex flex-col gap-3">
      {horarios.map((h, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center gap-2"
        >
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <select
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              value={h.dia}
              onChange={(e) =>
                handleChangeItem(index, "dia", e.target.value)
              }
            >
              <option value="">Día de la semana</option>
              {DIAS_SEMANA.map((dia) => (
                <option key={dia} value={dia}>
                  {dia}
                </option>
              ))}
            </select>

            <input
              type="time"
              className="sm:w-28 w-full rounded-lg border border-gray-200 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
              value={h.hora}
              onChange={(e) =>
                handleChangeItem(index, "hora", e.target.value)
              }
            />
          </div>

          {horarios.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="text-xs text-red-500 px-2 self-end sm:self-auto"
            >
              Eliminar
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="self-start text-xs text-violet-600 font-semibold"
      >
        + Agregar día y horario
      </button>
    </div>
  );
};

export default SelectorHorarios;
