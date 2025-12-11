
const BloqueDuracion = (props) => {
    const { titulo, texto } = props;

    return (
        <article className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold mb-1"> {titulo} </h2>
            <p className="text-sm text-gray-500"> {texto} min </p>
        </article>
    )
}

export default BloqueDuracion