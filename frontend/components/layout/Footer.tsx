"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, SITE } from "@/lib/site";
import SiteLogo from "./SiteLogo";

const exploreLinks = NAV.slice(0, 5);
const moreLinks = NAV.slice(5);

export default function Footer() {
  const pathname = usePathname();
  // On the homepage the green Support band meets the footer directly — no gap.
  const seamless = pathname === "/";
  return (
    <footer className={`bg-navy text-white${seamless ? "" : " mt-16"}`}>
      <div className="container-x grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" className="flex items-center gap-3" aria-label="UCReCENT — home">
            <SiteLogo size={56} mono />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight">UCReCENT</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/70">
                {SITE.tagline}
              </span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-white/75">
            {SITE.initiative} — community-owned library in Usao, Homa Bay County.
          </p>
          <div className="mt-4">
            <Link href="/support" className="btn-primary !px-4 !py-2 text-sm">
              Support the Project
            </Link>
          </div>
        </div>

        {/* Link columns keep the footer short: two compact centered lists side by side */}
        <nav aria-label="Footer" className="text-center lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Explore</p>
          <div className="mt-3 grid grid-cols-2 justify-center gap-x-6 gap-y-2 text-sm">
            <ul className="grid content-start justify-items-center gap-2">
              {exploreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/85 hover:text-sun hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="grid content-start justify-items-center gap-2">
              {moreLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/85 hover:text-sun hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/support" className="text-white/85 hover:text-sun hover:underline">
                  Support the Project
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Contact — compact */}
        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Contact</p>
          <address className="mt-3 text-[13px] not-italic leading-relaxed text-white/85">
            {SITE.contact.director} · {SITE.contact.directorRole.replace("Director, ", "")}
            <br />
            <a href={SITE.contact.phoneHref} className="hover:text-sun hover:underline">
              {SITE.contact.phoneDisplay}
            </a>
            {" · "}
            <a href={`mailto:${SITE.contact.email}`} className="break-all hover:text-sun hover:underline">
              {SITE.contact.email}
            </a>
            <br />
            <span className="text-white/60">
              Usao, Mbita East · Homa Bay County, Kenya
            </span>
          </address>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col gap-1 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 UCReCENT Initiative Team · Community-owned project.</p>
          <p>No public payment details are published.</p>
        </div>
      </div>
    </footer>
  );
}
