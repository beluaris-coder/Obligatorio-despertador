const HeaderNoticia = (props) => {
  const { categoria, titulo, tag, fecha } = props;
  return (
    <div className="absolute bottom-4 left-0 right-0 p-4 bg-linear-to-t from-black to-transparent">
      <span className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full mb-2 capitalize">
        {categoria}
      </span>
      <h1 className="text-2xl font-bold text-white mb-1">{titulo}</h1>
      <p className="text-sm text-gray-300">
        {tag} - {fecha}
      </p>
    </div>
  );
};

export default HeaderNoticia;
