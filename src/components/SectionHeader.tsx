import type { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-marrom md:text-2xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-marrom/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
