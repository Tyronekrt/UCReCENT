import {
  COLLABORATORS,
  GALLERY,
  INDIVIDUAL_CHAMPIONS,
  ORGANISATIONS_BEING_ENGAGED,
  UPDATES,
} from "./site";
import type {
  ApiGalleryImage,
  ApiPartner,
  ApiUpdate,
  GalleryImage,
  ImpactStat,
  PartnerEntry,
  UpdatePost,
} from "@/types";

/**
 * API-driven content with static fallback.
 *
 * When NEXT_PUBLIC_API_URL is set and the Django backend responds, pages render
 * managed content (updates, gallery, partners, impact stats) so the project team
 * can publish without touching React source. Otherwise — or on any API failure —
 * pages fall back to the verified static content in lib/site.ts, so the site
 * never breaks and never shows an empty page by accident.
 *
 * Core project facts (budget, dates, vision/mission) intentionally stay static:
 * they change rarely and must always match the Concept Note.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function isApiConfigured(): boolean {
  return API_BASE.length > 0;
}

async function apiGet<T>(path: string): Promise<T | null> {
  if (!isApiConfigured()) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function mapUpdate(u: ApiUpdate): UpdatePost {
  const paragraphs = u.content_paragraphs ?? u.body_paragraphs ?? [];
  const cover = u.cover_url || u.coverImage || "";
  const alt = u.cover_alt || u.coverAlt || u.title;
  const date = (u.published_date ?? u.date ?? "").slice(0, 10);
  return {
    slug: u.slug,
    title: u.title,
    date,
    category: u.category || "General",
    coverImage: cover,
    coverAlt: alt,
    excerpt: u.excerpt,
    body: paragraphs,
  };
}

export async function getUpdates(): Promise<UpdatePost[]> {
  const api = await apiGet<ApiUpdate[]>("/api/updates/");
  if (api && api.length > 0) return api.map(mapUpdate);
  return UPDATES;
}

export async function getUpdateSlugs(): Promise<string[]> {
  const updates = await getUpdates();
  return updates.map((u) => u.slug);
}

export async function getUpdateBySlug(slug: string): Promise<UpdatePost | null> {
  const api = await apiGet<ApiUpdate>(`/api/updates/${encodeURIComponent(slug)}/`);
  if (api) return mapUpdate(api);
  return UPDATES.find((u) => u.slug === slug) ?? null;
}

function coerceGalleryCategory(raw: string): GalleryImage["category"] {
  if (raw === "Designs" || raw === "Brand" || raw === "Community") return raw;
  return "Community";
}

export async function getGallery(): Promise<GalleryImage[]> {
  const api = await apiGet<ApiGalleryImage[]>("/api/gallery/");
  if (api && api.length > 0) {
    return api.map((g) => ({
      src: g.image_url || g.image_path || "",
      alt: g.alt_text || g.alt || g.caption,
      caption: g.caption,
      category: coerceGalleryCategory(g.category),
    }));
  }
  return GALLERY;
}

export interface PartnerGroups {
  confirmed: PartnerEntry[];
  strategic: PartnerEntry[];
  engaged: PartnerEntry[];
}

/** Groups API partners by verification status; null when the API is unavailable. */
export async function getApiPartners(): Promise<PartnerGroups | null> {
  const api = await apiGet<ApiPartner[]>("/api/partners/");
  if (!api) return null;
  const groups: PartnerGroups = { confirmed: [], strategic: [], engaged: [] };
  for (const p of api) {
    const entry: PartnerEntry = {
      name: p.name,
      category: p.category,
      role: p.description,
      status: p.status === "confirmed" ? "verified" : "to-verify",
      statusNote:
        p.status_note ||
        (p.status === "confirmed"
          ? "Confirmed partner."
          : p.status === "strategic"
            ? "Named collaborator — terms being confirmed."
            : "Outreach prepared — not a confirmed partnership."),
    };
    if (p.status === "confirmed") groups.confirmed.push(entry);
    else if (p.status === "strategic") groups.strategic.push(entry);
    else groups.engaged.push(entry);
  }
  return groups;
}

export function getStaticPartners(): PartnerGroups {
  return { confirmed: [], strategic: COLLABORATORS, engaged: ORGANISATIONS_BEING_ENGAGED };
}

export function getStaticChampions(): PartnerEntry[] {
  return INDIVIDUAL_CHAMPIONS;
}

export async function getImpactStats(): Promise<ImpactStat[] | null> {
  const api = await apiGet<ImpactStat[]>("/api/impact/");
  if (api && api.length > 0) return api;
  return null;
}
