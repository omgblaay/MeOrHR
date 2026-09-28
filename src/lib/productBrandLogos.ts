import framerLogo from "../assets/technology/framer.webp";
import webflowLogo from "../assets/technology/webflow.svg";

export const productBrandLogos: Record<string, string> = {
  framer: framerLogo,
  webflow: webflowLogo,
};

export function hasProductBrandIcon(name: string) {
  return name.toLowerCase() in productBrandLogos;
}
