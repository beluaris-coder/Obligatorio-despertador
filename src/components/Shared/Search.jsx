const Search = (props) => {
  const { placeholder, onChange, value } = props;
  
  return (
    <div className="bg-gray-100 border-gray-200 border-2 rounded-full p-2 w-full flex items-center gap-2 px-4 text-gray-400 text-sm">
      <span className="material-symbols-rounded">search</span>
      <input placeholder={placeholder} onChange={onChange} value={value} className=" focus-visible:outline-hidden bg-transparent grow"/>
    </div>
  );
};

export default Search;
