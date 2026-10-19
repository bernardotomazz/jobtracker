import { X } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { useLockBodyScroll } from "@/lib/useLockBodyScroll";
import type { ApplicationStatus, JobApplication, JobPayload, WorkMode } from "@/types";

const emptyForm = {
  title: "",
  company: "",
  status: "SAVED",
  jobUrl: "",
  location: "",
  workMode: "",
  salaryRange: "",
  appliedAt: "",
  description: "",
  mainRequirements: "",
  desiredRequirements: "",
  processDetails: "",
  notes: "",
};

type FormState = typeof emptyForm;

function optional(value: string) {
  return value.trim() || null;
}

interface JobFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onCreated: (job: JobApplication) => void;
}

export function JobFormDrawer({ open, onClose, onCreated }: JobFormDrawerProps) {
  useLockBodyScroll(open);
  const drawerRef = useRef<HTMLElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  onCloseRef.current = onClose;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    firstInputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !drawerRef.current) return;
      const focusable = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), a[href], select, input, textarea",
        ),
      );
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
  }, [open]);

  if (!open) return null;

  const update = (field: keyof FormState, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.company.trim()) {
      setError("Preencha o título da vaga e a empresa.");
      return;
    }

    const payload: JobPayload = {
      title: form.title.trim(),
      company: form.company.trim(),
      status: form.status as ApplicationStatus,
      jobUrl: optional(form.jobUrl),
      location: optional(form.location),
      workMode: (form.workMode || null) as WorkMode | null,
      salaryRange: optional(form.salaryRange),
      appliedAt: form.appliedAt ? `${form.appliedAt}T00:00:00` : null,
      description: optional(form.description),
      mainRequirements: optional(form.mainRequirements),
      desiredRequirements: optional(form.desiredRequirements),
      processDetails: optional(form.processDetails),
      notes: optional(form.notes),
    };

    setBusy(true);
    try {
      const created = await api.createJob(payload);
      setForm(emptyForm);
      onCreated(created);
      onClose();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível salvar a vaga.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="drawer-layer"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
      onWheel={(event) => {
        if (event.target === event.currentTarget) {
          drawerRef.current?.scrollBy({ top: event.deltaY });
        }
      }}
    >
      <aside
        ref={drawerRef}
        className="job-drawer job-form-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="icon-button drawer-close"
          onClick={onClose}
          disabled={busy}
          aria-label="Fechar formulário"
        >
          <X size={20} />
        </button>
        <div className="drawer-heading">
          <h2 id={titleId}>Nova vaga</h2>
          <p>Registre uma oportunidade para acompanhar o processo.</p>
        </div>
        {error && (
          <div className="alert error dashboard-alert" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={submit}>
          <FormSection title="Informações básicas" description="Identificação, origem e formato da oportunidade.">
            <div className="form-grid two">
              <Field label="Título da vaga" required>
                <input
                  ref={firstInputRef}
                  required
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="Ex.: Desenvolvedor Java Júnior"
                />
              </Field>
              <Field label="Empresa" required>
                <input
                  required
                  value={form.company}
                  onChange={(event) => update("company", event.target.value)}
                  placeholder="Ex.: Empresa Exemplo"
                />
              </Field>
            </div>
            <div className="form-grid two">
              <Field label="Link da vaga">
                <input
                  type="url"
                  value={form.jobUrl}
                  onChange={(event) => update("jobUrl", event.target.value)}
                  placeholder="Ex.: https://..."
                />
              </Field>
              <Field label="Localização">
                <input
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="Ex.: São Paulo, SP"
                />
              </Field>
            </div>
            <div className="form-grid two">
              <Field label="Status da vaga">
                <select value={form.status} onChange={(event) => update("status", event.target.value)}>
                  <option value="SAVED">Salva</option>
                  <option value="APPLIED">Aplicada</option>
                  <option value="IN_PROGRESS">Em andamento</option>
                  <option value="FINISHED">Finalizada</option>
                </select>
              </Field>
              <Field label="Modalidade">
                <select value={form.workMode} onChange={(event) => update("workMode", event.target.value)}>
                  <option value="">Selecione uma opção</option>
                  <option value="REMOTE">Remoto</option>
                  <option value="HYBRID">Híbrido</option>
                  <option value="ONSITE">Presencial</option>
                </select>
              </Field>
            </div>
            <div className="form-grid two">
              <Field label="Faixa salarial">
                <input
                  value={form.salaryRange}
                  onChange={(event) => update("salaryRange", event.target.value)}
                  placeholder="Ex.: R$ 3.000 – R$ 4.000"
                />
              </Field>
              <Field label="Data da candidatura">
                <input
                  type="date"
                  value={form.appliedAt}
                  onChange={(event) => update("appliedAt", event.target.value)}
                />
              </Field>
            </div>
            <Field label="Descrição">
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => update("description", event.target.value)}
                placeholder="Descreva responsabilidades e contexto da vaga..."
              />
            </Field>
          </FormSection>
          <FormSection title="Requisitos" description="Separe os itens essenciais das qualificações desejadas.">
            <Field label="Requisitos principais">
              <textarea
                rows={3}
                value={form.mainRequirements}
                onChange={(event) => update("mainRequirements", event.target.value)}
                placeholder="Liste os requisitos essenciais..."
              />
            </Field>
            <Field label="Qualificações desejadas">
              <textarea
                rows={3}
                value={form.desiredRequirements}
                onChange={(event) => update("desiredRequirements", event.target.value)}
                placeholder="Liste diferenciais e qualidades esperadas..."
              />
            </Field>
          </FormSection>
          <FormSection title="Acompanhamento" description="Mantenha contexto sobre o processo seletivo e suas anotações.">
            <Field label="Detalhes do processo">
              <textarea
                rows={3}
                value={form.processDetails}
                onChange={(event) => update("processDetails", event.target.value)}
                placeholder="Ex.: entrevista técnica marcada para sexta-feira..."
              />
            </Field>
            <Field label="Notas pessoais">
              <textarea
                rows={3}
                value={form.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder="Adicione lembretes ou observações..."
              />
            </Field>
          </FormSection>
          <div className="form-actions">
            <button type="button" className="button secondary" disabled={busy} onClick={onClose}>
              Cancelar
            </button>
            <button className="button primary" disabled={busy}>
              {busy ? "Salvando..." : "Criar vaga"}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="form-section">
      <header>
        <h2>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required && <b> *</b>}
      </span>
      {children}
    </label>
  );
}
