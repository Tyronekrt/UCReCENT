import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container-x ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="h-section mt-2">{title}</h2>
      {lead ? <p className="lead mt-3">{lead}</p> : null}
    </div>
  );
}

export function StatusPill({ kind, children }: { kind: "verify" | "planned" | "ok"; children: ReactNode }) {
  const styles =
    kind === "ok"
      ? "bg-forest/10 text-forest"
      : kind === "planned"
        ? "bg-lake/10 text-lake-dark"
        : "bg-sun/20 text-earth";
  return <span className={`status-pill ${styles}`}>{children}</span>;
}

export function CTAButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link href="/support" className="btn-primary">
        Support the Project
      </Link>
      <Link href="/project" className="btn-outline">
        Explore Phase 1
      </Link>
    </div>
  );
}
