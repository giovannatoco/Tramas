import { Link } from 'react-router-dom';
import { AtSign, BadgeCheck, MapPin, Mail, MessageCircle, Star } from 'lucide-react';
import type { Artisan, BrandTheme } from '../types';
import { formatPrice } from '../data/mock';
import type { Product } from '../types';

const FONT_CLASS: Record<BrandTheme['font'], string> = {
  serifada: 'font-display',
  moderna: 'font-sans',
  manuscrita: 'font-display italic',
};

export const TEMPLATE_LABELS: Record<BrandTheme['template'], string> = {
  artesanal: 'Artesanal e natural',
  minimalista: 'Minimalista',
  colorido: 'Colorido e criativo',
  elegante: 'Elegante e sofisticado',
  rustico: 'Rústico e tradicional',
};

export const FONT_LABELS: Record<BrandTheme['font'], string> = {
  serifada: 'Serifada clássica',
  moderna: 'Moderna sem serifa',
  manuscrita: 'Manuscrita expressiva',
};

interface Props {
  artisan: Artisan;
  theme: BrandTheme;
  products: Product[];
}

/** Prévia compacta da vitrine pública — usada no editor e espelha ArtisanProfile. */
export function BrandPreview({ artisan, theme, products }: Props) {
  const own = products.filter((p) => p.artisanId === artisan.id && p.active !== false);
  const featured = (theme.featuredProductIds ?? []).length
    ? own.filter((p) => theme.featuredProductIds!.includes(p.id))
    : own.slice(0, 4);
  const rest = own.filter((p) => !featured.includes(p));

  const shown = [...featured, ...rest].slice(0, theme.collections?.length ? 100 : 6);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-areia/70 shadow-md"
      style={{ backgroundColor: theme.background, color: theme.secondary }}
    >
      {/* capa */}
      <div className="relative h-28" style={{ backgroundColor: theme.primary }}>
        {theme.cover && <img src={theme.cover} alt="" className="h-full w-full object-cover opacity-80" />}
        <div className="absolute inset-x-0 bottom-0 h-10" style={{ background: `linear-gradient(transparent, ${theme.background})` }} />
      </div>
      <div className="px-4 pb-4">
        <div className="-mt-8 flex items-end gap-3">
          {theme.avatar || theme.logo ? (
            <img
              src={theme.logo ?? theme.avatar}
              alt={`Logo de ${artisan.brand}`}
              className="h-16 w-16 rounded-2xl border-4 object-cover shadow"
              style={{ borderColor: theme.background, backgroundColor: theme.secondary }}
            />
          ) : (
            <span
              className={`grid h-16 w-16 place-items-center rounded-2xl border-4 font-display text-2xl font-bold shadow ${FONT_CLASS[theme.font]}`}
              style={{ borderColor: theme.background, backgroundColor: theme.primary, color: theme.background }}
            >
              {artisan.initials}
            </span>
          )}
          <div className="min-w-0 flex-1 pb-1">
            <p className={`truncate text-lg font-bold ${FONT_CLASS[theme.font]}`} style={{ color: theme.secondary }}>
              {artisan.brand}
            </p>
            {theme.slogan && <p className="truncate text-xs" style={{ color: theme.accent }}>{theme.slogan}</p>}
          </div>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: theme.secondary }}>
          <MapPin size={12} aria-hidden="true" /> {artisan.location}
          <span className="mx-1">·</span>
          <Star size={12} className="text-laranja" aria-hidden="true" /> {artisan.rating} ({artisan.reviews})
        </p>

        {theme.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed" style={{ color: theme.secondary }}>
            {theme.description}
          </p>
        )}

        {(theme.email || theme.whatsapp || theme.instagram) && (
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]" style={{ color: theme.secondary }}>
            {theme.email && <span className="inline-flex items-center gap-1"><Mail size={11} aria-hidden="true" />{theme.email}</span>}
            {theme.whatsapp && <span className="inline-flex items-center gap-1"><MessageCircle size={11} aria-hidden="true" />{theme.whatsapp}</span>}
            {theme.instagram && <span className="inline-flex items-center gap-1"><AtSign size={11} aria-hidden="true" />@{theme.instagram.replace('@', '')}</span>}
          </p>
        )}

        {/* produtos */}
        <p className={`mt-4 text-[11px] font-extrabold uppercase tracking-widest`} style={{ color: theme.accent }}>
          Peças em destaque
        </p>
        <ul className="mt-2 grid grid-cols-3 gap-2">
          {shown.length === 0 && (
            <li className="col-span-3 rounded-xl border border-dashed p-4 text-center text-xs" style={{ borderColor: theme.primary, color: theme.secondary }}>
              Cadastre produtos para vê-los aqui.
            </li>
          )}
          {shown.map((p) => (
            <li key={p.id}>
              <Link to={`/produtos/${p.id}`} className="group block">
                <img src={p.image} alt={p.name} className="aspect-square w-full rounded-xl object-cover" />
                <span className="mt-1 block truncate text-[11px] font-bold" style={{ color: theme.secondary }}>{p.name}</span>
                <span className="text-[11px] font-extrabold" style={{ color: theme.primary }}>{formatPrice(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to={`/artesana/${artisan.id}`}
          className="mt-4 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition hover:opacity-90"
          style={{ backgroundColor: theme.primary, color: theme.background }}
        >
          <BadgeCheck size={13} aria-hidden="true" />
          Ver página pública completa
        </Link>
      </div>
    </div>
  );
}
