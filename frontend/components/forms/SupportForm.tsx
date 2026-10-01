"use client";

import { useState } from "react";
import { isApiConfigured, submitSupportEnquiry } from "@/lib/api";
import { SITE } from "@/lib/site";
import { SUPPORT_TYPES } from "@/types";

export default function SupportForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      organization: String(data.get("organization") ?? "").trim(),
      support_type: String(data.get("support_type") ?? ""),
      amount: String(data.get("amount") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };

    // Client-side validation with accessible per-field messages
    const errs: Record<string, string> = {};
    if (payload.name.length < 2) errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errs.email = "Please enter a valid email address.";
    if (!payload.support_type) errs.support_type = "Please choose a support type.";
    if (payload.message.length < 10) errs.message = "Please tell us a little more (at least 10 characters).";
    if (payload.amount && Number.isNaN(Number(payload.amount.replace(/[, ]/g, "")))) {
      errs.amount = "Please enter a numeric amount, or leave this blank.";
    }
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("idle");
      document.getElementById("support-form-errors")?.focus();
      return;
    }

    try {
      if (!isApiConfigured()) {
        // V1 without backend: open a pre-addressed email so no enquiry is lost.
        const subject = encodeURIComponent(`Support enquiry — ${payload.support_type} — ${payload.name}`);
        const body = encodeURIComponent(
          `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\nOrganisation: ${payload.organization}\nSupport type: ${payload.support_type}\nAmount (if applicable): ${payload.amount}\n\n${payload.message}`
        );
        window.location.href = `mailto:${SITE.contact.email}?subject=${subject}&body=${body}`;
        setStatus("done");
        return;
      }
      await submitSupportEnquiry(payload);
      setStatus("done");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again or contact us directly.");
    }
  }

  if (status === "done") {
    return (
      <div className="card border-forest/30 bg-forest/5" role="status" tabIndex={-1}>
        <h2 className="text-lg font-bold text-navy">Thank you — your interest has been recorded.</h2>
        <p className="mt-2 text-sm text-slate-600">
          {isApiConfigured()
            ? "The project team will respond using the contact details you provided."
            : `Your email app should have opened with a message addressed to ${SITE.contact.email}. If it did not, please contact ${SITE.contact.phoneDisplay} directly.`}
        </p>
      </div>
    );
  }

  const inputClass = (name: string) => `input ${fieldErrors[name] ? "!border-red-500" : ""}`;

  return (
    <form onSubmit={onSubmit} className="card grid gap-4" aria-label="Support the project enquiry form" noValidate={false}>
      {Object.keys(fieldErrors).length > 0 && status === "idle" ? (
        <div id="support-form-errors" tabIndex={-1} role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">Please fix the following:</p>
          <ul className="mt-1 list-disc pl-5">
            {Object.entries(fieldErrors).map(([k, v]) => (
              <li key={k}>{v}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="support-name">Full name *</label>
          <input className={inputClass("name")} id="support-name" name="name" required autoComplete="name" placeholder="Your full name" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? "support-name-error" : undefined} />
          {fieldErrors.name ? <p id="support-name-error" className="mt-1 text-xs font-semibold text-red-700">{fieldErrors.name}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="support-email">Email *</label>
          <input className={inputClass("email")} id="support-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? "support-email-error" : undefined} />
          {fieldErrors.email ? <p id="support-email-error" className="mt-1 text-xs font-semibold text-red-700">{fieldErrors.email}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="support-phone">Phone</label>
          <input className="input" id="support-phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 ..." />
        </div>
        <div>
          <label className="label" htmlFor="support-organization">Organization <span className="font-normal text-slate-400">(optional)</span></label>
          <input className="input" id="support-organization" name="organization" autoComplete="organization" placeholder="School, company, group…" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="support-type">Support type *</label>
          <select className={inputClass("support_type")} id="support-type" name="support_type" required defaultValue="" aria-invalid={!!fieldErrors.support_type} aria-describedby={fieldErrors.support_type ? "support-type-error" : undefined}>
            <option value="" disabled>Select a support type</option>
            {SUPPORT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {fieldErrors.support_type ? <p id="support-type-error" className="mt-1 text-xs font-semibold text-red-700">{fieldErrors.support_type}</p> : null}
        </div>
        <div>
          <label className="label" htmlFor="support-amount">Amount (KES) <span className="font-normal text-slate-400">— if applicable</span></label>
          <input className={inputClass("amount")} id="support-amount" name="amount" inputMode="numeric" placeholder="e.g. 5000" aria-invalid={!!fieldErrors.amount} aria-describedby={fieldErrors.amount ? "support-amount-error" : "support-amount-hint"} />
          {fieldErrors.amount
            ? <p id="support-amount-error" className="mt-1 text-xs font-semibold text-red-700">{fieldErrors.amount}</p>
            : <p id="support-amount-hint" className="mt-1 text-xs text-slate-500">Only for financial contributions. Leave blank for in-kind support.</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="support-message">Message *</label>
        <textarea className={`${inputClass("message")} min-h-28`} id="support-message" name="message" required placeholder="Tell us briefly how you would like to support the library…" aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? "support-message-error" : undefined} />
        {fieldErrors.message ? <p id="support-message-error" className="mt-1 text-xs font-semibold text-red-700">{fieldErrors.message}</p> : null}
      </div>

      <p className="text-xs text-slate-500">
        No payment is taken on this website. Payment or delivery details are shared directly with confirmed supporters by the project team.
      </p>
      {/* Honeypot: hidden from people, rejected by the API if filled. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="support-website">Website</label>
        <input id="support-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {status === "error" ? (
        <p className="text-sm font-semibold text-red-700" role="alert">{error}</p>
      ) : null}
      <div>
        <button type="submit" className="btn-secondary w-full sm:w-auto" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send support enquiry"}
        </button>
      </div>
    </form>
  );
}
