import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Package, Send } from 'lucide-react';
import { SELLER_ID, getArtisan, useApp, type Conversation } from '../store/AppContext';
import { NotFoundLink } from './NotFound';

function timeLabel(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function ConversationList({ conversations, activeId, sellerView }: { conversations: Conversation[]; activeId?: string; sellerView?: boolean }) {
  if (conversations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-areia-escura/40 bg-white/60 p-8 text-center">
        <MessageCircle size={28} className="mx-auto text-marrom/30" aria-hidden="true" />
        <p className="mt-2 text-sm text-marrom/60">
          {sellerView
            ? 'Nenhuma conversa ainda. Quando uma compradora chamar, ela aparece aqui.'
            : 'Nenhuma conversa ainda. Toque em "Conversar" no perfil de uma artesã para começar.'}
        </p>
        {!sellerView && (
          <Link to="/explorar" className="mt-3 inline-block text-sm font-bold text-terracota hover:underline">
            Explorar artesãs
          </Link>
        )}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {conversations.map((c) => {
        const artisan = getArtisan(c.artisanId);
        const last = c.messages[c.messages.length - 1];
        return (
          <li key={c.id}>
            <Link
              to={sellerView ? `/chat/${c.id}?visao=produtora` : `/chat/${c.id}`}
              className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                c.id === activeId ? 'border-terracota bg-terracota/5' : 'border-areia/60 bg-white/80 hover:border-areia-escura'
              }`}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bege font-display text-sm font-bold text-terracota">
                {artisan?.initials ?? '??'}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-bold text-marrom">
                    {sellerView ? c.buyerName : artisan?.brand ?? artisan?.name}
                  </span>
                  {last && <span className="shrink-0 text-[11px] text-marrom/40">{timeLabel(last.createdAt)}</span>}
                </span>
                <span className="block truncate text-xs text-marrom/60">
                  {last ? last.text : c.productName ? `Sobre: ${c.productName}` : 'Conversa iniciada'}
                </span>
              </span>
              {c.unread > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-terracota px-1.5 text-[10px] font-extrabold text-creme">
                  {c.unread}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function Thread({ conversationId, asSeller }: { conversationId: string; asSeller: boolean }) {
  const { conversations, sendChatMessage, markConversationRead, currentUser } = useApp();
  const conv = conversations.find((c) => c.id === conversationId);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const artisan = conv ? getArtisan(conv.artisanId) : undefined;

  useEffect(() => {
    markConversationRead(conversationId);
    bottomRef.current?.scrollIntoView({ block: 'end' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, conv?.messages.length]);

  if (!conv) return <NotFoundLink />;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    sendChatMessage(conversationId, asSeller ? 'produtora' : 'comprador', t);
    setText('');
  };

  return (
    <div className="flex h-[calc(100dvh-13rem)] min-h-[24rem] flex-col overflow-hidden rounded-2xl border border-areia/70 bg-white/80 shadow-sm">
      <header className="flex items-center gap-3 border-b border-areia/60 bg-creme/80 px-4 py-3">
        <Link to="/chat" className="rounded-lg p-1.5 text-marrom/60 hover:bg-bege hover:text-marrom" aria-label="Voltar para conversas">
          <ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-bege font-display text-xs font-bold text-terracota">
          {asSeller ? conv.buyerName.slice(0, 2).toUpperCase() : artisan?.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-marrom">
            {asSeller ? conv.buyerName : artisan?.brand ?? 'Artesã'}
          </p>
          <p className="truncate text-xs text-marrom/50">
            {conv.productName ? `Peça: ${conv.productName}` : 'Conversa direta'} · demonstração, sem tempo real
          </p>
        </div>
        {conv.productId && (
          <Link
            to={`/produtos/${conv.productId}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-bege px-3 py-1.5 text-xs font-bold text-terracota hover:bg-areia/40"
          >
            <Package size={12} aria-hidden="true" />
            Ver peça
          </Link>
        )}
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto bg-creme/40 p-4" role="log" aria-label="Mensagens">
        {conv.messages.length === 0 && (
          <p className="py-8 text-center text-sm text-marrom/50">
            {asSeller
              ? 'Nenhuma mensagem ainda. Diga olá para a compradora!'
              : `Diga olá para ${artisan?.name ?? 'a artesã'}! Ela responde pelo chat do Tramas.`}
          </p>
        )}
        {conv.messages.map((m) => {
          const mine = asSeller ? m.from === 'produtora' : m.from === 'comprador';
          return (
            <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.from === 'sistema'
                    ? 'bg-laranja/15 text-center text-xs text-marrom/70'
                    : mine
                      ? 'rounded-br-md bg-terracota text-creme'
                      : 'rounded-bl-md bg-white text-marrom'
                }`}
              >
                {m.from === 'sistema' ? m.text : <p>{m.text}</p>}
                <p className={`mt-1 text-[10px] ${mine ? 'text-creme/60' : 'text-marrom/40'}`}>{timeLabel(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex items-center gap-2 border-t border-areia/60 bg-white p-3"
        onSubmit={(e) => { e.preventDefault(); send(); }}
      >
        <label htmlFor="msg-input" className="sr-only">Escrever mensagem</label>
        <input
          id="msg-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={asSeller ? 'Responder à compradora…' : 'Escrever mensagem…'}
          className="flex-1 rounded-full border border-areia-escura/40 bg-creme px-4 py-2.5 text-sm text-marrom outline-none focus:border-terracota"
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Enviar mensagem"
          className="grid h-10 w-10 place-items-center rounded-full bg-terracota text-creme transition hover:bg-terracota-escura disabled:opacity-40"
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
      {currentUser && <span className="sr-only">Logada como {currentUser.name}</span>}
    </div>
  );
}

export default function Chat({ sellerView = false }: { sellerView?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { conversations } = useApp();
  const asSeller = sellerView;

  const sellerConvs = conversations.filter((c) => c.artisanId === SELLER_ID);
  const buyerConvs = conversations.filter((c) => c.artisanId !== SELLER_ID);
  const list = asSeller ? sellerConvs : buyerConvs;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl font-semibold text-marrom">Mensagens</h1>
        <p className="mt-1 text-sm text-marrom/60">
          {asSeller
            ? 'Conversas com compradoras das suas peças. Demonstração: sem tempo real — as respostas aparecem ao enviar.'
            : 'Fale direto com as artesãs. Demonstração: as respostas da produtora são feitas pela área dela.'}
        </p>
      </header>

      <div className={`grid gap-5 ${id ? 'lg:grid-cols-[20rem_1fr]' : ''}`}>
        <div className={id ? 'hidden lg:block' : ''}>
          <ConversationList conversations={list} activeId={id} sellerView={asSeller} />
          {asSeller && sellerConvs.length === 0 && (
            <p className="mt-3 text-center text-xs text-marrom/40">Dica: uma compradora pode iniciar pelo perfil de uma artesã.</p>
          )}
        </div>
        <div>
          {id ? (
            <Thread conversationId={id} asSeller={asSeller} />
          ) : (
            <div className="hidden rounded-2xl border border-dashed border-areia-escura/40 p-10 text-center text-sm text-marrom/50 lg:block">
              Selecione uma conversa ao lado para ler e responder.
            </div>
          )}
        </div>
      </div>
      {/* mobile: lista de conversas quando não há thread */}
      {id && (
        <Link to="/chat" className="inline-flex items-center gap-1.5 text-sm font-bold text-terracota lg:hidden">
          <ArrowLeft size={15} aria-hidden="true" /> Todas as conversas
        </Link>
      )}
    </div>
  );
}
