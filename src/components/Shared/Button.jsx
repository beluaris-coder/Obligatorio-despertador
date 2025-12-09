const Button = (props) => {
    const { label, variante, onClick, disabled} = props;

    const baseEstilos = "w-full py-2 rounded-full text-sm font-semibold";

    const estilos =
        variante === "primario" ? "bg-violet-500 text-white"
            : variante === "secundario" ? "border border-violet-200 text-violet-600"
                : variante === "peligro" ? "bg-red-100 text-red-600 disabled:opacity-50"
                    : "bg-gray-200 text-gray-700";

    return (
        <button
            className={baseEstilos + " " + estilos} //el espacio es para que no queden pegadas las clases
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;
