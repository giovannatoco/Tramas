import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  MessageSquareText,
  Package,
  PackagePlus,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Wallet,
} from 'lucide-react';
import { useApp, SELLER_ID } from '../store/AppContext';
import { ARTISANS, formatPrice } from '../data/mock';
import { OrderStatusBadge } from '../components/OrderBits';
import { StitchDivider } from '../components/Ornament';
import { SectionHeader } from '../components/SectionHeader';

interface Shortcut {
  title: string;
  description: string;
  icon: typeof Store;
  to?: string;
  badge?: string;
  accent?: string;
}

const SHORTCUTS: Shortcut[] = [
  {
    title: 'Minha marca',
    description: 'Perfil público, história e vitrine da sua marca no Tramas.',
    icon: Store,
    to: '/perfil-marca',
  },
  {
    title: 'Meus produtos',
    description: 'Cadastre, edite e organize suas peças disponíveis.',
    icon: ShoppingBag,
    to: '/vender/produtos',
  },
  {
    title: 'Meus pedidos',
    description: 'Acompanhe vendas, encomendas e status de envio.',
    icon: Package,
    to: '/vender/pedidos',
  },
  {
    title: 'Encomendas',
    description: 'Propostas de preço e produção de peças personalizadas.',
    icon: PackagePlus,
    to: '/vender/encomendas',
  },
  {
    title: 'Mensagens',
    description: 'Conversas com compradoras e dúvidas sobre peças.',
    icon: MessageSquareText,
    to: '/vender/chat',
  },
  {
    title: 'Assistente de IA',
    description: 'Precificação justa e identidade visual para sua marca.',
    icon: Sparkles,
    to: '/assistente',
    badge: 'Demo',
    accent: 'bg-laranja/15 text-laranja',
  },
  {
    title: 'Minha carteira',
    description: 'Faturamento, lucro estimado e histórico financeiro.',
    icon: Wallet,
    to: '/carteira',
    badge: 'Demo',
  },
  {
    title: 'Feiras e eventos',
    description: 'Eventos artesanais e participação da sua marca.',
    icon: CalendarDays,
    to: '/feiras',
    badge: 'Demo',
  },
  {
    title: 'Configurações',
    description: 'Dados da marca, preferências e acessibilidade.',
    icon: Settings,
    to: '/configuracoes',
  },
];

