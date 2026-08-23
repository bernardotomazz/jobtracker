import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, Banknote, BriefcaseBusiness, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { statusLabels } from "@/components/StatusBadge";
import { relativeDate, workModeLabels } from "@/lib/jobFormatters";
import type { ApplicationStatus, JobApplication } from "@/types";

const statuses = Object.keys(statusLabels) as ApplicationStatus[];
const statusOrder: Record<ApplicationStatus, number> = {
  SAVED: 0,
  APPLIED: 1,
  IN_PROGRESS: 2,
  FINISHED: 3,
};

type SortKey = "title" | "status" | "workMode" | "location" | "updatedAt";
type SortDirection = "asc" | "desc";

const sortLabels: Record<SortKey, string> = {
  title: "Vaga",
  status: "Status",
  workMode: "Modalidade",
  location: "Localização",
  updatedAt: "Atualização",
};

interface JobListProps {
  jobs: JobApplication[];
  onOpen: (job: JobApplication) => void;
  onStatus: (job: JobApplication, status: ApplicationStatus) => void;
}

export function JobList({ jobs, onOpen, onStatus }: JobListProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedJobs = useMemo(() => [...jobs].sort((first, second) => {
    let comparison = 0;
    if (sortKey === "status") {
      comparison = statusOrder[first.status] - statusOrder[second.status];
    } else if (sortKey === "updatedAt") {
      comparison = new Date(first.updatedAt).getTime() - new Date(second.updatedAt).getTime();
    } else {
      const firstValue = sortKey === "workMode"
        ? (first.workMode ? workModeLabels[first.workMode] : "")
        : (first[sortKey] || "");
      const secondValue = sortKey === "workMode"
        ? (second.workMode ? workModeLabels[second.workMode] : "")
        : (second[sortKey] || "");
      comparison = firstValue.localeCompare(secondValue, "pt-BR", { sensitivity: "base" });
    }
    return sortDirection === "asc" ? comparison : -comparison;
  }), [jobs, sortDirection, sortKey]);

  const changeSort = (nextKey: SortKey) => {
    if (nextKey === sortKey) {
      setSortDirection((current) => current === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === "updatedAt" ? "desc" : "asc");
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ArrowUpDown size={15} />;
    return sortDirection === "asc" ? <ArrowUp size={15} /> : <ArrowDown size={15} />;
  };

  return (
    <div className="job-list-view">
      <div className="mobile-list-sort">
        <label htmlFor="mobile-list-order">Ordenar por</label>
        <select
          id="mobile-list-order"
          value={`${sortKey}:${sortDirection}`}
          onChange={(event) => {
            const [nextKey, nextDirection] = event.target.value.split(":") as [SortKey, SortDirection];
            setSortKey(nextKey);
            setSortDirection(nextDirection);
          }}
        >
          <option value="updatedAt:desc">Mais recentes</option>
          <option value="updatedAt:asc">Mais antigas</option>
          <option value="title:asc">Vaga: A–Z</option>
          <option value="title:desc">Vaga: Z–A</option>
          <option value="status:asc">Status</option>
          <option value="workMode:asc">Modalidade</option>
          <option value="location:asc">Localização</option>
        </select>
      </div>
      <div className="job-list-header">
        {(Object.keys(sortLabels) as SortKey[]).filter((column) => column !== "updatedAt").map((column) => (
          <button
            key={column}
            className={sortKey === column ? "active" : ""}
            onClick={() => changeSort(column)}
            aria-label={`Ordenar por ${sortLabels[column]}${sortKey === column ? `, ordem ${sortDirection === "asc" ? "crescente" : "decrescente"}` : ""}`}
          >
            {sortLabels[column]} <SortIcon column={column} />
          </button>
        ))}
        <span className="job-list-salary-heading">Faixa salarial</span>
        <button
          className={sortKey === "updatedAt" ? "active" : ""}
          onClick={() => changeSort("updatedAt")}
          aria-label={`Ordenar por Atualização${sortKey === "updatedAt" ? `, ordem ${sortDirection === "asc" ? "crescente" : "decrescente"}` : ""}`}
        >
          Atualização <SortIcon column="updatedAt" />
        </button>
        <span />
      </div>
      <div className="job-list-body">
        {sortedJobs.map((job) => (
          <article className="job-list-row" key={job.id}>
            <button className="job-list-identity" onClick={() => onOpen(job)}>
              <strong>{job.title}</strong>
              <span>{job.company}</span>
            </button>
            <label className="job-list-status">
              <span className="sr-only">Status de {job.title}</span>
              <select value={job.status} onChange={(event) => onStatus(job, event.target.value as ApplicationStatus)}>
                {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
              </select>
            </label>
            <span className="job-list-mode">
              <BriefcaseBusiness size={14} />
              {job.workMode ? workModeLabels[job.workMode] : "Não informada"}
            </span>
            <span className="job-list-location">
              <MapPin size={14} />
              {job.location || "Não informada"}
            </span>
            <span className="job-list-salary">
              <Banknote size={15} />
              {job.salaryRange || "Não informada"}
            </span>
            <span className="job-list-updated">{relativeDate(job.updatedAt)}</span>
            <button className="icon-button job-list-open" onClick={() => onOpen(job)} aria-label={`Ver detalhes de ${job.title}`} title="Ver detalhes">
              <ArrowRight size={18} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
