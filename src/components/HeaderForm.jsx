import TextButton from "./Shared/TextButton";
import { useNavigate } from "react-router-dom";

const HeaderForm = ({ esEdicion, step }) => {
    const navigate = useNavigate();

    return (
        <>
            <header className="flex items-center justify-between mb-2">
                <TextButton label="Volver" onClick={() => navigate(-1)} variante="volver" />
                <h1 className="text-xl font-semibold"> {esEdicion ? "Editar escena" : "Nueva escena"} </h1>
                <span className="text-xs text-gray-500"> Paso {step} de 2 </span>
            </header><div className="flex items-center gap-2 mb-2">

                <div className={`flex-1 h-1 rounded-full ${step >= 1 ? "bg-violet-400" : "bg-gray-200"}`} />
                <div className={`flex-1 h-1 rounded-full ${step >= 2 ? "bg-violet-400" : "bg-gray-200"}`} />
            </div>
        </>
    );
};

export default HeaderForm;
