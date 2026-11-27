interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withSlogan?: boolean;
  light?: boolean;
}

const SIZES = {
  sm: { mark: 30, text: 'text-lg', slogan: 'text-[10px]' },
  md: { mark: 44, text: 'text-2xl', slogan: 'text-xs' },
  lg: { mark: 72, text: 'text-4xl', slogan: 'text-sm' },
};

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Símbolo do Tramas: fios entrelaçados"
      className="shrink-0"
    >
      <rect x="2" y="2" width="44" height="44" rx="14" fill="#A33D18" />
      <path
        d="M12 16c6-5 18-5 24 0"
        fill="none"
        stroke="#FFF8EF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 24c6-5 18-5 24 0"
        fill="none"
        stroke="#F6C069"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M12 32c6-5 18-5 24 0"
        fill="none"
        stroke="#FFF8EF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="36" cy="16" r="3" fill="#52672D" />
      <circle cx="12" cy="32" r="3" fill="#52672D" />
    </svg>
  );
}

export default function Logo({ size = 'md', withSlogan = true, light = false }: LogoProps) {
  const s = SIZES[size];
  const textColor = light ? 'text-creme' : 'text-marrom';
  const sloganColor = light ? 'text-laranja-claro' : 'text-terracota';
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={s.mark} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-semibold ${s.text} ${textColor}`}>Tramas</span>
        {withSlogan && (
          <span className={`mt-1 ${s.slogan} font-semibold tracking-wide ${sloganColor}`}>
            Feito à mão, feito no Brasil
          </span>
        )}
      </span>
    </span>
  );
}
