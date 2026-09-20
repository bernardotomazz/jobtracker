import { Link } from "react-router-dom";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AuthHeader() {
  return (
    <header className="auth-header">
      <Brand compact />
      <div className="auth-header-actions">
        <Link to="/">Voltar para o início</Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
