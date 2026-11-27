import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, MapPin, RotateCcw, Store } from 'lucide-react';
import { FAIRS, USER_LOCATION } from '../data/mock';
import { useApp } from '../store/AppContext';
import { SectionHeader } from '../components/SectionHeader';

// Leaflet carregado via CDN em index.html (sem dependência npm)
declare global {
  interface Window {
    L?: any;
  }
}

const CAMPINAS: [number, number] = [-22.9056, -47.0608];

function pinIcon(active: boolean) {
  const L = window.L;
  return L.divIcon({
    className: '',
    html: `<span style="display:block;width:${active ? 18 : 14}px;height:${active ? 18 : 14}px;border-radius:9999px;border:3px solid #fff;background:${active ? '#a33d18' : '#e99b32'};box-shadow:0 2px 6px rgba(0,0,0,.35);${active ? 'outline:3px solid rgba(163,61,24,.35);outline-offset:2px;' : ''}"></span>`,
    iconSize: [active ? 18 : 14, active ? 18 : 14],
    iconAnchor: [active ? 9 : 7, active ? 9 : 7],
  });
}

export default function FairsMap() {
  const { reservedFairIds, reserveFair } = useApp();
  const [selected, setSelected] = useState<string | null>('f1');
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const selectedRef = useRef(selected);
  useEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  // Demo focada em Campinas: apenas feiras da cidade
  const fairs = useMemo(
    () => FAIRS.filter((f) => f.city === 'Campinas' && f.state === 'SP'),
    [],
  );

  const current = fairs.find((f) => f.id === selected) ?? fairs[0];

  // Inicializa o mapa uma vez (e a cada "tentar novamente")
  useEffect(() => {
    if (!mapEl.current || !window.L) {
      setMapError(true);
      return;
    }
    setMapError(false);
    const L = window.L;
    const map = L.map(mapEl.current, {
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView(CAMPINAS, 12);
    mapRef.current = map;

    // Safari/containers com tamanho assíncrono: recalcula após o layout
    const raf = requestAnimationFrame(() => map.invalidateSize());
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });
    tiles.on('tileerror', () => setMapError(true));
    tiles.addTo(map);
    setMapReady(true);

    const markers = markersRef.current;
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      map.remove();
      markers.clear();
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapKey]);

  // Atualiza marcadores quando a lista filtrada muda
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!map || !L || !mapReady) return;

    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current.clear();

    fairs.forEach((f) => {
      if (f.lat == null || f.lng == null) return;
      const active = selectedRef.current === f.id;
      const marker = L.marker([f.lat, f.lng], { icon: pinIcon(active) })
        .addTo(map)
        .bindPopup(`<strong>${f.name}</strong><br/>${f.city}/${f.state}`);
      marker.on('click', () => {
        setSelected(f.id);
        map.setView([f.lat!, f.lng!], Math.max(map.getZoom(), 12), { animate: true });
        marker.openPopup();
      });
      markersRef.current.set(f.id, marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fairs, mapReady]);

  // Centraliza e destaca o selecionado
  const currentId = current?.id;
  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    const f = fairs.find((x) => x.id === currentId);
    if (!map || !L || !mapReady || !f) return;
    const marker = markersRef.current.get(f.id);
    if (marker && f.lat != null && f.lng != null) {
      map.flyTo([f.lat, f.lng], Math.max(map.getZoom(), 12), { duration: 0.6 });
      marker.setIcon(pinIcon(true));
      marker.openPopup();
    }
    markersRef.current.forEach((m, id) => {
      if (id !== f.id) {
        m.setIcon(pinIcon(false));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, mapReady]);

  return (
    <div className="space-y-6 pb-4">
      <header>
        <h1 className="font-display text-3xl font-semibold text-marrom">Mapa de feiras</h1>
        <p className="mt-1 text-sm text-marrom/60">
          Feiras artesanais em {USER_LOCATION.city}/{USER_LOCATION.state}.
        </p>
      </header>

      <p className="rounded-xl border border-laranja/40 bg-laranja/10 px-4 py-2.5 text-xs font-bold leading-relaxed text-terracota">
        Eventos demonstrativos fictícios. Pinos posicionados por latitude/longitude aproximada da cidade —
        endereços exatos não confirmados.
      </p>

      {fairs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-areia-escura/40 bg-white/60 p-10 text-center">
          <MapPin size={28} className="mx-auto text-marrom/30" aria-hidden="true" />
          <p className="mt-2 font-display text-lg font-semibold text-marrom">Nenhuma feira em Campinas</p>
          <p className="mt-1 text-sm text-marrom/60">
            Ainda não há eventos cadastrados na cidade. Novas feiras da região aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* Mapa geográfico */}
          <div className="relative">
            <div
              ref={mapEl}
              className="h-[22rem] w-full overflow-hidden rounded-3xl border border-areia/70 shadow-sm sm:h-[26rem]"
              role="application"
              aria-label="Mapa de feiras artesanais"
            />
            {mapError && (
              <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-3 rounded-3xl bg-creme/95 p-6 text-center">
                <MapPin size={30} className="text-marrom/40" aria-hidden="true" />
                <p className="text-sm font-bold text-marrom">Não foi possível carregar o mapa</p>
                <p className="max-w-xs text-xs text-marrom/60">
                  Verifique sua conexão — os tiles do OpenStreetMap precisam de internet. A lista de eventos continua acessível ao lado.
                </p>
                <button
                  type="button"
                  onClick={() => { setMapError(false); setMapKey((k) => k + 1); }}
                  className="inline-flex items-center gap-2 rounded-full bg-terracota px-5 py-2.5 text-sm font-extrabold text-creme transition hover:bg-terracota-escura"
                >
                  <RotateCcw size={14} aria-hidden="true" />
                  Tentar novamente
                </button>
              </div>
            )}
          </div>

          {/* Lista + detalhes */}
          <div className="space-y-3">
            <SectionHeader title="Eventos" subtitle={`${fairs.length} ${fairs.length === 1 ? 'evento' : 'eventos'} — mais perto primeiro`} />
            <ul className="space-y-2">
              {fairs.map((f) => {
                const active = current?.id === f.id;
                const reserved = reservedFairIds.includes(f.id);
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(f.id)}
                      aria-pressed={active}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition ${
                        active ? 'border-terracota bg-terracota/5 shadow-sm' : 'border-areia/70 bg-white/80 hover:border-areia-escura'
                      }`}
                    >
                      <img src={f.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-sm font-semibold text-marrom">{f.name}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-marrom/55">
                          <MapPin size={11} aria-hidden="true" /> {f.city}/{f.state}
                          {f.distanceKm === 0 ? ' · na sua cidade' : ` · ~${f.distanceKm} km (simulado)`}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-marrom/55">
                          <CalendarDays size={11} aria-hidden="true" /> {f.date}
                        </span>
                        {reserved && (
                          <span className="mt-1 inline-block rounded-full bg-oliva/15 px-2 py-0.5 text-[10px] font-extrabold text-oliva">
                            Reserva simulada feita
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Detalhes da feira selecionada */}
            {current && (
              <article className="overflow-hidden rounded-2xl border border-areia/70 bg-white shadow-sm" aria-label={`Detalhes de ${current.name}`}>
                <img src={current.image} alt={`Foto da ${current.name}`} className="h-36 w-full object-cover" />
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-base font-semibold text-marrom">{current.name}</p>
                    {current.demo && (
                      <span className="rounded-full bg-laranja/15 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-terracota">
                        Evento fictício
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-marrom/55">
                    <MapPin size={12} className="text-terracota" aria-hidden="true" />
                    {current.city}/{current.state} · {current.region}
                    {current.distanceKm > 0 && ` · ~${current.distanceKm} km (distância simulada)`}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-marrom/55">
                    <CalendarDays size={12} className="text-terracota" aria-hidden="true" />
                    {current.date}
                  </p>
                  {current.coordsApprox && (
                    <p className="mt-1.5 rounded-lg bg-bege/70 px-2.5 py-1.5 text-[11px] font-semibold text-marrom/60">
                      📍 Posição aproximada da cidade — endereço exato do evento não confirmado (demonstração).
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-marrom/65">{current.description}</p>
                  <button
                    type="button"
                    onClick={() => reserveFair(current.id)}
                    disabled={reservedFairIds.includes(current.id)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition ${
                      reservedFairIds.includes(current.id)
                        ? 'bg-oliva/15 text-oliva'
                        : 'bg-terracota text-creme hover:bg-terracota-escura'
                    }`}
                  >
                    <Store size={14} aria-hidden="true" />
                    {reservedFairIds.includes(current.id)
                      ? 'Reserva simulada confirmada'
                      : 'Reservar produto para retirada (simulado)'}
                  </button>
                  <p className="mt-1.5 text-center text-[10px] text-marrom/45">
                    Demonstração: a reserva não é real e não escolhe estande nem peça.
                  </p>
                </div>
              </article>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
