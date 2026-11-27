import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, Send } from 'lucide-react';
import { ARTISANS } from '../data/mock';
import { useApp } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';

const GALLERY = [
  '/images/renda-bilro-1.jpg', '/images/croche-colcha-1.jpg', '/images/ceramica-vaso-1.jpg',
  '/images/couro-bolsa-1.jpg', '/images/moda-vestido-1.jpg', '/images/macrame-painel-1.jpg',
];

export default function CommissionForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { products, addCommission, currentUser } = useApp();

  const preArtisan = params.get('artesana') ?? 'a2';
  const preProduct = params.get('produto');
  const preProductObj = preProduct ? products.find((p) => p.id === preProduct) : undefined;

  const [artisanId, setArtisanId] = useState(preArtisan);
  const [productId, setProductId] = useState(preProduct ?? '');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [customizations, setCustomizations] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [error, setError] = useState('');

  const artisanProducts = products.filter((p) => p.artisanId === artisanId && p.active !== false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Descreva a peça que você imagina — é a informação mais importante para a artesã.');
      return;
    }
    const product = productId ? products.find((p) => p.id === productId) : undefined;
    addCommission({
      artisanId,
      buyerName: currentUser?.name ?? 'Você',
      productId: product?.id,
      productName: product?.name,
      description: description.trim(),
      colors: colors.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      quantity: Math.max(1, parseInt(quantity, 10) || 1),
      customizations: customizations.trim() || undefined,
      deadline: deadline || undefined,
      budget: budget.trim() || undefined,
      referenceImage: referenceImage ?? undefined,
    });
    navigate('/encomendas');
  };

  const field =
    'w-full rounded-xl border border-areia-escura/60 bg-white px-3.5 py-2.5 text-sm text-marrom outline-none transition focus:border-terracota focus:ring-2 focus:ring-terracota/20';
  const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-marrom/60';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/explorar" className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 hover:text-terracota">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar
      </Link>
      <header>
        <h1 className="font-display text-3xl font-semibold text-marrom">Pedir uma encomenda</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Conte o que você imagina. A artesã analisa, envia uma proposta com preço e prazo, e você decide.
        </p>
      </header>

      <form onSubmit={submit} className="space-y-5">
        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm">
          <SectionHeader title="A peça" subtitle="Para quem e qual produto (opcional)" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="enc-artesana" className={label}>Artesã / marca</label>
              <select
                id="enc-artesana"
                className={field}
                value={artisanId}
                onChange={(e) => { setArtisanId(e.target.value); setProductId(''); }}
              >
                {ARTISANS.map((a) => <option key={a.id} value={a.id}>{a.brand} — {a.location}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="enc-produto" className={label}>Base do produto (opcional)</label>
              <select id="enc-produto" className={field} value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">Peça nova, sem base</option>
                {artisanProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="enc-desc" className={label}>Descreva a encomenda *</label>
              <textarea
                id="enc-desc"
                rows={4}
                required
                className={field}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={preProductObj ? `Uma variação da peça "${preProductObj.name}"…` : 'Ex.: um vestido longo de crochê para um casamento, com mangas largas…'}
              />
            </div>
            <div>
              <label htmlFor="enc-cores" className={label}>Cores desejadas</label>
              <input id="enc-cores" className={field} value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Ex.: tons terrosos, off-white" />
            </div>
            <div>
              <label htmlFor="enc-dim" className={label}>Dimensões / tamanho</label>
              <input id="enc-dim" className={field} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="Ex.: 1,20 m de largura, tamanho M" />
            </div>
            <div>
              <label htmlFor="enc-qtd" className={label}>Quantidade</label>
              <input id="enc-qtd" type="number" min={1} className={field} value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div>
              <label htmlFor="enc-prazo" className={label}>Prazo desejado</label>
              <input id="enc-prazo" type="date" className={field} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="enc-person" className={label}>Personalizações</label>
              <input id="enc-person" className={field} value={customizations} onChange={(e) => setCustomizations(e.target.value)} placeholder="Ex.: nome bordado, fechamento especial, embalagem de presente" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="enc-orc" className={label}>Orçamento estimado (opcional)</label>
              <input id="enc-orc" className={field} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Ex.: até R$ 500" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-marrom">
            <ImagePlus size={18} className="text-terracota" aria-hidden="true" />
            Imagem de referência (opcional)
          </h2>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {GALLERY.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setReferenceImage(referenceImage === g ? null : g)}
                aria-pressed={referenceImage === g}
                aria-label="Usar como referência"
                className={`overflow-hidden rounded-xl border-2 ${referenceImage === g ? 'border-terracota' : 'border-transparent'}`}
              >
                <img src={g} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-marrom/50">Escolha uma imagem do estilo que você imagina (demonstração).</p>
        </section>

        {error && <p role="alert" className="rounded-xl bg-terracota/10 px-4 py-3 text-sm font-bold text-terracota">{error}</p>}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-terracota px-6 py-3.5 text-sm font-extrabold text-creme transition hover:bg-terracota-escura"
        >
          <Send size={16} aria-hidden="true" />
          Enviar solicitação de encomenda
        </button>
        <p className="text-center text-xs text-marrom/50">
          A solicitação vai para a artesã, que pode aceitar, recusar ou enviar uma proposta de preço e prazo.
        </p>
      </form>
    </div>
  );
}
