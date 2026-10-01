"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Primitives";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-16 text-center">
      <p className="eyebrow">Something went wrong</p>
      <h1 className="h-display mt-2">Please try again.</h1>
      <p className="lead mx-auto mt-4 max-w-xl">
        An unexpected error occurred while loading this page.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-secondary">Try again</button>
        <Link href="/" className="btn-outline">Back to home</Link>
      </div>
    </Container>
  );
}
