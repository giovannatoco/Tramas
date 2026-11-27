import type { ReactNode } from 'react';
import { Hammer } from 'lucide-react';
import { StitchDivider } from '../components/Ornament';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export default function PlaceholderPage({ title, description, children }: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-full bg-bege text-terracota">
        <Hammer size={28} aria-hidden="true" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-marrom">{title}</h1>
      <StitchDivider className="w-40" />
      <p className="text-sm leading-relaxed text-marrom/70">
        {description ??
          'Esta funcionalidade está em desenvolvimento e será implementada em uma próxima etapa do Tramas.'}
      </p>
      {children}
      <p className="mt-2 rounded-full bg-laranja/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-terracota">
        Em desenvolvimento
      </p>
    </div>
  );
}
