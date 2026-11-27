import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, MessageCircle, ShoppingBag, Star } from 'lucide-react';
import { ARTISANS, CATEGORIES, formatPrice } from '../data/mock';
import { useApp } from '../store/AppContext';
import { FavoriteButton } from '../components/FavoriteButton';
import { StitchDivider } from '../components/Ornament';
import { ProductCard } from '../components/cards';
import { useFavorites } from '../components/FavoritesContext';
import { NotFoundLink } from './NotFound';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, cart, addToCart, ensureConversation } = useApp();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const { has, toggle } = useFavorites();

  if (!product) return <NotFoundLink />;

  const artisan = ARTISANS.find((a) => a.id === product.artisanId);
  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = products.filter((p) => p.id !== product.id && p.category === product.category && p.active !== false).slice(0, 4);
  const favorite = has(`prod-${product.id}`);
  const inCart = cart.some((i) => i.productId === product.id);

  return (
    <div className="space-y-8">
      <Link
        to="/explorar"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 transition hover:text-terracota"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para Explorar
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-areia/70 bg-white shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          {product.badge && (
            <span className="inline-block rounded-full bg-terracota px-3 py-1 text-xs font-bold text-creme">
              {product.badge}
            </span>
          )}
          <h1 className="font-display text-3xl font-semibold leading-tight text-marrom">{product.name}</h1>
          <p className="text-3xl font-extrabold text-terracota">{formatPrice(product.price)}</p>

          <dl className="space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-bold text-marrom/60">Categoria</dt>
              <dd className="font-semibold text-marrom">{category?.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-bold text-marrom/60">Técnica</dt>
              <dd className="font-semibold text-marrom">{product.technique}</dd>
            </div>
            {product.materials && (
              <div className="flex gap-2">
                <dt className="w-28 shrink-0 font-bold text-marrom/60">Materiais</dt>
                <dd className="font-semibold text-marrom">{product.materials}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="w-28 shrink-0 font-bold text-marrom/60">Origem</dt>
              <dd className="inline-flex items-center gap-1 font-semibold text-marrom">
                <MapPin size={14} className="text-terracota" aria-hidden="true" />
                {product.location} · {product.region}
              </dd>
            </div>
          </dl>

          {product.story && (
            <section className="rounded-2xl border border-areia/60 bg-bege/60 p-4" aria-labelledby="historia-peca">
              <h2 id="historia-peca" className="font-display text-base font-semibold text-marrom">
                A história desta peça
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-marrom/75">{product.story}</p>
            </section>
          )}

          <StitchDivider />

          {artisan && (
            <Link
              to={`/artesana/${artisan.id}`}
              className="flex items-center gap-3 rounded-2xl border border-areia/70 bg-white p-3 transition hover:border-terracota/50 hover:shadow-sm"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold text-creme"
                style={{ backgroundColor: artisan.color }}
                aria-hidden="true"
              >
                {artisan.initials}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display font-semibold text-marrom">{artisan.brand}</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-laranja">
                  <Star size={12} fill="currentColor" aria-hidden="true" />
                  {artisan.rating.toFixed(1)} · {artisan.craft}
                </span>
              </span>
            </Link>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const convId = ensureConversation(product.artisanId, { productId: product.id, productName: product.name });
                navigate(`/chat/${convId}`);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-terracota px-5 py-3.5 text-sm font-bold text-terracota transition hover:bg-bege"
            >
              <MessageCircle size={17} aria-hidden="true" />
              Conversar
            </button>
            {product.badge === 'Encomenda' ? (
              <Link
                to={`/encomenda/nova?produto=${product.id}&artesana=${product.artisanId}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terracota px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
              >
                Solicitar encomenda personalizada
              </Link>
            ) : inCart ? (
              <Link
                to="/sacola"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-oliva px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-oliva/90"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Na sacola — ver sacola
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-terracota px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
              >
                <ShoppingBag size={18} aria-hidden="true" />
                Adicionar à sacola
              </button>
            )}
            <FavoriteButton
              active={favorite}
              onToggle={() => toggle(`prod-${product.id}`)}
              label="Favoritar peça"
            />
          </div>
          <p className="text-xs text-marrom/50">
            Pagamento protegido pelo Tramas · Envio combinado direto com a produtora
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionadas">
          <h2 id="relacionadas" className="font-display text-2xl font-semibold text-marrom">
            Você também pode gostar
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} artisan={ARTISANS.find((a) => a.id === p.artisanId)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
