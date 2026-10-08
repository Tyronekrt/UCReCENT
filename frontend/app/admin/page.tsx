"use client";

import { useEffect, useState } from "react";
import {
  adminApiConfigured,
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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-navy">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function AdminPage() {
  const [session, setSession] = useState<AdminUser | null>(null);
  const [overview, setOverview] = useState<AdminOverview>(EMPTY_OVERVIEW);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
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

  async function saveRecord<T>(section: string, item: T, path: string) {
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

  if (!adminApiConfigured()) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-left shadow-sm">
          <p className="eyebrow text-amber-800">Admin dashboard unavailable</p>
          <h1 className="mt-3 text-3xl font-black text-navy">Set the API URL first</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            Add NEXT_PUBLIC_API_URL in your frontend environment so this page can authenticate against
            the Django backend and update the live website content safely.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-x py-16 text-center text-slate-600">
        Loading admin session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="eyebrow">UCReCENT admin</p>
          <h1 className="mt-3 text-3xl font-black text-navy">Sign in to manage updates</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use the staff account created in the Django backend to publish changes without affecting the
            public site fallback.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Username</label>
              <input
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-navy"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-navy"
                autoComplete="current-password"
              />
            </div>

            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

            <button type="submit" className="btn-primary w-full" disabled={isBusy}>
              {isBusy ? "Signing in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="eyebrow">UCReCENT admin</p>
          <h1 className="mt-2 text-3xl font-black text-navy">Website content dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-forest/10 px-3 py-1 text-sm font-medium text-forest">
            Signed in as {session.username}
          </span>
          <button type="button" onClick={handleLogout} className="btn-outline" disabled={isBusy}>
            Log out
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <SectionCard title="Website source documents">
            <div className="space-y-2 text-sm text-slate-700">
              {docSourceFiles.map((file) => (
                <div key={file} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  {file}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              These documents are the reference source for the live website updates. Review them before
              publishing new project, partner, gallery, or impact information.
            </p>
          </SectionCard>

          <SectionCard title="Project updates">
            <div className="space-y-4">
              {overview.updates.length === 0 ? (
                <p className="text-sm text-slate-600">No published updates yet.</p>
              ) : (
                overview.updates.map((item: AdminUpdate) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Title</span>
                        <input
                          value={item.title}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, title: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Slug</span>
                        <input
                          value={item.slug}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, slug: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="text-sm md:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">Excerpt</span>
                        <textarea
                          value={item.excerpt}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, excerpt: event.target.value } : row,
                              ),
                            }))
                          }
                          className="min-h-[90px] w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm md:col-span-2">
                        <span className="mb-1 block font-medium text-slate-700">Content</span>
                        <textarea
                          value={item.content}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, content: event.target.value } : row,
                              ),
                            }))
                          }
                          className="min-h-[120px] w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Category</span>
                        <input
                          value={item.category}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, category: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Cover image URL</span>
                        <input
                          value={item.cover_image}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, cover_image: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.published}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              updates: prev.updates.map((row) =>
                                row.id === item.id ? { ...row, published: event.target.checked } : row,
                              ),
                            }))
                          }
                        />
                        Published
                      </label>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={isBusy}
                        onClick={() => saveRecord("updates", item, `/api/admin/updates/${item.id}/`)}
                      >
                        Save update
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Partners and collaborators">
            <div className="space-y-4">
              {overview.partners.length === 0 ? (
                <p className="text-sm text-slate-600">No partner records yet.</p>
              ) : (
                overview.partners.map((item: AdminPartner) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Name</span>
                        <input
                          value={item.name}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              partners: prev.partners.map((row) =>
                                row.id === item.id ? { ...row, name: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Category</span>
                        <input
                          value={item.category}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              partners: prev.partners.map((row) =>
                                row.id === item.id ? { ...row, category: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                    </div>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Description</span>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            partners: prev.partners.map((row) =>
                              row.id === item.id ? { ...row, description: event.target.value } : row,
                            ),
                          }))
                        }
                        className="min-h-[90px] w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Website</span>
                        <input
                          value={item.website}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              partners: prev.partners.map((row) =>
                                row.id === item.id ? { ...row, website: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-slate-700">Status</span>
                        <select
                          value={item.status}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              partners: prev.partners.map((row) =>
                                row.id === item.id ? { ...row, status: event.target.value } : row,
                              ),
                            }))
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        >
                          <option value="confirmed">Confirmed</option>
                          <option value="strategic">Strategic</option>
                          <option value="being-engaged">Being engaged</option>
                        </select>
                      </label>
                    </div>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Status note</span>
                      <textarea
                        value={item.status_note}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            partners: prev.partners.map((row) =>
                              row.id === item.id ? { ...row, status_note: event.target.value } : row,
                            ),
                          }))
                        }
                        className="min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              partners: prev.partners.map((row) =>
                                row.id === item.id ? { ...row, is_active: event.target.checked } : row,
                              ),
                            }))
                          }
                        />
                        Active on site
                      </label>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={isBusy}
                        onClick={() => saveRecord("partners", item, `/api/admin/partners/${item.id}/`)}
                      >
                        Save partner
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Gallery images">
            <div className="space-y-4">
              {overview.gallery.length === 0 ? (
                <p className="text-sm text-slate-600">No gallery items yet.</p>
              ) : (
                overview.gallery.map((item: AdminGalleryImage) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Caption</span>
                      <input
                        value={item.caption}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            gallery: prev.gallery.map((row) =>
                              row.id === item.id ? { ...row, caption: event.target.value } : row,
                            ),
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Alt text</span>
                      <input
                        value={item.alt_text}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            gallery: prev.gallery.map((row) =>
                              row.id === item.id ? { ...row, alt_text: event.target.value } : row,
                            ),
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              gallery: prev.gallery.map((row) =>
                                row.id === item.id ? { ...row, is_active: event.target.checked } : row,
                              ),
                            }))
                          }
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={isBusy}
                        onClick={() => saveRecord("gallery", item, `/api/admin/gallery/${item.id}/`)}
                      >
                        Save image
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>

          <SectionCard title="Impact statistics">
            <div className="space-y-4">
              {overview.impact.length === 0 ? (
                <p className="text-sm text-slate-600">No impact statistics yet.</p>
              ) : (
                overview.impact.map((item: AdminImpactStat) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                    <label className="block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Label</span>
                      <input
                        value={item.label}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            impact: prev.impact.map((row) =>
                              row.id === item.id ? { ...row, label: event.target.value } : row,
                            ),
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Value</span>
                      <input
                        value={item.value}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            impact: prev.impact.map((row) =>
                              row.id === item.id ? { ...row, value: event.target.value } : row,
                            ),
                          }))
                        }
                        className="w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <label className="mt-3 block text-sm">
                      <span className="mb-1 block font-medium text-slate-700">Description</span>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          setOverview((prev) => ({
                            ...prev,
                            impact: prev.impact.map((row) =>
                              row.id === item.id ? { ...row, description: event.target.value } : row,
                            ),
                          }))
                        }
                        className="min-h-[80px] w-full rounded-lg border border-slate-300 px-3 py-2"
                      />
                    </label>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.is_active}
                          onChange={(event) =>
                            setOverview((prev) => ({
                              ...prev,
                              impact: prev.impact.map((row) =>
                                row.id === item.id ? { ...row, is_active: event.target.checked } : row,
                              ),
                            }))
                          }
                        />
                        Active
                      </label>
                      <button
                        type="button"
                        className="btn-primary"
                        disabled={isBusy}
                        onClick={() => saveRecord("impact", item, `/api/admin/impact/${item.id}/`)}
                      >
                        Save stat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-bold text-navy">Admin rules</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
          <li>Only publish verified updates after reviewing the PDF source documents.</li>
          <li>Do not add fundraisers, payment links, or unverified partner claims.</li>
          <li>Keep the site fallback working by using the Django API rather than hardcoding public content.</li>
        </ul>
      </div>
    </div>
  );
}
