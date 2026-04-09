"use client";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group h-full rounded-xl border border-nf-border bg-nf-surface/50 p-5 hover:border-nf-violet/30 hover:bg-nf-surface transition-all">
      <div className="w-9 h-9 rounded-lg bg-nf-violet/10 flex items-center justify-center text-nf-violet mb-3 group-hover:bg-nf-violet/15 transition-colors">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-nf-text-heading mb-1.5">{title}</h3>
      <p className="text-sm text-nf-text-muted leading-relaxed">{description}</p>
    </div>
  );
}
