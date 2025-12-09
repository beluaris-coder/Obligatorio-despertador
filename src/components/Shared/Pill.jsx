const Pill = (props) => {
  const { label, variante } = props;

  const baseEstilos =
    "text-xs px-2 py-1 rounded-full capitalize";

  const estilos =
    variante === "success" ? "bg-green-100 text-green-700"
      : variante === "neutral" ? "bg-gray-100 text-gray-600"
      : "bg-violet-100 text-violet-700";

  return (
    <span className={baseEstilos + " " + estilos}>
      {label}
    </span>
  );
};

export default Pill;
