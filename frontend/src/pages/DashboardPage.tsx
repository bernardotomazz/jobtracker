import { Columns3, List, Plus, Search } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { JobCard } from "@/components/JobCard";
import { JobDetailsDrawer } from "@/components/JobDetailsDrawer";
import { JobList } from "@/components/JobList";
import { api } from "@/lib/api";
import type { ApplicationStatus, JobApplication, WorkMode } from "@/types";

const columns: { status: ApplicationStatus; label: string }[] = [
  { status: "SAVED", label: "Salvas" },
  { status: "APPLIED", label: "Aplicadas" },
  { status: "IN_PROGRESS", label: "Em andamento" },
  { status: "FINISHED", label: "Finalizadas" },
];

type ViewMode = "kanban" | "list";

export function DashboardPage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [workMode, setWorkMode] = useState<WorkMode | "">("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => localStorage.getItem("job-tracker-view") === "list" ? "list" : "kanban");
  const initialViewMode = useRef(viewMode);
  const kanbanHasAnimated = useRef(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setJobs(await api.listJobs({ search, status, workMode }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível carregar suas vagas.");
    } finally {
      setLoading(false);
    }
  }, [search, status, workMode]);

  useEffect(() => {
    const timer = window.setTimeout(loadJobs, 250);
    return () => window.clearTimeout(timer);
  }, [loadJobs]);

  useEffect(() => {
    if (initialViewMode.current === "kanban" && viewMode === "kanban" && !loading && jobs.length > 0) {
      kanbanHasAnimated.current = true;
    }
  }, [jobs.length, loading, viewMode]);

  const grouped = useMemo(() => Object.fromEntries(columns.map(({ status: columnStatus }) => [columnStatus, jobs.filter((job) => job.status === columnStatus)])) as Record<ApplicationStatus, JobApplication[]>, [jobs]);

  const changeStatus = async (job: JobApplication, nextStatus: ApplicationStatus) => {
    try {
      const updated = await api.updateStatus(job.id, nextStatus);
      setJobs((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível alterar o status.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteJob(deleteTarget.id);
      setJobs((current) => current.filter((job) => job.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSelectedId(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível excluir a vaga.");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = Boolean(search.trim() || status || workMode);

  const changeViewMode = (nextView: ViewMode) => {
    setViewMode(nextView);
    localStorage.setItem("job-tracker-view", nextView);
  };

  const shouldAnimateKanban = initialViewMode.current === "kanban" && !kanbanHasAnimated.current;

  return (
    <div className="app-page">
      <AppHeader />
      <main className="dashboard-main" aria-busy={loading}>
        <div className="page-heading">
          <div><h1>Minhas vagas</h1><p>Acompanhe seus processos seletivos em um só lugar.</p></div>
          <button className="button primary new-job" aria-label="Criar nova vaga" onClick={() => navigate("/jobs/new")}><Plus size={18} /><span>Nova vaga</span></button>
        </div>
        <div className="filters">
          <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Buscar por título ou empresa</span><input aria-label="Buscar por título ou empresa" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por título ou empresa" /></label>
          <select value={status} onChange={(event) => setStatus(event.target.value as ApplicationStatus | "")} aria-label="Filtrar por status"><option value="">Status</option>{columns.map((column) => <option key={column.status} value={column.status}>{column.label}</option>)}</select>
          <select value={workMode} onChange={(event) => setWorkMode(event.target.value as WorkMode | "")} aria-label="Filtrar por modalidade"><option value="">Modalidade</option><option value="REMOTE">Remoto</option><option value="HYBRID">Híbrido</option><option value="ONSITE">Presencial</option></select>
          <div className="view-toggle" role="group" aria-label="Visualização das vagas">
            <button aria-pressed={viewMode === "kanban"} onClick={() => changeViewMode("kanban")}><Columns3 size={16} /> Kanban</button>
            <button aria-pressed={viewMode === "list"} onClick={() => changeViewMode("list")}><List size={16} /> Lista</button>
          </div>
        </div>

        {error && <div className="alert error dashboard-alert" role="alert">{error}</div>}
        {loading && jobs.length === 0 ? null : jobs.length === 0 ? (
          <div className="empty-state">
            <span><Search size={24} /></span>
            <h2>{filtered ? "Nenhuma vaga encontrada" : "Sua busca começa por aqui"}</h2>
            <p>{filtered ? "Tente remover ou ajustar os filtros utilizados." : "Cadastre sua primeira oportunidade para acompanhar o processo seletivo."}</p>
            {filtered ? <button className="button secondary" onClick={() => { setSearch(""); setStatus(""); setWorkMode(""); }}>Limpar filtros</button> : <button className="button primary" onClick={() => navigate("/jobs/new")}><Plus size={17} /> Nova vaga</button>}
          </div>
        ) : (
          <>
            {viewMode === "kanban" && (
              <motion.div className="kanban-board" initial={shouldAnimateKanban ? { opacity: 0, ...(prefersReducedMotion ? {} : { y: 24 }) } : false} animate={shouldAnimateKanban ? { opacity: 1, y: 0 } : undefined} transition={{ duration: prefersReducedMotion ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}>
                {columns.map((column) => (
                  <section className="kanban-column" key={column.status}>
                    <header><h2>{column.label}</h2><span>{grouped[column.status].length}</span></header>
                    <div>{grouped[column.status].map((job) => <motion.div key={job.id} initial={shouldAnimateKanban ? { opacity: 0, ...(prefersReducedMotion ? {} : { y: 24 }) } : false} animate={shouldAnimateKanban ? { opacity: 1, y: 0 } : undefined} transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, ease: [0.16, 1, 0.3, 1] }}><JobCard job={job} onOpen={() => setSelectedId(job.id)} onStatus={(nextStatus) => changeStatus(job, nextStatus)} /></motion.div>)}</div>
                  </section>
                ))}
              </motion.div>
            )}
            <div className="mobile-job-list">
              {jobs.map((job) => <JobCard key={job.id} job={job} onOpen={() => setSelectedId(job.id)} onStatus={(nextStatus) => changeStatus(job, nextStatus)} />)}
            </div>
            {viewMode === "list" && <div className="desktop-job-list"><JobList jobs={jobs} onOpen={(job) => setSelectedId(job.id)} onStatus={changeStatus} /></div>}
          </>
        )}
      </main>
      <JobDetailsDrawer
        jobId={selectedId}
        onClose={() => setSelectedId(null)}
        onEdit={(job) => navigate(`/jobs/${job.id}/edit`)}
        onDelete={setDeleteTarget}
        onUpdated={(updated) => setJobs((current) => current.map((job) => job.id === updated.id ? updated : job))}
      />
      <ConfirmDialog open={Boolean(deleteTarget)} title="Excluir esta vaga?" description={`A vaga “${deleteTarget?.title || ""}” será removida permanentemente.`} busy={deleting} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
    </div>
  );
}
