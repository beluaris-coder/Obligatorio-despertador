const Pill = (props) => {
  const { label, onClick, selected } = props;

  return (
    <button
      className={`rounded-full cursor-pointer py-2 px-4 text-xs capitalize ${
        selected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Pill;
