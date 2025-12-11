import SelectorHorarios from "./SelectorHorarios";
import InputText from "./Shared/InputTxt";
import InputTextarea from "./Shared/InputTxtArea";

const Paso1Form = (props) => {
    const { titulo, setTitulo, descripcion, setDescripcion, horarios, setHorarios, duracion, setDuracion } = props;

    return (
        <div className="flex flex-col gap-4">
            <InputText label="Nombre de la escena" placeholder="Ej: Despertar suave" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
            <InputTextarea label="Descripción" placeholder="Ej: Enciende luces y música..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3}/>

            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
                <label className="text-sm font-semibold"> Días y horarios programados </label>
                <p className="text-xs text-gray-500 mb-1"> Elegí uno o varios días de la semana y un horario para ejecutar esta escena.</p>
                <SelectorHorarios value={horarios} onChange={setHorarios} />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
                <label className="text-sm font-semibold">Duración (minutos)</label>
                <p className="text-xs text-gray-500 mb-1">La escena se detendrá automáticamente luego de este tiempo. Si quiere detenerla manualmente ingrese 0.</p>
                <input type="number" min={0} step={1} className="border rounded-lg px-3 py-1.5 text-sm w-32" value={duracion} onChange={(e) => setDuracion(Math.max(0, Number(e.target.value || 0)))}/>
            </div> 
        </div>
    );
};

export default Paso1Form;
