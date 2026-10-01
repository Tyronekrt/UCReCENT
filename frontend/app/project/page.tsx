import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BUDGET, PHASE_ONE, TIMELINE, formatKes } from "@/lib/site";
import { Container, SectionHeading, StatusPill } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Our Project",
  description:
    "Phase 1 of UCReCENT: mabati-and-wood structure, 10,000-book capacity, 100 seats, KES 500,000 target, timeline and long-term vision.",
};

export default function ProjectPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">Our Project</p>
      <h1 className="h-display mt-2">Phase 1: a lean library, built to open quickly.</h1>
      <p className="lead mt-4 max-w-3xl">{PHASE_ONE.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <StatusPill kind="planned">Launch planned: {PHASE_ONE.launchDatePlanned}</StatusPill>
        <StatusPill kind="ok">Community land donated</StatusPill>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <figure className="overflow-hidden rounded-xl border border-slate-200">
          <Image src="/images/design-views.jpg" alt="Different views of the proposed UCReCENT library building" width={1200} height={800} loading="lazy" className="h-auto w-full object-cover" />
          <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
            Proposed building — different views (architectural rendering, not the built facility)
          </figcaption>
        </figure>
        <figure className="overflow-hidden rounded-xl border border-slate-200">
          <Image src="/images/design-interior.jpg" alt="Interior reading and seating area of the proposed library" width={1200} height={800} loading="lazy" className="h-auto w-full object-cover" />
          <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
            Proposed reading and seating area (architectural rendering)
          </figcaption>
        </figure>
      </div>

      <div className="mt-10">
        <SectionHeading
          eyebrow="Facility"
          title="What Phase 1 includes"
          lead="Each component below maps to a Concept Note budget line. All images are proposals — construction progress is not claimed."
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Site preparation", d: "Minor groundwork on the community-donated site; boundaries confirmed and the plot prepared for construction. KES 40,000.", img: null },
            { t: "Mabati-and-wood structure", d: "A secure, affordable structure consistent with low-cost building options widely used in rural Kenya. KES 220,000.", img: "/images/design-views.jpg" },
            { t: "Roofing, doors & windows", d: "Weatherproof roofing with doors, windows and basic finishing for security, ventilation and daylight. KES 90,000.", img: null },
            { t: "Shelving for 10,000 books", d: "Sturdy shelving organized for children, youth and adult collections, ready to grow from the first 1,000 books. KES 60,000.", img: null },
            { t: "Seating for 100 users", d: "Reading and study seating for pupils, students and community members, including evening and weekend use. KES 45,000.", img: "/images/design-interior.jpg" },
            { t: "Librarian's office", d: "A small administrative office for the librarian, cataloguing and basic administration. KES 25,000.", img: "/images/design-office.jpg" },
            { t: "Lighting & fittings", d: "Basic lighting and fittings so the space is usable and welcoming, with solar options for evening study. KES 10,000.", img: null },
            { t: "Security", d: "Basic security for the building, books and users — doors, locks and site arrangements from the outset.", img: null },
            { t: "Launch preparation", d: "Community launch and opening activities, then reading clubs, weekend study sessions and holiday programmes. KES 5,000.", img: null },
          ].map((f) => (
            <div key={f.t} className="card flex flex-col overflow-hidden !p-0">
              {f.img ? (
                <Image src={f.img} alt="" width={600} height={380} loading="lazy" className="aspect-[8/5] w-full object-cover" />
              ) : null}
              <div className="p-5">
                <h3 className="font-bold text-navy">{f.t}</h3>
                <p className="mt-1 text-sm text-slate-600">{f.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading eyebrow="Budget" title={`Phase 1 budget — ${formatKes(PHASE_ONE.targetKes)} ceiling`} lead="A lean first phase focused on functionality and early access. Donated land, the first 1,000 books (terms to be confirmed) and partner support keep the project achievable." />
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Phase 1 budget breakdown</caption>
            <thead>
              <tr className="border-b bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <th scope="col" className="px-4 py-3">Budget item</th>
                <th scope="col" className="px-4 py-3 text-right">Cost (KES)</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET.map((b) => (
                <tr key={b.item} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-2.5">{b.item}</td>
                  <td className="px-4 py-2.5 text-right font-semibold">{b.costKes.toLocaleString("en-KE")}</td>
                </tr>
              ))}
              <tr className="bg-cream font-extrabold text-navy">
                <td className="px-4 py-3">Total</td>
                <td className="px-4 py-3 text-right">{PHASE_ONE.targetKes.toLocaleString("en-KE")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10">
        <SectionHeading eyebrow="Timeline" title="Implementation timeline" />
        <ol className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TIMELINE.map((t) => (
            <li key={t.milestone} className="card">
              <p className="text-xs font-bold uppercase tracking-widest text-forest">{t.period}</p>
              <p className="mt-1 text-sm font-semibold text-slate-800">{t.milestone}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-bold text-navy">Long-term vision</h2>
          <p className="mt-2 text-sm text-slate-600">
            Future phases may upgrade the structure with masonry, expand the collection toward
            and beyond 10,000 books, introduce ICT infrastructure and online learning access,
            and host more structured community learning activities as resources become available.
            Full functionality is estimated at {formatKes(PHASE_ONE.fullFunctionality.estimateKes)} for a{" "}
            {PHASE_ONE.fullFunctionality.sizeSqm} sqm facility.
          </p>
        </div>
        <div className="card">
          <h2 className="font-bold text-navy">Monitoring</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
            <li>Construction milestones against workplan and budget</li>
            <li>Books catalogued, available and circulated</li>
            <li>Membership, daily attendance and circulation records</li>
            <li>Reading-club and study-session participation</li>
            <li>Annual sustainability and growth review</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/support" className="btn-primary">Support Phase 1</Link>
        <Link href="/partners" className="btn-outline">See who is involved</Link>
      </div>
    </Container>
  );
}
