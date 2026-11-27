import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bookmark, Clapperboard } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { PostCard } from '../components/PostCard';

export default function Feed() {
  const { posts, savedPostIds } = useApp();
  const [tab, setTab] = useState<'feed' | 'salvos'>('feed');
  const shown = tab === 'salvos' ? posts.filter((p) => savedPostIds.includes(p.id)) : posts;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Feed</h1>
          <p className="mt-1 text-sm text-marrom/60">
            Bastidores, processos e histórias das artesãs — feito à mão, feito no Brasil.
          </p>
        </div>
        <Link
          to="/criar"
          className="inline-flex items-center gap-2 rounded-full bg-terracota px-5 py-2.5 text-sm font-bold text-creme shadow-sm transition hover:bg-terracota-escuro"
        >
          <Clapperboard size={16} aria-hidden="true" />
          Publicar
        </Link>
      </header>

      <div className="flex gap-2" role="tablist" aria-label="Feed">
        {([
          ['feed', 'Para você'],
          ['salvos', `Salvos (${savedPostIds.length})`],
        ] as const).map(([k, lbl]) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-extrabold transition ${
              tab === k ? 'bg-terracota text-creme' : 'bg-white/80 text-marrom/60 hover:bg-bege'
            }`}
          >
            {k === 'salvos' && <Bookmark size={13} aria-hidden="true" />}
            {lbl}
          </button>
        ))}
      </div>

      <section aria-label="Publicações">
        {shown.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-areia-escura/40 bg-white/60 p-8 text-center">
            <Bookmark size={26} className="mx-auto text-marrom/30" aria-hidden="true" />
            <p className="mt-2 text-sm text-marrom/60">
              Nenhuma publicação salva ainda. Toque em "Salvar" em qualquer post do feed.
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-md snap-y snap-mandatory flex-col gap-5 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:max-w-lg">
            {shown.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-marrom/50">
        deslizze para continuar vendo publicações
        <ArrowRight size={12} aria-hidden="true" />
      </p>
    </div>
  );
}
