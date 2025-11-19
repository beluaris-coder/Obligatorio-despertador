const IconButton = (props) => {
  const { icon, onClick, disabled } = props;

  return (
    <button
      className="bg-white/20 cursor-pointer backdrop-blur-lg hover:bg-white/45 rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="material-symbols-rounded text-white">{icon}</span>
    </button>
  );
};

export default IconButton;
