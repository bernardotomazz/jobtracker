import { Link } from "react-router-dom";
import { AuthHeader } from "@/components/AuthHeader";
import { useAuth } from "@/context/AuthContext";

export function NotFoundPage() {
  const { token } = useAuth();
  return (
    <div className="auth-page">
      <AuthHeader />
      <main className="not-found">
        <strong>404</strong>
        <h1>Esta página não foi encontrada</h1>
        <p>O endereço pode estar incorreto ou a página pode ter sido movida.</p>
        <div><Link className="button secondary" to="/">Voltar ao início</Link>{token && <Link className="button primary" to="/jobs">Ir para minhas vagas</Link>}</div>
      </main>
    </div>
  );
}
