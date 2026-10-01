import type { Metadata } from "next";
import { BOARD, SITE } from "@/lib/site";
import { Container, SectionHeading, StatusPill } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "About",
  description:
    "What UCReCENT is, why it is needed, and the vision, mission and objectives behind this community-owned initiative in Homa Bay County.",
};

export default function AboutPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">About</p>
      <h1 className="h-display mt-2">A community-owned library for Usao.</h1>
      <p className="lead mt-4 max-w-3xl">
        The {SITE.name} ({SITE.initiative}) is being established in {SITE.location.full} by alumni of
        Usao, Usungu, Ngodhe and Uwi Primary Schools, led by {SITE.contact.director} —{" "}
        {SITE.contact.directorNote}. The community is donating the land, making the
        library a genuine community-owned asset.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="card">
          <h2 className="font-bold text-navy">Vision</h2>
          <p className="mt-2 text-sm text-slate-600">{SITE.vision}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-navy">Mission</h2>
          <p className="mt-2 text-sm text-slate-600">{SITE.mission}</p>
        </div>
        <div className="card">
          <h2 className="font-bold text-navy">Goal</h2>
          <p className="mt-2 text-sm text-slate-600">{SITE.goal}</p>
        </div>
      </div>

      <div className="mt-10 max-w-3xl">
        <SectionHeading
          eyebrow="Why it is needed"
          title="Limited books, no nearby library, and constrained study options"
        />
        <div className="mt-4 prose-block rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
          <p>
            Usao Sublocation faces serious limitations in access to reading materials, study
            space and structured educational support. Literacy levels in Homa Bay County remain
            low, and many learners have very few opportunities to read outside the classroom.
          </p>
          <p>
            The absence of nearby public library facilities means students — especially at
            primary and junior secondary levels — lack safe, accessible spaces for evening,
            weekend and holiday study. Low electricity penetration and limited internet access
            further restrict digital learning and access to online information.
          </p>
          <p>
            In this context the library is a necessary educational and social intervention: a
            quiet, secure and supportive environment where children, youth and adults can read,
            study and strengthen literacy and academic performance.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading
          eyebrow="Sustainability"
          title="Built to last: community ownership first"
          lead="The project is sustained through donated land, alumni leadership and partner engagement — not a single donation."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="card">
            <h3 className="font-bold text-navy">Community land ownership</h3>
            <p className="mt-1 text-sm text-slate-600">
              The donated site guarantees local commitment and permanence — the library is a
              community asset from day one, which also keeps Phase 1 affordable.
            </p>
          </div>
          <div className="card">
            <h3 className="font-bold text-navy">Alumni-led governance</h3>
            <p className="mt-1 text-sm text-slate-600">
              The alumni-led board and project committee provide continuity, coordination and
              accountability in governance and operations, with usage and finances tracked
              against the workplan.
            </p>
          </div>
          <div className="card">
            <h3 className="font-bold text-navy">Professional capacity</h3>
            <p className="mt-1 text-sm text-slate-600">
              Egerton University Library is identified for librarian training and internship
              support, with KNLS offering a pathway for technical standards (both to be confirmed).
            </p>
          </div>
          <div className="card">
            <h3 className="font-bold text-navy">Growth in phases</h3>
            <p className="mt-1 text-sm text-slate-600">
              Future phases may upgrade the structure, expand the collection, add ICT access and
              host more structured learning activities — each step taken as resources allow.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading eyebrow="Leadership" title="Initiative team and board" lead="Alumni-led governance with community oversight. Confirm titles and roles with the project team before publication use." />
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {BOARD.map((b) => (
            <li key={b.name} className="card">
              <p className="font-bold text-navy">{b.name}</p>
              <p className="mt-1 text-xs text-slate-500">{b.note}</p>
              <div className="mt-2"><StatusPill kind="verify">To verify</StatusPill></div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
