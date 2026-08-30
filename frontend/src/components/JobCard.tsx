import { ArrowRight, Banknote, BriefcaseBusiness, MapPin, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (menuOpen) menuItemsRef.current.find((item) => item && !item.disabled)?.focus();
    const handlePointerDown = (event: PointerEvent) => {
      if (menuOpen && !menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocusRef.current = true;
        setMenuOpen(false);
        return;
      }
      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const items = menuItemsRef.current.filter((item): item is HTMLButtonElement => item !== null && !item.disabled);
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : (currentIndex + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items[nextIndex].focus();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocusRef.current) {
        menuTriggerRef.current?.focus();
        restoreFocusRef.current = false;
      }
    };
  }, [menuOpen]);

  return (
    <article className="job-card">
      <div className="job-card-top">
        <StatusBadge status={job.status} />
        <div ref={menuRef} className="card-menu-wrap">
          <button ref={menuTriggerRef} type="button" className="icon-button subtle" onClick={() => setMenuOpen((value) => !value)} aria-label={`Alterar status de ${job.title}`} aria-haspopup="menu" aria-expanded={menuOpen} aria-controls={`job-status-menu-${job.id}`}>
            <MoreHorizontal size={18} />
          </button>
          {menuOpen && (
            <div id={`job-status-menu-${job.id}`} className="card-menu" role="menu" aria-label={`Alterar status de ${job.title}`}>
              <small>Mover para</small>
              {statuses.map((status, index) => (
                <button ref={(element) => { menuItemsRef.current[index] = element; }} type="button" role="menuitem" key={status} disabled={status === job.status} onClick={() => { onStatus(status); setMenuOpen(false); }}>
                  {statusLabels[status]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <button type="button" className="job-card-main" onClick={onOpen} aria-label={`Ver detalhes de ${job.title}`}>
        <strong>{job.title}</strong>
        <span>{job.company}</span>
      </button>
      <div className="job-meta">
        {job.salaryRange && <span className="job-salary"><Banknote size={13} /> {job.salaryRange}</span>}
        {job.workMode && <span><BriefcaseBusiness size={12} /> {workModeLabels[job.workMode]}</span>}
        {job.location && <span><MapPin size={12} /> {job.location}</span>}
      </div>
      <button type="button" className="job-card-footer" onClick={onOpen}>
        <span>{relativeDate(job.updatedAt)}</span>
        <ArrowRight size={17} />
      </button>
    </article>
  );
}
