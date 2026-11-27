import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Bell, MapPin } from 'lucide-react';
import { ARTISANS, CATEGORIES, FAIRS, REGIONS, USER_LOCATION } from '../data/mock';
import { useApp } from '../store/AppContext';
import type { Region } from '../types';
import { ArtisanCard, ProductCard } from '../components/cards';
import { FairCard } from '../components/FairCard';
import { SearchBar } from '../components/SearchBar';
import { SectionHeader } from '../components/SectionHeader';
import Logo from '../components/Logo';

const REGION_GRADIENTS: Record<Region, string> = {
  Norte: 'from-oliva/80 to-oliva',
  Nordeste: 'from-terracota/80 to-terracota-escuro',
  'Centro-Oeste': 'from-laranja/80 to-terracota',
  Sudeste: 'from-areia-escura/80 to-marrom/80',
  Sul: 'from-oliva-claro/80 to-oliva',
};

export default function HomeBuyer() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { products } = useApp();
  const activeProducts = useMemo(() => products.filter((p) => p.active !== false), [products]);

  const artisansNear = useMemo(
    () => ARTISANS.filter((a) => a.location.toLowerCase().includes('campinas')),
    [],
  );

  const featuredProducts = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);
  const nearbyFairs = useMemo(
    () => FAIRS.filter((f) => f.city === 'Campinas').slice(0, 3),
    [],
  );

  return (
    <div className="space-y-12">
      {/* Busca */}
      <header className="anim-subir flex items-center gap-3">
        <div className="hidden sm:block">
          <Logo size="sm" withSlogan={false} />
        </div>
        <div className="flex-1">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={(q) => navigate(`/explorar${q ? `?q=${encodeURIComponent(q)}` : ''}`)}
          />
        </div>
        <Link
          to="/notificacoes"
          aria-label="Notificações"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-marrom transition hover:bg-bege"
        >
          <Bell size={20} aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-terracota ring-2 ring-creme" aria-hidden="true" />
        </Link>
        <Link
          to="/perfil"
          aria-label="Meu perfil"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-terracota text-sm font-bold text-creme"
        >
          VC
        </Link>
      </header>

      {/* Hero editorial */}
      <section
        className="anim-subir relative overflow-hidden rounded-[2rem] bg-marrom text-creme shadow-lg"
        aria-labelledby="hero-titulo"
      >
        <img
          src="/images/processo-mãos-3.jpg"
          alt="Mãos de artesã trabalhando argila"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-marrom via-marrom/85 to-marrom/40" aria-hidden="true" />
        <div className="relative z-10 grid gap-6 p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full bg-laranja/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-laranja-claro">
              <MapPin size={12} aria-hidden="true" />
              {USER_LOCATION.city}, {USER_LOCATION.state}
            </p>
            <h1 id="hero-titulo" className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Cada peça carrega uma história.
            </h1>
            <p className="mt-3 max-w-md text-sm text-creme/80 sm:text-base">
              Descubra talentos brasileiros, conheça quem cria e valorize o feito à mão.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/explorar"
                className="rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
              >
                Explorar produtos
              </Link>
              <Link
                to="/explorar?tab=artesas"
                className="rounded-full border border-creme/40 px-6 py-3 text-sm font-bold text-creme transition hover:bg-creme/10"
              >
                Conhecer as artesãs
              </Link>
            </div>
          </div>
          <div className="hidden gap-3 lg:flex" aria-hidden="true">
            <img src="/images/renda-bilro-0.jpg" alt="" className="h-44 w-32 rounded-2xl object-cover shadow-lg" />
            <img src="/images/ceramica-vaso-3.jpg" alt="" className="mt-8 h-44 w-32 rounded-2xl object-cover shadow-lg" />
            <img src="/images/couro-carteira-3.jpg" alt="" className="h-44 w-32 rounded-2xl object-cover shadow-lg" />
          </div>
        </div>
      </section>

      {/* Categorias com foto */}
      <section aria-labelledby="categorias">
        <SectionHeader
          title="Categorias artesanais"
          action={
            <Link to="/explorar" className="inline-flex items-center gap-1 text-sm font-bold text-terracota hover:underline">
              Ver tudo <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <Link
                to={`/explorar?categoria=${cat.id}`}
                className="group relative block h-32 overflow-hidden rounded-2xl shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:h-36"
              >
                <img
                  src={cat.image}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-marrom/85 via-marrom/20 to-transparent" aria-hidden="true" />
                <span className="absolute bottom-2.5 left-3 right-2 font-display text-base font-semibold text-creme">
                  {cat.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destaques */}
      <section aria-labelledby="destaques">
        <SectionHeader
          title="Peças em destaque"
          subtitle="Escolhidas pelas produtoras e mais desejadas da semana"
          action={
            <Link to="/explorar" className="inline-flex items-center gap-1 text-sm font-bold text-terracota hover:underline">
              Ver tudo <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {featuredProducts.map((p) => (
            <li key={p.id}>
              <ProductCard
                product={p}
                artisan={ARTISANS.find((a) => a.id === p.artisanId)}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Feed */}
      <Link
        to="/feed"
        className="group relative block overflow-hidden rounded-[2rem] bg-marrom shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <img
          src="/images/bordado-brasil-1.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="relative z-10 flex items-center justify-between gap-4 p-6 text-creme sm:p-8">
          <div>
            <p className="font-display text-2xl font-semibold">Feed de bastidores</p>
            <p className="mt-1 text-sm text-creme/75">
              Processos, histórias e vídeos curtos das artesãs em ação.
            </p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-laranja text-marrom transition group-hover:scale-110">
            <ArrowRight size={20} aria-hidden="true" />
          </span>
        </div>
      </Link>

      {/* Artesãs de Campinas */}
      <section aria-labelledby="artesas">
        <SectionHeader
          title="Artesãs em destaque"
          subtitle={`Produtoras de ${USER_LOCATION.city} — perfis demonstrativos`}
        />
        {artisansNear.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-areia-escura/40 bg-white/60 p-8 text-center">
            <p className="font-display text-lg font-semibold text-marrom">
              Ainda não há produtora de Campinas cadastrada
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-marrom/60">
              Perfis de outras cidades aparecem como demonstrativos em Explorar. Em breve,
              artesãs da região de Campinas terão vitrine própria aqui.
            </p>
            <Link
              to="/explorar?tab=artesas"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-terracota px-5 py-2 text-sm font-bold text-terracota transition hover:bg-terracota hover:text-creme"
            >
              Ver artesãs demonstrativas <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <ul className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {artisansNear.map((a) => (
              <li key={a.id}>
                <ArtisanCard artisan={a} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Regiões */}
      <section aria-labelledby="regioes">
        <SectionHeader title="Explorar por região" subtitle="Artesanato de todas as cantos do Brasil" />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {REGIONS.map((region) => {
            const count = activeProducts.filter((p) => p.region === region).length;
            return (
              <li key={region}>
                <Link
                  to={`/explorar?regiao=${encodeURIComponent(region)}`}
                  className={`flex h-28 flex-col justify-between rounded-2xl bg-gradient-to-br ${REGION_GRADIENTS[region]} p-4 text-creme shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
                >
                  <span className="font-display text-lg font-semibold">{region}</span>
                  <span className="text-xs font-bold opacity-90">
                    {count} {count === 1 ? 'peça' : 'peças'}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Feiras */}
      <section aria-labelledby="feiras">
        <SectionHeader
          title="Feiras e eventos"
          subtitle="Eventos de exemplo — a agenda real chega em breve"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {nearbyFairs.map((f) => (
            <li key={f.id}>
              <FairCard fair={f} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
