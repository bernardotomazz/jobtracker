import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const shortName = user?.name.split(" ")[0] || "Usuário";

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreFocusRef.current = true;
        setOpen(false);
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
        event.preventDefault();
        menuItemRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      if (restoreFocusRef.current) {
        triggerRef.current?.focus();
        restoreFocusRef.current = false;
      }
    };
  }, [open]);

  useEffect(() => {
    if (open) menuItemRef.current?.focus();
  }, [open]);

  return (
    <header className="app-header">
      <Brand />
      <div ref={menuRef} className="user-menu-wrap">
        <button ref={triggerRef} type="button" className="user-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" aria-controls="user-menu">
          <span className="user-name">{shortName}</span>
          <span className="avatar">{initials(user?.name || "Usuário")}</span>
        </button>
        {open && (
          <div id="user-menu" className="user-menu" role="menu">
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
            <button ref={menuItemRef} type="button" role="menuitem" onClick={logout}>
              <LogOut size={16} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
