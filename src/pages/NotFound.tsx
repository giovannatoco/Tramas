import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Logo from '../components/Logo';

export function NotFoundLink() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <Logo size="md" withSlogan={false} />
      <h1 className="font-display text-2xl font-semibold text-marrom">Página não encontrada</h1>
      <p className="max-w-sm text-sm text-marrom/60">
        O conteúdo que você procura não existe ou foi movido.
      </p>
      <Link
        to="/inicio"
        className="inline-flex items-center gap-2 rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
      >
        <Compass size={16} aria-hidden="true" />
        Voltar para o início
      </Link>
    </div>
  );
}

export default function NotFound() {
  return <NotFoundLink />;
}
