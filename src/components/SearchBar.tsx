import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: (value: string) => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar peça, técnica ou região',
  onSubmit,
}: SearchBarProps) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-marrom/50"
          aria-hidden="true"
        />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-full border border-areia bg-white py-2.5 pl-11 pr-4 text-sm font-semibold text-marrom shadow-sm placeholder:font-normal placeholder:text-marrom/40 focus:border-terracota"
        />
      </div>
    </form>
  );
}
