"use client";

import { useState } from "react";
import { isApiConfigured, submitContactMessage } from "@/lib/api";
import { SITE } from "@/lib/site";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    try {
      if (!isApiConfigured()) {
        const subject = encodeURIComponent(`Website contact — ${payload.subject} — ${payload.name}`);
        const body = encodeURIComponent(`Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\n${payload.message}`);
        window.location.href = `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`;
        setStatus("done");
        return;
      }
      await submitContactMessage(payload);
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="card border-forest/30 bg-forest/5" role="status">
        <h2 className="text-lg font-bold text-navy">Thank you — your message is on its way.</h2>
        <p className="mt-2 text-sm text-slate-600">
          {isApiConfigured()
            ? "We will respond using the email address you provided."
            : `Your email app should have opened with a message to ${SITE.contact.email}. You can also call ${SITE.contact.phoneDisplay}.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card grid gap-4" aria-label="Contact the project form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contact-name">Full name *</label>
          <input className="input" id="contact-name" name="name" required autoComplete="name" placeholder="Your full name" />
        </div>
        <div>
          <label className="label" htmlFor="contact-email">Email *</label>
          <input className="input" id="contact-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="contact-subject">Subject *</label>
          <input className="input" id="contact-subject" name="subject" required minLength={3} placeholder="What is your message about?" />
        </div>
        <div>
          <label className="label" htmlFor="contact-phone">Phone <span className="font-normal text-slate-400">(optional)</span></label>
          <input className="input" id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 ..." />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="contact-message">Message *</label>
        <textarea className="input min-h-28" id="contact-message" name="message" required minLength={10} placeholder="Write your message…" />
      </div>
      {/* Honeypot: hidden from people, rejected by the API if filled. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" ? (
        <p className="text-sm font-semibold text-red-700" role="alert">{error}</p>
      ) : null}
      <button type="submit" className="btn-secondary w-full sm:w-auto" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
