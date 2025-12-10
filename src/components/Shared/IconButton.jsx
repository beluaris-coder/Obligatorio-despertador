const IconButton = (props) => {
  const { icon: Icon, variante, bgColor, textColor } = props;

  const baseEstilos = "flex items-center justify-center rounded-full";

  const estilos =
    variante === "small" ? `w-7 h-7 ${bgColor || "bg-violet-100"} ${textColor || "text-violet-500"}`
      : variante === "medium" ? "w-8 h-8 bg-violet-100 text-violet-500"
      : "";

  const tamanioIcono =
    variante === "small" ? "w-3 h-3"
      : variante === "medium" ? "w-4 h-4"
      : "";

  return (
    <button className={baseEstilos + " " + estilos}>
      {Icon && <Icon className={tamanioIcono} />}
    </button>
  );
};

export default IconButton;
