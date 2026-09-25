import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }

        window.scrollTo({ left: 0, top: 0, behavior: "auto" });
      });

      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ left: 0, top: 0, behavior: "auto" });
  }, [hash, pathname]);

  return null;
}
