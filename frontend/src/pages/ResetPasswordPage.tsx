import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthHeader } from "@/components/AuthHeader";
import { PasswordField } from "@/components/PasswordField";
import { api, ApiError } from "@/lib/api";
import { usePageTitle } from "@/lib/usePageTitle";
import type { ResetPasswordPayload } from "@/types";

interface ResetPasswordState {
  password: string;
  confirmation: string;
  error: string;
  tokenExpired: boolean;
  busy: boolean;
}

export function ResetPasswordPage() {
  usePageTitle("Nova Senha");
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token")?.trim() || "";

  const [state, setState] = useState<ResetPasswordState>({
    password: "",
    confirmation: "",
    error: "",
    tokenExpired: false,
    busy: false,
  });

  const passwordMismatch =
    state.confirmation.length > 0 && state.password !== state.confirmation
      ? "As senhas não coincidem."
      : undefined;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    if (state.password.length < 8) {
      setState((prev) => ({
        ...prev,
        error: "A senha deve ter pelo menos 8 caracteres.",
      }));
      return;
    }

    if (state.password !== state.confirmation) {
      setState((prev) => ({
        ...prev,
        error: "As senhas não coincidem.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, error: "", tokenExpired: false, busy: true }));
    const payload: ResetPasswordPayload = {
      token,
      password: state.password,
    };

    try {
      await api.resetPassword(payload);
      navigate("/login?reset=true", { replace: true });
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setState((prev) => ({
          ...prev,
          busy: false,
          tokenExpired: true,
          error: "Este link de recuperação expirou ou já foi utilizado. Solicite um novo link para continuar.",
        }));
      } else {
        setState((prev) => ({
          ...prev,
          busy: false,
          error:
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível redefinir sua senha.",
        }));
      }
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <AuthHeader />
        <main className="auth-main">
          <div className="auth-form">
            <h1>Defina sua nova senha</h1>
            <div className="alert error" role="alert">
              Link de recuperação inválido ou expirado.
            </div>
            <Link to="/forgot-password" className="button primary full">
              Solicitar novo link
            </Link>
            <p className="auth-footer">
              Lembrou sua senha? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <AuthHeader />
      <main className="auth-main">
        <form className="auth-form" onSubmit={submit}>
          <h1>Defina sua nova senha</h1>
          <p>Crie uma senha forte com no mínimo 8 caracteres.</p>
          {state.error && (
            <div className="alert error" role="alert">
              {state.error}
            </div>
          )}
          <div className="auth-fields">
            <PasswordField
              label="Nova senha"
              required
              minLength={8}
              maxLength={32}
              value={state.password}
              onChange={(event) =>
                setState((prev) => ({ ...prev, password: event.target.value, error: "" }))
              }
              placeholder="Digite a nova senha"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmar nova senha"
              required
              minLength={8}
              maxLength={32}
              value={state.confirmation}
              onChange={(event) =>
                setState((prev) => ({ ...prev, confirmation: event.target.value, error: "" }))
              }
              placeholder="Confirme a nova senha"
              autoComplete="new-password"
              error={passwordMismatch}
            />
          </div>
          <button className="button primary full" disabled={state.busy}>
            {state.busy ? "Redefinindo senha..." : "Salvar nova senha"}
          </button>
          {state.tokenExpired && (
            <Link to="/forgot-password" className="button secondary full">
              Solicitar novo link
            </Link>
          )}
          <p className="auth-footer">
            Lembrou sua senha? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
