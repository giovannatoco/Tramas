import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, SlidersHorizontal, Users, X } from 'lucide-react';
import { ARTISANS, CATEGORIES, TECHNIQUES, USER_LOCATION } from '../data/mock';
import { useApp } from '../store/AppContext';
import { ArtisanCard, ProductCard } from '../components/cards';
import { SearchBar } from '../components/SearchBar';

function FilterGroup({
  label,
  options,
  value,
  onChange,
  allLabel,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  allLabel: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-marrom/50">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        <FilterChip active={!value} onClick={() => onChange('')} label={allLabel} />
        {options.map((opt) => (
          <FilterChip
            key={opt.value}
            active={value === opt.value}
            onClick={() => onChange(opt.value === value ? '' : opt.value)}
            label={opt.label}
          />
        ))}
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-bold transition ${
        active
          ? 'border-terracota bg-terracota text-creme shadow-sm'
          : 'border-areia-escura/50 bg-white text-marrom/75 hover:border-terracota/60 hover:text-terracota'
      }`}
    >
      {label}
    </button>
  );
}

function ActiveFilter({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remover filtro ${label}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-terracota/50 bg-terracota/10 px-3 py-1 text-xs font-bold text-terracota transition hover:bg-terracota/20"
    >
      {label}
      <X size={12} aria-hidden="true" />
    </button>
  );
}

export default function Explore() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') ?? '');
  const [tab, setTab] = useState<'produtos' | 'artesas'>(params.get('tab') === 'artesas' ? 'artesas' : 'produtos');
  const [category, setCategory] = useState(params.get('categoria') ?? '');
  const [technique, setTechnique] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { products } = useApp();

  const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? '';

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (p.active === false) return false;
      const artisan = ARTISANS.find((a) => a.id === p.artisanId);
      if (category && p.category !== category) return false;
      if (technique && p.technique !== technique) return false;
      if (!q) return true;
      const haystack = [p.name, p.technique, p.location, artisan?.name, artisan?.brand, categoryName(p.category)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, technique, products]);

  const filteredArtisans = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ARTISANS.filter((a) => {
      if (technique && !a.techniques.some((t) => t.toLowerCase().includes(technique.toLowerCase()))) return false;
      if (category) {
        const hasProduct = a.productIds.some((pid) =>
          products.find((p) => p.id === pid)?.category === category,
        );
        if (!hasProduct) return false;
      }
      if (!q) return true;
      return [a.name, a.brand, a.craft, a.location, ...a.techniques].join(' ').toLowerCase().includes(q);
    });
  }, [query, category, technique, products]);

  const activeFilterCount = (category ? 1 : 0) + (technique ? 1 : 0);

  const clearFilters = () => {
    setQuery('');
    setCategory('');
    setTechnique('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold text-marrom">Explorar</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Peças e artesãs de {USER_LOCATION.city} e região.
        </p>
      </div>

      {/* Busca + botão de filtros na mesma faixa */}
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Buscar por peça, técnica ou nome"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="painel-filtros"
          className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition ${
            showFilters || activeFilterCount > 0
              ? 'border-terracota bg-terracota text-creme'
              : 'border-areia-escura/50 bg-white text-marrom/75 hover:border-terracota/60 hover:text-terracota'
          }`}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtros
          {activeFilterCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-creme px-1 text-[11px] font-extrabold text-terracota">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Tipo de resultado">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'produtos'}
          onClick={() => setTab('produtos')}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition ${
            tab === 'produtos' ? 'bg-marrom text-creme' : 'bg-white text-marrom/70 hover:bg-bege'
          }`}
        >
          <LayoutGrid size={16} aria-hidden="true" />
          Produtos ({filteredProducts.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'artesas'}
          onClick={() => setTab('artesas')}
          className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition ${
            tab === 'artesas' ? 'bg-marrom text-creme' : 'bg-white text-marrom/70 hover:bg-bege'
          }`}
        >
          <Users size={16} aria-hidden="true" />
          Artesãs ({filteredArtisans.length})
        </button>
      </div>

      {/* Filtros ativos (sempre visíveis quando houver) */}
      {(category || technique) && (
        <div className="flex flex-wrap items-center gap-2" aria-label="Filtros ativos">
          {category && (
            <ActiveFilter label={`Categoria: ${categoryName(category)}`} onRemove={() => setCategory('')} />
          )}
          {technique && (
            <ActiveFilter label={`Técnica: ${technique}`} onRemove={() => setTechnique('')} />
          )}
          <button
            type="button"
            onClick={() => { setCategory(''); setTechnique(''); }}
            className="text-xs font-bold text-terracota hover:underline"
          >
            Limpar tudo
          </button>
        </div>
      )}

      {/* Painel de filtros sob demanda */}
      {showFilters && (
        <section
          id="painel-filtros"
          className="space-y-4 rounded-2xl border border-areia/70 bg-white/70 p-4"
          aria-label="Filtros de busca"
        >
          <FilterGroup
            label="Categoria"
            allLabel="Todas"
            value={category}
            onChange={setCategory}
            options={CATEGORIES.map((c) => ({ value: c.id, label: c.name }))}
          />
          <FilterGroup
            label="Técnica"
            allLabel="Todas as técnicas"
            value={technique}
            onChange={setTechnique}
            options={TECHNIQUES.map((t) => ({ value: t, label: t }))}
          />
        </section>
      )}

      {/* Resultados */}
      {tab === 'produtos' ? (
        filteredProducts.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((p) => {
              const artisan = ARTISANS.find((a) => a.id === p.artisanId);
              return (
                <li key={p.id}>
                  <ProductCard product={p} artisan={artisan} />
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState onClear={clearFilters} />
        )
      ) : filteredArtisans.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredArtisans.map((a) => (
            <li key={a.id} className="flex justify-center">
              <ArtisanCard artisan={a} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState onClear={clearFilters} />
      )}
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-10 text-center">
      <p className="font-display text-xl font-semibold text-marrom">Nenhum resultado encontrado</p>
      <p className="mt-2 text-sm text-marrom/60">
        Tente buscar por outro termo ou ajustar os filtros.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 rounded-full bg-terracota px-5 py-2 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
      >
        Limpar busca
      </button>
    </div>
  );
}
