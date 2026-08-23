import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthHeader } from "@/components/AuthHeader";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: string } | null)?.from || "/jobs";
      navigate(from, { replace: true });
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setError("E-mail ou senha inválidos. Confira os dados e tente novamente.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "Não foi possível entrar.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHeader />
      <main className="auth-main">
        <form className="auth-form" onSubmit={submit}>
          <h1>Entre na sua conta</h1>
          <p>Acesse suas vagas e continue acompanhando seus processos.</p>
          {params.get("expired") && <div className="alert warning">Sua sessão expirou. Entre novamente para continuar.</div>}
          {params.get("registered") && <div className="alert success">Conta criada com sucesso. Agora, entre para acessar suas vagas.</div>}
          {error && <div className="alert error">{error}</div>}
          <div className="auth-fields">
            <label className="field"><span>E-mail</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoComplete="email" /></label>
            <PasswordField label="Senha" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Digite sua senha" autoComplete="current-password" />
          </div>
          <button className="button primary full" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</button>
          <p className="auth-footer">Ainda não tem uma conta? <Link to="/register">Criar conta</Link></p>
        </form>
      </main>
    </div>
  );
}
