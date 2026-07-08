import { useEffect, useState } from "react";

export function useHash() {
  const [hash, setHash] = useState(() => window.location.hash || "#");
  useEffect(() => {
    const h = () => setHash(window.location.hash || "#");
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return hash;
}
