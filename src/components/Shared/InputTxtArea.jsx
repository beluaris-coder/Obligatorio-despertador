const InputTextarea = ({ label, value, onChange, placeholder = "", rows = 3 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col gap-2">
      <label className="text-sm font-semibold">{label}</label>

      <textarea className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
        rows={rows} placeholder={placeholder} value={value} onChange={onChange}
      />
    </div>
  );
};

export default InputTextarea;
