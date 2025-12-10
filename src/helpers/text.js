export const capitalizar = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

export const labelFuncionalidad = (texto) => {
  if (!texto) return "";
  return texto
    .replace(/_/g, " ")      // convierte guiones bajos a espacios
    .replace(/\b\w/g, (l) => l.toUpperCase());  // pone cada palabra con mayúscula
};
