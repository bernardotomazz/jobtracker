import {
  ArrowRight,
  Banknote,
  BriefcaseBusiness,
  Building2,
  Github,
  MapPin,
  MoreHorizontal,
  Search,
  StickyNote,
  Timer,
} from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import "@/pages/landing-v2.css";

type Tone = "saved" | "applied" | "progress" | "finished";

const columns: Array<{
  label: string;
  tone: Tone;
  jobs: Array<{ title: string; company: string; salary: string }>;
}> = [
  {
    label: "Salvas",
    tone: "saved",
    jobs: [
      { title: "Analista Financeiro", company: "Norte Capital", salary: "R$ 4.500 - 5.800" },
      { title: "Assistente de Projetos", company: "Estúdio Linha", salary: "R$ 3.200 - 4.000" },
    ],
  },
  {
    label: "Aplicadas",
    tone: "applied",
    jobs: [{ title: "Coordenador de Operações", company: "Vértice Logística", salary: "R$ 6.000 - 7.500" }],
  },
  {
    label: "Em andamento",
    tone: "progress",
    jobs: [{ title: "Analista de Marketing", company: "Aurora Cosméticos", salary: "R$ 4.800 - 6.200" }],
  },
  {
    label: "Finalizadas",
    tone: "finished",
    jobs: [{ title: "Consultor Comercial", company: "Grupo Horizonte", salary: "R$ 5.000 + variável" }],
  },
];

const stages: Array<{
  number: string;
  status: string;
  tone: Tone;
  title: string;
  description: string;
}> = [
  { number: "1", status: "Salva", tone: "saved", title: "Guarde a oportunidade", description: "Reúna link, salário, requisitos e suas primeiras impressões." },
  { number: "2", status: "Aplicada", tone: "applied", title: "Registre a candidatura", description: "A data e o contexto ficam próximos da vaga, sem depender da memória." },
  { number: "3", status: "Em andamento", tone: "progress", title: "Acompanhe cada conversa", description: "Entrevistas, retornos e observações permanecem em um único histórico." },
  { number: "4", status: "Finalizada", tone: "finished", title: "Aprenda com o processo", description: "Mesmo concluída, a oportunidade continua disponível para consulta." },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <span className={`v3-status ${tone}`}>{children}</span>;
}

