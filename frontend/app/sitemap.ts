import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getUpdateSlugs } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const slugs = await getUpdateSlugs();
  const routes = [
    "",
    "/about",
    "/project",
    "/impact",
    "/get-involved",
    "/updates",
    ...slugs.map((s) => `/updates/${s}`),
    "/gallery",
    "/partners",
    "/contact",
    "/support",
  ];
  return routes.map((r) => ({
    url: `${base}${r === "" ? "" : r}`,
    lastModified: new Date("2026-08-19"),
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : r === "/support" ? 0.9 : 0.7,
  }));
}
