export const parsearDiasHorarios = (horarios) =>
  horarios
    .filter((h) => h.dia && h.hora)
    .map((h) => `${h.dia} ${h.hora}`);

export const limpiarAcciones = (acciones) =>
  acciones.filter((a) => a.funcionalidad?.trim());

export const validarEscena = (titulo, diasHorarios, acciones) => {
  if (!titulo.trim()) return "La escena debe tener un nombre.";
  if (diasHorarios.length === 0) return "Agregá al menos un día y horario para la escena.";
  if (acciones.length === 0) return "Agregá al menos una acción para la escena.";
  return null;
};