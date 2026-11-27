import { Link, useNavigate } from 'react-router-dom';
import {
  Bell, ChevronRight, Heart, LogOut, MessageCircle, Package, PackagePlus,
  Settings, ShoppingBag, Sparkles, Store, User as UserIcon, Wallet,
} from 'lucide-react';
import { useApp } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

function CompactLink({ to, label, desc, icon: Icon, badge }: {
  to: string; label: string; desc: string; icon: React.ElementType; badge?: string;
}) {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center gap-4 rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-terracota/50 hover:shadow-md"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bege text-terracota">
          <Icon size={20} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold text-marrom">{label}</span>
          <span className="mt-0.5 block text-sm leading-snug text-marrom/60">{desc}</span>
        </span>
        {badge && (
          <span className="shrink-0 rounded-full bg-terracota/10 px-2 py-0.5 text-[10px] font-extrabold text-terracota">
            {badge}
          </span>
        )}
        <ChevronRight size={16} className="shrink-0 text-marrom/30" aria-hidden="true" />
      </Link>
    </li>
  );
}

export default function Profile() {
  const { orders, cartCount, currentUser, logout, commissions, conversations } = useApp();
  const navigate = useNavigate();
  const activeOrders = orders.filter((o) => o.status !== 'entregue').length;
  const activeCommissions = commissions.filter((c) => !['concluida', 'cancelada'].includes(c.status)).length;
  const unreadChats = conversations.reduce((s, c) => s + c.unread, 0);
  const initials = currentUser
    ? currentUser.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'VC';

  const links = [
    { to: '/pedidos', label: 'Meus pedidos', desc: `${activeOrders} em andamento`, icon: Package },
    { to: '/encomendas', label: 'Minhas encomendas', desc: `${activeCommissions} ativas`, icon: PackagePlus },
    { to: '/chat', label: 'Mensagens', desc: unreadChats > 0 ? `${unreadChats} não lidas` : 'Conversas com artesãs', icon: MessageCircle, badge: unreadChats > 0 ? String(unreadChats) : undefined },
    { to: '/sacola', label: 'Sacola', desc: `${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`, icon: ShoppingBag },
    { to: '/feed', label: 'Feed', desc: 'Bastidores das artesãs', icon: Sparkles },
  ];

  const sellerLinks = [
    { to: '/vender', label: 'Área da produtora', desc: 'Painel da sua marca', icon: Store },
    { to: '/perfil-marca', label: 'Minha marca', desc: 'Editor da vitrine pública', icon: UserIcon },
    { to: '/carteira', label: 'Minha carteira', desc: 'Faturamento e lucro estimado', icon: Wallet },
    { to: '/assistente', label: 'Assistente', desc: 'Precificação e identidade', icon: Sparkles },
    { to: '/notificacoes', label: 'Notificações', desc: 'Avisos e novidades', icon: Bell },
    { to: '/configuracoes', label: 'Configurações', desc: 'Preferências e acessibilidade', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-terracota text-xl font-bold text-creme">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold text-marrom">
            {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}!` : 'Olá, visitante!'}
          </h1>
          <p className="truncate text-sm text-marrom/60">
            {currentUser
              ? `${currentUser.email} · ${currentUser.role === 'produtora' ? 'Produtora' : currentUser.role === 'ambos' ? 'Compradora e produtora' : 'Compradora'}`
              : 'Explore, favorite e encomende peças feitas à mão.'}
          </p>
          {currentUser && (
            <button
              type="button"
              onClick={() => { logout(); navigate('/'); }}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-marrom/50 transition hover:text-terracota"
            >
              <LogOut size={13} aria-hidden="true" />
              Sair da conta
            </button>
          )}
        </div>
        <Link
          to="/favoritos"
          aria-label="Ver favoritos"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-terracota text-terracota transition hover:bg-terracota/10"
        >
          <Heart size={19} aria-hidden="true" />
        </Link>
        {!currentUser && (
          <Link
            to="/entrar"
            className="shrink-0 rounded-full bg-terracota px-4 py-2 text-xs font-extrabold text-creme transition hover:bg-terracota-escura"
          >
            Entrar
          </Link>
        )}
      </div>

      <StitchDivider />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <section aria-labelledby="atalhos-perfil">
          <SectionHeader title="Compras e conversas" />
          <ul className="grid gap-3">
            {links.map((l) => <CompactLink key={l.to} {...l} />)}
          </ul>
        </section>

        <section aria-labelledby="atalhos-vender">
          <SectionHeader title="Para quem produz" subtitle="Área da produtora e ferramentas" />
          <ul className="grid gap-3">
            {sellerLinks.map((l) => <CompactLink key={l.to} {...l} />)}
          </ul>
        </section>
      </div>
    </div>
  );
}
