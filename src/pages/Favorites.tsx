import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ARTISANS } from '../data/mock';
import { useFavorites } from '../components/FavoritesContext';
import { ArtisanCard, ProductCard } from '../components/cards';
import { SectionHeader } from '../components/SectionHeader';

export default function Favorites() {
  const { products } = useApp();
  const { favorites } = useFavorites();

  const favProducts = products.filter((p) => favorites.has(`prod-${p.id}`));
  const favArtisans = ARTISANS.filter((a) => favorites.has(`art-${a.id}`));

  const empty = favProducts.length === 0 && favArtisans.length === 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-marrom">Favoritos</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Peças e artesãs que você salvou para depois.
        </p>
      </div>

      {empty ? (
        <div className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-10 text-center">
          <Heart size={36} className="mx-auto text-marrom/40" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-semibold text-marrom">
            Nada favoritado ainda
          </p>
          <p className="mt-1 text-sm text-marrom/60">
            Toque no coração das peças e perfis para guardar aqui.
          </p>
          <Link
            to="/explorar"
            className="mt-4 inline-block rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
          >
            Explorar peças
          </Link>
        </div>
      ) : (
        <>
          {favProducts.length > 0 && (
            <section aria-labelledby="fav-produtos">
              <SectionHeader title="Peças" />
              <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {favProducts.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} artisan={ARTISANS.find((a) => a.id === p.artisanId)} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          {favArtisans.length > 0 && (
            <section aria-labelledby="fav-artesas">
              <SectionHeader title="Artesãs" />
              <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {favArtisans.map((a) => (
                  <li key={a.id}>
                    <ArtisanCard artisan={a} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
