"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") ?? false;

  return (
    <>
      {!isAdminRoute ? <Header /> : null}
      <main id={isAdminRoute ? undefined : "main"}>{children}</main>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
}
