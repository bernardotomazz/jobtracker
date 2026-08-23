import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand${compact ? " compact" : ""}`} to="/" aria-label="Job Tracker - início">
      Job Tracker
    </Link>
  );
}
