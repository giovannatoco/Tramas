import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check, ExternalLink, ImagePlus, RotateCcw, Save, Sparkles, Upload, X,
} from 'lucide-react';
import { ARTISANS, TECHNIQUES } from '../data/mock';
import { SELLER_ID, defaultBrandTheme, useApp } from '../store/AppContext';
import type { BrandFont, BrandTemplate, BrandTheme } from '../types';
import { BrandPreview, FONT_LABELS, TEMPLATE_LABELS } from '../components/BrandPreview';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

const TEMPLATES: BrandTemplate[] = ['artesanal', 'minimalista', 'colorido', 'elegante', 'rustico'];
const FONTS: BrandFont[] = ['serifada', 'moderna', 'manuscrita'];
const GALLERY = [
  '/images/ateliê-mãos-1.jpg', '/images/processo-mãos-3.jpg', '/images/feira-barracas-4.jpg',
  '/images/mercado-artesanato-1.jpg', '/images/fios-lã-2.jpg', '/images/ceramica-tigelas-1.jpg',
];

const PRESET_SWATCHES = ['#a33d18', '#4b2414', '#52672d', '#e99b32', '#ebc9a5', '#1f3a5f', '#6e1f2e', '#3a3a3a', '#fff8ef', '#fdf3ef'];

const FIELD_CLS =
  'w-full rounded-xl border border-areia-escura/60 bg-white px-3.5 py-2.5 text-sm text-marrom outline-none transition focus:border-terracota focus:ring-2 focus:ring-terracota/20';
const LABEL_CLS = 'mb-1 block text-xs font-bold uppercase tracking-wide text-marrom/60';

