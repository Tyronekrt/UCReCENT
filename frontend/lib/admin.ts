export type AdminUser = {
  id: number;
  username: string;
  is_staff: boolean;
  is_superuser: boolean;
};

export type AdminUpdate = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover: string;
  cover_image: string;
  cover_alt: string;
  category: string;
  author: string;
  published: boolean;
  published_date: string | null;
};

export type AdminPartner = {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
  category: string;
  status: string;
  status_note: string;
  order: number;
  is_active: boolean;
};

export type AdminGalleryImage = {
  id: number;
  title: string;
  image: string;
  image_path: string;
  caption: string;
  category: string;
  alt_text: string;
  order: number;
  is_active: boolean;
};

export type AdminImpactStat = {
  id: number;
  label: string;
  value: string;
  description: string;
  order: number;
  is_active: boolean;
};

export type AdminOverview = {
  project: Record<string, unknown> | null;
  updates: AdminUpdate[];
  partners: AdminPartner[];
  gallery: AdminGalleryImage[];
  impact: AdminImpactStat[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function adminApiConfigured(): boolean {
  return API_BASE.length > 0;
}

async function requestAdmin<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!adminApiConfigured()) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const headers = new Headers(init.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
    if (match && !headers.has("X-CSRFToken")) {
      headers.set("X-CSRFToken", decodeURIComponent(match[1]));
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your admin session has expired. Please log in again.");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = `Request failed (${response.status})`;
    try {
      const json = JSON.parse(text);
      if (typeof json.detail === "string") message = json.detail;
      else if (typeof json?.error === "string") message = json.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function loginAdmin(username: string, password: string): Promise<AdminUser> {
  return requestAdmin<AdminUser>("/api/admin/login/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function fetchAdminMe(): Promise<AdminUser> {
  return requestAdmin<AdminUser>("/api/admin/me/");
}

export function logoutAdmin(): Promise<{ status: string }> {
  return requestAdmin<{ status: string }>("/api/admin/logout/", { method: "POST" });
}

export function fetchAdminOverview(): Promise<AdminOverview> {
  return requestAdmin<AdminOverview>("/api/admin/overview/");
}

export function updateAdminRecord<T>(path: string, payload: Partial<T>): Promise<T> {
  return requestAdmin<T>(path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export const docSourceFiles = [
  "USAO Community Library Foundation Storyline.pdf",
  "USAO Community Library Foundation Storyline (1).pdf",
  "USAO ReCENT MINUTES OF COMMUNITY MEETING 1 PDF (1).pdf",
  "Revised Launch Programme_ Community Library_2026.pdf",
];
