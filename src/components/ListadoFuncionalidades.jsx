import { useFuncionalidades } from "../hooks/useFuncionalidades";
import { labelFuncionalidad } from "../helpers/text";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";


const ListadoFuncionalidades = (props) => {
    const { value, onChange } = props;
    
    // Cargar lista de funcionalidades desde Firebase (hook)
    const { data: funcionalidades = {}, isLoading, error } = useFuncionalidades();

    // Convertir el objeto en un array usable por el select
    const opciones = Object.entries(funcionalidades).map(([id, info]) => ({ id, nombre: info?.nombre || id })); //si no hay nombre usamos el Id

    if (isLoading) {
        return (
            <div className="text-xs text-gray-400 flex items-center gap-2">
                <Loader /> <span>Cargando funcionalidades...</span>
            </div>
        );
    }

    if (error) {
        return <Message variant="error" message={error.message || "Error al cargar funcionalidades"} />
    }

    return (
        <select
            className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Seleccioná una funcionalidad</option>

            {opciones.map((f) => (
                <option key={f.id} value={f.id}>
                    {labelFuncionalidad(f.nombre)}
                </option>
            ))}
        </select>
    );
};

export default ListadoFuncionalidades;