function ColorField({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={`cor-${name}`} className={LABEL_CLS}>{name}</label>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
        <input
          id={`cor-${name}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-11 shrink-0 cursor-pointer rounded-lg border border-areia-escura/40 bg-white p-1"
          aria-label={`Seletor de cor ${name}`}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD_CLS} w-24 shrink-0 font-mono text-xs`}
          aria-label={`Código hex de ${name}`}
          maxLength={7}
        />
        <div className="flex flex-wrap gap-1" role="group" aria-label={`Cores prontas para ${name}`}>
          {PRESET_SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-label={`Cor ${c}`}
              className={`h-6 w-6 rounded-full border-2 ${value.toLowerCase() === c ? 'border-marrom' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ImagePicker({
  labelText, value, target, tall, onUpload, onPick, onRemove,
}: {
  labelText: string;
  value?: string;
  target: 'cover' | 'avatar' | 'logo';
  tall?: boolean;
  onUpload: (t: 'cover' | 'avatar' | 'logo') => void;
  onPick: (t: 'cover' | 'avatar' | 'logo', src: string) => void;
  onRemove: (t: 'cover' | 'avatar' | 'logo') => void;
}) {
  return (
    <div>
      <span className={LABEL_CLS}>{labelText}</span>
      <div className="mt-1.5 flex items-center gap-3">
        <div className={`overflow-hidden rounded-xl border border-areia-escura/40 bg-bege ${tall ? 'h-20 w-32' : 'h-14 w-14'}`}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-marrom/30"><ImagePlus size={18} aria-hidden="true" /></span>}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => onUpload(target)} className="rounded-lg border border-areia-escura/50 px-2.5 py-1.5 text-xs font-bold text-marrom/70 hover:border-terracota hover:text-terracota">
            Enviar foto
          </button>
          {GALLERY.slice(0, 4).map((g) => (
            <button key={g} type="button" onClick={() => onPick(target, g)} className="h-8 w-8 overflow-hidden rounded-lg border border-transparent hover:border-terracota" aria-label={`Usar foto da galeria ${g}`}>
              <img src={g} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          {value && (
            <button type="button" onClick={() => onRemove(target)} className="rounded-lg px-2 py-1.5 text-xs font-bold text-terracota hover:underline">
              Remover
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrandEditor() {
  const { getBrandTheme, saveBrandTheme, resetBrandTheme, products } = useApp();
  const artisan = ARTISANS.find((a) => a.id === SELLER_ID) ?? ARTISANS[0];
  const saved = getBrandTheme(SELLER_ID);
  const [draft, setDraft] = useState<BrandTheme>(saved);
  const [dirty, setDirty] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'cover' | 'avatar' | 'logo' | null>(null);

  const ownProducts = products.filter((p) => p.artisanId === SELLER_ID && p.active !== false);

  const patch = (p: Partial<BrandTheme>) => {
    setDraft((d) => ({ ...d, ...p }));
    setDirty(true);
  };

  const handleFile = (file: File | undefined) => {
    if (!file || !uploadTarget) return;
    const url = URL.createObjectURL(file);
    patch({ [uploadTarget]: url } as Partial<BrandTheme>);
    setUploadTarget(null);
  };

  const save = () => {
    saveBrandTheme(SELLER_ID, draft);
    setDirty(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2500);
  };

  const cancel = () => {
    setDraft(getBrandTheme(SELLER_ID));
    setDirty(false);
  };

  const restore = () => {
    resetBrandTheme(SELLER_ID);
    setDraft(defaultBrandTheme(SELLER_ID));
    setDirty(false);
  };


  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Minha marca</h1>
          <p className="mt-1 text-sm text-marrom/60">
            Personalize a vitrine pública da {artisan.brand}. As mudanças aparecem só na sua página — o Tramas continua igual para todo mundo.
          </p>
        </div>
        <Link
          to={`/artesana/${artisan.id}`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-areia-escura/50 bg-white px-4 py-2.5 text-sm font-bold text-marrom transition hover:border-terracota hover:text-terracota"
        >
          <ExternalLink size={15} aria-hidden="true" />
          Ver página pública
        </Link>
      </header>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Enviar imagem da marca"
        onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Editor */}
        <div className="space-y-6">
          {/* Modelo visual */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="modelo-titulo">
            <SectionHeader title="Modelo visual" subtitle="Escolha a personalidade da sua vitrine" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => patch({ template: t })}
                  aria-pressed={draft.template === t}
                  className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs font-extrabold transition ${
                    draft.template === t ? 'border-terracota bg-terracota/10 text-terracota' : 'border-areia-escura/30 text-marrom/70 hover:border-areia-escura'
                  }`}
                >
                  {TEMPLATE_LABELS[t]}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <span className={LABEL_CLS}>Estilo da letra dos títulos</span>
              <div className="flex flex-wrap gap-2">
                {FONTS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => patch({ font: f })}
                    aria-pressed={draft.font === f}
                    className={`rounded-lg border px-3 py-2 text-xs font-bold transition ${
                      draft.font === f ? 'border-terracota bg-terracota/10 text-terracota' : 'border-areia-escura/30 text-marrom/70'
                    }`}
                  >
                    {FONT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Cores */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="cores-titulo">
            <SectionHeader title="Cores da vitrine" subtitle="Aplicadas apenas na página da sua marca" />
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorField name="Cor primária" value={draft.primary} onChange={(v) => patch({ primary: v })} />
              <ColorField name="Cor secundária" value={draft.secondary} onChange={(v) => patch({ secondary: v })} />
              <ColorField name="Cor de fundo" value={draft.background} onChange={(v) => patch({ background: v })} />
              <ColorField name="Cor de destaque" value={draft.accent} onChange={(v) => patch({ accent: v })} />
            </div>
          </section>

          {/* Fotos */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="fotos-titulo">
            <SectionHeader title="Fotos e logotipo" subtitle="Use fotos do seu ateliê, produtos ou envie do celular" />
            <div className="grid gap-5 sm:grid-cols-3">
              <ImagePicker labelText="Foto de capa" value={draft.cover} target="cover" tall onUpload={(t)=>{setUploadTarget(t);fileRef.current?.click();}} onPick={(t,src)=>patch({[t]:src} as Partial<BrandTheme>)} onRemove={(t)=>patch({[t]:undefined} as Partial<BrandTheme>)} />
              <ImagePicker labelText="Foto de perfil" value={draft.avatar} target="avatar" onUpload={(t)=>{setUploadTarget(t);fileRef.current?.click();}} onPick={(t,src)=>patch({[t]:src} as Partial<BrandTheme>)} onRemove={(t)=>patch({[t]:undefined} as Partial<BrandTheme>)} />
              <ImagePicker labelText="Logotipo" value={draft.logo} target="logo" onUpload={(t)=>{setUploadTarget(t);fileRef.current?.click();}} onPick={(t,src)=>patch({[t]:src} as Partial<BrandTheme>)} onRemove={(t)=>patch({[t]:undefined} as Partial<BrandTheme>)} />
            </div>
          </section>

          {/* Textos */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="textos-titulo">
            <SectionHeader title="Textos" subtitle="Como sua marca se apresenta" />
            <div className="space-y-4">
              <div>
                <label htmlFor="be-slogan" className={LABEL_CLS}>Slogan</label>
                <input id="be-slogan" className={FIELD_CLS} value={draft.slogan ?? ''} onChange={(e) => patch({ slogan: e.target.value })} placeholder="Ex.: Feito à mão, feito para durar" />
              </div>
              <div>
                <label htmlFor="be-desc" className={LABEL_CLS}>Descrição curta</label>
                <textarea id="be-desc" rows={2} className={FIELD_CLS} value={draft.description ?? ''} onChange={(e) => patch({ description: e.target.value })} placeholder="Uma frase sobre o que você cria" />
              </div>
              <div>
                <span className={LABEL_CLS}>Técnicas que você usa</span>
                <div className="flex flex-wrap gap-2">
                  {TECHNIQUES.map((t) => {
                    const active = (draft.techniques ?? []).includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() =>
                          patch({
                            techniques: active
                              ? (draft.techniques ?? []).filter((x) => x !== t)
                              : [...(draft.techniques ?? []), t],
                          })
                        }
                        aria-pressed={active}
                        className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                          active ? 'border-terracota bg-terracota text-creme' : 'border-areia-escura/40 text-marrom/70 hover:border-terracota'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Contato */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="contato-titulo">
            <SectionHeader title="Contato e redes" subtitle="Opcional — ajuda clientes a falar com você" />
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="be-email" className={LABEL_CLS}>E-mail</label>
                <input id="be-email" type="email" className={FIELD_CLS} value={draft.email ?? ''} onChange={(e) => patch({ email: e.target.value })} placeholder="voce@marca.com" />
              </div>
              <div>
                <label htmlFor="be-zap" className={LABEL_CLS}>WhatsApp</label>
                <input id="be-zap" className={FIELD_CLS} value={draft.whatsapp ?? ''} onChange={(e) => patch({ whatsapp: e.target.value })} placeholder="(81) 99999-0000" />
              </div>
              <div>
                <label htmlFor="be-ig" className={LABEL_CLS}>Instagram</label>
                <input id="be-ig" className={FIELD_CLS} value={draft.instagram ?? ''} onChange={(e) => patch({ instagram: e.target.value })} placeholder="@suamarca" />
              </div>
            </div>
          </section>

          {/* Vitrine */}
          <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="vitrine-titulo">
            <SectionHeader title="Vitrine" subtitle="Escolha as peças em destaque" />
            {ownProducts.length === 0 ? (
              <p className="text-sm text-marrom/60">Você ainda não tem produtos. <Link to="/vender/produtos/novo" className="font-bold text-terracota hover:underline">Cadastre o primeiro</Link>.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ownProducts.map((p) => {
                  const on = (draft.featuredProductIds ?? ownProducts.map((x) => x.id)).includes(p.id);
                  const noneSelected = (draft.featuredProductIds ?? []).length === 0;
                  const active = noneSelected || on;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          const current = draft.featuredProductIds ?? ownProducts.map((x) => x.id);
                          patch({
                            featuredProductIds: active
                              ? current.filter((id) => id !== p.id)
                              : [...current, p.id],
                          });
                        }}
                        aria-pressed={active}
                        className={`w-full overflow-hidden rounded-xl border-2 text-left transition ${
                          active ? 'border-terracota' : 'border-transparent opacity-50'
                        }`}
                      >
                        <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
                        <span className="block truncate bg-white/90 px-2 py-1.5 text-xs font-bold text-marrom">{p.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-2 text-xs text-marrom/50">Peças marcadas aparecem primeiro na sua página pública.</p>
          </section>
        </div>

        {/* Preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Pré-visualização da vitrine">
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-marrom/50">
            <Sparkles size={13} className="text-laranja" aria-hidden="true" />
            Pré-visualização ao vivo
          </p>
          <BrandPreview artisan={artisan} theme={draft} products={products} />
          {dirty && <p className="mt-2 text-xs font-bold text-laranja">Você tem alterações não salvas.</p>}
        </aside>
      </div>

      {/* Ações */}
      <div className="sticky bottom-20 z-20 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-areia/70 bg-creme/95 p-3 shadow-lg backdrop-blur lg:bottom-6">
        <button
          type="button"
          onClick={save}
          className="inline-flex items-center gap-2 rounded-xl bg-terracota px-5 py-2.5 text-sm font-extrabold text-creme transition hover:bg-terracota-escura"
        >
          {savedFlash ? <Check size={16} aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
          {savedFlash ? 'Salvo!' : 'Salvar alterações'}
        </button>
        <button
          type="button"
          onClick={cancel}
          disabled={!dirty}
          className="inline-flex items-center gap-2 rounded-xl border border-areia-escura/50 bg-white px-5 py-2.5 text-sm font-bold text-marrom transition hover:border-marrom disabled:opacity-40"
        >
          <X size={16} aria-hidden="true" />
          Cancelar
        </button>
        <button
          type="button"
          onClick={restore}
          className="inline-flex items-center gap-2 rounded-xl border border-areia-escura/50 bg-white px-5 py-2.5 text-sm font-bold text-marrom transition hover:border-terracota hover:text-terracota"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Restaurar tema padrão
        </button>
        <span className="hidden items-center gap-1 text-xs text-marrom/50 sm:inline-flex">
          <Upload size={12} aria-hidden="true" /> Fotos enviadas ficam nesta sessão (demonstração)
        </span>
      </div>

      <StitchDivider />
      <p className="mx-auto max-w-2xl text-center text-sm text-marrom/60">
        Dica: o <Link to="/assistente" className="font-bold text-terracota hover:underline">Assistente de identidade</Link>{' '}
        pode sugerir slogan, cores e textos prontos para aplicar aqui.
      </p>
    </div>
  );
}
