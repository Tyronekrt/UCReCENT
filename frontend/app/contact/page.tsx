import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import { SITE } from "@/lib/site";
import { Container, SectionHeading } from "@/components/ui/Primitives";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact the UCReCENT Initiative Team: phone, email and message form.",
};

export default function ContactPage() {
  return (
    <Container className="py-10">
      <p className="eyebrow">Contact</p>
      <h1 className="h-display mt-2">Talk to the project team.</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Message" title="Send a message" />
          <div className="mt-5"><ContactForm /></div>
        </div>
        <div className="card h-fit">
          <h2 className="font-bold text-navy">Project contact</h2>
          <address className="mt-2 text-sm not-italic leading-relaxed text-slate-600">
            <strong>{SITE.contact.director}</strong><br />
            {SITE.contact.directorRole}<br />
            {SITE.contact.directorNote}<br /><br />
            Phone: <a className="font-semibold text-lake-dark hover:underline" href={SITE.contact.phoneHref}>{SITE.contact.phoneDisplay}</a><br />
            Email: <a className="break-all font-semibold text-lake-dark hover:underline" href={`mailto:${SITE.contact.email}`}>{SITE.contact.email}</a><br /><br />
            {SITE.location.full}
          </address>
          <p className="mt-4 text-xs text-slate-500">
            For support, materials, books or partnership enquiries, please use the Support the
            Project form so the team can route your message correctly.
          </p>
        </div>
      </div>
    </Container>
  );
}
