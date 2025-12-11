export const capitalizar = (texto) =>
  texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

export const labelFuncionalidad = (texto) => {
  if (!texto) return "";

  return texto
    .replace(/_/g, " ") 
    .split(" ")
    .map(
      (palabra) =>
        palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    )
    .join(" ");
};
