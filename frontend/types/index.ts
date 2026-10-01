export type VerificationStatus = "verified" | "to-verify" | "planned";

export interface BudgetItem {
  item: string;
  costKes: number;
}

export interface TimelineMilestone {
  milestone: string;
  period: string;
}

export interface PartnerEntry {
  name: string;
  category: string;
  role: string;
  status: VerificationStatus;
  statusNote: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  category: "Designs" | "Brand" | "Community";
}

export const GALLERY_CATEGORIES = ["All", "Designs", "Brand", "Community"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

export interface UpdatePost {
  slug: string;
  title: string;
  date: string;
  category: string;
  coverImage: string;
  coverAlt: string;
  excerpt: string;
  body: string[];
}

export const SUPPORT_TYPES = [
  "Financial contribution",
  "Books",
  "Building materials",
  "ICT",
  "Solar",
  "Internet / connectivity",
  "Professional skills",
  "Volunteering",
  "Other",
] as const;
export type SupportType = (typeof SUPPORT_TYPES)[number];

/** Impact statistic shown on the homepage (API-managed, static fallback). */
export interface ImpactStat {
  label: string;
  value: string;
  description: string;
}

/** Raw shapes returned by the Django API (see backend docs/BACKEND.md). */
export interface ApiUpdate {
  slug: string;
  title: string;
  excerpt: string;
  content_paragraphs?: string[];
  body_paragraphs?: string[];
  cover_url?: string;
  coverImage?: string;
  cover_alt?: string;
  coverAlt?: string;
  category: string;
  author?: string;
  published_date?: string;
  date?: string;
}

export interface ApiPartner {
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  category: string;
  status: string;
  status_note?: string;
  order?: number;
}

export interface ApiGalleryImage {
  title?: string;
  image_url?: string;
  image_path?: string;
  caption: string;
  category: string;
  alt_text?: string;
  alt?: string;
  order?: number;
}
