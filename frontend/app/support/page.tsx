import type { Metadata } from "next";
import SupportForm from "@/components/forms/SupportForm";
import { PHASE_ONE, SITE, SUPPORT_NEEDS, formatKes } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Support the Project",
  description:
    "Support UCReCENT Phase 1 (KES 500,000 target): sponsorship, materials, books, solar, ICT or skills. Enquiry-based — no payment is taken on this website.",
};

export default function SupportPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">Support the Project</p>
      <h1 className="h-display mt-2">Help open Phase 1 — {formatKes(PHASE_ONE.targetKes)} target.</h1>
      <p className="lead mt-4 max-w-3xl">
        {SITE.name} is built on community-donated land with a lean Phase 1 plan. Your contribution —
        large or small, financial or in-kind — moves the {PHASE_ONE.launchDatePlanned} launch closer.
      </p>

      <div className="card mt-6 border-sun/60 bg-cream" role="note" aria-label="How giving works">
        <h2 className="font-bold text-navy">How giving works (please read)</h2>
        <p className="mt-2 text-sm text-slate-600">
          No M-Pesa Paybill or Till number, bank account, or card-payment link is published on this
          website because no official payment details were supplied in the project material. Send a
          support enquiry below or contact {SITE.contact.director} directly at{" "}
          <a href={SITE.contact.phoneHref} className="font-semibold text-lake-dark hover:underline">{SITE.contact.phoneDisplay}</a>{" "}
          or <a href={`mailto:${SITE.contact.email}`} className="font-semibold text-lake-dark hover:underline">{SITE.contact.email}</a> —{" "}
          payment or delivery details are shared directly with confirmed supporters.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORT_NEEDS.map((s) => (
          <div key={s.title} className="card">
            <h2 className="font-bold text-navy">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-2xl">
        <SectionHeading eyebrow="Enquiry form" title="Express interest in supporting" />
        <div className="mt-5"><SupportForm /></div>
      </div>
    </Container>
  );
}
