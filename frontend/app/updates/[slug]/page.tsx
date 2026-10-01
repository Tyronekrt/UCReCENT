import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { getUpdateBySlug, getUpdateSlugs, getUpdates } from "@/lib/content";
import { Container } from "@/components/ui/Primitives";

export async function generateStaticParams() {
  const slugs = await getUpdateSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getUpdateBySlug(params.slug);
  if (!post) return { title: "Update not found" };
  const url = `${SITE.url.replace(/\/$/, "")}/updates/${post.slug}`;
  const ogImages = post.coverImage ? [{ url: post.coverImage, alt: post.coverAlt }] : [];
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      publishedTime: post.date,
      images: ogImages,
    },
  };
}

export default async function UpdateDetailPage({ params }: { params: { slug: string } }) {
  const post = await getUpdateBySlug(params.slug);
  if (!post) notFound();

  const others = (await getUpdates()).filter((u) => u.slug !== post.slug);

  return (
    <Container className="py-10">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/updates" className="font-semibold text-lake-dark hover:underline">
          Updates
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{post.category}</span>
      </nav>

      <article className="mt-4 max-w-3xl">
        <p className="eyebrow">{post.category}</p>
        <h1 className="h-display mt-2">{post.title}</h1>
        <p className="mt-3 text-sm font-semibold text-slate-500">
          Published <time dateTime={post.date}>{post.date}</time> · UCReCENT Initiative Team
        </p>
        {post.coverImage ? (
          <figure className="mt-6 overflow-hidden rounded-xl border border-slate-200">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              width={1200}
              height={750}
              priority
              className="h-auto w-full object-cover"
            />
            <figcaption className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
              {post.coverAlt}
            </figcaption>
          </figure>
        ) : null}
        <p className="lead mt-6">{post.excerpt}</p>
        <div className="mt-4 grid gap-4 text-sm leading-relaxed text-slate-700 sm:text-base">
          {post.body.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
      </article>

      <div className="card mt-10 max-w-3xl bg-cream">
        <h2 className="font-bold text-navy">Support this work</h2>
        <p className="mt-2 text-sm text-slate-600">
          Phase 1 needs KES 500,000 on community-donated land. Tell the team how you would
          like to help — no payment is taken on this website.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Link href="/support" className="btn-primary">Support the Project</Link>
          <Link href="/updates" className="btn-outline">All updates</Link>
        </div>
      </div>

      {others.length > 0 ? (
        <section aria-labelledby="more-updates" className="mt-10 max-w-3xl">
          <h2 id="more-updates" className="text-lg font-bold text-navy">More updates</h2>
          <ul className="mt-3 grid gap-3">
            {others.map((o) => (
              <li key={o.slug} className="card">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  <time dateTime={o.date}>{o.date}</time> · {o.category}
                </p>
                <Link href={`/updates/${o.slug}`} className="mt-1 block font-bold text-navy hover:underline">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </Container>
  );
}
