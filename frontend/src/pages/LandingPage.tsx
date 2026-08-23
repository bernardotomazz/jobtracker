import {
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  FileText,
  Folder,
  Github,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";

const previewJobs = [
  {
    status: "Salva",
    title: "Assistente Administrativo",
    company: "Horizonte Serviços",
    mode: "Presencial",
    place: "Belo Horizonte",
    tone: "saved",
  },
  {
    status: "Aplicada",
    title: "Analista de Marketing",
    company: "Aurora Cosméticos",
    mode: "Híbrido",
    place: "São Paulo",
    tone: "applied",
  },
  {
    status: "Em andamento",
    title: "Consultor Comercial",
    company: "Grupo Vértice",
    mode: "Presencial",
    place: "Curitiba",
    tone: "progress",
  },
  {
    status: "Finalizada",
    title: "Assistente Financeiro",
    company: "Nova Gestão",
    mode: "Remoto",
    place: "Brasil",
    tone: "finished",
  },
];

function ProductPreview() {
  return (
    <div className="product-preview" aria-hidden="true">
      <div className="preview-header">
        <Brand compact />
        <span>Bernardo&nbsp;&nbsp; B</span>
      </div>
      <div className="preview-main">
        <div className="preview-title">
          <div>
            <strong>Minhas vagas</strong>
            <small>Acompanhe seus processos seletivos em um só lugar.</small>
          </div>
          <span>+ Nova vaga</span>
        </div>
        <div className="preview-filters">
          <span>Buscar por título ou empresa</span>
          <i>Status</i>
          <i>Modalidade</i>
          <i>Empresa</i>
        </div>
        <div className="preview-board">
          {previewJobs.map((job) => (
            <div className="preview-column" key={job.status}>
              <strong>
                {job.status === "Salva"
                  ? "Salvas"
                  : job.status === "Aplicada"
                    ? "Aplicadas"
                    : job.status === "Em andamento"
                      ? "Em andamento"
                      : "Finalizadas"}
              </strong>
              <article>
                <em className={`preview-${job.tone}`}>{job.status}</em>
                <b>{job.title}</b>
                <span>{job.company}</span>
                <small>
                  <BriefcaseBusiness /> {job.mode}
                </small>
                <small>
                  <MapPin /> {job.place}
                </small>
                <footer>
                  Atualizada hoje <ArrowRight />
                </footer>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <Brand />
        <nav>
          <Link className="button secondary" to="/login">
            Entrar
          </Link>
          <Link className="button primary" to="/register">
            Criar conta
          </Link>
        </nav>
      </header>
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <h1>Job Tracker</h1>
            <p>
              Organize suas vagas e acompanhe cada processo seletivo em um só
              lugar.
            </p>
            <div>
              <Link className="button primary" to="/register">
                Criar conta
              </Link>
              <Link className="button secondary" to="/login">
                Entrar
              </Link>
            </div>
          </div>
          <div className="product-preview-stage">
            <ProductPreview />
          </div>
        </section>
        <section className="landing-band benefits-band">
          <h2>Sua busca, com menos informação espalhada</h2>
          <div className="feature-grid">
            <article>
              <span aria-hidden="true">
                <Folder />
              </span>
              <div>
                <h3>Organize</h3>
                <p>Reúna vagas que estavam em links, planilhas e anotações.</p>
              </div>
            </article>
            <article className="coral">
              <span aria-hidden="true">
                <Eye />
              </span>
              <div>
                <h3>Acompanhe</h3>
                <p>
                  Visualize rapidamente em qual etapa está cada oportunidade.
                </p>
              </div>
            </article>
            <article>
              <span aria-hidden="true">
                <FileText />
              </span>
              <div>
                <h3>Centralize</h3>
                <p>Guarde requisitos, detalhes do processo e notas pessoais.</p>
              </div>
            </article>
          </div>
        </section>
        <section className="landing-band steps-band">
          <h2>Um fluxo simples em três etapas</h2>
          <div className="steps-grid">
            <article>
              <span>1</span>
              <div>
                <h3>Cadastre</h3>
                <p>Adicione as informações essenciais da oportunidade.</p>
              </div>
            </article>
            <article className="coral">
              <span>2</span>
              <div>
                <h3>Acompanhe</h3>
                <p>Use o Kanban para entender o andamento.</p>
              </div>
            </article>
            <article>
              <span>3</span>
              <div>
                <h3>Atualize</h3>
                <p>Registre mudanças e mantenha o histórico acessível.</p>
              </div>
            </article>
          </div>
        </section>
        <section className="final-cta">
          <h2>Comece a organizar suas oportunidades</h2>
          <p>
            Crie sua conta e leve seus processos seletivos para um só lugar.
          </p>
          <Link className="button white" to="/register">
            Criar conta
          </Link>
        </section>
      </main>
      <footer className="landing-footer">
        <Brand />
        <a className="footer-github" href="https://github.com/bernardotomazz" target="_blank" rel="noreferrer">
          <Github size={18} />
          github.com/bernardotomazz
          <span className="sr-only"> (abre em uma nova aba)</span>
        </a>
      </footer>
    </div>
  );
}
