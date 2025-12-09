import { API_URL } from "../helpers/constants";
import Loader from "./Shared/Loader";
import Message from "./Shared/Message";
import { useQuery } from "@tanstack/react-query";

const ListadoFuncionalidades = (props) => {
    const { value, onChange } = props;

    const {
        data: funcionalidades = {},
        isLoading,
        error,
    } = useQuery({
        queryKey: ["funcionalidades"],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/funcionalidades.json`);
            if (!res.ok) throw new Error("Error al cargar funcionalidades");
            const data = await res.json();
            return data || {};
        },
    });

    const opciones = Object.entries(funcionalidades).map(([id, info]) => ({
        id,
        nombre: info?.nombre || id,
    }));

    if (isLoading) {
        return (
            <div className="text-xs text-gray-400 flex items-center gap-2">
                <Loader /> <span>Cargando funcionalidades...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Message variant="error" message={error.message || "Error al cargar funcionalidades"}/>
        );
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
                    {f.nombre.charAt(0).toUpperCase() + f.nombre.slice(1)}
                </option>
            ))}
        </select>
    );
};

export default ListadoFuncionalidades;