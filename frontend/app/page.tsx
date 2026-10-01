import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BENEFICIARIES,
  BUDGET,
  OBJECTIVES,
  PHASE_ONE,
  SITE,
  SUPPORT_NEEDS,
  TIMELINE,
  formatKes,
} from "@/lib/site";
import {
  getApiPartners,
  getGallery,
  getImpactStats,
  getStaticPartners,
  getUpdates,
} from "@/lib/content";
import { Container, SectionHeading, StatusPill } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "UCReCENT — Read... Learn... Grow... Succeed",
  description:
    "UCReCENT — An Initiative of Building a Library in Usao, Homa Bay County, Kenya. Phase 1: shelving for 10,000 books, seating for 100 users, KES 500,000 target. Learn, support and get involved.",
};

function Stat({ value, label, note }: { value: string; label: string; note?: string }) {
  return (
    <div className="card !p-5 text-left">
      <p className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
      {note ? <p className="mt-1 text-xs leading-relaxed text-slate-500">{note}</p> : null}
    </div>
  );
}

export default async function HomePage() {
  // API-managed content with verified static fallback (see lib/content.ts).
  const [impactStats, updates, gallery, apiPartners] = await Promise.all([
    getImpactStats(),
    getUpdates(),
    getGallery(),
    getApiPartners(),
  ]);
  const partnerPreview = apiPartners
    ? [...apiPartners.confirmed, ...apiPartners.strategic].slice(0, 4)
    : getStaticPartners().strategic;
  return (
    <>
      {/* 2. Hero */}
      <section className="hero-band" aria-labelledby="hero-heading">
        <Container className="py-14 text-center sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <p className="eyebrow eyebrow-center">UCReCENT — {SITE.initiative}</p>
            <h1 id="hero-heading" className="h-display mt-4 text-balance">
              A safe place for Usao to read, learn, grow and succeed.
            </h1>
            <p className="lead mx-auto mt-5 text-pretty">
              UCReCENT is a community-owned library initiative in {SITE.location.full},
              led by local alumni under {SITE.contact.director} — giving children, youth
              and adults books, study space and a lasting culture of reading.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/support" className="btn-primary w-full sm:w-auto">
                Support the Project
              </Link>
              <Link href="/about" className="btn-outline w-full sm:w-auto">
                Learn More
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Planned official launch: {PHASE_ONE.launchDatePlanned} (subject to readiness).
              No payment is taken on this website.
            </p>
          </div>
        </Container>
      </section>

      {/* 3. Key project statistics */}
      <section aria-label="Project at a glance" className="py-10">
        <Container>
          <SectionHeading
            eyebrow="At a glance"
            title="Verified project figures"
          />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {impactStats
              ? impactStats.slice(0, 4).map((s) => (
                  <Stat key={s.label} value={s.value} label={s.label} note={s.description || undefined} />
                ))
              : (
                <>
                  <Stat value="10,000" label="Book capacity" note="shelving planned in Phase 1" />
                  <Stat value="~100" label="Reading & study seats" note="Phase 1 seating" />
                  <Stat value={formatKes(PHASE_ONE.targetKes)} label="Phase 1 target" note="budget ceiling" />
                  <Stat value="7 Oct 2026" label="Planned launch" note="subject to readiness" />
                </>
              )}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            The first 1,000 books are identified in the Concept Note via The Reading Culture
            (formal terms to be confirmed). Only the fundraising target is shown — no funds
            raised are claimed.
          </p>
        </Container>
      </section>

      {/* 4. Why Usao Needs a Library */}
      <section aria-labelledby="why-heading" className="py-8">
        <Container className="grid items-stretch gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="eyebrow">Why Usao needs a library</p>
            <h2 id="why-heading" className="h-section mt-2">
              Learners have too few books and nowhere quiet to study.
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-700">
              <p>
                Many learners in Usao rely solely on school textbooks. There is no nearby
                public library, and limited electricity and internet access further constrain
                learning after school hours, on weekends and during holidays.
              </p>
              <p>
                Literacy levels in Homa Bay County remain low. Without intervention, learners
                face continued barriers to literacy, examination performance and long-term
                social development.
              </p>
            </div>
            <ul className="mt-5 grid gap-3 text-sm text-slate-700">
              {[
                "Safe, quiet reading and study space for children, youth and adults",
                "Reading clubs, weekend study sessions and holiday reading programmes",
                "Librarian training support through Egerton University Library (to be confirmed)",
                "Technical alignment with Kenya National Library Service standards (to be confirmed)",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden="true" className="font-bold text-forest">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[260px] overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_12px_40px_rgba(7,56,108,0.10)] sm:min-h-[320px] lg:min-h-full">
            <Image
              src="/images/community-book-handover-2.jpg"
              alt="Box of English and Kiswahili homework books prepared for the community collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      {/* 5. About the Project */}
      <section aria-labelledby="about-project-heading" className="bg-slate-50 py-12">
        <Container className="grid gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Image
              src="/images/design-front-view.jpg"
              alt="Architectural rendering — front view of the proposed UCReCENT library"
              width={1200}
              height={800}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">About the project</p>
            <h2 id="about-project-heading" className="h-section mt-2">
              A community-owned library, led by alumni giving back.
            </h2>
            <p className="lead mt-3">
              Alumni of Usao, Usungu, Ngodhe and Uwi Primary Schools have come together to
              establish a functional public library on community-donated land — a genuine
              community asset that reduces start-up costs and guarantees local ownership.
            </p>
            <div className="card mt-5">
              <h3 className="font-bold text-navy">Vision</h3>
              <p className="mt-1 text-sm text-slate-600">{SITE.vision}</p>
            </div>
            <div className="mt-4">
              <Link href="/about" className="font-semibold text-lake-dark hover:underline">
                Read the full story, mission and objectives →
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* 6. Who We Serve */}
      <section aria-labelledby="serve-heading" className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Who we serve"
            title="Learners, teachers, youth, parents — and the wider community"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="card">
              <h3 className="font-bold text-navy">Direct beneficiaries</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {BENEFICIARIES.direct.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="font-bold text-navy">Wider community benefit</h3>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
                {BENEFICIARIES.indirect.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-600">
                The library will especially benefit learners who need a place to study in
                the evenings and on weekends.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/impact" className="font-semibold text-lake-dark hover:underline">
              See the intended impact →
            </Link>
          </div>
        </Container>
      </section>

      {/* 7. Phase 1 overview */}
      <section aria-labelledby="phase1-heading" className="bg-navy py-12 text-white">
        <Container>
          <p className="eyebrow !text-sun">Phase 1 — {formatKes(PHASE_ONE.targetKes)} ceiling</p>
          <h2 id="phase1-heading" className="mt-2 text-2xl font-bold sm:text-3xl">
            A lean, functional library the community can open quickly.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            {PHASE_ONE.description} The full-functionality vision (
            {PHASE_ONE.fullFunctionality.sizeSqm} sqm at{" "}
            {formatKes(PHASE_ONE.fullFunctionality.ratePerSqm)}/sqm,{" "}
            {formatKes(PHASE_ONE.fullFunctionality.estimateKes)}) follows as resources allow.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { v: "10,000", l: "Book shelving capacity" },
              { v: "100", l: "Reader seats" },
              { v: "1 office", l: "Librarian & admin space" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 px-4 py-5 text-center">
                <p className="text-2xl font-extrabold text-sun">{s.v}</p>
                <p className="mt-1 text-sm font-semibold text-white/85">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/project" className="btn-primary">
              Explore the full project plan
            </Link>
          </div>
        </Container>
      </section>

      {/* 8. Phase 1 budget / funding target */}
      <section aria-labelledby="budget-heading" className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Funding target"
            title={`Phase 1 budget — ${formatKes(PHASE_ONE.targetKes)}`}
            lead="Transparent budget from the Concept Note. Only the target is shown: no funds raised are claimed because verified fundraising figures have not been supplied."
          />
          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <caption className="sr-only">Phase 1 budget breakdown</caption>
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-4 py-3">Budget item</th>
                  <th scope="col" className="px-4 py-3 text-right">Amount (KES)</th>
                  <th scope="col" className="px-4 py-3 text-right">Share</th>
                </tr>
              </thead>
              <tbody>
                {BUDGET.map((b) => (
                  <tr key={b.item} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-2.5">{b.item}</td>
                    <td className="px-4 py-2.5 text-right font-semibold">
                      {b.costKes.toLocaleString("en-KE")}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500">
                      {Math.round((b.costKes / PHASE_ONE.targetKes) * 100)}%
                    </td>
                  </tr>
                ))}
                <tr className="bg-cream font-extrabold text-navy">
                  <td className="px-4 py-3">Total (Phase 1 target)</td>
                  <td className="px-4 py-3 text-right">{PHASE_ONE.targetKes.toLocaleString("en-KE")}</td>
                  <td className="px-4 py-3 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Visual breakdown bars */}
          <div className="mt-5 grid gap-2" aria-hidden="true">
            {BUDGET.map((b) => (
              <div key={b.item} className="flex items-center gap-3">
                <span className="w-48 truncate text-xs text-slate-500 sm:w-64">{b.item}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <span
                    className="block h-full rounded-full bg-forest"
                    style={{ width: `${Math.max(2, (b.costKes / PHASE_ONE.targetKes) * 100)}%` }}
                  />
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/support" className="btn-primary">Support Phase 1</Link>
            <Link href="/project" className="btn-outline">Full budget & timeline</Link>
          </div>
        </Container>
      </section>

      {/* 9. How People Can Help */}
      <section aria-labelledby="help-heading" className="bg-cream py-12">
        <Container>
          <SectionHeading
            eyebrow="Get involved"
            title="Every shelf, solar panel and chair will exist because someone chose to help."
            lead="Contribute according to your strengths — funds, materials, books, skills or advocacy. Enquiries go directly to the project team; no payment is taken on this site."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SUPPORT_NEEDS.map((s) => (
              <div key={s.title} className="card">
                <h3 className="font-bold text-navy">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/support" className="btn-primary">Support the Project</Link>
            <Link href="/get-involved" className="btn-outline">All ways to help</Link>
          </div>
        </Container>
      </section>

      {/* 10. Project timeline / progress */}
      <section aria-labelledby="timeline-heading" className="py-12">
        <Container>
          <SectionHeading
            eyebrow="Timeline"
            title="From mobilization to launch — and beyond"
            lead={`Planned official launch: ${PHASE_ONE.launchDatePlanned}. No activity is shown as completed unless confirmed in the source material.`}
          />
          <ol className="mt-8 space-y-0">
            {TIMELINE.map((t, i) => (
              <li key={t.milestone} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center" aria-hidden="true">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {i < TIMELINE.length - 1 ? <span className="w-0.5 flex-1 bg-slate-200" /> : null}
                </div>
                <div className="pb-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-forest">{t.period}</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-800">{t.milestone}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2">
            <StatusPill kind="planned">Planned dates</StatusPill>
            <span className="text-xs text-slate-500">Reconfirm readiness before treating the launch date as firm.</span>
          </div>
        </Container>
      </section>

      {/* 11. Partners */}
      <section aria-labelledby="partners-heading" className="bg-slate-50 py-12">
        <Container>
          <SectionHeading
            eyebrow="Partners"
            title="Working with others — honestly presented"
            lead="The Concept Note names collaborators; outreach letters were prepared for others. None is presented as a confirmed formal partner until terms are agreed."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {partnerPreview.map((p) => (
              <div key={p.name} className="card">
                <h3 className="font-bold text-navy">{p.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{p.category}</p>
                <p className="mt-2 text-sm text-slate-600">{p.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/partners" className="font-semibold text-lake-dark hover:underline">
              See all collaborators, organisations being engaged and champions →
            </Link>
          </div>
        </Container>
      </section>

      {/* 12. Latest Updates */}
      <section aria-labelledby="updates-heading" className="py-12">
        <Container>
          <SectionHeading eyebrow="Updates" title="Latest from the initiative" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {updates.map((u) => (
              <article key={u.slug} className="card flex flex-col overflow-hidden !p-0">
                {u.coverImage ? (
                  <Image
                    src={u.coverImage}
                    alt={u.coverAlt}
                    width={600}
                    height={400}
                    loading="lazy"
                    className="aspect-[3/2] w-full object-cover"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <time dateTime={u.date}>{u.date}</time> · {u.category}
                  </p>
                  <h3 className="mt-1 font-bold text-navy">{u.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-slate-600">{u.excerpt}</p>
                  <Link href={`/updates/${u.slug}`} className="mt-3 font-semibold text-lake-dark hover:underline">
                    Read update →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 13. Gallery preview */}
      <section aria-labelledby="gallery-heading" className="bg-cream py-12">
        <Container>
          <SectionHeading eyebrow="Gallery" title="The community behind the library" />
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {gallery.slice(0, 4).map((g) => (
              <figure key={g.src} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <Image src={g.src} alt={g.alt} width={600} height={450} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="px-3 py-2 text-xs text-slate-600">{g.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-4">
            <Link href="/gallery" className="font-semibold text-lake-dark hover:underline">View full gallery →</Link>
          </div>
        </Container>
      </section>

      {/* Objectives strip */}
      <section aria-labelledby="objectives-heading" className="py-12">
        <Container>
          <SectionHeading eyebrow="Objectives" title="What the library will do" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {OBJECTIVES.map((o, i) => (
              <div key={o} className="card">
                <p className="text-xs font-bold uppercase tracking-widest text-lake">0{i + 1}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{o}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 14. Strong final Support CTA */}
      <section aria-labelledby="final-cta-heading" className="bg-gradient-to-br from-forest-dark via-forest to-forest-dark py-14 text-white">
        <Container className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow !text-sun">Support the project</p>
            <h2 id="final-cta-heading" className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-4xl">
              Help Usao&apos;s children read, learn, grow and succeed.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              Phase 1 needs {formatKes(PHASE_ONE.targetKes)} on community-donated land. Financial
              sponsorship, books, materials, solar, ICT or your skills — every contribution moves
              the {PHASE_ONE.launchDatePlanned} launch closer. Giving details are shared directly
              with confirmed supporters.
            </p>
            <p className="mt-4 text-xs text-white/70">
              {SITE.contact.director} · {SITE.contact.phoneDisplay} · {SITE.contact.email}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link href="/support" className="btn-primary">Support the Project</Link>
            <Link href="/contact" className="border border-white/30 text-white btn hover:bg-white/10">
              Contact the Team
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
