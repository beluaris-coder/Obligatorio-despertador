import { IoArrowBack } from "react-icons/io5";

const BackButton = (props) => {
    const { label, onClick } = props;

    return (
        <button onClick={onClick} className="text-sm text-violet-500 font-medium cursor-pointer">
            <div className="flex gap-1 items-center">
                <IoArrowBack size={16} />
                {label}
            </div>

        </button>
    )
}

export default BackButton