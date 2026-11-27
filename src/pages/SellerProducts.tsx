import { Link } from 'react-router-dom';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { useApp, SELLER_ID } from '../store/AppContext';
import { ARTISANS, CATEGORIES, formatPrice } from '../data/mock';
import { StitchDivider } from '../components/Ornament';

export default function SellerProducts() {
  const { products, deleteProduct, updateProduct } = useApp();
  const mine = products.filter((p) => p.artisanId === SELLER_ID);
  const artisan = ARTISANS.find((a) => a.id === SELLER_ID);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remover "${name}" da sua vitrine?`)) deleteProduct(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Meus produtos</h1>
          <p className="mt-1 text-sm text-marrom/60">
            {artisan?.brand} · {mine.length} {mine.length === 1 ? 'peça' : 'peças'} na vitrine
          </p>
        </div>
        <Link
          to="/vender/produtos/novo"
          className="inline-flex items-center gap-2 rounded-full bg-terracota px-5 py-2.5 text-sm font-bold text-creme shadow-sm transition hover:bg-terracota-escuro"
        >
          <Plus size={16} aria-hidden="true" />
          Novo produto
        </Link>
      </div>

      {mine.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-10 text-center">
          <p className="font-display text-lg font-semibold text-marrom">Nenhum produto cadastrado</p>
          <p className="mt-1 text-sm text-marrom/60">
            Cadastre sua primeira peça para começar a vender.
          </p>
          <Link
            to="/vender/produtos/novo"
            className="mt-4 inline-block rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme"
          >
            Cadastrar produto
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => {
            const category = CATEGORIES.find((c) => c.id === p.category);
            const inactive = p.active === false;
            return (
              <li
                key={p.id}
                className={`overflow-hidden rounded-2xl border border-areia/70 bg-white shadow-sm ${inactive ? 'opacity-60' : ''}`}
              >
                <div className="relative aspect-[4/3] bg-bege">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  {inactive && (
                    <span className="absolute left-2.5 top-2.5 rounded-full bg-marrom/80 px-2.5 py-1 text-[11px] font-bold text-creme">
                      Inativo
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-display font-semibold text-marrom line-clamp-1">{p.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-marrom/50">
                    {category?.name} · {p.technique}
                  </p>
                  <p className="mt-1.5 font-bold text-terracota">{formatPrice(p.price)}</p>
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/vender/produtos/${p.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-areia-escura/60 px-3 py-2 text-xs font-bold text-marrom transition hover:bg-bege"
                    >
                      <Pencil size={13} aria-hidden="true" />
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => updateProduct(p.id, { active: !inactive })}
                      aria-label={inactive ? `Ativar ${p.name}` : `Desativar ${p.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-areia-escura/60 text-marrom transition hover:bg-bege"
                    >
                      <Power size={14} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name)}
                      aria-label={`Excluir ${p.name}`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-areia-escura/60 text-marrom transition hover:bg-red-50 hover:text-terracota"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <StitchDivider />
      <p className="text-center text-xs text-marrom/50">
        Produtos inativos não aparecem na vitrine pública, mas ficam salvos aqui.
      </p>
    </div>
  );
}
