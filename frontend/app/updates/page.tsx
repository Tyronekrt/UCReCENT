import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Primitives";
import { getUpdates } from "@/lib/content";

export const metadata: Metadata = {
  title: "Updates",
  description: "News and milestones from the UCReCENT initiative.",
};

export default async function UpdatesPage() {
  const updates = await getUpdates();

  if (updates.length === 0) {
    return (
      <Container className="py-10">
        <p className="eyebrow">Updates</p>
        <h1 className="h-display mt-2">Project updates.</h1>
        <div className="card mt-8 max-w-2xl" role="status">
          <h2 className="font-bold text-navy">No updates published yet.</h2>
          <p className="mt-2 text-sm text-slate-600">
            The project team has not published any verified updates beyond the Concept Note.
            Check back soon, or contact the team directly for the latest news.
          </p>
        </div>
      </Container>
    );
  }

  const categories = Array.from(new Set(updates.map((u) => u.category)));

  return (
    <Container className="py-10">
      <p className="eyebrow">Updates</p>
      <h1 className="h-display mt-2">Project updates.</h1>
      <p className="lead mt-4 max-w-3xl">
        Milestones drawn only from verified project material. New entries are published here
        by the project team as they are confirmed.
      </p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Categories: {categories.join(" · ")}
      </p>
      <div className="mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
        {updates.map((u) => (
          <article key={u.slug} className="card flex flex-col overflow-hidden !p-0">
            {u.coverImage ? (
              <Link href={`/updates/${u.slug}`} aria-label={`Read: ${u.title}`}>
                <Image
                  src={u.coverImage}
                  alt={u.coverAlt}
                  width={800}
                  height={500}
                  loading="lazy"
                  className="aspect-[8/5] w-full object-cover"
                />
              </Link>
            ) : null}
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                <time dateTime={u.date}>{u.date}</time> · {u.category}
              </p>
              <h2 className="mt-1 text-xl font-bold text-navy">
                <Link href={`/updates/${u.slug}`} className="hover:underline">
                  {u.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{u.excerpt}</p>
              <Link href={`/updates/${u.slug}`} className="mt-3 font-semibold text-lake-dark hover:underline">
                Read full update →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </Container>
  );
}
