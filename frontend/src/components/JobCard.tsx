import { ArrowRight, Banknote, BriefcaseBusiness, MapPin, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { StatusBadge, statusLabels } from "@/components/StatusBadge";
import { relativeDate, workModeLabels } from "@/lib/jobFormatters";
import type { ApplicationStatus, JobApplication } from "@/types";

const statuses = Object.keys(statusLabels) as ApplicationStatus[];

interface JobCardProps {
  job: JobApplication;
  onOpen: () => void;
  onStatus: (status: ApplicationStatus) => void;
}

export function JobCard({ job, onOpen, onStatus }: JobCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <article className="job-card">
      <div className="job-card-top">
        <StatusBadge status={job.status} />
        <div className="card-menu-wrap">
          <button className="icon-button subtle" onClick={() => setMenuOpen((value) => !value)} aria-label="Alterar status">
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div className="card-menu">
              <small>Mover para</small>
              {statuses.map((status) => (
                <button key={status} disabled={status === job.status} onClick={() => { onStatus(status); setMenuOpen(false); }}>
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="job-card-main" onClick={onOpen}>
        <strong>{job.title}</strong>
        <span>{job.company}</span>
      </button>
      <div className="job-meta">
        {job.salaryRange && <span className="job-salary"><Banknote size={13} /> {job.salaryRange}</span>}
        {job.workMode && <span><BriefcaseBusiness size={12} /> {workModeLabels[job.workMode]}</span>}
        {job.location && <span><MapPin size={12} /> {job.location}</span>}
      </div>
      <button className="job-card-footer" onClick={onOpen}>
        <span>{relativeDate(job.updatedAt)}</span>
        <ArrowRight size={17} />
      </button>
    </article>
  );
}
