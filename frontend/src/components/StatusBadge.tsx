import type { ApplicationStatus } from "@/types";

export const statusLabels: Record<ApplicationStatus, string> = {
  SAVED: "Salva",
  APPLIED: "Aplicada",
  IN_PROGRESS: "Em andamento",
  FINISHED: "Finalizada",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{statusLabels[status]}</span>;
}
