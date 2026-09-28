import { productBrandLogos } from "../lib/productBrandLogos";

export default function ProductBrandIcon({
  name,
  size,
  className = "",
}: {
  name: string;
  size: number | string;
  className?: string;
}) {
  return (
    <img
      src={productBrandLogos[name.toLowerCase()]}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
