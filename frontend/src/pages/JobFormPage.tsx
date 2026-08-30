import { ArrowLeft, LoaderCircle } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { api } from "@/lib/api";
import type { JobPayload, WorkMode } from "@/types";

const emptyForm = {
  title: "", company: "", jobUrl: "", location: "", workMode: "", salaryRange: "", appliedAt: "", description: "", mainRequirements: "", desiredRequirements: "", processDetails: "", notes: "",
};

type FormState = typeof emptyForm;

function optional(value: string) { return value.trim() || null; }

export function JobFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    api.getJob(id, controller.signal).then((job) => setForm({
      title: job.title, company: job.company, jobUrl: job.jobUrl || "", location: job.location || "", workMode: job.workMode || "", salaryRange: job.salaryRange || "", appliedAt: job.appliedAt?.slice(0, 10) || "", description: job.description || "", mainRequirements: job.mainRequirements || "", desiredRequirements: job.desiredRequirements || "", processDetails: job.processDetails || "", notes: job.notes || "",
    })).catch((requestError: Error) => {
      if (requestError.name !== "AbortError") setError(requestError.message);
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  const update = (field: keyof FormState, value: string) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.company.trim()) return setError("Preencha o título da vaga e a empresa.");
    const payload: JobPayload = {
      title: form.title.trim(), company: form.company.trim(), jobUrl: optional(form.jobUrl), location: optional(form.location), workMode: (form.workMode || null) as WorkMode | null, salaryRange: optional(form.salaryRange), appliedAt: form.appliedAt ? `${form.appliedAt}T00:00:00` : null, description: optional(form.description), mainRequirements: optional(form.mainRequirements), desiredRequirements: optional(form.desiredRequirements), processDetails: optional(form.processDetails), notes: optional(form.notes),
    };
    setBusy(true);
    try {
      if (editing && id) await api.updateJob(id, payload);
      else await api.createJob(payload);
      navigate("/jobs");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível salvar a vaga.");
    } finally { setBusy(false); }
  };

  if (loading) return <div className="app-page"><AppHeader /><div className="page-state" role="status"><LoaderCircle className="spin" /> Carregando vaga...</div></div>;

  return (
    <div className="app-page">
      <AppHeader />
      <main className="job-form-main">
        <button type="button" className="back-link" onClick={() => navigate("/jobs")}><ArrowLeft size={16} /> Voltar para minhas vagas</button>
        <div className="form-heading"><h1>{editing ? "Editar vaga" : "Nova vaga"}</h1><p>{editing ? "Atualize as informações desta oportunidade." : "Registre uma oportunidade para acompanhar o processo."}</p></div>
        {error && <div className="alert error" role="alert">{error}</div>}
        <form onSubmit={submit}>
          <FormSection title="Informações básicas" description="Identificação, origem e formato da oportunidade.">
            <div className="form-grid two"><Field label="Título da vaga" required><input required value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Ex.: Desenvolvedor Java Júnior" /></Field><Field label="Empresa" required><input required value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="Ex.: Empresa Exemplo" /></Field></div>
            <div className="form-grid two"><Field label="Link da vaga"><input type="url" value={form.jobUrl} onChange={(event) => update("jobUrl", event.target.value)} placeholder="Ex.: https://..." /></Field><Field label="Localização"><input value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="Ex.: São Paulo, SP" /></Field></div>
            <div className="form-grid three"><Field label="Modalidade"><select value={form.workMode} onChange={(event) => update("workMode", event.target.value)}><option value="">Selecione uma opção</option><option value="REMOTE">Remoto</option><option value="HYBRID">Híbrido</option><option value="ONSITE">Presencial</option></select></Field><Field label="Faixa salarial"><input value={form.salaryRange} onChange={(event) => update("salaryRange", event.target.value)} placeholder="Ex.: R$ 3.000 – R$ 4.000" /></Field><Field label="Data da candidatura"><input type="date" value={form.appliedAt} onChange={(event) => update("appliedAt", event.target.value)} /></Field></div>
            <Field label="Descrição"><textarea rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Descreva responsabilidades e contexto da vaga..." /></Field>
          </FormSection>
          <FormSection title="Requisitos" description="Separe os itens essenciais das qualificações desejadas.">
            <Field label="Requisitos principais"><textarea rows={3} value={form.mainRequirements} onChange={(event) => update("mainRequirements", event.target.value)} placeholder="Liste os requisitos essenciais..." /></Field>
            <Field label="Qualificações desejadas"><textarea rows={3} value={form.desiredRequirements} onChange={(event) => update("desiredRequirements", event.target.value)} placeholder="Liste diferenciais e qualidades esperadas..." /></Field>
          </FormSection>
          <FormSection title="Acompanhamento" description="Mantenha contexto sobre o processo seletivo e suas anotações.">
            <Field label="Detalhes do processo"><textarea rows={3} value={form.processDetails} onChange={(event) => update("processDetails", event.target.value)} placeholder="Ex.: entrevista técnica marcada para sexta-feira..." /></Field>
            <Field label="Notas pessoais"><textarea rows={3} value={form.notes} onChange={(event) => update("notes", event.target.value)} placeholder="Adicione lembretes ou observações..." /></Field>
          </FormSection>
          <div className="form-actions"><button type="button" className="button secondary" onClick={() => navigate("/jobs")}>Cancelar</button><button className="button primary" disabled={busy}>{busy ? "Salvando..." : editing ? "Salvar alterações" : "Criar vaga"}</button></div>
        </form>
      </main>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <section className="form-section"><header><h2>{title}</h2><p>{description}</p></header>{children}</section>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="field"><span>{label}{required && <b> *</b>}</span>{children}</label>;
}
