import type { OrderStatus } from '../store/AppContext';
import { ORDER_STATUS_LABELS } from '../store/AppContext';

const COLORS: Record<OrderStatus, string> = {
  aguardando: 'bg-laranja/20 text-terracota',
  confirmado: 'bg-oliva/15 text-oliva',
  em_producao: 'bg-laranja/20 text-terracota',
  enviado: 'bg-areia text-marrom',
  entregue: 'bg-oliva text-creme',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-extrabold ${COLORS[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

const FLOW_ORDER: OrderStatus[] = ['aguardando', 'confirmado', 'em_producao', 'enviado', 'entregue'];

export function OrderProgress({ status }: { status: OrderStatus }) {
  const current = FLOW_ORDER.indexOf(status);
  return (
    <ol className="flex items-center gap-1" aria-label={`Status do pedido: ${ORDER_STATUS_LABELS[status]}`}>
      {FLOW_ORDER.map((s, i) => (
        <li
          key={s}
          className={`h-1.5 flex-1 rounded-full ${i <= current ? 'bg-terracota' : 'bg-areia'}`}
          aria-hidden="true"
        />
      ))}
    </ol>
  );
}
