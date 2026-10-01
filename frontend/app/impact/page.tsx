import type { Metadata } from "next";
import Link from "next/link";
import { BENEFICIARIES } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Impact",
  description:
    "Who UCReCENT serves and the outcomes it aims to achieve for learners, youth, teachers and the wider Mbita East community.",
};

const OUTCOMES = [
  "Increased access to books and learning materials in the community",
  "Improved reading habits and literacy levels among children, youth and adults",
  "Stronger academic performance and examination readiness among learners",
  "Professional capacity for the librarian and stronger local library management",
  "Deeper community ownership and participation in educational initiatives",
  "A long-term platform for educational and social development in Mbita East Division",
];

const PROGRAMMES = [
  { title: "Reading clubs", desc: "Regular, welcoming sessions where children, youth and adults read together and build lasting habits." },
  { title: "Weekend study sessions", desc: "Quiet, supervised space for revision and independent study outside school hours." },
  { title: "Holiday reading programmes", desc: "Structured activities that keep learners reading and learning during school holidays." },
  { title: "Basic literacy activities", desc: "Foundational support planned after launch for emerging and adult readers." },
];

export default function ImpactPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">Impact</p>
      <h1 className="h-display mt-2">Who the library serves — and what it will change.</h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-bold text-navy">Direct beneficiaries</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {BENEFICIARIES.direct.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="card">
          <h2 className="font-bold text-navy">Indirect beneficiaries</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            {BENEFICIARIES.indirect.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading eyebrow="Programmes" title="An active library, not just a room of books" lead="Reading clubs, weekend study sessions and holiday programmes are planned to begin after the official launch." />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PROGRAMMES.map((p) => (
            <div key={p.title} className="card">
              <h3 className="font-bold text-navy">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading eyebrow="Expected outcomes" title="What success looks like" />
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {OUTCOMES.map((o) => (
            <li key={o} className="card flex gap-2 text-sm font-medium text-slate-700">
              <span aria-hidden="true" className="font-bold text-forest">✓</span>{o}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-slate-500">
          Outcomes are aims from the Concept Note. The project committee will track membership,
          attendance, circulation and programme participation — no results are claimed before launch.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-bold text-navy">Youth development & community learning</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Beyond school revision, the library gives out-of-school youth and adults a place to
            continue learning, access information that can improve livelihoods, and take part in
            civic life. Reading clubs and study sessions are designed for all ages — children,
            youth, teachers and parents learning alongside one another.
          </p>
        </div>
        <div className="card">
          <h2 className="font-bold text-navy">Future ICT & digital learning</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Phase 1 focuses on books, space and light. As resources allow, future phases may add
            ICT infrastructure, connectivity and online learning access — introduced in stages so
            each investment is practical and sustainable. See the{" "}
            <Link href="/project" className="font-semibold text-lake-dark hover:underline">project plan</Link>{" "}
            for the long-term vision.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/get-involved" className="btn-secondary">Help create this impact</Link>
      </div>
    </Container>
  );
}
