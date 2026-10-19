import { useEffect } from "react";

const DEFAULT_TITLE = "Waldo — Gestão Inteligente de Processos Seletivos";

export function usePageTitle(pageTitle?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = pageTitle ? `${pageTitle} | Waldo` : DEFAULT_TITLE;
    return () => {
      document.title = previous;
    };
  }, [pageTitle]);
}
