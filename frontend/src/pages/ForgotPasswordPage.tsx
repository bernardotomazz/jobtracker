import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthHeader } from "@/components/AuthHeader";
import { api } from "@/lib/api";
import { usePageTitle } from "@/lib/usePageTitle";
import type { ForgotPasswordPayload } from "@/types";

interface ForgotPasswordState {
  email: string;
  error: string;
  sent: boolean;
  busy: boolean;
  cooldown: boolean;
}

const RESEND_COOLDOWN_MS = 8000;

export function ForgotPasswordPage() {
  usePageTitle("Recuperar Senha");
  const [state, setState] = useState<ForgotPasswordState>({
    email: "",
    error: "",
    sent: false,
    busy: false,
    cooldown: false,
  });

  useEffect(() => {
    if (!state.cooldown) return;
    const timer = window.setTimeout(() => {
      setState((prev) => ({ ...prev, cooldown: false }));
    }, RESEND_COOLDOWN_MS);
    return () => window.clearTimeout(timer);
  }, [state.cooldown]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedEmail = state.email.trim();
    if (!trimmedEmail) {
      setState((prev) => ({ ...prev, error: "Informe seu e-mail.", sent: false }));
      return;
    }

    setState((prev) => ({ ...prev, error: "", busy: true }));
    const payload: ForgotPasswordPayload = { email: trimmedEmail };

    try {
      await api.forgotPassword(payload);
      setState((prev) => ({
        ...prev,
        sent: true,
        busy: false,
        cooldown: true,
      }));
    } catch (requestError) {
      setState((prev) => ({
        ...prev,
        sent: false,
        busy: false,
        error:
          requestError instanceof Error
            ? requestError.message
            : "Não foi possível enviar o link de recuperação.",
      }));
    }
  };

  return (
    <div className="auth-page">
      <AuthHeader />
      <main className="auth-main">
        <form className="auth-form" onSubmit={submit}>
          <h1>Recuperar senha</h1>
          <p>Digite o e-mail associado à sua conta para receber as instruções de redefinição.</p>
          {state.sent && (
            <div className="alert success" role="status">
              Se este e-mail estiver cadastrado, enviamos as instruções para a sua caixa de entrada. Verifique também a pasta de spam ou lixo eletrônico.
            </div>
          )}
          {state.error && (
            <div className="alert error" role="alert">
              {state.error}
            </div>
          )}
          <div className="auth-fields">
            <label className="field">
              <span>E-mail</span>
              <input
                type="email"
                required
                value={state.email}
                onChange={(event) =>
                  setState((prev) => ({ ...prev, email: event.target.value, cooldown: false }))
                }
                placeholder="seu@email.com"
                autoComplete="email"
              />
            </label>
          </div>
          <button className="button primary full" disabled={state.busy || state.cooldown}>
            {state.busy ? "Enviando link..." : "Enviar link de recuperação"}
          </button>
          <p className="auth-footer">
            Lembrou sua senha? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
