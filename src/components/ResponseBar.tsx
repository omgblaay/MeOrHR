type ResponseBarProps = {
  responseRate: number;
  className?: string;
};

export default function ResponseBar({
  responseRate,
  className = "w-28 h-4",
}: ResponseBarProps) {
  const safeResponseRate = Math.min(100, Math.max(0, responseRate));

  return (
    <div
      className={`relative overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-label={`${safeResponseRate}% response rate`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeResponseRate}
    >
      <span className="left-2 m-0 z-20 text-xs invert top-0 absolute font-extrabold">
        {responseRate}%
      </span>
      <span
        className="block h-full bg-[#35a36f]"
        style={{ width: `${safeResponseRate}%` }}
      />
    </div>
  );
}