export default function SellerDashboard() {
  const { products, orders } = useApp();
  const artisan = ARTISANS.find((a) => a.id === SELLER_ID) ?? ARTISANS[1];

  const myProducts = products.filter((p) => p.artisanId === SELLER_ID);
  const myOrders = orders.filter((o) => o.artisanId === SELLER_ID);
  const activeOrders = myOrders.filter((o) => o.status !== 'entregue');
  const recentOrders = [...myOrders]
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 3);

  const stats = [
    { label: 'Peças na vitrine', value: String(myProducts.filter((p) => p.active !== false).length) },
    { label: 'Pedidos ativos', value: String(activeOrders.length) },
    { label: 'Seguidores', value: String(artisan.reviews) },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-marrom/60">Área da produtora</p>
          <h1 className="font-display text-3xl font-semibold text-marrom">
            Olá, Dona Nega! Que tal vender mais hoje?
          </h1>
        </div>
        <Link
          to="/artesana/a2"
          className="inline-flex items-center gap-2 rounded-full border border-areia-escura/60 bg-white px-5 py-2.5 text-sm font-bold text-marrom transition hover:bg-bege"
        >
          Ver minha marca pública
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </header>

      {/* Resumo */}
      <section aria-label="Resumo da loja" className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-areia/70 bg-white/80 p-4 text-center shadow-sm"
          >
            <p className="font-display text-xl font-semibold text-terracota sm:text-2xl">{s.value}</p>
            <p className="mt-1 text-xs font-bold text-marrom/60">{s.label}</p>
          </div>
        ))}
      </section>

      <StitchDivider />

      {/* Atalhos */}
      <section aria-labelledby="atalhos-titulo">
        <SectionHeader title="Gerencie seu negócio" subtitle="Atalhos para as ferramentas da produtora" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SHORTCUTS.map((s) => (
            <li key={s.title}>
              <ShortcutCard {...s} />
            </li>
          ))}
        </ul>
      </section>

      <StitchDivider />

      {/* Pedidos recentes */}
      <section aria-labelledby="pedidos-titulo">
        <SectionHeader
          title="Pedidos recentes"
          subtitle={recentOrders.length === 0 ? 'Nenhum pedido ainda' : undefined}
          action={
            <Link to="/vender/pedidos" className="inline-flex items-center gap-1 text-sm font-bold text-terracota hover:underline">
              Ver todos <ArrowRight size={14} aria-hidden="true" />
            </Link>
          }
        />
        {recentOrders.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-6 text-center text-sm text-marrom/60">
            Assim que uma compradora finalizar um pedido, ele aparece aqui.
          </p>
        ) : (
          <ul className="space-y-3">
            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="font-display font-semibold text-marrom">Pedido {o.id}</p>
                  <p className="mt-0.5 text-sm text-marrom/60">
                    {o.buyerName} · {o.items.map((i) => i.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-terracota">{formatPrice(o.total)}</p>
                    <OrderStatusBadge status={o.status} />
                  </div>
                  <Link
                    to="/vender/pedidos"
                    className="grid h-9 w-9 place-items-center rounded-full border border-areia-escura/50 text-marrom transition hover:bg-bege"
                    aria-label={`Detalhes do pedido ${o.id}`}
                  >
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Chat / mensagens */}
      <section className="rounded-3xl border border-areia/70 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-bege text-terracota">
              <MessageSquareText size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-marrom">Mensagens de compradores</h2>
              <p className="text-sm text-marrom/60">3 conversas aguardando sua resposta</p>
            </div>
          </div>
          <Link
            to="/chat"
            className="rounded-full bg-terracota px-5 py-2.5 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
          >
            Abrir chat
          </Link>
        </div>
      </section>

      {/* Perfil público */}
      <section
        className="relative overflow-hidden rounded-3xl bg-marrom p-6 text-creme sm:p-8"
        aria-labelledby="marca-titulo"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 id="marca-titulo" className="font-display text-2xl font-semibold">
              Sua marca no Tramas
            </h2>
            <p className="mt-1 max-w-md text-sm text-creme/75">
              {artisan.brand} · {artisan.craft} · {artisan.location}
            </p>
            <p className="mt-1 text-sm font-semibold text-laranja-claro">
              ★ {artisan.rating.toFixed(1)} · {artisan.reviews} avaliações
            </p>
          </div>
          <img
            src={artisan.cover}
            alt={`Capa da marca ${artisan.brand}`}
            className="h-24 w-40 rounded-2xl object-cover sm:h-28 sm:w-48"
          />
        </div>
      </section>
    </div>
  );
}

function ShortcutCard({ title, description, icon: Icon, to, badge, accent }: Shortcut) {
  const content = (
    <>
      <span
        className={`grid h-10 w-10 place-items-center rounded-xl ${
          accent ?? 'bg-bege text-terracota'
        }`}
      >
        <Icon size={19} aria-hidden="true" />
      </span>
      <span className="mt-2.5 flex items-center gap-1.5">
        <span className="text-sm font-display font-semibold text-marrom">{title}</span>
        {badge && (
          <span className="rounded-full bg-laranja/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-terracota">
            {badge}
          </span>
        )}
      </span>
      <span className="mt-1 block text-sm leading-relaxed text-marrom/60">{description}</span>
    </>
  );

  const cls =
    'flex h-full flex-col rounded-2xl border border-areia/70 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md';

  if (to) {
    return (
      <Link to={to} className={cls}>
        {content}
      </Link>
    );
  }
  return <div className={cls}>{content}</div>;
}
