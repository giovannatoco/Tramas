import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  Bell,
  Clapperboard,
  Compass,
  HandHeart,
  Home,
  Map,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Store,
  User,
  Video,
} from 'lucide-react';
import Logo, { LogoMark } from './Logo';
import { useApp } from '../store/AppContext';
import { USER_LOCATION } from '../data/mock';

const NAV_ITEMS = [
  { to: '/inicio', label: 'Início', icon: Home },
  { to: '/explorar', label: 'Explorar', icon: Compass },
  { to: '/feed', label: 'Feed', icon: Video },
  { to: '/mapa', label: 'Mapa', icon: Map },
  { to: '/perfil', label: 'Perfil', icon: User },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Navegação principal" className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              isActive
                ? 'bg-bege text-terracota shadow-sm'
                : 'text-marrom/70 hover:bg-bege/60 hover:text-marrom'
            }`
          }
        >
          <Icon size={19} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AppLayout() {
  const { cartCount, unreadChatCount } = useApp();
  return (
    <div className="min-h-screen bg-creme textura-papel">
      {/* Barra lateral — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-areia/70 bg-creme/95 px-5 py-6 backdrop-blur lg:flex">
        <Link to="/inicio" aria-label="Tramas — página inicial" className="px-1">
          <Logo size="md" />
        </Link>
        <div className="mt-3 px-4">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-bege px-3 py-1 text-xs font-bold text-oliva">
            <MapPin size={12} aria-hidden="true" />
            {USER_LOCATION.city}, {USER_LOCATION.state}
          </p>
        </div>
        <div className="mt-8">
          <NavLinks />
          <Link
            to="/criar"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-areia-escura/60 px-4 py-2.5 text-sm font-bold text-marrom/70 transition hover:border-terracota hover:text-terracota"
          >
            <Clapperboard size={17} aria-hidden="true" />
            Publicar no feed
          </Link>
        </div>
        <Link
          to="/sacola"
          className="mt-4 flex items-center justify-between rounded-xl border border-areia/70 bg-white/70 px-4 py-2.5 text-sm font-bold text-marrom transition hover:bg-bege"
        >
          <span className="inline-flex items-center gap-3">
            <ShoppingBag size={19} aria-hidden="true" />
            Sacola
          </span>
          {cartCount > 0 && (
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-terracota px-1.5 text-xs font-extrabold text-creme">
              {cartCount}
            </span>
          )}
        </Link>
        <div className="mt-4 space-y-3">
          <Link
            to="/chat"
            className="flex items-center justify-between rounded-xl border border-areia/70 bg-white/70 px-4 py-2.5 text-sm font-bold text-marrom transition hover:bg-bege"
          >
            <span className="inline-flex items-center gap-3">
              <MessageCircle size={19} aria-hidden="true" />
              Mensagens
            </span>
            {unreadChatCount > 0 && (
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-terracota px-1.5 text-xs font-extrabold text-creme">
                {unreadChatCount}
              </span>
            )}
          </Link>
          <div className="trama-ponto" aria-hidden="true" />
          <Link
            to="/vender"
            className="flex items-center gap-3 rounded-xl bg-terracota px-4 py-3 text-sm font-bold text-creme shadow-sm transition hover:bg-terracota-escuro"
          >
            <Store size={19} aria-hidden="true" />
            Área da produtora
          </Link>
          <Link
            to="/inicio"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-marrom/70 transition hover:bg-bege/60 hover:text-marrom"
          >
            <HandHeart size={19} aria-hidden="true" />
            Sobre o Tramas
          </Link>
        </div>
      </aside>

      {/* Barra superior — mobile */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-areia/60 bg-creme/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/inicio" aria-label="Tramas — página inicial">
          <LogoMark size={36} />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/notificacoes"
            aria-label="Notificações"
            className="grid h-10 w-10 place-items-center rounded-full text-marrom transition hover:bg-bege"
          >
            <Bell size={20} aria-hidden="true" />
          </Link>
          <Link
            to="/chat"
            aria-label={`Mensagens${unreadChatCount > 0 ? `, ${unreadChatCount} não lidas` : ''}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-marrom transition hover:bg-bege"
          >
            <MessageCircle size={20} aria-hidden="true" />
            {unreadChatCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracota px-1 text-[10px] font-extrabold text-creme">
                {unreadChatCount}
              </span>
            )}
          </Link>
          <Link
            to="/sacola"
            aria-label={`Sacola de compras${cartCount > 0 ? `, ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}` : ''}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-marrom transition hover:bg-bege"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-terracota px-1 text-[10px] font-extrabold text-creme">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/perfil"
            aria-label="Meu perfil"
            className="grid h-10 w-10 place-items-center rounded-full bg-terracota text-sm font-bold text-creme"
          >
            VC
          </Link>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="pb-24 lg:ml-64 lg:pb-10">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Navegação inferior — mobile */}
      <nav
        aria-label="Navegação inferior"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-areia/70 bg-creme/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition ${
                  isActive ? 'text-terracota' : 'text-marrom/55 hover:text-marrom'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-9 w-14 place-items-center rounded-full transition ${
                      isActive ? 'bg-bege shadow-sm' : ''
                    }`}
                  >
                    <Icon size={21} strokeWidth={isActive ? 2.4 : 2} aria-hidden="true" />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

