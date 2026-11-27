import { useMemo, useState } from 'react';
import { Banknote, Package, TrendingUp, Wallet as WalletIcon } from 'lucide-react';
import { formatPrice } from '../data/mock';
import { COMMISSION_STATUS_LABELS, SELLER_ID, useApp, ORDER_STATUS_LABELS } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

const brl = formatPrice;
const COST_RATIO = 0.55; // estimativa de custo de produção — demonstrativo

type Period = '30' | '90' | 'tudo';

export default function Wallet() {
  const { orders, products, commissions } = useApp();
  const [period, setPeriod] = useState<Period>('tudo');

  const sellerOrders = useMemo(() => orders.filter((o) => o.artisanId === SELLER_ID), [orders]);

  const stats = useMemo(() => {
    // base de corte relativa à venda mais recente (dados demonstrativos com datas futuras)
    const dates = sellerOrders.map((o) => o.createdAt).sort();
    const latest = dates[dates.length - 1] ? new Date(dates[dates.length - 1]) : new Date();
    const days = period === 'tudo' ? Infinity : Number(period);
    const cutoff = new Date(latest.getTime() - days * 86400000);

    const inPeriod = sellerOrders.filter((o) => new Date(o.createdAt) >= cutoff);
    const paid = inPeriod.filter((o) => o.status !== 'aguardando');
    const pending = inPeriod.filter((o) => o.status === 'aguardando');

    const revenue = paid.reduce((s, o) => s + o.total, 0);
    const pendingAmount = pending.reduce((s, o) => s + o.total, 0);
    const estCost = revenue * COST_RATIO;
    const profit = revenue - estCost;
    const count = paid.reduce((s, o) => s + o.items.reduce((a, i) => a + i.qty, 0), 0);
    const ticket = count > 0 ? revenue / count : 0;

    const pendingCommissions = commissions
      .filter((c) => c.artisanId === SELLER_ID && c.status === 'aguardando_aprovacao' && c.proposedPrice)
      .reduce((s, c) => s + (c.proposedPrice ?? 0), 0);

    // vendas por mês
    const byMonth = new Map<string, number>();
    inPeriod.forEach((o) => {
      if (o.status === 'aguardando') return;
      const key = o.createdAt.slice(0, 7);
      byMonth.set(key, (byMonth.get(key) ?? 0) + o.total);
    });
    const months = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b));
    const maxMonth = Math.max(1, ...months.map(([, v]) => v));

    // produtos mais vendidos
    const qty = new Map<string, { name: string; qty: number; revenue: number }>();
    inPeriod.forEach((o) => {
      if (o.status === 'aguardando') return;
      o.items.forEach((i) => {
        const cur = qty.get(i.productId) ?? { name: i.name, qty: 0, revenue: 0 };
        qty.set(i.productId, { name: i.name, qty: cur.qty + i.qty, revenue: cur.revenue + i.price * i.qty });
      });
    });
    const topProducts = [...qty.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // movimentações
    const movements = [
      ...sellerOrders.map((o) => ({
        id: o.id,
        label: `Pedido ${o.id} — ${o.items.map((i) => i.name).join(', ').slice(0, 40)}`,
        amount: o.total,
        kind: o.status === 'aguardando' ? 'a_receber' : 'venda',
        date: o.createdAt,
        status: ORDER_STATUS_LABELS[o.status],
      })),
      ...commissions
        .filter((c) => c.artisanId === SELLER_ID && c.proposedPrice)
        .map((c) => ({
          id: c.id,
          label: `Encomenda ${c.id} — ${c.productName ?? 'peça personalizada'}`,
          amount: c.proposedPrice ?? 0,
          kind: 'a_receber',
          date: c.createdAt,
          status: COMMISSION_STATUS_LABELS[c.status],
        })),
    ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 12);

    return { revenue, pendingAmount, pendingCommissions, estCost, profit, ticket, count, months, maxMonth, topProducts, movements, orderCount: paid.length };
  }, [sellerOrders, commissions, period]);

  const cards = [
    { icon: WalletIcon, label: 'Faturamento do período', value: brl(stats.revenue), sub: `${stats.orderCount} pedidos pagos` },
    { icon: Banknote, label: 'Saldo disponível (estimado)', value: brl(stats.revenue - stats.estCost), sub: 'após custos estimados' },
    { icon: TrendingUp, label: 'A receber', value: brl(stats.pendingAmount + stats.pendingCommissions), sub: 'pedidos aguardando + propostas' },
    { icon: Package, label: 'Ticket médio', value: brl(stats.ticket), sub: `${stats.count} peças vendidas` },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Minha carteira</h1>
          <p className="mt-1 text-sm text-marrom/60">Painel financeiro da {ARTISAN_BRAND} — demonstrativo, sem movimentação bancária real.</p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Filtrar por período">
          {([['30', '30 dias'], ['90', '90 dias'], ['tudo', 'Tudo']] as const).map(([k, lbl]) => (
            <button
              key={k}
              onClick={() => setPeriod(k)}
              aria-pressed={period === k}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${period === k ? 'bg-terracota text-creme' : 'bg-white/80 text-marrom/60 hover:bg-bege'}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </header>

      <p className="rounded-xl bg-laranja/15 px-4 py-2.5 text-xs font-bold text-terracota">
        Carteira demonstrativa: valores calculados a partir dos pedidos e encomendas do Tramas.
        Não há saques, transferências ou integração bancária nesta etapa.
      </p>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(({ icon: Icon, label, value, sub }) => (
          <li key={label} className="rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-bege text-terracota"><Icon size={17} aria-hidden="true" /></span>
            <p className="mt-2 text-xs font-bold text-marrom/50">{label}</p>
            <p className="font-display text-xl font-semibold text-marrom">{value}</p>
            <p className="text-[11px] text-marrom/45">{sub}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Faturamento por mês */}
        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="graf-mes">
          <SectionHeader title="Faturamento por mês" subtitle="Vendas confirmadas, sem pedidos aguardando" />
          {stats.months.length === 0 ? (
            <p className="py-6 text-center text-sm text-marrom/50">Sem vendas no período.</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.months.map(([month, value]) => (
                <li key={month} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 text-xs font-bold text-marrom/60">{month.split('-').reverse().join('/')}</span>
                  <span className="h-5 flex-1 overflow-hidden rounded-full bg-bege">
                    <span
                      className="block h-full rounded-full bg-terracota transition-all"
                      style={{ width: `${(value / stats.maxMonth) * 100}%` }}
                    />
                  </span>
                  <span className="w-20 shrink-0 text-right text-xs font-extrabold text-marrom">{brl(value)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Produtos mais vendidos */}
        <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="top-prod">
          <SectionHeader title="Produtos mais vendidos" subtitle="Por receita no período" />
          {stats.topProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-marrom/50">Sem vendas no período.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-laranja/20 text-xs font-extrabold text-terracota">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-marrom">{p.name}</span>
                    <span className="text-xs text-marrom/50">{p.qty} {p.qty === 1 ? 'peça' : 'peças'}</span>
                  </span>
                  <span className="text-sm font-extrabold text-marrom">{brl(p.revenue)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 rounded-lg bg-bege/70 px-3 py-2 text-xs text-marrom/60">
            Lucro estimado no período: <strong className="text-oliva">{brl(stats.profit)}</strong> (custo estimado em {Math.round(COST_RATIO * 100)}% da receita — refine no Assistente de precificação).
          </p>
        </section>
      </div>

      {/* Movimentações */}
      <section className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm" aria-labelledby="mov">
        <SectionHeader title="Histórico de movimentações" subtitle="Pedidos e encomendas da sua marca" />
        {stats.movements.length === 0 ? (
          <p className="py-4 text-center text-sm text-marrom/50">Nenhuma movimentação ainda.</p>
        ) : (
          <ul className="divide-y divide-areia/50">
            {stats.movements.map((m) => (
              <li key={m.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-marrom">{m.label}</p>
                  <p className="text-xs text-marrom/50">{m.date} · {m.status}</p>
                </div>
                <span className={`shrink-0 text-sm font-extrabold ${m.kind === 'a_receber' ? 'text-laranja' : 'text-oliva'}`}>
                  {m.kind === 'a_receber' ? '+' : ''}{brl(m.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <StitchDivider />
      <p className="text-center text-xs text-marrom/40">
        Produtos cadastrados: {products.filter((p) => p.artisanId === SELLER_ID && p.active !== false).length} ·
        Encomendas ativas: {commissions.filter((c) => c.artisanId === SELLER_ID && !['concluida', 'cancelada'].includes(c.status)).length}
      </p>
    </div>
  );
}

const ARTISAN_BRAND = 'Casa da Nega';
