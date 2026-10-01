import Link from "next/link";
import { Container } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <p className="eyebrow">404 — Page not found</p>
      <h1 className="h-display mt-2">This page is not on our shelves.</h1>
      <p className="lead mx-auto mt-4 max-w-xl">
        The page you are looking for does not exist or was moved. Try the homepage or the
        project plan instead.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-secondary">Back to home</Link>
        <Link href="/project" className="btn-outline">Our Project</Link>
      </div>
    </Container>
  );
}
