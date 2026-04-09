"use client";

interface DocPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DocPage({ title, description, children }: DocPageProps) {
  return (
    <article className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-nf-text-heading mb-2">{title}</h1>
        {description && (
          <p className="text-lg text-nf-text-muted leading-relaxed">{description}</p>
        )}
      </header>
      <div className="prose prose-nightfall">{children}</div>
    </article>
  );
}

export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  return (
    <section className="mb-10">
      <h2 id={id} className="text-xl font-bold text-nf-text-heading mb-4 scroll-mt-20">
        {title}
      </h2>
      <div className="space-y-4 text-nf-text leading-relaxed">{children}</div>
    </section>
  );
}
