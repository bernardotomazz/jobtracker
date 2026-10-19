import { ArrowRight, Banknote, BriefcaseBusiness, ExternalLink, MapPin, MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { StatusBadge, statusLabels } from "@/components/StatusBadge";
import { relativeDate, workModeLabels } from "@/lib/jobFormatters";
import type { ApplicationStatus, JobApplication } from "@/types";

const statuses = Object.keys(statusLabels) as ApplicationStatus[];

interface JobCardProps {
  job: JobApplication;
  onOpen: () => void;
  onStatus: (status: ApplicationStatus) => void;
  isDragging?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLElement>) => void;
}

export function JobCard({ job, onOpen, onStatus, isDragging, onDragStart, onDragEnd }: JobCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const restoreFocusRef = useRef(false);
  const suppressClickRef = useRef(false);
  const suppressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (suppressTimerRef.current !== null) {
        window.clearTimeout(suppressTimerRef.current);
      }
    };
  }, []);

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

  const handleDragStart = (event: React.DragEvent<HTMLElement>) => {
    if (suppressTimerRef.current !== null) {
      window.clearTimeout(suppressTimerRef.current);
      suppressTimerRef.current = null;
    }
    suppressClickRef.current = true;
    setMenuOpen(false);
    onDragStart?.(event);
  };

  const handleDragEnd = (event: React.DragEvent<HTMLElement>) => {
    onDragEnd?.(event);
    suppressTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false;
      suppressTimerRef.current = null;
    }, 150);
  };

  const handleCardClick = () => {
    if (suppressClickRef.current || isDragging) {
      suppressClickRef.current = false;
      return;
    }
    onOpen();
  };

  return (
    <article
      className="job-card"
      style={{
        cursor: onDragStart ? "grab" : "pointer",
        opacity: isDragging ? 0.4 : 1,
        transition: "opacity 0.2s ease",
      }}
      onClick={handleCardClick}
      draggable={Boolean(onDragStart)}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="job-card-top">
        <StatusBadge status={job.status} />
        <div className="job-card-actions">
          {job.jobUrl && (
            <a
              href={job.jobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-button subtle"
              onClick={(event) => event.stopPropagation()}
              aria-label={`Abrir link da candidatura de ${job.title}`}
              title="Abrir link da candidatura"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <div
            ref={menuRef}
            className="card-menu-wrap"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={menuTriggerRef}
              type="button"
              className="icon-button subtle"
              onClick={(event) => {
                event.stopPropagation();
                setMenuOpen((value) => !value);
              }}
              aria-label={`Alterar status de ${job.title}`}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={`job-status-menu-${job.id}`}
            >
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div id={`job-status-menu-${job.id}`} className="card-menu" role="menu" aria-label={`Alterar status de ${job.title}`}>
                <small>Mover para</small>
                {statuses.map((status, index) => (
                  <button
                    ref={(element) => { menuItemsRef.current[index] = element; }}
                    type="button"
                    role="menuitem"
                    key={status}
                    disabled={status === job.status}
                    onClick={(event) => {
                      event.stopPropagation();
                      onStatus(status);
                      setMenuOpen(false);
                    }}
                  >
                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <button type="button" className="job-card-main" aria-label={`Ver detalhes de ${job.title}`}>
        <strong>{job.title}</strong>
        <span>{job.company}</span>
      </button>
      <div className="job-meta">
        {job.salaryRange && <span className="job-salary"><Banknote size={13} /> {job.salaryRange}</span>}
        {job.workMode && <span><BriefcaseBusiness size={12} /> {workModeLabels[job.workMode]}</span>}
        {job.location && <span><MapPin size={12} /> {job.location}</span>}
      </div>
      <div className="job-card-footer">
        <span>{relativeDate(job.updatedAt)}</span>
        <ArrowRight size={17} />
      </div>
    </article>
  );
}
