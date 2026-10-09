"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  adminApiConfigured,
  createAdminRecord,
  deleteAdminRecord,
  docSourceFiles,
  fetchAdminMe,
  fetchAdminOverview,
  loginAdmin,
  logoutAdmin,
  updateAdminRecord,
  type AdminGalleryImage,
  type AdminImpactStat,
  type AdminOverview,
  type AdminPartner,
  type AdminUpdate,
  type AdminUser,
} from "@/lib/admin";

const EMPTY_OVERVIEW: AdminOverview = {
  project: null,
  updates: [],
  partners: [],
  gallery: [],
  impact: [],
  people: [],
  support_requests: [],
  contact_messages: [],
};

function formatStatusLabel(value: string) {
  switch (value) {
    case "confirmed":
      return "Confirmed";
    case "strategic":
      return "Strategic";
    case "being-engaged":
      return "Being engaged";
    default:
      return value;
  }
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-sky-700">Management</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">{title}</h2>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 h-2 w-14 rounded-full ${accent}`} />
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminUser | null>(null);
  const [overview, setOverview] = useState<AdminOverview>(EMPTY_OVERVIEW);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("Overview");

  const sidebarItems = [
    "Overview",
    "Contacts",
    "Support",
    "People",
    "Updates",
    "Gallery",
    "Partners",
    "Impact",
  ];

  const metrics = useMemo(
    () => [
      { label: "Published updates", value: String(overview.updates.length), accent: "bg-amber-400" },
      { label: "Active partners", value: String(overview.partners.filter((item) => item.is_active).length), accent: "bg-sky-500" },
      { label: "Gallery items", value: String(overview.gallery.filter((item) => item.is_active).length), accent: "bg-emerald-500" },
      { label: "Impact stats", value: String(overview.impact.filter((item) => item.is_active).length), accent: "bg-violet-500" },
    ],
    [overview],
  );

  const analyticsBars = useMemo(
    () => [
      { label: "Updates", value: Math.max(overview.updates.length * 18, 28), color: "bg-violet-500" },
      { label: "Partners", value: Math.max(overview.partners.filter((item) => item.is_active).length * 20, 30), color: "bg-sky-500" },
      { label: "Gallery", value: Math.max(overview.gallery.filter((item) => item.is_active).length * 18, 32), color: "bg-emerald-500" },
      { label: "Impact", value: Math.max(overview.impact.filter((item) => item.is_active).length * 22, 26), color: "bg-amber-500" },
    ],
    [overview],
  );

  async function refreshOverview() {
    const data = await fetchAdminOverview();
    setOverview(data);
  }

  useEffect(() => {
    async function loadSession() {
      if (!adminApiConfigured()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchAdminMe();
        setSession(currentUser);
        await refreshOverview();
      } catch {
        setSession(null);
      } finally {
        setLoading(false);
      }
    }

    void loadSession();
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setError("");

    try {
      const currentUser = await loginAdmin(loginForm.username, loginForm.password);
      setSession(currentUser);
      const data = await fetchAdminOverview();
      setOverview(data);
      setLoginForm({ username: "", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleLogout() {
    setIsBusy(true);
    try {
      await logoutAdmin();
      setSession(null);
      setOverview(EMPTY_OVERVIEW);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function saveRecord<T>(item: T, path: string) {
    setIsBusy(true);
    setError("");
    try {
      await updateAdminRecord<T>(path, item);
      await refreshOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the record.");
    } finally {
      setIsBusy(false);
    }
  }

  async function createRecord(section: "updates" | "partners" | "gallery" | "impact") {
    setIsBusy(true);
    setError("");

    try {
      let payload: Record<string, unknown> = {};
      const timestamp = Date.now();

      if (section === "updates") {
        payload = {
          title: "New update",
          slug: `new-update-${timestamp}`,
          excerpt: "Add a concise summary for this update.",
          content: "Write the full update content here.",
          cover: "",
          cover_image: "",
          cover_alt: "",
          category: "Update",
          author: session?.username ?? "Staff",
          published: false,
          published_date: null,
        };
      }

      if (section === "partners") {
        payload = {
          name: "New partner",
          description: "Add the organisation background and relationship context.",
          logo: "",
          website: "",
          category: "Community",
          status: "being-engaged",
          status_note: "Awaiting confirmation.",
          order: timestamp,
          is_active: true,
        };
      }

      if (section === "gallery") {
        payload = {
          title: "New gallery item",
          image: "",
          image_path: "",
          caption: "Add a short gallery caption.",
          category: "Gallery",
          alt_text: "",
          order: timestamp,
          is_active: true,
        };
      }

      if (section === "impact") {
        payload = {
          label: "New metric",
          value: "0",
          description: "Add a short description for the metric.",
          order: timestamp,
          is_active: true,
        };
      }

      const path = `/api/admin/${section}/`;
      const created = await createAdminRecord<Record<string, unknown>>(path, payload);

      setOverview((prev) => {
        const next = { ...prev };
        const sectionValue = created as Partial<AdminUpdate | AdminPartner | AdminGalleryImage | AdminImpactStat>;

        if (section === "updates") {
          next.updates = [sectionValue as AdminUpdate, ...prev.updates];
        }
        if (section === "partners") {
          next.partners = [sectionValue as AdminPartner, ...prev.partners];
        }
        if (section === "gallery") {
          next.gallery = [sectionValue as AdminGalleryImage, ...prev.gallery];
        }
        if (section === "impact") {
          next.impact = [sectionValue as AdminImpactStat, ...prev.impact];
        }
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create a new record.");
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteRecord(section: "updates" | "partners" | "gallery" | "impact", id: number) {
    setIsBusy(true);
    setError("");

    try {
      await deleteAdminRecord(`/api/admin/${section}/${id}/`);
      setOverview((prev) => {
        if (section === "updates") return { ...prev, updates: prev.updates.filter((item) => item.id !== id) };
        if (section === "partners") return { ...prev, partners: prev.partners.filter((item) => item.id !== id) };
        if (section === "gallery") return { ...prev, gallery: prev.gallery.filter((item) => item.id !== id) };
        return { ...prev, impact: prev.impact.filter((item) => item.id !== id) };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the record.");
    } finally {
      setIsBusy(false);
    }
  }

  if (!adminApiConfigured()) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-white/10 bg-white/5 p-8 shadow-[0_25px_80px_rgba(14,116,144,0.3)] backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Admin dashboard unavailable</p>
          <h1 className="mt-4 text-3xl font-black text-white">Set the local API URL first</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Add NEXT_PUBLIC_API_URL in the frontend environment so the admin panel can authenticate against the local Django backend and update content safely.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-200">
        <div className="rounded-2xl border border-sky-500/30 bg-slate-900/70 px-6 py-5 text-sm shadow-xl">
          Loading admin session...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full bg-[#0b1020] px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-3rem)] w-full items-center justify-center">
          <div className="w-full max-w-md rounded-[28px] border border-violet-400/20 bg-slate-900/90 p-7 shadow-[0_25px_80px_rgba(91,33,182,0.35)] ring-1 ring-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 text-lg font-black text-violet-200">
                U
              </div>
              <div>
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.28em] text-violet-200">UCReCENT</p>
                <h1 className="mt-1 text-xl font-black text-white">Admin login</h1>
              </div>
            </div>

            <form className="mt-7 space-y-5" onSubmit={handleLogin}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Username</label>
                <input
                  value={loginForm.username}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  autoComplete="username"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              {error ? (
                <p className="rounded-2xl border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
              ) : null}

              <button
                type="submit"
                disabled={isBusy}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 px-4 py-3 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBusy ? "Signing in..." : "Log in to dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const renderTaskbarView = () => {
    if (activeNav === "Overview") {
      return (
        <>
          <div className="mt-6 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <section className="rounded-[26px] border border-violet-200 bg-white p-5 shadow-[0_20px_60px_rgba(76,29,149,0.08)]">
              <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-violet-600">Overview</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900">Engagement analytics</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live</span>
              </div>

              <div className="mt-5 flex h-48 items-end gap-3">
                {analyticsBars.map((item) => (
                  <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center rounded-t-2xl bg-slate-100 p-1">
                      <div
                        className={`${item.color} w-full rounded-t-xl`}
                        style={{ height: `${item.value}%` }}
                        title={`${item.label}: ${item.value}%`}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[26px] border border-violet-200 bg-gradient-to-br from-violet-600 to-indigo-600 p-5 text-white shadow-[0_20px_60px_rgba(76,29,149,0.18)]">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-violet-100">Snapshot</p>
              <h2 className="mt-2 text-xl font-bold">Platform health</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-violet-100"><span>Content readiness</span><span>88%</span></div>
                  <div className="h-2.5 rounded-full bg-white/15"><div className="h-2.5 w-[88%] rounded-full bg-white" /></div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-violet-100"><span>Partner pipeline</span><span>73%</span></div>
                  <div className="h-2.5 rounded-full bg-white/15"><div className="h-2.5 w-[73%] rounded-full bg-emerald-300" /></div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-violet-100"><span>Launch readiness</span><span>91%</span></div>
                  <div className="h-2.5 rounded-full bg-white/15"><div className="h-2.5 w-[91%] rounded-full bg-cyan-300" /></div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((item) => (
              <MetricCard key={item.label} label={item.label} value={item.value} accent={item.accent} />
            ))}
          </div>
        </>
      );
    }

    if (activeNav === "Contacts") {
      return (
        <SectionCard title="Contact messages" description="Review incoming contact submissions.">
          <div className="space-y-4">
            {overview.contact_messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">
                No contact submissions yet.
              </div>
            ) : (
              overview.contact_messages.map((item) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.email} · {item.phone || "No phone"}</p>
                    </div>
                    <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-700">{formatStatusLabel(item.status)}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-700">{item.subject}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                  <p className="mt-3 text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    if (activeNav === "Support") {
      return (
        <SectionCard title="Support requests" description="Track support enquiries and funding asks.">
          <div className="space-y-4">
            {overview.support_requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">
                No support requests yet.
              </div>
            ) : (
              overview.support_requests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-lg font-bold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-600">{item.organization || "No organisation"} · {item.support_type}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{formatStatusLabel(item.status)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">Requested support: {item.amount || "Not specified"}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    if (activeNav === "People") {
      return (
        <SectionCard title="People and leadership" description="View the active people and leadership directory.">
          <div className="space-y-4">
            {overview.people.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">
                No people added yet.
              </div>
            ) : (
              overview.people.map((item) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <p className="text-lg font-bold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-violet-700">{item.role}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.organization}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.bio}</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    if (activeNav === "Updates") {
      return (
        <SectionCard title="Project updates" description="Review the latest update items." action={<button type="button" className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void createRecord("updates")} disabled={isBusy}>Add update</button>}>
          <div className="space-y-4">
            {overview.updates.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">No updates yet.</div>
            ) : (
              overview.updates.map((item: AdminUpdate) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold text-slate-900">{item.title}</p>
                    <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">{item.published ? "Published" : "Draft"}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{item.excerpt}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white" onClick={() => void saveRecord(item, `/api/admin/updates/${item.id}/`)} disabled={isBusy}>Save</button>
                    <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700" onClick={() => void deleteRecord("updates", item.id)} disabled={isBusy}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    if (activeNav === "Gallery") {
      return (
        <SectionCard title="Gallery" description="Preview the image collection." action={<button type="button" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void createRecord("gallery")} disabled={isBusy}>Add image</button>}>
          <div className="space-y-4">
            {overview.gallery.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">No gallery items yet.</div>
            ) : (
              overview.gallery.map((item: AdminGalleryImage) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <p className="text-lg font-bold text-slate-900">{item.caption || item.title || "Gallery item"}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.alt_text || "No alt text specified"}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white" onClick={() => void saveRecord(item, `/api/admin/gallery/${item.id}/`)} disabled={isBusy}>Save</button>
                    <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700" onClick={() => void deleteRecord("gallery", item.id)} disabled={isBusy}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    if (activeNav === "Partners") {
      return (
        <SectionCard title="Partners" description="Review the partner network." action={<button type="button" className="rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white" onClick={() => void createRecord("partners")} disabled={isBusy}>Add partner</button>}>
          <div className="space-y-4">
            {overview.partners.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">No partners yet.</div>
            ) : (
              overview.partners.map((item: AdminPartner) => (
                <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                  <p className="text-lg font-bold text-slate-900">{item.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{item.category}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" className="rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white" onClick={() => void saveRecord(item, `/api/admin/partners/${item.id}/`)} disabled={isBusy}>Save</button>
                    <button type="button" className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-sm font-semibold text-rose-700" onClick={() => void deleteRecord("partners", item.id)} disabled={isBusy}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      );
    }

    return (
      <SectionCard title="Impact statistics" description="Review the measurable outcomes" action={<button type="button" className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950" onClick={() => void createRecord("impact")} disabled={isBusy}>Add metric</button>}>
        <div className="space-y-4">
          {overview.impact.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50 px-4 py-5 text-sm text-slate-500">No impact metrics yet.</div>
          ) : (
            overview.impact.map((item: AdminImpactStat) => (
              <div key={item.id} className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
                <p className="text-lg font-bold text-slate-900">{item.label}</p>
                <p className="mt-1 text-sm text-violet-700">{item.value}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </SectionCard>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f1ff] text-slate-800">
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-72 shrink-0 border-r border-violet-200 bg-[#1f163d] p-5 text-white lg:flex lg:flex-col">
          <div className="flex items-center gap-3 border-b border-white/10 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/20 text-lg font-black text-violet-200">U</div>
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-violet-200">UCReCENT</p>
              <h2 className="mt-1 text-lg font-bold">Admin Panel</h2>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarItems.map((item) => {
              const active = activeNav === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setActiveNav(item)}
                  className={[
                    "flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition",
                    active ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "text-violet-100/80 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <span>{item}</span>
                  {active ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-200">System</p>
            <p className="mt-3 text-sm text-violet-50">Admin session active</p>
            <button type="button" onClick={handleLogout} className="mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/15" disabled={isBusy}>Log out</button>
          </div>
        </aside>

        <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
          <header className="rounded-[26px] border border-violet-200 bg-white/80 p-4 shadow-[0_20px_70px_rgba(76,29,149,0.08)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-violet-600">Dashboard</p>
                <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{activeNav}</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="rounded-2xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700">Signed in as {session.username}</div>
                <button type="button" onClick={handleLogout} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700" disabled={isBusy}>Log out</button>
              </div>
            </div>
          </header>

          {error ? (
            <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}

          {renderTaskbarView()}
        </main>
      </div>
    </div>
  );
}
