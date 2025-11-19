const DetallesMedio = (props) => {
  const { img, nombre, verificado } = props;
  return (
    <div className="flex items-center mb-4">
      <img src={img} alt={nombre} className="w-10 h-10 rounded-full mr-3" />
      <div className="flex gap-1">
        <h2 className="font-bold">{nombre}</h2>
        {verificado && (
          <span className="material-symbols-outlined text-blue-400">
            verified
          </span>
        )}
      </div>
    </div>
  );
};

export default DetallesMedio;
