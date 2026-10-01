"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import SiteLogo from "./SiteLogo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on Escape and on route change.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-[0_1px_12px_rgba(7,56,108,0.06)] backdrop-blur">
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="UCReCENT — home">
          <SiteLogo size={44} priority />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-extrabold tracking-tight text-navy sm:text-lg">
              UCReCENT
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-forest min-[400px]:block">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={`rounded-lg px-2.5 py-2 text-sm font-semibold transition-colors ${
                pathname === item.href
                  ? "bg-cream text-navy"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/support" className="btn-primary ml-2 !px-4 !py-2">
            Support the Project
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/support" className="btn-primary !px-3 !py-2 text-xs">
            Support
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-navy"
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden"
        >
          <ul className="grid gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    pathname === item.href
                      ? "bg-cream text-navy"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/support"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 w-full"
              >
                Support the Project
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
