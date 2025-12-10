export const parsearDiasHorarios = (horarios) =>
  horarios
    .filter((h) => h.dia && h.hora)
    .map((h) => `${h.dia} ${h.hora}`);


export const limpiarAcciones = (acciones) =>
  acciones.filter((a) => a.funcionalidad?.trim());


export const validarPaso1 = (titulo, horarios) => {
  if (!titulo.trim()) return "La escena debe tener un nombre.";

  // Validar que cada fila tenga ambos (dia Y hora) o ninguno
  for (const h of horarios) {
    const tienedia = h.dia && h.dia.trim();
    const tienehora = h.hora && h.hora.trim();

    // Si tiene uno pero no el otro da error
    if ((tienedia && !tienehora) || (!tienedia && tienehora)) {
      return "Cada día debe tener un horario asignado (o dejar ambos vacíos).";
    }
  }

  return null;
};


export const validarPaso2 = (acciones) => {
  const accionesValidas = acciones.filter((a) => a.funcionalidad?.trim());
  if (accionesValidas.length === 0) return "Agregá al menos una acción para la escena.";

  // Validar que cada acción tenga todos sus parámetros completos
  for (const accion of accionesValidas) {
    const parametros = accion.parametros || {};
    for (const [key, valor] of Object.entries(parametros)) {
      if (valor === "" || valor === null || valor === undefined) {
        return `La acción "${accion.funcionalidad}" tiene parámetros incompletos.`;
      }
    }
  }

  return null;
};

export const validarEscena = (titulo, diasHorarios, acciones) => {
  if (!titulo.trim()) return "La escena debe tener un nombre.";
  if (diasHorarios.length === 0) return "Agregá al menos un día y horario para la escena.";
  if (acciones.length === 0) return "Agregá al menos una acción para la escena.";
  return null;
};