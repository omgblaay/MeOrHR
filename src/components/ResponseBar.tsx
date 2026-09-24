type ResponseBarProps = {
  responseRate: number;
  className?: string;
};

export default function ResponseBar({
  responseRate,
  className = "w-28",
}: ResponseBarProps) {
  const safeResponseRate = Math.min(100, Math.max(0, responseRate));

  return (
    <div
      className={`h-2 overflow-hidden rounded-full bg-slate-200 ${className}`}
      role="progressbar"
      aria-label={`${safeResponseRate}% response rate`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeResponseRate}
    >
      <span
        className="block h-full bg-[#35a36f]"
        style={{ width: `${safeResponseRate}%` }}
      />
    </div>
  );
}
