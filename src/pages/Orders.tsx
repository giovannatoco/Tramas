import { useSearchParams } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useApp, getArtisan, ORDER_STATUS_LABELS } from '../store/AppContext';
import { formatPrice } from '../data/mock';
import { OrderProgress, OrderStatusBadge } from '../components/OrderBits';
import { StitchDivider } from '../components/Ornament';

export default function Orders() {
  const { orders } = useApp();
  const [params] = useSearchParams();
  const highlightId = params.get('pedido');

  const displayOrders = [...orders].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-marrom">Meus pedidos</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Acompanhe cada encomenda desde a confirmação até a entrega.
        </p>
      </div>

      {displayOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-areia-escura bg-white/60 p-10 text-center">
          <Package size={36} className="mx-auto text-marrom/40" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-semibold text-marrom">Nenhum pedido ainda</p>
          <p className="mt-1 text-sm text-marrom/60">
            Quando você finalizar uma compra, o pedido aparece aqui.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {displayOrders.map((order) => {
            const artisan = getArtisan(order.artisanId);
            return (
              <li
                key={order.id}
                id={`pedido-${order.id}`}
                className={`rounded-2xl border bg-white/80 p-5 shadow-sm ${
                  order.id === highlightId ? 'border-terracota ring-2 ring-terracota/30' : 'border-areia/70'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-marrom">Pedido {order.id}</p>
                    <p className="text-sm text-marrom/60">
                      {order.createdAt} · {artisan?.brand ?? 'Produtora'}
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
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

                <p className="mt-3 text-xs text-marrom/50">
                  Pagamento: {order.payment} · Entrega em {order.address}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      <StitchDivider />
      <p className="text-center text-xs text-marrom/50">
        Novidades do pedido (confirmacão, envio, código de rastreio) aparecerão aqui e nas notificações.
      </p>
    </div>
  );
}
