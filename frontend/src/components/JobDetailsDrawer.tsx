import { ExternalLink, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge, statusLabels } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import type { ApplicationStatus, JobApplication } from "@/types";

const workModeLabels = { REMOTE: "Remoto", HYBRID: "Híbrido", ONSITE: "Presencial" } as const;
const statuses = Object.keys(statusLabels) as ApplicationStatus[];

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(new Date(value));
}

function Detail({ title, children }: { title: string; children: React.ReactNode }) {
  if (!children) return null;
  return <section className="detail-section"><h3>{title}</h3><div>{children}</div></section>;
}

interface JobDetailsDrawerProps {
  jobId: string | null;
  onClose: () => void;
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
  onUpdated: (job: JobApplication) => void;
}

export function JobDetailsDrawer({ jobId, onClose, onEdit, onDelete, onUpdated }: JobDetailsDrawerProps) {
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) { setJob(null); return; }
    setLoading(true);
    setError("");
    api.getJob(jobId)
      .then(setJob)
      .catch((requestError: Error) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (status: ApplicationStatus) => {
    if (!job) return;
    const updated = await api.updateStatus(job.id, status);
    setJob(updated);
    onUpdated(updated);
  };

  if (!jobId) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside className="job-drawer" role="dialog" aria-modal="true" aria-label="Detalhes da vaga" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button drawer-close" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button>
        {loading && <div className="drawer-state"><LoaderCircle className="spin" /> Carregando vaga...</div>}
        {error && <div className="alert error">{error}</div>}
        {job && (
          <>
            <div className="drawer-heading">
              <h2>{job.title}</h2>
              <p>{job.company}</p>
              <StatusBadge status={job.status} />
            </div>
            <Detail title="Informações">
              <p>{[job.workMode ? workModeLabels[job.workMode] : null, job.location].filter(Boolean).join(" · ") || "Não informado"}</p>
              {job.salaryRange && <p>{job.salaryRange}</p>}
              {job.appliedAt && <p>Candidatura em {formatDate(job.appliedAt)}</p>}
              {job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noreferrer">Abrir anúncio <ExternalLink size={14} /></a>}
            </Detail>
            <Detail title="Descrição">{job.description && <p>{job.description}</p>}</Detail>
            <Detail title="Requisitos principais">{job.mainRequirements && <p>{job.mainRequirements}</p>}</Detail>
            <Detail title="Qualificações desejadas">{job.desiredRequirements && <p>{job.desiredRequirements}</p>}</Detail>
            <Detail title="Acompanhamento">{job.processDetails && <p>{job.processDetails}</p>}</Detail>
            <Detail title="Notas">{job.notes && <p>{job.notes}</p>}</Detail>
            <div className="drawer-actions">
              <button className="button secondary" onClick={() => onEdit(job)}>Editar</button>
              <label className="status-select-label">
                <span className="sr-only">Alterar status</span>
                <select value={job.status} onChange={(event) => updateStatus(event.target.value as ApplicationStatus)}>
                  {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                </select>
              </label>
              <button className="button secondary danger-text" onClick={() => onDelete(job)}>Excluir</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
