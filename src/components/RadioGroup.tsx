export default function RadioGroup({
  name,
  value,
  options,
  onChange,
  className = "",
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <span
      className={`flex flex-row overflow-hidden rounded-xl border border-brandgray-200 bg-brandgray-200 p-px text-lime-900 ${className}`}
    >
      {options.map((option) => (
        <label
          key={option}
          className={`relative flex h-10 flex-1 cursor-pointer items-center justify-center px-2 text-center text-sm font-semibold transition rounded-xl ${
            value === option
              ? "z-10 bg-lime-400 "
              : "text-brandgray-500 hover:bg-lime-200 hover:text-gray-900"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          {option}
        </label>
      ))}
    </span>
  );
}
