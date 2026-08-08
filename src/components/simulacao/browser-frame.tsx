import type { ReactNode } from "react";

export function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
      <div className="flex items-center gap-1.5 border-b border-border bg-[#F5F5F5] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-[11px] text-muted">
          app.dclubigreja.com/igreja/dashboard
        </span>
      </div>
      <div className="h-[340px] overflow-hidden bg-[#F7FAFF] p-4">{children}</div>
    </div>
  );
}
