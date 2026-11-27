import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AtSign, BadgeCheck, Mail, MapPin, MessageCircle, Star } from 'lucide-react';
import { ARTISANS } from '../data/mock';
import { useApp } from '../store/AppContext';
import { ProductCard } from '../components/cards';
import { PostCard } from '../components/PostCard';
import { StitchDivider } from '../components/Ornament';
import { SectionHeader } from '../components/SectionHeader';
import { FONT_LABELS } from '../components/BrandPreview';
import { NotFoundLink } from './NotFound';

export default function ArtisanProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    products: allProducts,
    posts,
    getBrandTheme,
    followedIds,
    toggleFollow,
    ensureConversation,
  } = useApp();
  const artisan = ARTISANS.find((a) => a.id === id);
  const theme = artisan ? getBrandTheme(artisan.id) : null;
  const artisanPosts = posts.filter((p) => p.authorId === artisan?.id);
  const following = artisan ? followedIds.includes(artisan.id) : false;

  if (!artisan || !theme) return <NotFoundLink />;

  const allOwn = allProducts.filter((p) => p.artisanId === artisan.id && p.active !== false);
  const featuredIds = theme.featuredProductIds ?? [];
  const featured = featuredIds.length ? allOwn.filter((p) => featuredIds.includes(p.id)) : allOwn.slice(0, 4);
  const featuredSet = new Set(featured.map((p) => p.id));
  const rest = allOwn.filter((p) => !featuredSet.has(p.id));

  const openChat = () => {
    const convId = ensureConversation(artisan.id);
    navigate(`/chat/${convId}`);
  };

  const fontClass = theme.font === 'moderna' ? 'font-sans' : theme.font === 'manuscrita' ? 'font-display italic' : 'font-display';

  return (
    <div
      className="space-y-8"
      style={{ '--marca-primary': theme.primary, '--marca-accent': theme.accent } as React.CSSProperties}
    >
      <Link
        to="/explorar"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 transition hover:text-terracota"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para Explorar
      </Link>

      {/* Capa + identidade */}
      <header
        className="overflow-hidden rounded-3xl border shadow-sm"
        style={{ borderColor: theme.accent + '55', backgroundColor: theme.background }}
      >
        <div className="relative h-44 overflow-hidden sm:h-56" style={{ backgroundColor: theme.primary }}>
          {(theme.cover ?? artisan.cover) && (
            <img
              src={theme.cover ?? artisan.cover}
              alt={`Trabalho de ${artisan.name} — ${artisan.craft}`}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-marrom/50 to-transparent" aria-hidden="true" />
        </div>
        <div className="relative px-5 pb-5 sm:px-8">
          <div className="-mt-14 flex flex-wrap items-end justify-between gap-4 sm:-mt-16">
            <div className="flex items-end gap-4">
              {theme.logo ? (
                <img
                  src={theme.logo}
                  alt={`Logotipo de ${artisan.brand}`}
                  className="h-28 w-28 rounded-3xl border-4 object-cover shadow-md sm:h-32 sm:w-32"
                  style={{ borderColor: theme.background, backgroundColor: theme.secondary }}
                />
              ) : theme.avatar ?? artisan.avatar ? (
                <img
                  src={theme.avatar ?? artisan.avatar}
                  alt={`Foto de ${artisan.name}`}
                  className="h-28 w-28 rounded-full border-4 object-cover shadow-md sm:h-32 sm:w-32"
                  style={{ borderColor: theme.background }}
                />
              ) : (
                <span
                  className={`grid h-28 w-28 place-items-center rounded-full border-4 text-3xl font-bold shadow-md sm:h-32 sm:w-32 ${fontClass}`}
                  style={{ borderColor: theme.background, backgroundColor: theme.primary, color: theme.background }}
                  aria-hidden="true"
                >
                  {artisan.initials}
                </span>
              )}
              <div className="pb-1">
                <h1 className={`flex items-center gap-2 text-2xl font-semibold sm:text-3xl ${fontClass}`} style={{ color: theme.secondary }}>
                  {artisan.brand}
                  <BadgeCheck size={22} style={{ color: theme.primary }} aria-label="Marca verificada" />
                </h1>
                <p className="text-sm font-bold" style={{ color: theme.primary }}>
                  {artisan.name}
                  <span className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide" style={{ backgroundColor: theme.accent + '33', color: theme.secondary }}>
                    Perfil demonstrativo
                  </span>
                </p>
                {theme.slogan && (
                  <p className="mt-0.5 text-sm font-semibold italic" style={{ color: theme.accent }}>{theme.slogan}</p>
                )}
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm" style={{ color: theme.secondary }}>
                  <MapPin size={14} style={{ color: theme.primary }} aria-hidden="true" />
                  {artisan.location} · {artisan.craft}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: theme.primary }}>
                  <Star size={14} fill="currentColor" aria-hidden="true" />
                  {artisan.rating.toFixed(1)}
                  <span className="font-normal opacity-60">({artisan.reviews} avaliações)</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <button
                type="button"
                onClick={() => toggleFollow(artisan.id)}
                aria-pressed={following}
                className="rounded-full px-5 py-2.5 text-sm font-bold transition"
                style={
                  following
                    ? { border: `1px solid ${theme.secondary}55`, backgroundColor: 'transparent', color: theme.secondary }
                    : { backgroundColor: theme.primary, color: theme.background }
                }
              >
                {following ? 'Seguindo' : 'Seguir'}
              </button>
              <button
                type="button"
                onClick={openChat}
                className="inline-flex items-center gap-2 rounded-full border-2 px-5 py-2.5 text-sm font-bold transition hover:opacity-80"
                style={{ borderColor: theme.primary, color: theme.primary }}
              >
                <MessageCircle size={15} aria-hidden="true" />
                Conversar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* História — destaque */}
      <section
        className="relative overflow-hidden rounded-3xl border p-6 shadow-sm sm:p-8"
        style={{ borderColor: theme.accent + '44', backgroundColor: theme.background }}
        aria-labelledby="historia-titulo"
      >
        <span
          className={`pointer-events-none absolute -right-6 -top-6 text-[10rem] font-bold leading-none select-none ${fontClass}`}
          style={{ color: theme.primary + '0d' }}
          aria-hidden="true"
        >
          “
        </span>
        <h2 id="historia-titulo" className={`text-xl font-semibold ${fontClass}`} style={{ color: theme.secondary }}>
          A história de {artisan.name.split(' ')[0]}
        </h2>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed" style={{ color: theme.secondary }}>
          {theme.description ?? artisan.story}
        </p>
        {(theme.email || theme.whatsapp || theme.instagram) && (
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm" style={{ color: theme.secondary }}>
            {theme.email && <span className="inline-flex items-center gap-1.5"><Mail size={13} aria-hidden="true" />{theme.email}</span>}
            {theme.whatsapp && <span className="inline-flex items-center gap-1.5"><MessageCircle size={13} aria-hidden="true" />{theme.whatsapp}</span>}
            {theme.instagram && <span className="inline-flex items-center gap-1.5"><AtSign size={13} aria-hidden="true" />@{theme.instagram.replace('@', '')}</span>}
          </p>
        )}
      </section>

      {/* Técnicas */}
      <section aria-labelledby="tecnicas-titulo">
        <h2 id="tecnicas-titulo" className="font-display text-xl font-semibold text-marrom">Técnicas utilizadas</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(theme.techniques ?? artisan.techniques).map((t) => (
            <li
              key={t}
              className="rounded-full border px-4 py-1.5 text-sm font-bold"
              style={{ borderColor: theme.primary + '66', backgroundColor: theme.primary + '14', color: theme.secondary }}
            >
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Publicações */}
      {artisanPosts.length > 0 && (
        <section aria-labelledby="publicacoes-titulo">
          <SectionHeader title="Publicações" subtitle="Bastidores e processos de criação" />
          <ul className="mx-auto grid max-w-md gap-5 sm:max-w-lg">
            {artisanPosts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <StitchDivider />

      {/* Processo de criação */}
      <section aria-labelledby="processo-titulo">
        <SectionHeader title="O processo de criação" subtitle="Bastidores do ateliê, passo a passo" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {artisan.processPhotos.map((photo) => (
            <li key={photo.src} className="overflow-hidden rounded-2xl border border-areia/70 bg-white shadow-sm">
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <p className="px-3 py-2.5 text-sm font-semibold text-marrom/80">{photo.caption}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Vitrine */}
      <section aria-labelledby="vitrine-titulo">
        <SectionHeader
          title="Vitrine"
          subtitle={`Peças de ${artisan.brand} à venda no Tramas`}
        />
        {featured.length > 0 && (
          <>
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide" style={{ color: theme.primary }}>
              Em destaque
            </h3>
            <ul className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} artisan={artisan} />
                </li>
              ))}
            </ul>
          </>
        )}
        {rest.length > 0 && (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {rest.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} artisan={artisan} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Encomenda */}
      <section className="rounded-3xl p-6 text-center shadow-sm sm:p-8" style={{ backgroundColor: theme.secondary, color: theme.background }} aria-labelledby="encomenda-titulo">
        <h2 id="encomenda-titulo" className={`text-2xl font-semibold ${fontClass}`}>
          Quer uma peça única de {artisan.name.split(' ')[0]}?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm opacity-80">
          Encomendas personalizadas ficam prontas em 2 a 6 semanas. Converse direto com a produtora pelo chat
          do Tramas — sem intermediários.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            to={`/encomenda/nova?artesana=${artisan.id}`}
            className="rounded-full px-6 py-3 text-sm font-bold transition hover:opacity-90"
            style={{ backgroundColor: theme.accent, color: theme.secondary }}
          >
            Fazer uma encomenda
          </Link>
          <button
            type="button"
            onClick={openChat}
            className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-bold transition hover:bg-white/10"
            style={{ borderColor: theme.background + '66' }}
          >
            <MessageCircle size={15} aria-hidden="true" />
            Tirar uma dúvida
          </button>
        </div>
      </section>

      <p className="text-center text-xs text-marrom/40">
        Modelo de vitrine: {FONT_LABELS[theme.font].toLowerCase()} · Personalização da marca em{' '}
        <Link to="/perfil-marca" className="font-bold text-terracota hover:underline">Minha marca</Link>
      </p>
    </div>
  );
}
