import { CalendarDays, MapPin, Users } from 'lucide-react';
import type { Fair } from '../types';

export function FairCard({ fair }: { fair: Fair }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-areia/70 bg-white shadow-sm">
      <div className="relative h-40 overflow-hidden bg-bege">
        <img
          src={fair.image}
          alt={`Foto da ${fair.name}`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <span className="absolute left-2.5 top-2.5 flex gap-1.5">
          <span className="rounded-full bg-oliva px-2.5 py-1 text-[11px] font-bold text-creme shadow">
            {fair.region}
          </span>
          {fair.demo && (
            <span className="rounded-full bg-creme/90 px-2.5 py-1 text-[11px] font-bold text-marrom shadow">
              Evento demonstrativo
            </span>
          )}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-marrom">{fair.name}</h3>
        <p className="mt-1 text-sm text-marrom/70">{fair.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-marrom/80">
          <li className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-terracota" aria-hidden="true" />
            {fair.city}, {fair.state}
            {fair.distanceKm === 0
              ? ' · Na sua cidade'
              : ` · a ${fair.distanceKm} km de você`}
          </li>
          <li className="flex items-center gap-2">
            <CalendarDays size={14} className="shrink-0 text-terracota" aria-hidden="true" />
            {fair.date}
          </li>
        </ul>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-terracota px-4 py-1.5 text-sm font-bold text-terracota transition hover:bg-terracota hover:text-creme"
        >
          <Users size={14} aria-hidden="true" />
          Reservar produto
        </button>
      </div>
    </article>
  );
}
