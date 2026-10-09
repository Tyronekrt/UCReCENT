import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "UCReCENT — Read... Learn... Grow... Succeed",
    template: "%s | UCReCENT",
  },
  description:
    "UCReCENT — An Initiative of Building a Library in Usao Sublocation, Mbita East, Homa Bay County, Kenya. Phase 1: shelving for 10,000 books and seating for 100 users, with a KES 500,000 target.",
  keywords: [
    "UCReCENT",
    "Usao Community Library",
    "Homa Bay County library",
    "Mbita community library",
    "Kenya literacy",
    "reading culture Kenya",
  ],
  authors: [{ name: "UCReCENT Initiative Team" }],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "UCReCENT",
    title: "UCReCENT — Read... Learn... Grow... Succeed",
    description:
      "UCReCENT — An Initiative of Building a Library in Usao, Homa Bay County: books, study space and reading programmes. Phase 1 target KES 500,000.",
    url: SITE.url,
    images: [
      {
        url: SITE.logo,
        alt: "UCReCENT logo — Read... Learn... Grow... Succeed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UCReCENT",
    description:
      "UCReCENT — An Initiative of Building a Library in Usao, Homa Bay County, Kenya. Support Phase 1: KES 500,000.",
    images: [SITE.logo],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
  icons: { icon: SITE.logo, apple: SITE.logo },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <SiteShell>{children}</SiteShell>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Library",
              name: "UCReCENT",
              slogan: SITE.tagline,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Usao Sublocation, Mbita East Division",
                addressRegion: "Homa Bay County",
                addressCountry: "KE",
              },
              email: SITE.contact.email,
              telephone: SITE.contact.phoneDisplay,
            }),
          }}
        />
      </body>
    </html>
  );
}
