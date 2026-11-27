import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Check, Heart, MessageCircle, Share2, X } from 'lucide-react';
import { getArtisan, useApp, type Post } from '../store/AppContext';
import { formatPrice } from '../data/mock';

export function PostCard({ post }: { post: Post }) {
  const { togglePostLike, togglePostSave, savedPostIds, postComments, addPostComment, products, followedIds, toggleFollow } = useApp();
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shared, setShared] = useState(false);
  const artisan = getArtisan(post.authorId);
  const saved = savedPostIds.includes(post.id);
  const comments = postComments[post.id] ?? [];
  const following = artisan ? followedIds.includes(artisan.id) : false;
  const displayLikes = post.likes + (liked ? 1 : 0);

  if (!artisan) return null;

  const share = async () => {
    const url = `${window.location.origin}/artesana/${artisan.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Tramas — ${artisan.brand}`, text: post.caption.slice(0, 100), url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      /* usuário cancelou o compartilhamento */
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addPostComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <article className="relative flex h-[70vh] max-h-[640px] min-h-[420px] snap-start flex-col overflow-hidden rounded-3xl border border-areia/70 bg-marrom shadow-lg sm:h-[75vh]">
      <img
        src={post.image}
        alt={`Publicação de ${artisan.name}: ${post.caption.slice(0, 80)}…`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-marrom/90 via-marrom/20 to-transparent" aria-hidden="true" />

      <header className="relative z-10 flex items-center gap-3 p-4">
        <Link
          to={`/artesana/${artisan.id}`}
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-creme/60 bg-terracota text-sm font-bold text-creme"
          aria-label={`Ver perfil de ${artisan.name}`}
        >
          {artisan.initials}
        </Link>
        <div className="min-w-0">
          <Link to={`/artesana/${artisan.id}`} className="block truncate font-display font-semibold text-creme">
            {artisan.name}
          </Link>
          <p className="truncate text-xs font-semibold text-creme/70">{artisan.location}</p>
        </div>
        <button
          type="button"
          onClick={() => artisan && toggleFollow(artisan.id)}
          aria-pressed={following}
          className="ml-auto rounded-full bg-creme px-4 py-1.5 text-xs font-extrabold text-marrom transition hover:bg-bege"
        >
          {following ? 'Seguindo' : 'Seguir'}
        </button>
      </header>

      <div className="relative z-10 mt-auto space-y-2 p-4">
        {post.productId && (() => {
          const linked = products.find((p) => p.id === post.productId);
          return linked ? (
            <Link
              to={`/produtos/${linked.id}`}
              className="flex items-center gap-2.5 rounded-2xl bg-creme/95 p-2 pr-3 shadow backdrop-blur transition hover:bg-creme"
            >
              <img src={linked.image} alt={linked.name} className="h-11 w-11 rounded-xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold text-marrom">{linked.name}</span>
                <span className="text-xs font-extrabold text-terracota">{formatPrice(linked.price)}</span>
              </span>
              <span className="rounded-full bg-terracota px-3 py-1.5 text-[11px] font-extrabold text-creme">
                Ver peça
              </span>
            </Link>
          ) : null;
        })()}
        <p className="text-sm leading-relaxed text-creme">{post.caption}</p>
        <p className="text-xs font-semibold text-laranja-claro">{post.createdAt}</p>
      </div>

      <aside className="absolute bottom-24 right-3 z-10 flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => {
            setLiked((v) => !v);
            if (!liked) togglePostLike(post.id);
          }}
          aria-pressed={liked}
          aria-label={liked ? 'Descurtir publicação' : 'Curtir publicação'}
          className="flex flex-col items-center gap-1 text-creme"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-marrom/40 backdrop-blur transition hover:bg-terracota">
            <Heart size={20} fill={liked ? '#A33D18' : 'none'} strokeWidth={2.2} />
          </span>
          <span className="text-xs font-bold">{displayLikes}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments((v) => !v)}
          aria-expanded={showComments}
          aria-label="Comentar publicação"
          className="flex flex-col items-center gap-1 text-creme"
        >
          <span className={`grid h-11 w-11 place-items-center rounded-full backdrop-blur transition ${showComments ? 'bg-terracota' : 'bg-marrom/40 hover:bg-terracota'}`}>
            <MessageCircle size={20} />
          </span>
          <span className="text-xs font-bold">{post.comments + comments.length}</span>
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Compartilhar publicação"
          className="flex flex-col items-center gap-1 text-creme"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-marrom/40 backdrop-blur transition hover:bg-terracota">
            {shared ? <Check size={20} /> : <Share2 size={20} />}
          </span>
          <span className="text-xs font-bold">{shared ? 'Copiado' : 'Enviar'}</span>
        </button>
        <button
          type="button"
          onClick={() => togglePostSave(post.id)}
          aria-pressed={saved}
          aria-label={saved ? 'Remover dos salvos' : 'Salvar publicação'}
          className="flex flex-col items-center gap-1 text-creme"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-marrom/40 backdrop-blur transition hover:bg-terracota">
            <Bookmark size={20} fill={saved ? '#E99B32' : 'none'} strokeWidth={2.2} />
          </span>
          <span className="text-xs font-bold">{saved ? 'Salvo' : 'Salvar'}</span>
        </button>
      </aside>

      {/* Painel de comentários */}
      {showComments && (
        <div className="absolute inset-0 z-20 flex flex-col bg-marrom/95 p-4 backdrop-blur-sm" role="dialog" aria-label="Comentários da publicação">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-creme">Comentários</h3>
            <button
              type="button"
              onClick={() => setShowComments(false)}
              aria-label="Fechar comentários"
              className="rounded-full bg-creme/15 p-2 text-creme transition hover:bg-creme/25"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <ul className="mt-3 flex-1 space-y-2.5 overflow-y-auto">
            {post.comments > 0 && (
              <li className="rounded-xl bg-creme/5 p-3 text-center text-xs text-creme/50">
                +{post.comments} {post.comments === 1 ? 'comentário anterior' : 'comentários anteriores'} (demonstrativo)
              </li>
            )}
            {comments.length === 0 && post.comments === 0 && (
              <li className="py-6 text-center text-sm text-creme/60">Seja a primeira pessoa a comentar.</li>
            )}
            {comments.map((c) => (
              <li key={c.id} className="rounded-xl bg-creme/10 p-3">
                <p className="text-xs font-extrabold text-laranja-claro">{c.author} <span className="font-normal text-creme/50">· {c.createdAt}</span></p>
                <p className="mt-0.5 text-sm text-creme">{c.text}</p>
              </li>
            ))}
          </ul>
          <form onSubmit={submitComment} className="mt-3 flex gap-2">
            <label htmlFor={`comment-${post.id}`} className="sr-only">Escrever comentário</label>
            <input
              id={`comment-${post.id}`}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Escreva um comentário…"
              maxLength={280}
              className="flex-1 rounded-full border border-creme/30 bg-creme/10 px-4 py-2.5 text-sm text-creme placeholder:text-creme/50 outline-none focus:border-laranja"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              aria-label="Publicar comentário"
              className="rounded-full bg-terracota px-4 py-2.5 text-xs font-extrabold text-creme transition hover:bg-terracota-escura disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
