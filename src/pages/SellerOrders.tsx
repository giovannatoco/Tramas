import { useState } from 'react';
import { useApp, SELLER_ID, ORDER_STATUS_LABELS, type OrderStatus } from '../store/AppContext';
import { getArtisan } from '../store/AppContext';
import { formatPrice } from '../data/mock';
import { OrderProgress, OrderStatusBadge } from '../components/OrderBits';
import { StitchDivider } from '../components/Ornament';

export default function SellerOrders() {
  const { orders, advanceOrderStatus } = useApp();
  const seller = getArtisan(SELLER_ID);
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'entregues'>('ativos');

  const mine = orders.filter((o) => o.artisanId === SELLER_ID);
  const filtered = mine.filter((o) =>
    filter === 'todos' ? true : filter === 'entregues' ? o.status === 'entregue' : o.status !== 'entregue',
  );

  const nextStatus = (s: OrderStatus): OrderStatus | null => {
    const flow: OrderStatus[] = ['aguardando', 'confirmado', 'em_producao', 'enviado', 'entregue'];
    const idx = flow.indexOf(s);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Meus pedidos</h1>
          <p className="mt-1 text-sm text-marrom/60">
            Gerencie encomendas e avance o status de cada pedido.
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Filtrar pedidos">
          {(
            [
              ['ativos', 'Ativos'],
              ['entregues', 'Entregues'],
              ['todos', 'Todos'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                filter === key ? 'bg-marrom text-creme' : 'bg-white text-marrom/70 hover:bg-bege'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-10 text-center">
          <p className="font-display text-lg font-semibold text-marrom">Nenhum pedido por aqui</p>
          <p className="mt-1 text-sm text-marrom/60">
            Quando uma compradora finalizar uma compra das suas peças, o pedido aparece nesta lista.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => {
            const next = nextStatus(order.status);
            return (
              <li
                key={order.id}
                className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-marrom">
                      Pedido {order.id}
                    </p>
                    <p className="text-sm text-marrom/60">
                      {order.buyerName} · {order.createdAt}
                    </p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} />
                    <p className="mt-1 font-display text-lg font-bold text-terracota">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <OrderProgress status={order.status} />
                  <p className="mt-1.5 text-xs font-semibold text-marrom/50">
                    {ORDER_STATUS_LABELS[order.status]}
                  </p>
                </div>

                <ul className="mt-4 space-y-2 border-t border-areia/50 pt-4">
                  {order.items.map((item) => (
                    <li key={item.productId} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-marrom">{item.name}</p>
                        <p className="text-xs text-marrom/50">Quantidade: {item.qty}</p>
                      </div>
                      <span className="text-sm font-bold text-marrom">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-areia/50 pt-4">
                  <p className="text-xs text-marrom/50">
                    Entrega em {order.address} · Pagamento: {order.payment}
                  </p>
                  {next && (
                    <button
                      type="button"
                      onClick={() => advanceOrderStatus(order.id)}
                      className="rounded-full bg-terracota px-5 py-2 text-sm font-bold text-creme transition hover:bg-terracota-escuro"
                    >
                      Marcar como {ORDER_STATUS_LABELS[next].toLowerCase()}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <StitchDivider />
      <p className="text-center text-xs text-marrom/50">
        {seller?.brand}: atualizações de status são visíveis para a compradora em tempo real.
      </p>
    </div>
  );
}
