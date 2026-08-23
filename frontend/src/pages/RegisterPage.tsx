import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHeader } from "@/components/AuthHeader";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!name.trim()) return setError("Informe seu nome.");
    if (password.length < 6) return setError("A senha deve ter pelo menos 6 caracteres.");
    if (password !== confirmation) return setError("As senhas não coincidem.");
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate("/jobs", { replace: true });
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 409) setError("Este e-mail já está em uso.");
      else setError(requestError instanceof Error ? requestError.message : "Não foi possível criar sua conta.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthHeader />
      <main className="auth-main register-main">
        <form className="auth-form" onSubmit={submit}>
          <h1>Crie sua conta</h1>
          <p>Comece a organizar suas oportunidades em poucos passos.</p>
          {error && <div className="alert error">{error}</div>}
          <div className="auth-fields compact-fields">
            <label className="field"><span>Nome</span><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Como podemos chamar você?" autoComplete="name" /></label>
            <label className="field"><span>E-mail</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="seu@email.com" autoComplete="email" /></label>
            <PasswordField label="Senha" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Crie uma senha" autoComplete="new-password" />
            <PasswordField label="Confirmar senha" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="Digite a senha novamente" autoComplete="new-password" />
          </div>
          <button className="button primary full" disabled={busy}>{busy ? "Criando conta..." : "Criar conta"}</button>
          <p className="auth-footer">Já possui uma conta? <Link to="/login">Entrar</Link></p>
        </form>
      </main>
    </div>
  );
}
