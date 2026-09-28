import logoDark from "../assets/brand/logo-dark.svg";

export default function AppLogo({
  className = "h-7 w-auto",
  alt = "MeOrHR",
}: {
  className?: string;
  alt?: string;
}) {
  return <img src={logoDark} alt={alt} className={className} />;
}
