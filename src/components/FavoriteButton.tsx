import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
  label?: string;
}

export function FavoriteButton({ active, onToggle, label = 'Favoritar' }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={active}
      aria-label={active ? `${label} (remover dos favoritos)` : label}
      className="grid h-9 w-9 place-items-center rounded-full bg-creme/90 text-marrom shadow-sm backdrop-blur transition hover:scale-105 hover:text-terracota"
    >
      <Heart size={17} fill={active ? '#A33D18' : 'none'} strokeWidth={2.2} className={active ? 'text-terracota' : ''} />
    </button>
  );
}
