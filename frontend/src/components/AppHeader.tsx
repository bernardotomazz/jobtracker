import { LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Brand } from "@/components/Brand";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function AppHeader() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const shortName = user?.name.split(" ")[0] || "Usuário";

  return (
    <header className="app-header">
      <Brand />
      <div className="user-menu-wrap">
        <button className="user-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          <span className="user-name">{shortName}</span>
          <span className="avatar">{initials(user?.name || "Usuário")}</span>
        </button>
        {open && (
          <div className="user-menu">
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
            <button onClick={logout}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
