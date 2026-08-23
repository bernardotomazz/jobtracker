import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, description, busy, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <div className="confirm-dialog" role="alertdialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <button className="icon-button dialog-close" onClick={onCancel} aria-label="Fechar"><X size={18} /></button>
        <span className="danger-icon"><AlertTriangle size={20} /></span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="dialog-actions">
          <button className="button secondary" onClick={onCancel}>Cancelar</button>
          <button className="button danger" disabled={busy} onClick={onConfirm}>{busy ? "Excluindo..." : "Excluir vaga"}</button>
        </div>
      </div>
    </div>
  );
}
