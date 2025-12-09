import { IoArrowBack, IoAdd, IoTrash } from "react-icons/io5";

const TextButton = (props) => {
    const { label, onClick, variante, type } = props;

    const variantes = {
        volver: {
            className: "text-sm text-violet-500 font-medium",
            icon: <IoArrowBack size={16} />,
        },
        agregar: {
            className: "text-xs text-violet-600 font-semibold",
            icon: <IoAdd size={16} />,
        },
        eliminar: {
            className: "text-xs text-red-500 font-medium",
            icon: <IoTrash size={14} />,
        },
    };

    const { className, icon } = variantes[variante];

    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
        >
            <div className="flex gap-1 items-center">
                {icon}
                {label}
            </div>
        </button>
    );
};

export default TextButton