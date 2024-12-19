type SwitchProps = {
  isYear: boolean;
  setIsYear: (isYear: boolean) => void;
};

export const Switch: React.FC<SwitchProps> = ({ isYear, setIsYear }) => {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <button
          className={`${
            isYear ? "bg-sky-400 text-white" : "bg-white text-sky-400"
          } px-4 py-2 rounded-lg font-semibold`}
          onClick={() => setIsYear(true)}
        >
          Year
        </button>
        <button
          className={`${
            isYear ? "bg-white text-sky-400" : "bg-sky-400 text-white"
          } px-4 py-2 rounded-lg font-semibold`}
          onClick={() => setIsYear(false)}
        >
          Artist
        </button>
      </div>
    </div>
  );
};
