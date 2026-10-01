import type { Metadata } from "next";
import Link from "next/link";
import SupportForm from "@/components/forms/SupportForm";
import { SITE, SUPPORT_NEEDS } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Support UCReCENT with funds, materials, books, solar, ICT, skills or advocacy. Enquiry-based support — no payment is taken on this website.",
};

export default function GetInvolvedPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">Get Involved</p>
      <h1 className="h-display mt-2">There is a role for everyone in building this library.</h1>
      <p className="lead mt-4 max-w-3xl">
        Different supporters contribute according to their strengths. Tell the project team how
        you would like to help — {SITE.contact.director} ({SITE.contact.phoneDisplay},{" "}
        {SITE.contact.email}) responds to every enquiry.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUPPORT_NEEDS.map((s) => (
          <div key={s.title} className="card">
            <h2 className="font-bold text-navy">{s.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Enquiry form" title="Express interest in supporting" lead="No payment is taken here. Sharing payment or delivery details happens directly with confirmed supporters." />
          <div className="mt-5"><SupportForm /></div>
        </div>
        <div className="card h-fit">
          <h2 className="font-bold text-navy">Prefer to talk first?</h2>
          <address className="mt-2 text-sm not-italic leading-relaxed text-slate-600">
            {SITE.contact.director}<br />{SITE.contact.directorRole}<br />
            <a className="font-semibold text-lake-dark hover:underline" href={SITE.contact.phoneHref}>{SITE.contact.phoneDisplay}</a><br />
            <a className="font-semibold text-lake-dark hover:underline" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a>
          </address>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/support" className="btn-primary">Go to Support the Project</Link>
            <Link href="/partners" className="btn-outline">How partnerships work</Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
