import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, Copy, Palette, Percent, Sparkles, Tag, Wand2,
} from 'lucide-react';
import { CATEGORIES, formatPrice } from '../data/mock';
import { SELLER_ID, useApp } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

const brl = (v: number) => formatPrice(v);

function num(v: string): number {
  const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

/* ---------------- Precificação ---------------- */

function PricingTool() {
  const { products, updateProduct } = useApp();
  const ownProducts = useMemo(() => products.filter((p) => p.artisanId === SELLER_ID), [products]);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.id ?? '');
  const [materialsCost, setMaterialsCost] = useState('');
  const [hours, setHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [packaging, setPackaging] = useState('');
  const [extra, setExtra] = useState('');
  const [margin, setMargin] = useState('50');
  const [applyTo, setApplyTo] = useState('');
  const [applied, setApplied] = useState(false);

  const result = useMemo(() => {
    const mat = num(materialsCost);
    const h = num(hours);
    const rate = num(hourlyRate) || 0;
    const pack = num(packaging);
    const add = num(extra);
    const m = Math.min(Math.max(num(margin), 0), 95);
    const labor = h * rate;
    const cost = mat + labor + pack + add;
    const suggested = m >= 95 ? cost : cost / (1 - m / 100);
    const profit = suggested - cost;
    const realMargin = suggested > 0 ? (profit / suggested) * 100 : 0;
    return { mat, labor, cost, suggested, profit, realMargin, hasInput: cost > 0 };
  }, [materialsCost, hours, hourlyRate, packaging, extra, margin]);

  const applyPrice = () => {
    if (!applyTo || !result.hasInput) return;
    updateProduct(applyTo, { price: Math.round(result.suggested * 100) / 100 });
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const field =
    'w-full rounded-xl border border-areia-escura/60 bg-white px-3.5 py-2.5 text-sm text-marrom outline-none transition focus:border-terracota focus:ring-2 focus:ring-terracota/20';
  const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-marrom/60';

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-label="Dados da peça">
        <h3 className="font-display text-lg font-semibold text-marrom">Sobre a peça</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="pc-nome" className={label}>Nome do produto</label>
            <input id="pc-nome" className={field} value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Bolsa de crochê colorida" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pc-cat" className={label}>Categoria</label>
            <select id="pc-cat" className={field} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="pc-mat" className={label}>Custo dos materiais (R$)</label>
            <input id="pc-mat" inputMode="decimal" className={field} value={materialsCost} onChange={(e) => setMaterialsCost(e.target.value)} placeholder="0,00" />
          </div>
          <div>
            <label htmlFor="pc-horas" className={label}>Horas de trabalho</label>
            <input id="pc-horas" inputMode="decimal" className={field} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Ex.: 6" />
          </div>
          <div>
            <label htmlFor="pc-hora" className={label}>Valor da sua hora (R$)</label>
            <input id="pc-hora" inputMode="decimal" className={field} value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
          </div>
          <div>
            <label htmlFor="pc-emb" className={label}>Embalagem (R$)</label>
            <input id="pc-emb" inputMode="decimal" className={field} value={packaging} onChange={(e) => setPackaging(e.target.value)} placeholder="0,00" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pc-extra" className={label}>Outros custos — frete, taxas, imprevistos (R$)</label>
            <input id="pc-extra" inputMode="decimal" className={field} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="0,00" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="pc-margem" className={label}>Margem de lucro desejada (%)</label>
            <input id="pc-margem" inputMode="numeric" className={field} value={margin} onChange={(e) => setMargin(e.target.value)} />
            <p className="mt-1 text-xs text-marrom/50">Sugestão para começar: 50%. Peças muito artesanais podem usar 60–80%.</p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-label="Resultado do cálculo">
        <div className="rounded-2xl bg-marrom p-5 text-creme shadow-sm">
          <p className="text-xs font-extrabold uppercase tracking-widest text-laranja-claro">Preço sugerido</p>
          <p className="mt-1 font-display text-4xl font-semibold">{result.hasInput ? brl(result.suggested) : '—'}</p>
          {result.hasInput && (
            <p className="mt-1 text-sm text-creme/70">Lucro estimado: <strong className="text-laranja-claro">{brl(result.profit)}</strong> · Margem real: {result.realMargin.toFixed(0)}%</p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          {[
            ['Materiais', result.mat],
            ['Mão de obra', result.labor],
            ['Custo total', result.cost],
            ['Preço mínimo (sem prejuízo)', result.cost],
          ].map(([k, v]) => (
            <div key={k as string} className="rounded-xl border border-areia/70 bg-white/80 p-3">
              <dt className="text-xs font-bold text-marrom/50">{k}</dt>
              <dd className="mt-0.5 font-display text-lg font-semibold text-marrom">{brl(v as number)}</dd>
            </div>
          ))}
        </dl>

        <div className="rounded-2xl border border-areia/70 bg-bege/60 p-4 text-sm leading-relaxed text-marrom/80">
          <p className="font-bold text-marrom">Como calculamos</p>
          <p className="mt-1">
            Somamos materiais + (horas × valor da hora) + embalagem + outros custos = <strong>custo total</strong>.
            Para atingir a margem desejada, dividimos o custo por (1 − margem). O resultado é o <strong>preço sugerido</strong>;
            abaixo do custo total, você trabalha de graça ou no prejuízo.
          </p>
          <p className="mt-1 text-xs text-marrom/50">Calculadora local do Tramas — sem inteligência artificial externa.</p>
        </div>

        <div className="rounded-2xl border border-areia/70 bg-white/80 p-4">
          <label htmlFor="pc-aplicar" className="mb-1 block text-xs font-bold uppercase tracking-wide text-marrom/60">
            Aplicar preço a um produto seu
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select id="pc-aplicar" className={field} value={applyTo} onChange={(e) => { setApplyTo(e.target.value); setApplied(false); }}>
              <option value="">Selecione o produto…</option>
              {ownProducts.map((p) => <option key={p.id} value={p.id}>{p.name} — {brl(p.price)}</option>)}
            </select>
            <button
              type="button"
              onClick={applyPrice}
              disabled={!applyTo || !result.hasInput}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-terracota px-4 py-2.5 text-sm font-extrabold text-creme transition hover:bg-terracota-escura disabled:cursor-not-allowed disabled:opacity-40"
            >
              {applied ? <Check size={16} aria-hidden="true" /> : <Tag size={16} aria-hidden="true" />}
              {applied ? 'Preço aplicado!' : 'Aplicar preço'}
            </button>
          </div>
          <p className="mt-2 text-xs text-marrom/50">
            O preço atualiza na vitrine e no marketplace na hora.{' '}
            <Link to="/vender/produtos" className="font-bold text-terracota hover:underline">Gerenciar produtos</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Identidade visual (demonstração) ---------------- */

const PALETTES: { name: string; colors: [string, string, string, string] }[] = [
  { name: 'Terracota & Areia', colors: ['#a33d18', '#4b2414', '#fff8ef', '#e99b32'] },
  { name: 'Oliva & Creme', colors: ['#52672d', '#3d4d20', '#fff8ef', '#ebc9a5'] },
  { name: 'Azul índigo & Algodão', colors: ['#1f3a5f', '#14263f', '#f6f1e7', '#d9a441'] },
  { name: 'Vinho & Rosa antigo', colors: ['#6e1f2e', '#4a1420', '#fdf3ef', '#c98a5e'] },
  { name: 'Grafite & Mostarda', colors: ['#3a3a3a', '#222', '#faf7f0', '#d9a441'] },
];

const NAME_PARTS_A = ['Casa', 'Ateliê', 'Estúdio', 'Oficina', 'Cantinho'];
const NAME_PARTS_B = ['da Fibra', 'do Fio', 'da Trama', 'das Mãos', 'do Tear', 'da Raiz', 'da Cor', 'do Ponto'];
const CRAFT_WORDS: Record<string, string[]> = {
  crochê: ['ponto', 'fio', 'agulha'],
  renda: ['bilro', 'linha', 'agulha'],
  cerâmica: ['barro', 'forno', 'torno'],
  couro: ['facão', 'bancada', 'cor', 'guarnição'],
  macramê: ['nó', 'corda', 'base'],
  bordado: ['agulha', 'linha', 'tecido'],
  'moda autoral': ['tecido', 'modelagem', 'costura'],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

interface Suggestion {
  title: string;
  body: string;
  apply?: () => void;
}

function IdentityTool() {
  const { getBrandTheme, saveBrandTheme } = useApp();
  const theme = getBrandTheme(SELLER_ID);

  const [brandName, setBrandName] = useState('');
  const [craft, setCraft] = useState('');
  const [story, setStory] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('');
  const [values, setValues] = useState('');
  const [colorPref, setColorPref] = useState('terrosas');
  const [result, setResult] = useState<Suggestion[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  const generate = () => {
    const seed = hashStr(`${brandName}|${craft}|${story}`);
    const name = brandName.trim() || `${pick(NAME_PARTS_A, seed)} ${pick(NAME_PARTS_B, seed + 1)}`;
    const craftWords = CRAFT_WORDS[craft.toLowerCase()] ?? ['trama', 'fio', 'ponto'];
    const craftWord = pick(craftWords, seed + 2);
    const palette =
      PALETTES.find((p) => p.name.toLowerCase().includes(colorPref.slice(0, 4))) ??
      PALETTES[seed % PALETTES.length];

    const suggestions: Suggestion[] = [
      {
        title: 'Nome da marca',
        body: name,
        apply: () => saveBrandTheme(SELLER_ID, { ...theme, description: theme.description }),
      },
      {
        title: 'Slogan',
        body: pick([
          `Feito à mão, feito para durar.`,
          `Cada ${craftWord} guarda uma história.`,
          `Artesanato que abraça quem usa.`,
          `Do nosso ateliê para a sua casa.`,
          `Tradição que se veste todo dia.`,
        ], seed + 3),
        apply: () => saveBrandTheme(SELLER_ID, { ...theme, slogan: pick([
          `Feito à mão, feito para durar.`,
          `Cada ${craftWord} guarda uma história.`,
          `Artesanato que abraça quem usa.`,
          `Do nosso ateliê para a sua casa.`,
          `Tradição que se veste todo dia.`,
        ], seed + 3) }),
      },
      {
        title: 'Paleta de cores',
        body: palette.name,
        apply: () =>
          saveBrandTheme(SELLER_ID, {
            ...theme,
            primary: palette.colors[0],
            secondary: palette.colors[1],
            background: palette.colors[2],
            accent: palette.colors[3],
          }),
      },
      {
        title: 'Conceito de logotipo',
        body: `Monograma com as iniciais "${name.slice(0, 2).toUpperCase()}" entrelaçadas em linhas que lembram ${craftWord} — estilo ${style || 'artesanal natural'}.`,
      },
      {
        title: 'Biografia da marca',
        body: `${name} nasceu do desejo de valorizar o ${craft || 'artesanato'} feito com as próprias mãos. ${story ? story + ' ' : ''}Cada peça é produzida em pequenos lotes, com atenção a cada detalhe, para pessoas que ${audience || 'valorizam autenticidade e história'} — ${values || 'feito com carinho, respeito e tradição'}.`,
        apply: () =>
          saveBrandTheme(SELLER_ID, {
            ...theme,
            description: `${name} nasceu do desejo de valorizar o ${craft || 'artesanato'} feito com as próprias mãos. Cada peça é produzida em pequenos lotes, com atenção a cada detalhe.`,
          }),
      },
      {
        title: 'Descrição de produto (modelo)',
        body: `Peça de ${craft || 'artesanato'} feita à mão pela equipe da ${name}. Materiais selecionados, produção lenta e única — nenhuma peça é igual à outra. Ideal para quem busca autenticidade.`,
      },
      {
        title: 'Legenda para publicação',
        body: `Nosso ${craft || 'artesanato'} favorito está pronto ✨ Cada detalhe feito à mão com ${values || 'amor e dedicação'}. Salva esse post e marca alguém que ama peças autorais! #artesanato #feitoamao #${(craft || 'artesanato').replace(/\s/g, '')}`,
      },
      {
        title: 'Ideias de conteúdo',
        body: `1) Bastidores: filmar o processo do ${craftWord}.\n2) História da peça: mostrar a inspiração.\n3) Antes/depois: embalagem e acabamento.\n4) Encontro com cliente: mostre a entrega.\n5) Tutorial rápido: um detalhe do seu ofício.`,
      },
    ];
    setResult(suggestions);
  };

  const field =
    'w-full rounded-xl border border-areia-escura/60 bg-white px-3.5 py-2.5 text-sm text-marrom outline-none transition focus:border-terracota focus:ring-2 focus:ring-terracota/20';
  const label = 'mb-1 block text-xs font-bold uppercase tracking-wide text-marrom/60';

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm">
        <p className="text-sm font-bold text-marrom">Conte um pouco sobre sua marca</p>
        <p className="mt-0.5 text-xs text-marrom/50">Quanto mais detalhes, melhores as sugestões. Campos vazios são completados pelo assistente.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="id-nome" className={label}>Nome da marca (se já tiver)</label>
            <input id="id-nome" className={field} value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Ex.: Casa da Nega" />
          </div>
          <div>
            <label htmlFor="id-craft" className={label}>Tipo de artesanato</label>
            <select id="id-craft" className={field} value={craft} onChange={(e) => setCraft(e.target.value)}>
              <option value="">Selecione…</option>
              {['Crochê', 'Renda', 'Bordado', 'Cerâmica', 'Couro', 'Macramê', 'Moda autoral', 'Cestaria'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="id-story" className={label}>História da marca</label>
            <textarea id="id-story" rows={2} className={field} value={story} onChange={(e) => setStory(e.target.value)} placeholder="Como tudo começou…" />
          </div>
          <div>
            <label htmlFor="id-publico" className={label}>Público-alvo</label>
            <input id="id-publico" className={field} value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Ex.: mães que valorizam decoração afetiva" />
          </div>
          <div>
            <label htmlFor="id-estilo" className={label}>Estilo desejado</label>
            <input id="id-estilo" className={field} value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ex.: rústico, minimalista, colorido" />
          </div>
          <div>
            <label htmlFor="id-valores" className={label}>Valores que quer transmitir</label>
            <input id="id-valores" className={field} value={values} onChange={(e) => setValues(e.target.value)} placeholder="Ex.: tradição, sustentabilidade, afeto" />
          </div>
          <div>
            <label htmlFor="id-cores" className={label}>Preferência de cores</label>
            <select id="id-cores" className={field} value={colorPref} onChange={(e) => setColorPref(e.target.value)}>
              <option value="terrosas">Tons terrosos</option>
              <option value="oliva">Verde oliva</option>
              <option value="azul">Azul e algodão</option>
              <option value="vinho">Vinho e rosa</option>
              <option value="grafite">Grafite e mostarda</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={generate}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-terracota px-5 py-3 text-sm font-extrabold text-creme transition hover:bg-terracota-escura"
        >
          <Wand2 size={17} aria-hidden="true" />
          Gerar sugestões
        </button>
      </div>

      {result && (
        <div className="space-y-3" aria-live="polite">
          <p className="rounded-xl bg-laranja/15 px-4 py-2.5 text-xs font-bold text-terracota">
            Modo demonstrativo: estas sugestões são geradas localmente por regras do Tramas, sem inteligência artificial externa.
            Revise, edite e aplique o que fizer sentido para a sua marca.
          </p>
          {result.map((s) => (
            <article key={s.title} className="rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h4 className="flex items-center gap-2 font-display text-base font-semibold text-marrom">
                  <Sparkles size={15} className="text-laranja" aria-hidden="true" />
                  {s.title}
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copy(s.title, s.body)}
                    className="inline-flex items-center gap-1 rounded-lg border border-areia-escura/50 px-2.5 py-1 text-xs font-bold text-marrom/70 transition hover:border-terracota hover:text-terracota"
                  >
                    {copied === s.title ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    {copied === s.title ? 'Copiado' : 'Copiar'}
                  </button>
                  {s.apply && (
                    <button
                      type="button"
                      onClick={s.apply}
                      className="inline-flex items-center gap-1 rounded-lg bg-oliva/15 px-2.5 py-1 text-xs font-extrabold text-oliva transition hover:bg-oliva/25"
                    >
                      <Palette size={12} aria-hidden="true" />
                      Aplicar à vitrine
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-marrom/75">{s.body}</p>
            </article>
          ))}
          <p className="text-center text-xs text-marrom/50">
            Aplicou uma sugestão? Ela já aparece na sua página pública.{' '}
            <Link to="/perfil-marca" className="font-bold text-terracota hover:underline">Abrir editor da vitrine</Link>
          </p>
        </div>
      )}

      <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 text-sm text-marrom/70 shadow-sm">
        <h4 className="flex items-center gap-2 font-display text-base font-semibold text-marrom">
          <Percent size={16} className="text-terracota" aria-hidden="true" />
          Sobre a integração futura
        </h4>
        <p className="mt-1.5 leading-relaxed">
          Quando uma API de IA for configurada, este assistente poderá gerar sugestões personalizadas em linguagem natural.
          Até lá, a precificação é calculada de verdade (fórmula local) e a identidade usa sugestões demonstrativas —
          nada aqui é apresentado como resultado de IA.
        </p>
      </section>
    </div>
  );
}

/* ---------------- Página ---------------- */

export default function Assistant() {
  const [tab, setTab] = useState<'preco' | 'identidade'>('preco');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold text-marrom">Assistente da produtora</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Ferramentas para precificar com justiça e construir a identidade da sua marca.
        </p>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Ferramentas do assistente">
        {([
          ['preco', 'Precificação justa', Percent],
          ['identidade', 'Identidade da marca', Palette],
        ] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition ${
              tab === key ? 'bg-terracota text-creme' : 'bg-white/80 text-marrom/70 hover:bg-bege'
            }`}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {tab === 'preco' ? <PricingTool /> : <IdentityTool />}

      <StitchDivider />
      <SectionHeader title="Dica da semana" subtitle="Como a Dona Nega precifica" />
      <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-marrom/70">
        Some o custo dos fios e do tingimento, conte as horas reais — incluindo desfazer e recomeçar —,
        some a embalagem e uma margem de pelo menos 50%. Peça justa valoriza o seu trabalho e o ofício inteiro.
      </p>
    </div>
  );
}
