import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand${compact ? " compact" : ""}`} to="/" aria-label="Waldo - início">
      Waldo
    </Link>
  );
}
