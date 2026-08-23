import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Brand compact />
      <Link to="/">Voltar para o início</Link>
    </header>
  );
}
