import type { Metadata } from "next";
import Link from "next/link";
import type { PartnerEntry } from "@/types";
import { Container, SectionHeading, StatusPill } from "@/components/ui/Primitives";
import { getApiPartners, getStaticChampions, getStaticPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partners",
  description:
    "How partnerships work for UCReCENT: named collaborators, organisations being engaged, and individual champions — with verification status shown honestly.",
};

function PartnerCard({ p }: { p: PartnerEntry }) {
  const pill =
    p.status === "verified" ? (
      <StatusPill kind="ok">Confirmed</StatusPill>
    ) : p.status === "planned" ? (
      <StatusPill kind="planned">Planned</StatusPill>
    ) : (
      <StatusPill kind="verify">To verify</StatusPill>
    );
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-navy">{p.name}</h3>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{p.category}</p>
      <p className="mt-2 text-sm text-slate-600">{p.role}</p>
      <p className="mt-2 text-xs text-slate-500">{p.statusNote}</p>
      <div className="mt-2">{pill}</div>
    </div>
  );
}

export default async function PartnersPage() {
  const api = await getApiPartners();
  const groups = api ?? getStaticPartners();
  const champions = getStaticChampions();
  const usingApi = api !== null;

  return (
    <Container className="py-10">
      <p className="eyebrow">Partners</p>
      <h1 className="h-display mt-2">Honest about where every relationship stands.</h1>
      <p className="lead mt-4 max-w-3xl">
        The Concept Note names collaborators and stakeholders, and tailored outreach letters were
        prepared in August 2026. <strong>No formal partnership is presented as confirmed</strong> until
        terms are agreed with each organisation. This page keeps that distinction visible.
      </p>
      {usingApi ? (
        <p className="mt-3 text-xs text-slate-500" role="status">
          Managed content — updated by the project team without code changes.
        </p>
      ) : null}

      {groups.confirmed.length > 0 ? (
        <div className="mt-10">
          <SectionHeading
            eyebrow="Confirmed"
            title="Confirmed partners"
            lead="Formal partnerships with written agreements on file."
          />
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {groups.confirmed.map((p) => <PartnerCard key={p.name} p={p} />)}
          </div>
        </div>
      ) : null}

      <div className="mt-10">
        <SectionHeading
          eyebrow={groups.confirmed.length > 0 ? "Strategic" : "Named in the Concept Note"}
          title="Collaborators and stakeholders"
          lead="Identified as working with the initiative on books, training, technical guidance or mobilization. Confirm current terms with the project team before describing any of these as a confirmed partner."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {groups.strategic.map((p) => <PartnerCard key={p.name} p={p} />)}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading
          eyebrow="Outreach prepared — not confirmed"
          title="Organisations being engaged"
          lead="Each was sent (or prepared for) a tailored letter inviting a contribution matching its strengths — books, literacy programming, professional practice, evidence, business mobilization or county coordination."
        />
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {groups.engaged.map((p) => <PartnerCard key={p.name} p={p} />)}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading
          eyebrow="People"
          title="Individual champions"
          lead="Named in the Concept Note stakeholder network. Current roles and affiliations are all to be verified — no institutional title is used here until confirmed."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {champions.map((p) => <PartnerCard key={p.name} p={p} />)}
        </div>
      </div>

      <div className="card mt-10 bg-cream">
        <h2 className="font-bold text-navy">Become a partner</h2>
        <p className="mt-2 text-sm text-slate-600">
          Partnerships are built around comparative advantage: books, publishing, literacy
          programming, professional practice, networks, materials, energy, ICT or advocacy.
          Start with an enquiry — the team agrees one practical next step with every partner.
        </p>
        <div className="mt-4">
          <Link href="/support" className="btn-primary">Start a partnership enquiry</Link>
        </div>
      </div>
    </Container>
  );
}
