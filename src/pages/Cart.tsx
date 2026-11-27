import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { CATEGORIES, formatPrice } from '../data/mock';
import { StitchDivider } from '../components/Ornament';

export default function Cart() {
  const { cart, products, setCartQty, removeFromCart, cartTotal } = useApp();
  const navigate = useNavigate();

  const items = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((i) => i.product);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-bege text-terracota">
          <ShoppingBag size={28} aria-hidden="true" />
        </span>
        <h1 className="font-display text-2xl font-semibold text-marrom">Sua sacola está vazia</h1>
        <p className="text-sm text-marrom/60">
          Explore peças únicas feitas à mão e encha sua sacola de tramas.
        </p>
        <Link
          to="/explorar"
          className="mt-2 rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
        >
          Explorar peças
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-semibold text-marrom">Sua sacola</h1>

      <ul className="space-y-3">
        {items.map(({ product, qty }) => {
          if (!product) return null;
          const category = CATEGORIES.find((c) => c.id === product.category);
          return (
            <li
              key={product.id}
              className="flex gap-4 rounded-2xl border border-areia/70 bg-white/80 p-3 shadow-sm"
            >
              <Link to={`/produtos/${product.id}`} className="shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link to={`/produtos/${product.id}`} className="font-display font-semibold text-marrom line-clamp-1">
                  {product.name}
                </Link>
                <p className="text-xs font-semibold text-marrom/50">
                  {category?.name} · {product.technique}
                </p>
                <p className="mt-1 text-sm font-bold text-terracota">{formatPrice(product.price)}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2" aria-label={`Quantidade de ${product.name}`}>
                    <button
                      type="button"
                      onClick={() => setCartQty(product.id, qty - 1)}
                      aria-label="Diminuir quantidade"
                      className="grid h-8 w-8 place-items-center rounded-full border border-areia-escura/60 text-marrom transition hover:bg-bege"
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold" aria-live="polite">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCartQty(product.id, qty + 1)}
                      aria-label="Aumentar quantidade"
                      className="grid h-8 w-8 place-items-center rounded-full border border-areia-escura/60 text-marrom transition hover:bg-bege"
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    aria-label={`Remover ${product.name} da sacola`}
                    className="grid h-9 w-9 place-items-center rounded-full text-marrom/50 transition hover:bg-red-50 hover:text-terracota"
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <StitchDivider />

      <div className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-marrom">Subtotal</span>
          <span className="font-display text-2xl font-bold text-terracota">{formatPrice(cartTotal)}</span>
        </div>
        <p className="mt-1 text-xs text-marrom/50">
          Frete e prazos combinados diretamente com cada produtora.
        </p>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-terracota px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
        >
          Finalizar compra
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <Link
          to="/explorar"
          className="mt-3 block text-center text-sm font-bold text-terracota hover:underline"
        >
          Continuar explorando
        </Link>
      </div>
    </div>
  );
}
