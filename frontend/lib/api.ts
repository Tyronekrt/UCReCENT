const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

/** Canonical V1 endpoints (legacy /api/enquiries/* and /api/content/* still served). */
const SUPPORT_PATH = "/api/support/";
const CONTACT_PATH = "/api/contact/";

export interface SupportEnquiry {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  support_type: string;
  /** Legacy alias accepted by older backend deployments. */
  interest?: string;
  amount?: string;
  message: string;
  /** Honeypot — must stay empty; bots that fill it are rejected. */
  website?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
}

async function postJson<T>(path: string, payload: unknown): Promise<T> {
  if (!API_BASE) {
    throw new Error("API not configured");
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortException") {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw new Error("Could not reach the server. Please check your connection and try again.");
  } finally {
    clearTimeout(timeout);
  }
  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) {
      throw new Error("The server could not accept this submission. Please check the form and try again.");
    }
    throw new Error("The server had a problem. Please try again in a moment.");
  }
  return (await res.json()) as T;
}

export function isApiConfigured(): boolean {
  return API_BASE.length > 0;
}

export function submitSupportEnquiry(payload: SupportEnquiry) {
  return postJson<{ id: number }>(SUPPORT_PATH, payload);
}

export function submitContactMessage(payload: ContactMessage) {
  return postJson<{ id: number }>(CONTACT_PATH, payload);
}
