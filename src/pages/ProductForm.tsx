import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp, SELLER_ID } from '../store/AppContext';
import { ARTISANS, CATEGORIES, REGIONS, TECHNIQUES } from '../data/mock';
import type { Region } from '../types';
import { StitchDivider } from '../components/Ornament';

const GALLERY = [
  '/images/cesta-palha-3.jpg',
  '/images/couro-bolsa-1.jpg',
  '/images/couro-carteira-1.jpg',
  '/images/bordado-arte-2.jpg',
  '/images/bordado-brasil-1.jpg',
  '/images/croche-colcha-1.jpg',
  '/images/croche-colcha-3.jpg',
  '/images/ceramica-tigelas-1.jpg',
  '/images/ceramica-tigelas-2.jpg',
  '/images/ceramica-vaso-1.jpg',
  '/images/macrame-painel-1.jpg',
  '/images/moda-vestido-3.jpg',
  '/images/renda-bilro-0.jpg',
  '/images/renda-ponto-3.jpg',
  '/images/tear-tapete-1.jpg',
];

const inputCls =
  'w-full rounded-xl border border-areia bg-creme px-4 py-2.5 text-sm font-semibold text-marrom focus:border-terracota';

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id && id !== 'novo');
  const { products, addProduct, updateProduct } = useApp();
  const navigate = useNavigate();
  const artisan = ARTISANS.find((a) => a.id === SELLER_ID);

  const existing = useMemo(
    () => (isEdit ? products.find((p) => p.id === id) : undefined),
    [isEdit, id, products],
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [price, setPrice] = useState(existing ? String(existing.price) : '');
  const [category, setCategory] = useState(existing?.category ?? 'croche');
  const [technique, setTechnique] = useState(existing?.technique ?? TECHNIQUES[1]);
  const [region, setRegion] = useState<Region>(existing?.region ?? artisan?.region ?? 'Sudeste');
  const [image, setImage] = useState(existing?.image ?? GALLERY[0]);
  const [badge, setBadge] = useState(existing?.badge ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Informe o nome da peça.';
    const priceNum = Number(price.replace(',', '.'));
    if (!price.trim() || Number.isNaN(priceNum) || priceNum <= 0) errs.price = 'Informe um preço válido.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const data = {
      name: name.trim(),
      price: priceNum,
      image,
      category,
      technique,
      artisanId: SELLER_ID,
      location: existing?.location ?? artisan?.location ?? '',
      region,
      badge: badge.trim() || undefined,
      active: existing?.active ?? true,
    };

    if (isEdit && existing) {
      updateProduct(existing.id, data);
    } else {
      addProduct(data);
    }
    navigate('/vender/produtos');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/vender/produtos"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 transition hover:text-terracota"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para Meus produtos
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-marrom">
        {isEdit ? 'Editar produto' : 'Novo produto'}
      </h1>
      <p className="mt-1 text-sm text-marrom/60">
        Peças cadastradas aparecem na vitrine pública da {artisan?.brand}.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="space-y-4 rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-label="Dados da peça">
          <div>
            <label htmlFor="nome" className="mb-1.5 block text-sm font-bold text-marrom">
              Nome da peça
            </label>
            <input
              id="nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex.: Colcha de crochê amarelinha"
              className={inputCls}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'nome-erro' : undefined}
            />
            {errors.name && (
              <p id="nome-erro" className="mt-1 text-xs font-semibold text-terracota">{errors.name}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="preco" className="mb-1.5 block text-sm font-bold text-marrom">
                Preço (R$)
              </label>
              <input
                id="preco"
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex.: 129,90"
                className={inputCls}
                aria-invalid={Boolean(errors.price)}
                aria-describedby={errors.price ? 'preco-erro' : undefined}
              />
              {errors.price && (
                <p id="preco-erro" className="mt-1 text-xs font-semibold text-terracota">{errors.price}</p>
              )}
            </div>
            <div>
              <label htmlFor="badge" className="mb-1.5 block text-sm font-bold text-marrom">
                Selo <span className="font-normal text-marrom/50">(opcional)</span>
              </label>
              <input
                id="badge"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="ex.: Peça única, Encomenda"
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="categoria" className="mb-1.5 block text-sm font-bold text-marrom">
                Categoria
              </label>
              <select
                id="categoria"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="tecnica" className="mb-1.5 block text-sm font-bold text-marrom">
                Técnica
              </label>
              <select
                id="tecnica"
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                className={inputCls}
              >
                {TECHNIQUES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="regiao" className="mb-1.5 block text-sm font-bold text-marrom">
                Região de origem
              </label>
              <select
                id="regiao"
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className={inputCls}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="foto-titulo">
          <h2 id="foto-titulo" className="font-display text-lg font-semibold text-marrom">
            Foto da peça
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {GALLERY.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(src)}
                aria-pressed={image === src}
                aria-label={`Usar foto ${src.split('/').pop()}`}
                className={`overflow-hidden rounded-xl border-2 transition ${
                  image === src ? 'border-terracota ring-2 ring-terracota/30' : 'border-transparent hover:border-areia-escura'
                }`}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-marrom/50">
            Demonstração: upload de fotos próprias estará disponível em breve.
          </p>
        </section>

        <StitchDivider />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-full bg-terracota px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
          >
            {isEdit ? 'Salvar alterações' : 'Cadastrar produto'}
          </button>
          <Link
            to="/vender/produtos"
            className="rounded-full border border-areia-escura/60 px-6 py-3.5 text-sm font-bold text-marrom transition hover:bg-bege"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
