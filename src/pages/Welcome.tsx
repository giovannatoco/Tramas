import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import { CornerFlourish, FloralCorner, StitchDivider } from '../components/Ornament';

export default function Welcome() {
  const [showGoogleNote, setShowGoogleNote] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-creme via-bege to-areia/60 textura-papel">
      <FloralCorner className="left-0 top-0" />
      <FloralCorner flip className="bottom-0 right-0" />
      <CornerFlourish className="absolute -left-4 top-24 hidden text-terracota/20 md:block" />
      <CornerFlourish flip className="absolute -right-4 bottom-24 hidden text-oliva/20 md:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-10 text-center">
        <Logo size="lg" />
        <p className="mt-3 max-w-md text-base font-semibold text-marrom/75 md:text-lg">
          Uma rede feita de tramas: quem cria, quem vende e quem compra, tudo ligado por fio a fio.
        </p>

        <section className="mt-10 w-full" aria-labelledby="escolha-titulo">
          <h1 id="escolha-titulo" className="font-display text-2xl font-semibold text-marrom md:text-3xl">
            Como você quer usar o Tramas?
          </h1>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link
              to="/inicio"
              className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-areia/80 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-terracota hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-bege text-terracota transition group-hover:bg-terracota group-hover:text-creme">
                <ShoppingBag size={24} aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-semibold text-marrom">Quero comprar</span>
              <span className="text-sm text-marrom/60">
                Descubra peças únicas, encomende sob medida e apoie quem cria.
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-terracota">
                Explorar o Tramas
                <ArrowRight size={15} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>

            <Link
              to="/vender"
              className="group flex flex-col items-center gap-3 rounded-3xl border-2 border-areia/80 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-oliva hover:shadow-lg"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-bege text-oliva transition group-hover:bg-oliva group-hover:text-creme">
                <Sparkles size={24} aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-semibold text-marrom">Quero vender minha arte</span>
              <span className="text-sm text-marrom/60">
                Mostre seus produtos, receba encomendas e cresça seu negócio.
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-oliva">
                Abrir minha marca
                <ArrowRight size={15} className="transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </section>

        <StitchDivider className="my-8 w-56" />

        <div className="flex w-full max-w-sm flex-col gap-3">
          <Link
            to="/entrar"
            className="rounded-full bg-terracota px-6 py-3.5 text-base font-bold text-creme shadow-md transition hover:bg-terracota-escuro"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="rounded-full border-2 border-terracota px-6 py-3.5 text-base font-bold text-terracota transition hover:bg-bege"
          >
            Criar conta
          </Link>
          <button
            type="button"
            onClick={() => setShowGoogleNote((v) => !v)}
            aria-expanded={showGoogleNote}
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-areia-escura/60 bg-white/80 px-6 py-3.5 text-sm font-bold text-marrom shadow-sm transition hover:bg-white"
          >
            <GoogleIcon />
            Entrar com Google
          </button>
          {showGoogleNote && (
            <p role="status" className="rounded-xl bg-bege px-4 py-2.5 text-xs font-semibold text-marrom/70">
              Demonstração: a autenticação com Google será integrada em uma próxima etapa.
            </p>
          )}
        </div>
      </div>

      <footer className="relative z-10 pb-6 text-center text-xs font-semibold text-marrom/50">
        Feito à mão, feito no Brasil · Valorizando quem cria
      </footer>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.27v-3.1H1.29a12 12 0 0 0 0 10.74l3.98-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.29 6.63l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}
