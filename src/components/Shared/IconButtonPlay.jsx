const IconButtonPlay = (props) => {
  const { icon: Icon, onClick, loading = false, animando = false, className = "" } = props;

  return (
    <div onClick={onClick} className={`absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center cursor-pointer ${className}`} >
      {loading && (
        <div className="absolute w-10 h-10 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
      )}

      <div
        className={`bg-white/90 w-9 h-9 rounded-full flex items-center justify-center shadow transition-transform duration-150 ${
          animando ? "scale-90" : "scale-100"
        }`}
      >
        <Icon className="text-gray-600 text-xl" />
      </div>
    </div>
  );
};

export default IconButtonPlay;
