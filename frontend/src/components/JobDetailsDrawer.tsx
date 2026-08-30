import { ExternalLink, LoaderCircle, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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
  const drawerRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  onCloseRef.current = onClose;
  const [job, setJob] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!jobId) { setJob(null); return; }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api.getJob(jobId, controller.signal)
      .then(setJob)
      .catch((requestError: Error) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(drawerRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], select, input, textarea"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [jobId]);

  const updateStatus = async (status: ApplicationStatus) => {
    if (!job) return;
    try {
      const updated = await api.updateStatus(job.id, status);
      setJob(updated);
      onUpdated(updated);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível alterar o status.");
    }
  };

  if (!jobId) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
    <aside ref={drawerRef} className="job-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId} onMouseDown={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="icon-button drawer-close" onClick={onClose} aria-label="Fechar detalhes"><X size={20} /></button>
        {loading && <div className="drawer-state" role="status"><LoaderCircle className="spin" /> Carregando vaga...</div>}
        {error && <div className="alert error" role="alert">{error}</div>}
        {job && (
          <>
            <div className="drawer-heading">
              <h2 id={titleId}>{job.title}</h2>
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
