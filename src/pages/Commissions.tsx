import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, PackagePlus, X } from 'lucide-react';
import { ARTISANS, formatPrice } from '../data/mock';
import { COMMISSION_STATUS_LABELS, SELLER_ID, useApp, type Commission } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

function statusColor(status: Commission['status']) {
  if (status === 'concluida') return 'bg-oliva/15 text-oliva';
  if (status === 'cancelada') return 'bg-marrom/10 text-marrom/50';
  if (status === 'aguardando_aprovacao' || status === 'proposta') return 'bg-laranja/20 text-terracota';
  return 'bg-bege text-marrom/70';
}

function CommissionCard({ c, sellerView }: { c: Commission; sellerView: boolean }) {
  const { advanceCommission, sendCommissionProposal, approveCommission, cancelCommission } = useApp();
  const [price, setPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const artisan = ARTISANS.find((a) => a.id === c.artisanId);

  const nextLabel =
    c.status === 'solicitacao' ? 'Marcar em análise' :
    c.status === 'em_analise' ? 'Enviar proposta' :
    c.status === 'aprovada' ? 'Iniciar produção' :
    c.status === 'em_producao' ? 'Marcar pronta p/ envio' :
    c.status === 'pronta_envio' ? 'Marcar como enviada' :
    c.status === 'enviada' ? 'Concluir encomenda' : null;

  const canAdvance = sellerView && nextLabel && c.status !== 'cancelada' && c.status !== 'concluida' &&
    !(c.status === 'em_analise' && false);

  return (
    <li className="rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-display text-base font-semibold text-marrom">
            {c.productName ?? 'Peça personalizada'}
          </p>
          <p className="text-xs text-marrom/50">
            {c.id} · {c.createdAt}
            {sellerView ? ` · ${c.buyerName}` : artisan ? ` · ${artisan.brand}` : ''}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${statusColor(c.status)}`}>
          {COMMISSION_STATUS_LABELS[c.status]}
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-marrom/75">{c.description}</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-marrom/60 sm:grid-cols-4">
        {c.colors && <div><dt className="font-bold">Cores</dt><dd>{c.colors}</dd></div>}
        {c.dimensions && <div><dt className="font-bold">Dimensões</dt><dd>{c.dimensions}</dd></div>}
        <div><dt className="font-bold">Quantidade</dt><dd>{c.quantity}</dd></div>
        {c.deadline && <div><dt className="font-bold">Prazo desejado</dt><dd>{c.deadline}</dd></div>}
        {c.budget && <div><dt className="font-bold">Orçamento</dt><dd>{c.budget}</dd></div>}
        {c.customizations && <div className="col-span-2"><dt className="font-bold">Personalização</dt><dd>{c.customizations}</dd></div>}
      </dl>

      {c.proposedPrice != null && (
        <p className="mt-3 rounded-xl bg-laranja/15 px-3 py-2 text-sm font-bold text-terracota">
          Proposta da artesã: {formatPrice(c.proposedPrice)}
          {c.proposedDeadline ? ` · prazo: ${c.proposedDeadline}` : ''}
        </p>
      )}
      {c.referenceImage && (
        <img src={c.referenceImage} alt="Referência da encomenda" className="mt-3 h-20 w-20 rounded-xl object-cover" />
      )}

      {/* Ações */}
      <div className="mt-4 flex flex-wrap gap-2">
        {!sellerView && c.status === 'aguardando_aprovacao' && c.proposedPrice != null && (
          <>
            <button
              type="button"
              onClick={() => approveCommission(c.id)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-oliva px-4 py-2 text-xs font-extrabold text-creme hover:opacity-90"
            >
              <Check size={14} aria-hidden="true" /> Aprovar proposta
            </button>
            <button
              type="button"
              onClick={() => cancelCommission(c.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-areia-escura/50 px-4 py-2 text-xs font-bold text-marrom/70 hover:border-terracota hover:text-terracota"
            >
              <X size={14} aria-hidden="true" /> Recusar
            </button>
          </>
        )}
        {!sellerView && ['solicitacao', 'em_analise', 'proposta'].includes(c.status) && (
          <button
            type="button"
            onClick={() => cancelCommission(c.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-areia-escura/50 px-4 py-2 text-xs font-bold text-marrom/60 hover:border-terracota hover:text-terracota"
          >
            <X size={14} aria-hidden="true" /> Cancelar solicitação
          </button>
        )}

        {sellerView && c.status === 'em_analise' && (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const p = parseFloat(price.replace(',', '.'));
              if (!p || p <= 0) return;
              sendCommissionProposal(c.id, p, deadline);
            }}
          >
            <label className="text-xs font-bold text-marrom/60">
              Preço proposto (R$)
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="0,00"
                className="mt-1 block w-28 rounded-lg border border-areia-escura/50 px-2.5 py-1.5 text-sm"
                required
              />
            </label>
            <label className="text-xs font-bold text-marrom/60">
              Prazo
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="mt-1 block rounded-lg border border-areia-escura/50 px-2.5 py-1.5 text-sm"
                required
              />
            </label>
            <button type="submit" className="rounded-xl bg-terracota px-4 py-2 text-xs font-extrabold text-creme hover:bg-terracota-escura">
              Enviar proposta
            </button>
          </form>
        )}

        {sellerView && canAdvance && c.status !== 'em_analise' && (
          <button
            type="button"
            onClick={() => advanceCommission(c.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-terracota px-4 py-2 text-xs font-extrabold text-creme hover:bg-terracota-escura"
          >
            <PackagePlus size={14} aria-hidden="true" /> {nextLabel}
          </button>
        )}
        {sellerView && c.status === 'solicitacao' && (
          <button
            type="button"
            onClick={() => advanceCommission(c.id)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-terracota px-4 py-2 text-xs font-extrabold text-creme hover:bg-terracota-escura"
          >
            <PackagePlus size={14} aria-hidden="true" /> Marcar em análise
          </button>
        )}
        {sellerView && !['cancelada', 'concluida'].includes(c.status) && (
          <button
            type="button"
            onClick={() => cancelCommission(c.id)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-areia-escura/50 px-4 py-2 text-xs font-bold text-marrom/60 hover:border-terracota hover:text-terracota"
          >
            <X size={14} aria-hidden="true" /> Recusar encomenda
          </button>
        )}
        {!sellerView && artisan && (
          <Link to={`/artesana/${artisan.id}`} className="text-xs font-bold text-terracota hover:underline">
            Ver perfil da artesã
          </Link>
        )}
      </div>
    </li>
  );
}

export function CommissionsList({ sellerView = false }: { sellerView?: boolean }) {
  const { commissions } = useApp();
  // visão da compradora: todas as solicitações (demonstração de usuário único)
  const list = sellerView ? commissions.filter((c) => c.artisanId === SELLER_ID) : commissions;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={sellerView ? 'Encomendas recebidas' : 'Minhas encomendas'}
        subtitle={sellerView
          ? 'Propostas de preço, prazos e andamento da produção.'
          : 'Acompanhe solicitações, propostas e produção das suas peças únicas.'}
      />
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-areia-escura/40 bg-white/60 p-8 text-center">
          <p className="text-sm text-marrom/60">
            {sellerView
              ? 'Nenhuma encomenda ainda. Compartilhe seu perfil para receber solicitações.'
              : 'Você ainda não pediu nenhuma encomenda. Que tal criar a sua primeira peça sob medida?'}
          </p>
          {!sellerView && (
            <Link to="/explorar" className="mt-3 inline-block text-sm font-bold text-terracota hover:underline">
              Explorar artesãs
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {list.map((c) => <CommissionCard key={c.id} c={c} sellerView={sellerView} />)}
        </ul>
      )}
      <StitchDivider />
    </div>
  );
}

export default function Commissions() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-semibold text-marrom">Encomendas</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Peças personalizadas feitas sob medida, direto com a artesã.
        </p>
      </header>
      <CommissionsList />
      <div className="text-center">
        <Link
          to="/encomenda/nova"
          className="inline-flex items-center gap-2 rounded-2xl bg-terracota px-6 py-3 text-sm font-extrabold text-creme transition hover:bg-terracota-escura"
        >
          <PackagePlus size={16} aria-hidden="true" />
          Nova encomenda
        </Link>
      </div>
    </div>
  );
}
