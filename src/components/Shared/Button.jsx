const Button = (props) => {
    const { label, variante, onClick, disabled, type } = props;

    const baseEstilos = "w-full py-1.5 rounded-full text-sm font-semibold cursor-pointer";

    let estilos = "";

    switch (variante) {
        case "primario":
            estilos = "bg-violet-500 text-white";
            break;

        case "secundario":
            estilos = "border border-violet-400 text-violet-600";
            break;

        case "peligro":
            estilos = "border border-red-400 text-red-600 disabled:opacity-50";
            break;

        case "peligro-solido":
            estilos = "bg-red-500 text-white";
            break;

        case "neutro":
            estilos = "border border-gray-200 text-gray-700";
            break;

        default:
            estilos = "bg-gray-200 text-gray-700";
    }


    return (
        <button
            type={type}
            className={`${baseEstilos} ${estilos}`}
            onClick={onClick}
            disabled={disabled}
        >
            {label}
        </button>
    );
};

export default Button;
