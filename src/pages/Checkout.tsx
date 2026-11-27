import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Check, CreditCard, MapPin, Package } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { formatPrice } from '../data/mock';
import { StitchDivider } from '../components/Ornament';

const PAYMENTS = ['Pix', 'Cartão de crédito', 'Boleto'];
const CARD_BRANDS = [
  { id: 'visa', name: 'Visa', img: '/images/bandeiras/visa.svg' },
  { id: 'mastercard', name: 'Mastercard', img: '/images/bandeiras/mastercard.svg' },
  { id: 'elo', name: 'Elo', img: '/images/bandeiras/elo.svg' },
];

export default function Checkout() {
  const { cart, cartTotal, checkout, products } = useApp();
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState(PAYMENTS[0]);
  const [cardBrand, setCardBrand] = useState(CARD_BRANDS[0].id);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!buyerName.trim()) errs.name = 'Informe seu nome completo.';
    if (!address.trim()) errs.address = 'Informe o endereço de entrega.';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const order = checkout({ buyerName: buyerName.trim(), address: address.trim(), payment });
    setDone(true);
    setTimeout(() => navigate(`/pedidos?pedido=${order.id}`), 1600);
  };

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-marrom">Nada para finalizar</h1>
        <p className="mt-2 text-sm text-marrom/60">Sua sacola está vazia.</p>
        <Link
          to="/explorar"
          className="mt-4 inline-block rounded-full bg-terracota px-6 py-3 text-sm font-bold text-creme"
        >
          Explorar peças
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
        <CheckCircle2 size={56} className="text-oliva" aria-hidden="true" />
        <h1 className="font-display text-3xl font-semibold text-marrom">Pedido confirmado!</h1>
        <p className="text-sm text-marrom/70">
          Seu pedido foi enviado para a produtora. Acompanhe o status em Meus pedidos.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/sacola"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 transition hover:text-terracota"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar para a sacola
      </Link>
      <h1 className="mt-2 font-display text-3xl font-semibold text-marrom">Finalizar compra</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          {/* Coluna esquerda: Entrega + Pagamento */}
          <div className="space-y-6">
            <section
              className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm"
              aria-labelledby="entrega-titulo"
            >
              <h2
                id="entrega-titulo"
                className="flex items-center gap-2 font-display text-lg font-semibold text-marrom"
              >
                <MapPin size={18} className="text-terracota" aria-hidden="true" />
                Entrega
              </h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="nome" className="mb-1.5 block text-sm font-bold text-marrom">
                    Nome completo
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    autoComplete="name"
                    className="w-full rounded-xl border border-areia bg-creme px-4 py-2.5 text-sm font-semibold text-marrom focus:border-terracota"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'nome-erro' : undefined}
                  />
                  {errors.name && (
                    <p id="nome-erro" className="mt-1 text-xs font-semibold text-terracota">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="endereco" className="mb-1.5 block text-sm font-bold text-marrom">
                    Endereço de entrega
                  </label>
                  <textarea
                    id="endereco"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-areia bg-creme px-4 py-2.5 text-sm font-semibold text-marrom focus:border-terracota"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? 'endereco-erro' : undefined}
                  />
                  {errors.address && (
                    <p id="endereco-erro" className="mt-1 text-xs font-semibold text-terracota">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section
              className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm"
              aria-labelledby="pagamento-titulo"
            >
              <h2
                id="pagamento-titulo"
                className="flex items-center gap-2 font-display text-lg font-semibold text-marrom"
              >
                <CreditCard size={18} className="text-terracota" aria-hidden="true" />
                Pagamento
              </h2>
              <fieldset className="mt-4">
                <legend className="sr-only">Forma de pagamento</legend>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PAYMENTS.map((p) => (
                    <label
                      key={p}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
                        payment === p
                          ? 'border-terracota bg-bege text-terracota'
                          : 'border-areia/70 bg-creme text-marrom/70 hover:border-areia-escura'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pagamento"
                        value={p}
                        checked={payment === p}
                        onChange={() => setPayment(p)}
                        className="sr-only"
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </fieldset>
              {payment === 'Cartão de crédito' && (
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-marrom/50">
                    Escolha a bandeira do cartão
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Bandeira do cartão">
                    {CARD_BRANDS.map((b) => {
                      const active = cardBrand === b.id;
                      return (
                        <label
                          key={b.id}
                          className={`relative cursor-pointer rounded-xl border-2 p-1.5 transition focus-within:ring-2 focus-within:ring-terracota focus-within:ring-offset-2 ${
                            active
                              ? 'border-terracota bg-bege/60'
                              : 'border-areia/60 bg-creme hover:border-areia-escura'
                          }`}
                        >
                          <input
                            type="radio"
                            name="bandeira"
                            value={b.id}
                            checked={active}
                            onChange={() => setCardBrand(b.id)}
                            className="sr-only"
                            aria-label={`Bandeira ${b.name}`}
                          />
                          <img
                            src={b.img}
                            alt={`Logotipo ${b.name}`}
                            className="h-12 w-full rounded-lg object-contain"
                          />
                          <span className="mt-1 block text-center text-[11px] font-extrabold text-marrom/70">
                            {b.name}
                          </span>
                          {active && (
                            <span
                              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-terracota text-creme"
                              aria-hidden="true"
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-[11px] text-marrom/45">
                    Simulação: nenhuma cobrança ou dado de cartão é processado.
                  </p>
                </div>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-xs text-marrom/50">
                <Package size={13} aria-hidden="true" />
                Demonstração: nenhum pagamento real será cobrado nesta etapa.
              </p>
            </section>
          </div>

          {/* Coluna direita: Resumo do pedido */}
          <div>
            <section
              className="rounded-2xl border border-areia/70 bg-white/80 p-5 shadow-sm"
              aria-labelledby="resumo-titulo"
            >
              <h2 id="resumo-titulo" className="font-display text-lg font-semibold text-marrom">
                Resumo do pedido
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {cart.map((i) => {
                  const p = products.find((pr) => pr.id === i.productId);
                  if (!p) return null;
                  return (
                    <li key={i.productId} className="flex justify-between gap-3">
                      <span className="min-w-0 text-marrom/80">
                        <span className="block truncate">{p.name}</span>
                        <span className="font-bold">× {i.qty}</span>
                      </span>
                      <span className="shrink-0 font-semibold text-marrom">
                        {formatPrice(p.price * i.qty)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <StitchDivider />
              <p className="text-sm text-marrom/70">
                Pagamento:{' '}
                <span className="font-bold text-marrom">
                  {payment === 'Cartão de crédito'
                    ? `Cartão de crédito · ${CARD_BRANDS.find((b) => b.id === cardBrand)?.name} (simulação)`
                    : `${payment} (simulação)`}
                </span>
              </p>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-display font-semibold text-marrom">Total</span>
                <span className="font-display text-xl font-bold text-terracota">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-full bg-terracota px-6 py-4 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
              >
                Confirmar pedido · {formatPrice(cartTotal)}
              </button>
              <p className="mt-2 text-center text-[11px] text-marrom/45">
                Pagamento e entrega simulados — nenhum dado real é cobrado.
              </p>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}
