import { Container } from "@/components/ui/Primitives";

export default function Loading() {
  return (
    <Container className="py-16" aria-busy="true" aria-label="Loading">
      <div className="mx-auto max-w-xl animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-8 w-3/4 rounded bg-slate-200" />
        <div className="mt-4 h-24 rounded bg-slate-100" />
      </div>
    </Container>
  );
}
