import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-nf-text-heading mb-4">404</h1>
      <p className="text-lg text-nf-text-muted mb-8">This page doesn't exist yet.</p>
      <Link
        href="/overview"
        className="px-6 py-2.5 rounded-lg bg-nf-violet text-white font-medium hover:bg-nf-violet-dark transition-colors"
      >
        Back to Overview
      </Link>
    </div>
  );
}
