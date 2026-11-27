import { useMemo, useState } from 'react';
import { CalendarDays, MapPin, Store } from 'lucide-react';
import { ARTISANS, FAIRS, REGIONS } from '../data/mock';
import { useApp } from '../store/AppContext';
import { FairCard } from '../components/FairCard';
import { SectionHeader } from '../components/SectionHeader';
import { StitchDivider } from '../components/Ornament';

export default function Fairs() {
  const { reservedFairIds, reserveFair } = useApp();
  const [region, setRegion] = useState<string>('Todas');
  const [view, setView] = useState<'comprador' | 'produtora'>('comprador');

  const fairs = useMemo(
    () => (region === 'Todas' ? FAIRS : FAIRS.filter((f) => f.region === region)),
    [region],
  );

  const sellerFairs = useMemo(
    () => fairs.filter((f) => f.region === 'Sudeste' || f.distanceKm < 300),
    [fairs],
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-marrom">Feiras e eventos</h1>
          <p className="mt-1 text-sm text-marrom/60">
            Eventos artesanais demonstrativos — datas e locais são fictícios para o MVP.
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Visão">
          {([['comprador', 'Quero comprar'], ['produtora', 'Sou produtora']] as const).map(([k, lbl]) => (
            <button
              key={k}
              onClick={() => setView(k)}
              aria-pressed={view === k}
              className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${view === k ? 'bg-terracota text-creme' : 'bg-white/80 text-marrom/60 hover:bg-bege'}`}
            >
              {lbl}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por região">
        {['Todas', ...REGIONS].map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            aria-pressed={region === r}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
              region === r ? 'border-terracota bg-terracota text-creme' : 'border-areia-escura/40 bg-white/70 text-marrom/60 hover:border-terracota'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {view === 'comprador' ? (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {fairs.map((f) => {
              const reserved = reservedFairIds.includes(f.id);
              const nearbyArtisans = ARTISANS.filter((a) => a.region === f.region).slice(0, 3);
              return (
                <li key={f.id} className="flex flex-col">
                  <FairCard fair={f} />
                  {nearbyArtisans.length > 0 && (
                    <p className="mt-2 px-1 text-xs text-marrom/55">
                      Produtoras da região: {nearbyArtisans.map((a) => a.brand).join(', ')}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => reserveFair(f.id)}
                    disabled={reserved}
                    className={`mt-2 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      reserved
                        ? 'bg-oliva/15 text-oliva'
                        : 'bg-terracota text-creme hover:bg-terracota-escura'
                    }`}
                  >
                    <Store size={14} aria-hidden="true" />
                    {reserved ? 'Reserva demonstrativa feita' : 'Reservar produto p/ retirada'}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="text-center text-xs text-marrom/45">
            A reserva é demonstrativa: em breve você poderá escolher a peça exata e o estande da produtora.
          </p>
        </>
      ) : (
        <div className="space-y-6">
          <SectionHeader title="Feiras perto de você" subtitle="Eventos na sua região e no Nordeste" />
          <ul className="grid gap-4 sm:grid-cols-2">
            {sellerFairs.map((f) => (
              <li key={f.id} className="flex items-start gap-4 rounded-2xl border border-areia/70 bg-white/80 p-4 shadow-sm">
                <img src={f.image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-marrom">{f.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-marrom/55">
                    <MapPin size={11} aria-hidden="true" /> {f.city}/{f.state} · {f.distanceKm} km
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-marrom/55">
                    <CalendarDays size={11} aria-hidden="true" /> {f.date}
                  </p>
                  <button
                    type="button"
                    className="mt-2 rounded-lg bg-laranja/20 px-3 py-1.5 text-xs font-extrabold text-terracota transition hover:bg-laranja/30"
                  >
                    Solicitar participação (demonstração)
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-areia/70 bg-bege/60 p-5 text-sm text-marrom/70">
            <p className="font-bold text-marrom">Divulgue sua presença</p>
            <p className="mt-1">
              Quando participar de uma feira, publique no feed com a foto do estande e marque os produtos
              disponíveis para retirada presencial — os compradores verão a publicação e poderão reservar.
            </p>
            <LinkFeiras />
          </div>
        </div>
      )}

      <StitchDivider />
    </div>
  );
}

function LinkFeiras() {
  return (
    <a href="/criar" className="mt-2 inline-block text-sm font-bold text-terracota hover:underline">
      Publicar no feed
    </a>
  );
}
