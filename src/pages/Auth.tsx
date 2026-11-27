import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useApp } from '../store/AppContext';
import type { User } from '../types';

const field =
  'w-full rounded-xl border border-areia-escura/60 bg-white px-4 py-3 text-sm text-marrom outline-none transition focus:border-terracota focus:ring-2 focus:ring-terracota/20';
const label = 'mb-1.5 block text-xs font-bold uppercase tracking-wide text-marrom/60';

function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-areia-escura/50 bg-white px-4 py-3 text-sm font-bold text-marrom transition hover:border-marrom"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.02.15 3.5 2.7.24.02c2.2-2 3.5-5 3.5-8.8z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.1 0-5.8-2.1-6.8-5l-.14.01-3.6 2.8-.05.13C3.4 21.3 7.4 24 12 24z" />
        <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.2-1.7.4-2.4l-.01-.16-3.7-2.9-.12.06C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.4l3.8-3z" />
        <path fill="#EA4335" d="M12 4.6c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l3.8 3c1-2.9 3.7-5 6.8-5z" />
      </svg>
      Continuar com Google
    </button>
  );
}

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.ok) navigate('/inicio');
    else setError(res.error ?? 'Não foi possível entrar.');
  };

  return (
    <div className="mx-auto max-w-md space-y-6 py-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 hover:text-terracota">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar
      </Link>
      <header className="text-center">
        <h1 className="font-display text-3xl font-semibold text-marrom">Entrar no Tramas</h1>
        <p className="mt-1 text-sm text-marrom/60">Acesse sua conta de compradora ou produtora.</p>
      </header>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-areia/70 bg-white/80 p-6 shadow-sm">
        <div>
          <label htmlFor="login-email" className={label}>E-mail</label>
          <input id="login-email" type="email" required autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        </div>
        <div>
          <label htmlFor="login-senha" className={label}>Senha</label>
          <div className="relative">
            <input
              id="login-senha"
              type={showPw ? 'text' : 'password'}
              required
              autoComplete="current-password"
              className={`${field} pr-11`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-marrom/40 hover:text-marrom"
            >
              {showPw ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-terracota/10 px-4 py-2.5 text-sm font-bold text-terracota">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-terracota px-4 py-3 text-sm font-extrabold text-creme transition hover:bg-terracota-escura">
          Entrar
        </button>
      </form>

      <GoogleButton onClick={() => navigate('/inicio')} />

      <div className="rounded-2xl bg-bege/70 p-4 text-center text-xs leading-relaxed text-marrom/60">
        <p className="font-bold text-marrom">Contas de demonstração</p>
        <p className="mt-1">Compradora: <code>maria@tramas.app</code> · senha <code>demo123</code></p>
        <p>Produtora: <code>nega@casadanega.art</code> · senha <code>demo123</code></p>
        <p className="mt-1 text-marrom/45">Autenticação demonstrativa — sem credenciais reais.</p>
      </div>

      <p className="text-center text-sm text-marrom/60">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-bold text-terracota hover:underline">Criar conta</Link>
      </p>
    </div>
  );
}

export function Register() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', role: 'comprador' as User['role'],
    brandName: '', location: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('As senhas não conferem. Digite a mesma senha nos dois campos.');
      return;
    }
    if (form.role !== 'comprador' && !form.brandName.trim()) {
      setError('Para vender, informe o nome da sua marca.');
      return;
    }
    const res = register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      brandName: form.brandName || undefined,
      location: form.location || undefined,
    });
    if (res.ok) navigate(form.role === 'produtora' || form.role === 'ambos' ? '/vender' : '/inicio');
    else setError(res.error ?? 'Não foi possível criar a conta.');
  };

  return (
    <div className="mx-auto max-w-lg space-y-6 py-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-marrom/60 hover:text-terracota">
        <ArrowLeft size={16} aria-hidden="true" /> Voltar
      </Link>
      <header className="text-center">
        <h1 className="font-display text-3xl font-semibold text-marrom">Criar sua conta</h1>
        <p className="mt-1 text-sm text-marrom/60">Leva menos de um minuto. Você pode ser compradora e produtora.</p>
      </header>

      <form onSubmit={submit} className="space-y-5 rounded-2xl border border-areia/70 bg-white/80 p-6 shadow-sm">
        <fieldset>
          <legend className={label}>Como você quer usar o Tramas?</legend>
          <div className="grid grid-cols-3 gap-2">
            {([
              ['comprador', 'Comprar'],
              ['produtora', 'Vender'],
              ['ambos', 'Os dois'],
            ] as const).map(([v, lbl]) => (
              <label
                key={v}
                className={`cursor-pointer rounded-xl border-2 px-3 py-3 text-center text-sm font-extrabold transition ${
                  form.role === v ? 'border-terracota bg-terracota/10 text-terracota' : 'border-areia-escura/30 text-marrom/60 hover:border-areia-escura'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={v}
                  checked={form.role === v}
                  onChange={set('role')}
                  className="sr-only"
                />
                {lbl}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="reg-nome" className={label}>Seu nome</label>
            <input id="reg-nome" required className={field} value={form.name} onChange={set('name')} placeholder="Como te chamam" />
          </div>
          <div>
            <label htmlFor="reg-email" className={label}>E-mail</label>
            <input id="reg-email" type="email" required autoComplete="email" className={field} value={form.email} onChange={set('email')} placeholder="voce@email.com" />
          </div>
          <div>
            <label htmlFor="reg-senha" className={label}>Senha</label>
            <div className="relative">
              <input
                id="reg-senha"
                type={showPw ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete="new-password"
                className={`${field} pr-11`}
                value={form.password}
                onChange={set('password')}
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? 'Ocultar senha' : 'Mostrar senha'} className="absolute right-3 top-1/2 -translate-y-1/2 text-marrom/40 hover:text-marrom">
                {showPw ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="reg-conf" className={label}>Confirmar senha</label>
            <input id="reg-conf" type={showPw ? 'text' : 'password'} required className={field} value={form.confirm} onChange={set('confirm')} placeholder="Repita a senha" />
          </div>
          {(form.role === 'produtora' || form.role === 'ambos') && (
            <>
              <div>
                <label htmlFor="reg-marca" className={label}>Nome da marca *</label>
                <input id="reg-marca" className={field} value={form.brandName} onChange={set('brandName')} placeholder="Ex.: Casa da Nega" />
              </div>
              <div>
                <label htmlFor="reg-local" className={label}>Cidade / estado</label>
                <input id="reg-local" className={field} value={form.location} onChange={set('location')} placeholder="Ex.: Recife/PE" />
              </div>
            </>
          )}
          {(form.role === 'comprador' || form.role === 'ambos') && (
            <div className="sm:col-span-2">
              <label htmlFor="reg-loc" className={label}>Onde você mora (opcional)</label>
              <input id="reg-loc" className={field} value={form.role === 'ambos' ? form.location : form.location} onChange={set('location')} placeholder="Ex.: Campinas/SP" />
            </div>
          )}
        </div>

        {error && <p role="alert" className="rounded-xl bg-terracota/10 px-4 py-2.5 text-sm font-bold text-terracota">{error}</p>}

        <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracota px-4 py-3 text-sm font-extrabold text-creme transition hover:bg-terracota-escura">
          <Sparkles size={16} aria-hidden="true" />
          Criar conta
        </button>
      </form>

      <GoogleButton onClick={() => navigate('/inicio')} />
      <p className="text-center text-sm text-marrom/60">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-bold text-terracota hover:underline">Entrar</Link>
      </p>
    </div>
  );
}
