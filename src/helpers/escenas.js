export const parsearDiasHorarios = (horarios) =>
  horarios
    .filter((h) => h.dia && h.hora)
    .map((h) => `${h.dia} ${h.hora}`);


export const limpiarAcciones = (acciones) =>
  acciones.filter((a) => a.funcionalidad?.trim());


export const validarPaso1 = (titulo, horarios) => {
  if (!titulo.trim()) return "La escena debe tener un nombre.";

  // Cada fila debe tener ambos (día Y hora) o ninguno
  for (const h of horarios) {
    const tieneDia = h.dia && h.dia.trim();
    const tieneHora = h.hora && h.hora.trim();
    if ((tieneDia && !tieneHora) || (!tieneDia && tieneHora)) {
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
  // diasHorarios puede ser vacío (modo manual), no forzamos su existencia aquí
  const accionesValidas = acciones.filter((a) => a.funcionalidad?.trim());
  if (accionesValidas.length === 0) return "Agregá al menos una acción para la escena.";
  return null;
};