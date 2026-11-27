import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { Artisan } from '../types';
import { formatPrice } from '../data/mock';
import { useFavorites } from './FavoritesContext';
import { FavoriteButton } from './FavoriteButton';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    technique: string;
    category: string;
    location?: string;
    badge?: string;
  };
  artisan?: Artisan;
}

export function ProductCard({ product, artisan }: ProductCardProps) {
  const { has, toggle } = useFavorites();
  const favorite = has(`prod-${product.id}`);
  const encomenda = product.badge === 'Encomenda';

  return (
    <Link
      to={`/produtos/${product.id}`}
      className="group block overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-areia/60 transition hover:-translate-y-1 hover:shadow-lg"
      aria-label={`${product.name} — ${formatPrice(product.price)}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bege sm:aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-marrom/40 to-transparent" aria-hidden="true" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-creme/95 px-3 py-1 text-[11px] font-extrabold text-terracota shadow">
            {product.badge}
          </span>
        )}
        <span className="absolute right-3 top-3">
          <FavoriteButton active={favorite} onToggle={() => toggle(`prod-${product.id}`)} />
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-oliva px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-creme">
          {encomenda ? 'Sob encomenda' : 'Disponível'}
        </span>
      </div>
      <div className="p-3.5">
        <p className="font-display text-[15px] font-semibold leading-snug text-marrom line-clamp-2">
          {product.name}
        </p>
        <p className="mt-1 text-lg font-extrabold text-terracota">{formatPrice(product.price)}</p>
        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-marrom/70">
          <span className="truncate font-semibold">{artisan?.brand ?? 'Produtora'}</span>
          <span className="inline-flex shrink-0 items-center gap-1">
            <MapPin size={11} aria-hidden="true" />
            {artisan?.location ?? product.location ?? ''}
          </span>
        </div>
        <span className="mt-2 inline-block rounded-full bg-bege px-2.5 py-0.5 text-[11px] font-bold text-oliva">
          {product.technique}
        </span>
      </div>
    </Link>
  );
}

export function ArtisanCard({ artisan }: { artisan: Artisan }) {
  const { has, toggle } = useFavorites();
  const favorite = has(`art-${artisan.id}`);

  return (
    <div className="group relative flex w-44 shrink-0 flex-col items-center rounded-2xl border border-areia/70 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-48">
      <Link to={`/artesana/${artisan.id}`} className="flex w-full flex-col items-center" aria-label={`Ver perfil de ${artisan.name}`}>
      <span className="relative">
      {artisan.avatar ? (
        <img
          src={artisan.avatar}
          alt={`Foto de ${artisan.name}`}
          loading="lazy"
          className="h-20 w-20 rounded-full border-2 border-areia object-cover"
        />
      ) : (
        <span
          className="grid h-20 w-20 place-items-center rounded-full border-2 border-areia text-xl font-bold text-creme"
          style={{ backgroundColor: artisan.color }}
          aria-hidden="true"
        >
          {artisan.initials}
        </span>
      )}
      <span className="absolute -right-1 -top-1">
        <FavoriteButton
          active={favorite}
          onToggle={() => toggle(`art-${artisan.id}`)}
          label={`Favoritar ${artisan.name}`}
        />
      </span>
      </span>
      <p className="mt-2.5 font-display text-base font-semibold text-marrom line-clamp-1">
        {artisan.name}
      </p>
      <p className="text-xs font-semibold text-terracota">{artisan.craft}</p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs text-marrom/60">
        <MapPin size={11} aria-hidden="true" />
        {artisan.location}
      </p>
      <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-laranja">
        <Star size={12} fill="currentColor" aria-hidden="true" />
        {artisan.rating.toFixed(1)}
        <span className="font-normal text-marrom/50">({artisan.reviews})</span>
      </p>
      </Link>
    </div>
  );
}
