import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Send, Upload } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { ARTISANS } from '../data/mock';
import { StitchDivider } from '../components/Ornament';

const GALLERY = [
  '/images/ateliê-mãos-1.jpg',
  '/images/bordado-arte-1.jpg',
  '/images/bordado-brasil-2.jpg',
  '/images/ceramica-processo-2.jpg',
  '/images/couro-processo-1.jpg',
  '/images/croche-colcha-2.jpg',
  '/images/fios-lã-2.jpg',
  '/images/loom-tear-3.jpg',
  '/images/macrame-extra-1.jpg',
  '/images/mercado-artesanato-1.jpg',
  '/images/processo-mãos-3.jpg',
  '/images/renda-bilro-1.jpg',
];

export default function CreatePost() {
  const { addPost } = useApp();
  const navigate = useNavigate();
  const [authorId, setAuthorId] = useState('a2');
  const [image, setImage] = useState(GALLERY[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError('Escreva uma legenda para a publicação.');
      return;
    }
    const tagList = tags
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, '').trim().toLowerCase())
      .filter(Boolean);
    addPost({ authorId, image: customImage ?? image, caption: caption.trim(), tags: tagList });
    navigate('/feed');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-semibold text-marrom">Criar publicação</h1>
      <p className="mt-1 text-sm text-marrom/60">
        Compartilhe bastidores, processos e novidades da sua arte no feed do Tramas.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="autor-titulo">
          <h2 id="autor-titulo" className="font-display text-lg font-semibold text-marrom">
            Publicando como
          </h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ARTISANS.map((a) => (
              <label
                key={a.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${
                  authorId === a.id
                    ? 'border-terracota bg-bege'
                    : 'border-areia/60 bg-creme hover:border-areia-escura'
                }`}
              >
                <input
                  type="radio"
                  name="autor"
                  value={a.id}
                  checked={authorId === a.id}
                  onChange={() => setAuthorId(a.id)}
                  className="sr-only"
                />
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold text-creme"
                  style={{ backgroundColor: a.color }}
                  aria-hidden="true"
                >
                  {a.initials}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-marrom">{a.brand}</span>
                  <span className="block truncate text-xs text-marrom/60">{a.name}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="foto-titulo">
          <h2 id="foto-titulo" className="flex items-center gap-2 font-display text-lg font-semibold text-marrom">
            <ImagePlus size={18} className="text-terracota" aria-hidden="true" />
            Imagem da publicação
          </h2>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            className="sr-only"
            aria-label="Enviar foto ou vídeo do dispositivo"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.type.startsWith('image/')) {
                setCustomImage(URL.createObjectURL(file));
                setImage('');
              } else {
                // vídeo: demonstrativo — usa a imagem de capa da galeria
                setCustomImage(null);
                setImage(GALLERY[0]);
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-areia-escura/70 bg-creme/60 px-4 py-3.5 text-sm font-bold text-marrom transition hover:border-terracota hover:text-terracota"
          >
            <Upload size={17} aria-hidden="true" />
            Enviar foto ou vídeo do dispositivo
          </button>
          {customImage && (
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-bege p-3">
              <img src={customImage} alt="Pré-visualização do envio" className="h-16 w-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold text-marrom">Arquivo selecionado</p>
                <p className="text-xs text-marrom/60">Será usado como imagem da publicação (demonstração)</p>
              </div>
              <button
                type="button"
                onClick={() => { setCustomImage(null); setImage(GALLERY[0]); }}
                className="text-xs font-bold text-terracota hover:underline"
              >
                Remover
              </button>
            </div>
          )}
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-marrom/50">
            Ou escolha da galeria
          </p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {GALLERY.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => { setImage(src); setCustomImage(null); }}
                aria-pressed={!customImage && image === src}
                aria-label={`Usar imagem ${src.split('/').pop()}`}
                className={`overflow-hidden rounded-xl border-2 transition ${
                  !customImage && image === src ? 'border-terracota ring-2 ring-terracota/30' : 'border-transparent hover:border-areia-escura'
                }`}
              >
                <img src={src} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-marrom/50">
            Demonstração: arquivos ficam apenas nesta sessão — o armazenamento real chega em breve.
          </p>
        </section>

        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="texto-titulo">
          <h2 id="texto-titulo" className="font-display text-lg font-semibold text-marrom">
            Legenda e hashtags
          </h2>
          <div className="mt-3 space-y-4">
            <div>
              <label htmlFor="legenda" className="mb-1.5 block text-sm font-bold text-marrom">
                Legenda
              </label>
              <textarea
                id="legenda"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                placeholder="Conte a história da peça, do processo ou do seu dia…"
                className="w-full rounded-xl border border-areia bg-creme px-4 py-2.5 text-sm font-semibold text-marrom placeholder:font-normal placeholder:text-marrom/40 focus:border-terracota"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'legenda-erro' : undefined}
              />
              {error && (
                <p id="legenda-erro" className="mt-1 text-xs font-semibold text-terracota">
                  {error}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="tags" className="mb-1.5 block text-sm font-bold text-marrom">
                Hashtags <span className="font-normal text-marrom/50">(opcional)</span>
              </label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ex.: crochê, artesanato, feitoamao"
                className="w-full rounded-xl border border-areia bg-creme px-4 py-2.5 text-sm font-semibold text-marrom placeholder:font-normal placeholder:text-marrom/40 focus:border-terracota"
              />
            </div>
          </div>
        </section>

        <StitchDivider />

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-terracota px-6 py-4 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
        >
          <Send size={18} aria-hidden="true" />
          Publicar no feed
        </button>
      </form>
    </div>
  );
}
