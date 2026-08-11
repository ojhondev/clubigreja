import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-4 shadow-[0_1px_2px_rgba(16,26,61,0.04)] sm:rounded-3xl sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "accent" | "dark" | "dark-outline";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 disabled:pointer-events-none sm:px-6 sm:py-3 sm:text-base";
  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-white text-primary border-2 border-primary hover:bg-[#EAF6FF]",
    accent: "bg-accent text-primary hover:brightness-95",
    ghost: "bg-transparent text-foreground hover:bg-black/5",
    dark: "bg-black text-white hover:bg-black/85",
    "dark-outline": "bg-transparent text-black border-2 border-black hover:bg-black/5",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ProgressBar({ percentual }: { percentual: number }) {
  const pct = Math.min(100, Math.max(0, percentual));
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-border">
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "accent";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 text-muted",
    success: "bg-green-100 text-success",
    warning: "bg-amber-100 text-amber-700",
    accent: "bg-[#EAF6FF] text-primary",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <Card>
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-2 text-xl font-bold text-foreground sm:text-3xl ${valueClassName}`}>{value}</p>
    </Card>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-lg font-bold text-foreground">{children}</h2>;
}