function ProductBoard() {
  return (
    <div className="v3-product" aria-label="Prévia do Kanban do Job Tracker">
      <div className="v3-product-topbar"><strong>Job Tracker</strong><span>B</span></div>
      <div className="v3-product-content">
        <div className="v3-product-heading">
          <div><strong>Minhas vagas</strong><span>5 oportunidades acompanhadas</span></div>
          <i>+ Nova vaga</i>
        </div>
        <div className="v3-product-search"><Search size={13} /> Buscar por título ou empresa</div>
        <div className="v3-board-desktop">
          {columns.map((column) => (
            <section key={column.label}>
              <header><strong>{column.label}</strong><span>{column.jobs.length}</span></header>
              {column.jobs.map((job) => (
                <article key={job.title}>
                  <StatusBadge tone={column.tone}>{column.label === "Salvas" ? "Salva" : column.label}</StatusBadge>
                  <b>{job.title}</b><span>{job.company}</span>
                  <small><Banknote size={11} /> {job.salary}</small>
                  <footer><span>Atualizada hoje</span><ArrowRight size={12} /></footer>
                </article>
              ))}
            </section>
          ))}
        </div>
        <div className="v3-board-mobile">
          {[
            { title: "Coordenador de Operações", company: "Vértice Logística", salary: "R$ 6.000 - 7.500", mode: "Híbrido", location: "São Paulo, SP" },
            { title: "Analista Financeiro", company: "Norte Capital", salary: "R$ 4.500 - 5.800", mode: "Presencial", location: "Rio de Janeiro, RJ" },
          ].map((job) => (
            <article key={job.title}>
              <header><StatusBadge tone="applied">Aplicada</StatusBadge><MoreHorizontal /></header>
              <strong>{job.title}</strong>
              <span className="v3-mobile-company">{job.company}</span>
              <div className="v3-mobile-meta">
                <span><Banknote /> {job.salary}</span>
                <span><BriefcaseBusiness /> {job.mode}</span>
                <span><MapPin /> {job.location}</span>
              </div>
              <footer><span>Há 2 dias</span><ArrowRight /></footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 78%", "end 54%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  return (
    <section className="v3-journey" ref={sectionRef}>
      <motion.div className="v3-section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
        <span>Do interesse ao resultado</span><h2>Acompanhe cada vaga do início ao fim.</h2>
      </motion.div>
      <div className="v3-timeline">
        <span className="v3-timeline-line desktop" aria-hidden="true"><motion.i style={{ scaleX: progress }} /></span>
        <span className="v3-timeline-line mobile" aria-hidden="true"><motion.i style={{ scaleY: progress }} /></span>
        {stages.map((stage, index) => (
          <motion.article key={stage.number} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.42, delay: index * 0.07 }}>
            <div className="v3-timeline-marker"><span>{stage.number}</span><StatusBadge tone={stage.tone}>{stage.status}</StatusBadge></div>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function LandingV2Page() {
  const { scrollYProgress } = useScroll();
  const pageProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div className="landing-v2">
      <motion.div className="v3-scroll-progress" style={{ scaleX: pageProgress }} />
      <header className="v3-header">
        <Brand />
        <nav aria-label="Navegação principal">
          <Link to="/login">Entrar</Link>
          <Link className="v3-button primary" to="/register">Criar conta <ArrowRight size={17} /></Link>
        </nav>
      </header>

      <main>
        <section className="v3-hero">
          <motion.div className="v3-hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.span variants={reveal} transition={{ duration: 0.6 }}>Sua busca, finalmente em um só lugar</motion.span>
            <motion.h1 variants={reveal} transition={{ duration: 0.65 }}>Job Tracker</motion.h1>
            <motion.p variants={reveal} transition={{ duration: 0.65 }}>Organize oportunidades, acompanhe processos seletivos e saiba exatamente qual é o próximo passo.</motion.p>
            <motion.div className="v3-hero-actions" variants={reveal} transition={{ duration: 0.65 }}>
              <Link className="v3-button primary" to="/register">Organizar minhas vagas <ArrowRight size={18} /></Link>
              <Link className="v3-text-link" to="/login">Já tenho uma conta</Link>
            </motion.div>
          </motion.div>
          <motion.div
            className="v3-product-wrap"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProductBoard />
          </motion.div>
        </section>

        <section className="v3-value-strip">
          {[
            [Building2, "Empresa e vaga", "O essencial visível de imediato"],
            [Banknote, "Faixa salarial", "Informação para decidir melhor"],
            [Timer, "Status do processo", "Clareza sobre o próximo passo"],
            [StickyNote, "Notas e contexto", "Tudo junto da oportunidade"],
          ].map(([Icon, title, text], index) => (
            <motion.article key={String(title)} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.55, delay: index * 0.06 }}>
              <Icon size={21} /><div><strong>{title as string}</strong><span>{text as string}</span></div>
            </motion.article>
          ))}
        </section>

        <section className="v3-principles">
          <motion.div className="v3-section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
            <span>Menos informação espalhada</span><h2>Sua atenção fica onde realmente importa.</h2>
          </motion.div>
          <div className="v3-principles-grid">
            {[
              ["01", "Centralize", "Links, requisitos e observações deixam de viver em lugares diferentes."],
              ["02", "Priorize", "Status e datas ajudam a perceber quais processos pedem atenção agora."],
              ["03", "Acompanhe", "Cada mudança permanece ligada à vaga e acessível quando você precisar."],
            ].map(([number, title, text], index) => (
              <motion.article key={number} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.55, delay: index * 0.08 }}>
                <span>{number}</span><h3>{title}</h3><p>{text}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <JourneySection />

        <section className="v3-decision">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
            <span>Informação para decidir</span><h2>Salário, modalidade e contexto sem procurar duas vezes.</h2>
          </motion.div>
          <motion.div className="v3-decision-data" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65, delay: 0.08 }}>
            <div><span>Faixa salarial</span><strong>R$ 6.000 - 7.500</strong></div>
            <div><span>Empresa</span><strong>Vértice Logística</strong></div>
            <div><span>Modalidade</span><strong>Híbrido</strong></div>
            <div><span>Status</span><StatusBadge tone="progress">Em andamento</StatusBadge></div>
          </motion.div>
        </section>

        <section className="v3-cta">
          <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.65 }}>
            <span>Comece com a próxima oportunidade</span><h2>Uma busca mais organizada começa aqui.</h2>
            <Link className="v3-button light" to="/register">Criar minha conta <ArrowRight size={18} /></Link>
          </motion.div>
        </section>
      </main>

      <footer className="v3-footer">
        <Brand />
        <a href="https://github.com/bernardotomazz" target="_blank" rel="noreferrer"><Github size={18} /> github.com/bernardotomazz</a>
      </footer>
    </div>
  );
}
