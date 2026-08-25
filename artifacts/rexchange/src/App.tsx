import { type ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowRight, BadgeCheck, Bell, Check, ChevronDown, CircleAlert, Clock3, Heart, LogOut, Menu, Search, ShieldCheck, SlidersHorizontal, Sparkles, Star, Tag, X, Zap } from 'lucide-react';
import { categories, type DemoUser, type Listing, readStore, seedListings, writeStore } from '@/lib/demo';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const demoLogin = { name: 'Aarav Menon', email: 'aarav.menon@srmuniv.edu.in', registrationNumber: 'RA2111003010047', verified: true };

type DemoContextValue = {
  listings: Listing[];
  user: DemoUser | null;
  favorites: string[];
  requested: string[];
  setUser: (user: DemoUser | null) => void;
  toggleFavorite: (id: string) => void;
  requestListing: (id: string) => void;
  addListing: (listing: Listing) => void;
};
const DemoContext = createContext<DemoContextValue | null>(null);
const useDemo = () => {
  const value = useContext(DemoContext);
  if (!value) throw new Error('useDemo must be used inside DemoContext');
  return value;
};

function DemoProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(() => readStore('rexchange-listings', seedListings));
  const [user, setUserState] = useState<DemoUser | null>(() => readStore('rexchange-user', null));
  const [favorites, setFavorites] = useState<string[]>(() => readStore('rexchange-favorites', ['rx-102']));
  const [requested, setRequested] = useState<string[]>(() => readStore('rexchange-requested', []));
  useEffect(() => writeStore('rexchange-listings', listings), [listings]);
  useEffect(() => writeStore('rexchange-user', user), [user]);
  useEffect(() => writeStore('rexchange-favorites', favorites), [favorites]);
  useEffect(() => writeStore('rexchange-requested', requested), [requested]);
  const setUser = (next: DemoUser | null) => setUserState(next);
  const toggleFavorite = (id: string) => setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const requestListing = (id: string) => setRequested((current) => current.includes(id) ? current : [...current, id]);
  const addListing = (listing: Listing) => setListings((current) => [listing, ...current]);
  return <DemoContext.Provider value={{ listings, user, favorites, requested, setUser, toggleFavorite, requestListing, addListing }}>{children}</DemoContext.Provider>;
}

function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" data-testid="link-logo" className={`rex-focus inline-flex items-center gap-2.5 ${inverse ? 'text-[#f7eee6]' : 'text-foreground'}`}><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-primary text-primary-foreground shadow-[4px_4px_0_hsl(var(--accent))]"><span className="text-lg font-bold">R</span></span><span className="text-lg font-bold tracking-[-.06em]">RExchange<span className="text-primary">.</span></span></Link>;
}

function AppShell({ children }: { children: ReactNode }) {
  const { user, setUser } = useDemo();
  const [, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const logout = () => { setUser(null); setLocation('/'); };
  return <div className="min-h-[100dvh] bg-background">
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/browse" data-testid="link-browse" className="rex-focus rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">Browse</Link>
          <Link href="/profile" data-testid="link-profile" className="rex-focus rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground">My space</Link>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button data-testid="button-notifications" aria-label="Notifications" onClick={() => window.alert('You are all caught up.')} className="rex-focus grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"><Bell size={18} /></button>
          <Link href="/profile" data-testid="link-user-menu" className="rex-focus flex items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1.5 text-sm font-semibold transition hover:border-primary/40"><Avatar initials={user?.name.slice(0, 2).toUpperCase() || 'AM'} small /><span className="max-w-[110px] truncate">{user?.name || 'Your space'}</span><ChevronDown size={15} className="text-muted-foreground" /></Link>
        </div>
        <button data-testid="button-mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen((open) => !open)} className="rex-focus grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"><Menu size={19} /></button>
      </div>
      {mobileOpen && <div className="border-t border-border bg-card px-5 py-4 md:hidden">
        <div className="flex flex-col gap-2"><Link onClick={() => setMobileOpen(false)} href="/browse" data-testid="link-mobile-browse" className="rounded-xl px-4 py-3 font-semibold hover:bg-muted">Browse marketplace</Link><Link onClick={() => setMobileOpen(false)} href="/profile" data-testid="link-mobile-profile" className="rounded-xl px-4 py-3 font-semibold hover:bg-muted">My space</Link><button onClick={logout} data-testid="button-mobile-logout" className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold text-primary hover:bg-primary/5"><LogOut size={16} /> Log out</button></div>
      </div>}
    </header>
    <main>{children}</main>
  </div>;
}

function Avatar({ initials, small = false }: { initials: string; small?: boolean }) {
  return <span data-testid={`avatar-${initials}`} className={`grid shrink-0 place-items-center rounded-full bg-[#2a181d] font-bold text-[#f8e9dd] ${small ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs'}`}>{initials}</span>;
}

function Button({ children, className = '', variant = 'primary', onClick, type = 'button', disabled = false, testId }: { children: ReactNode; className?: string; variant?: 'primary' | 'soft' | 'outline' | 'dark'; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; testId?: string }) {
  const variants = { primary: 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_8px_20px_hsl(var(--primary)/.22)]', soft: 'bg-primary/10 text-primary hover:bg-primary/15', outline: 'border border-border bg-card text-foreground hover:border-primary/45 hover:text-primary', dark: 'bg-[#2a181d] text-[#f8e9dd] hover:bg-[#40242b]' };
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={`rex-focus inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}>{children}</button>;
}

function Home() {
  return <div className="rex-noise min-h-[100dvh] overflow-hidden bg-[#261318] text-[#f8e9dd]">
    <header className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-10 lg:px-16"><Logo inverse /><div className="flex items-center gap-3"><Link href="/login" data-testid="link-home-login" className="rex-focus hidden rounded-full px-4 py-2 text-sm font-bold text-[#dfc9c0] transition hover:text-white sm:inline-block">Log in</Link><Link href="/register" data-testid="link-home-register" className="rex-focus rounded-full bg-[#f8e9dd] px-4 py-2.5 text-sm font-bold text-[#261318] transition hover:bg-[#f1c9bc]">Join RExchange <ArrowRight size={15} className="ml-1 inline" /></Link></div></header>
    <section className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-20 pt-12 sm:px-10 sm:pt-20 lg:grid-cols-[1.1fr_.9fr] lg:px-16 lg:pb-28 lg:pt-28">
      <div className="relative z-10 rex-enter max-w-3xl"><p className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#ef625e]"><span className="h-2 w-2 rounded-full bg-[#ef625e]" /> Built for SRMIST, by the people in it</p><h1 className="rex-display max-w-4xl text-[clamp(3.65rem,8vw,8.8rem)] font-bold">Good things<br /><span className="text-[#ef625e]">find people.</span></h1><p className="mt-8 max-w-lg text-lg leading-relaxed text-[#d7bfb5]">The student-first way to pass things forward. Trade your textbook, find a study buddy, or give a little skill a new home.</p><div className="mt-10 flex flex-wrap items-center gap-3"><Link href="/browse" data-testid="link-start-browsing" className="rex-focus inline-flex items-center gap-3 rounded-xl bg-[#ef625e] px-5 py-3.5 font-bold text-[#261318] transition hover:-translate-y-0.5 hover:bg-[#f47770]">Explore the marketplace <ArrowRight size={18} /></Link><span className="text-sm text-[#b99891]">No noise. Just campus utility.</span></div></div>
      <div className="relative mx-auto h-[390px] w-full max-w-[520px] lg:h-[500px]"><div className="absolute inset-0 rounded-[42%_58%_52%_48%/48%_41%_59%_52%] border border-[#75434a] bg-[#351b23] shadow-[inset_20px_20px_100px_rgba(239,98,94,.1)]" /><div className="absolute left-[12%] top-[12%] h-[70%] w-[76%] rotate-[-8deg] rounded-[30px] border border-[#956066] bg-[#e8cfc2] p-6 text-[#261318] shadow-[18px_22px_0_#ef625e]"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-widest">RExchange / 001</span><span className="grid h-8 w-8 place-items-center rounded-full bg-[#261318] text-[#f8e9dd]"><Zap size={15} /></span></div><div className="mt-12 border-y border-[#aa837c] py-7"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#75525a]">Today's signal</p><p className="mt-2 text-4xl font-bold tracking-[-.06em]">Pass it on.</p></div><div className="mt-6 flex items-end justify-between"><div><p className="text-xs text-[#75525a]">Active on campus</p><p className="mt-1 text-2xl font-bold">2,418</p></div><div className="flex -space-x-2"><Avatar initials="IR" small /><Avatar initials="NS" small /><Avatar initials="AB" small /></div></div></div><div className="absolute bottom-[5%] right-[-3%] rounded-2xl border border-[#704048] bg-[#2a181d] px-4 py-3 shadow-xl"><p className="text-[10px] uppercase tracking-widest text-[#ba9490]">Latest exchange</p><p className="mt-1 text-sm font-bold">Cycle ↔ Calculator</p></div></div>
    </section>
    <section className="border-y border-[#512b33] bg-[#2b171e]"><div className="mx-auto grid max-w-[1440px] gap-px bg-[#512b33] sm:grid-cols-3"><div className="bg-[#2b171e] p-7 lg:p-10"><p className="text-4xl font-bold text-[#ef625e]">01</p><p className="mt-8 text-xl font-bold">Find the useful.</p><p className="mt-2 text-sm leading-relaxed text-[#b99891]">A sharper feed for the things students actually need between semesters.</p></div><div className="bg-[#2b171e] p-7 lg:p-10"><p className="text-4xl font-bold text-[#ef625e]">02</p><p className="mt-8 text-xl font-bold">Trust the circle.</p><p className="mt-2 text-sm leading-relaxed text-[#b99891]">SRMIST email, clear profiles, campus-first meetups. Keep it human.</p></div><div className="bg-[#2b171e] p-7 lg:p-10"><p className="text-4xl font-bold text-[#ef625e]">03</p><p className="mt-8 text-xl font-bold">Keep it moving.</p><p className="mt-2 text-sm leading-relaxed text-[#b99891]">Sell it, trade it, teach it, or give it away. Every exchange has a next chapter.</p></div></div></section>
    <footer className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 text-sm text-[#a98281] sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16"><span>RExchange / SRM Institute of Science and Technology</span><span>Made for the in-between semesters.</span></footer>
  </div>;
}

function AuthLayout({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <div className="rex-noise grid min-h-[100dvh] bg-background lg:grid-cols-[.82fr_1.18fr]"><aside className="relative hidden overflow-hidden bg-[#261318] p-10 text-[#f8e9dd] lg:flex lg:flex-col lg:justify-between"><Logo inverse /><div className="relative z-10 max-w-md pb-10"><p className="mb-6 text-xs font-bold uppercase tracking-[.2em] text-[#ef625e]">Your campus, in motion</p><h2 className="rex-display text-6xl font-bold">Useful lives<br /><span className="text-[#ef625e]">here.</span></h2><p className="mt-7 text-base leading-relaxed text-[#cdb2ab]">A trusted exchange layer for the objects, skills, and small moments that make student life work.</p><div className="mt-9 flex items-center gap-3 text-sm text-[#b99891]"><ShieldCheck size={17} className="text-[#ef625e]" /> Built around your SRMIST identity</div></div><div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border-[40px] border-[#ef625e]/20" /><div className="absolute -right-20 top-28 h-60 w-60 rounded-full bg-[#ef625e]/10 blur-3xl" /></aside><main className="flex min-h-[100dvh] flex-col px-5 py-6 sm:px-10 lg:px-20"><div className="lg:hidden"><Logo /></div><div className="mx-auto flex w-full max-w-[500px] flex-1 flex-col justify-center py-10"><Link href="/" data-testid="link-auth-back" className="rex-focus mb-12 inline-flex w-fit items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"><span>←</span> Back to RExchange</Link><div className="rex-enter"><p className="text-xs font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p><h1 className="rex-display mt-4 text-5xl font-bold sm:text-6xl">{title}</h1><p className="mt-5 max-w-md leading-relaxed text-muted-foreground">{description}</p>{children}</div></div></main></div>;
}

function PasswordStrength({ password }: { password: string }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const label = score < 2 ? 'Needs a little more length' : score < 4 ? 'Getting stronger' : 'Strong password';
  return <div className="mt-3" aria-live="polite"><div className="flex gap-1">{[0, 1, 2, 3].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item < score ? (score === 4 ? 'bg-[#2f806e]' : 'bg-primary') : 'bg-muted'}`} />)}</div><p className="mt-1.5 text-xs text-muted-foreground">{password ? label : 'Use 8+ characters, a number, and a symbol.'}</p></div>;
}

function Field({ label, id, value, onChange, type = 'text', placeholder, error }: { label: string; id: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; error?: string }) {
  return <label className="block text-sm font-semibold" htmlFor={id}>{label}<input id={id} data-testid={`input-${id}`} value={value} onChange={(event) => onChange(event.target.value)} type={type} placeholder={placeholder} className={`rex-focus mt-2 w-full rounded-xl border bg-card px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-muted-foreground/65 ${error ? 'border-primary' : 'border-border focus:border-primary'}`} />{error && <span data-testid={`error-${id}`} className="mt-1.5 flex items-center gap-1 text-xs font-medium text-primary"><CircleAlert size={13} /> {error}</span>}</label>;
}

function RegisterPage() {
  const [, setLocation] = useLocation();
  const { setUser } = useDemo();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reg, setReg] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const emailOkay = email.toLowerCase().endsWith('@srmuniv.edu.in');
    const regOkay = /^RA\d{13}$/i.test(reg);
    if (!name.trim() || !emailOkay || !regOkay || password.length < 8 || password !== confirm || !terms) {
      setError(!emailOkay ? 'Use your SRMIST email address ending in @srmist.edu.in.' : !regOkay ? 'Registration number must match RA followed by exactly 13 digits.' : password !== confirm ? 'Passwords do not match yet.' : !terms ? 'Please accept the community safety terms.' : 'Add the required details to continue.');
      return;
    }
    const next = { name: name.trim(), email: email.trim().toLowerCase(), registrationNumber: reg.toUpperCase(), verified: false };
    setUser(next);
    writeStore('rexchange-pending', next);
    setLocation('/verify');
  };
  return <AuthLayout eyebrow="Start with your identity" title={<>Join the<br /><span className="text-primary">good circle.</span></>} description="One SRMIST identity. A campus full of useful possibilities.">
    <form onSubmit={submit} className="mt-9 space-y-5" noValidate><Field label="Full name" id="full-name" value={name} onChange={setName} placeholder="Your name as it appears on campus" /><Field label="SRMIST email" id="email" value={email} onChange={setEmail} type="email" placeholder="name@srmist.edu.in" /><Field label="Registration number" id="registration-number" value={reg} onChange={(value) => setReg(value.toUpperCase())} placeholder="RA2111003010047" /><div><label className="block text-sm font-semibold" htmlFor="password">Password<div className="relative mt-2"><input id="password" data-testid="input-password" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? 'text' : 'password'} placeholder="Create a secure password" className="rex-focus w-full rounded-xl border border-border bg-card px-4 py-3.5 pr-16 text-sm outline-none transition placeholder:text-muted-foreground/65 focus:border-primary" /><button type="button" data-testid="button-toggle-password" onClick={() => setShowPassword((show) => !show)} className="rex-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-muted-foreground hover:text-primary">{showPassword ? 'Hide' : 'Show'}</button></div></label><PasswordStrength password={password} /></div><Field label="Confirm password" id="confirm-password" value={confirm} onChange={setConfirm} type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" /><label className="flex cursor-pointer items-start gap-3 rounded-xl bg-muted/60 p-3.5 text-xs leading-relaxed text-muted-foreground"><input data-testid="input-terms" type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" /><span>I agree to keep exchanges respectful, meet safely on campus, and represent listings honestly.</span></label>{error && <p data-testid="status-register-error" className="rounded-xl bg-primary/10 px-3.5 py-3 text-sm font-semibold text-primary">{error}</p>}<Button type="submit" testId="button-register" className="w-full">Create my space <ArrowRight size={17} /></Button><div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-xs text-muted-foreground"><BadgeCheck size={17} className="text-[#2f806e]" /><span><strong className="text-foreground">Demo verification:</strong> no real email is sent in this prototype.</span></div><p className="text-center text-sm text-muted-foreground">Already inside? <Link href="/login" data-testid="link-register-login" className="font-bold text-primary hover:underline">Log in</Link></p></form>
  </AuthLayout>;
}

function LoginPage() {
  const [, setLocation] = useLocation();
  const { setUser } = useDemo();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const login = (next: DemoUser) => { setUser(next); setLocation('/browse'); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!(email.toLowerCase().endsWith('@srmist.edu.in') || email.toLowerCase().endsWith('@srmuniv.edu.in')) || password.length < 4) { setError('Use an SRMIST email and your demo password to continue.'); return; }
    login({ name: email.split('@')[0].split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' '), email, registrationNumber: 'RA2111003010047', verified: true });
  };
  return <AuthLayout eyebrow="Welcome back" title={<>Back to<br /><span className="text-primary">your circle.</span></>} description="Pick up where you left off. Your campus feed is waiting."><form onSubmit={submit} className="mt-9 space-y-5"><Field label="SRMIST email" id="login-email" value={email} onChange={setEmail} type="email" placeholder="name@srmist.edu.in" /><div><label className="block text-sm font-semibold" htmlFor="login-password">Password<div className="relative mt-2"><input id="login-password" data-testid="input-login-password" value={password} onChange={(event) => setPassword(event.target.value)} type={show ? 'text' : 'password'} placeholder="Your password" className="rex-focus w-full rounded-xl border border-border bg-card px-4 py-3.5 pr-16 text-sm outline-none transition placeholder:text-muted-foreground/65 focus:border-primary" /><button type="button" data-testid="button-toggle-login-password" onClick={() => setShow((current) => !current)} className="rex-focus absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-muted-foreground hover:text-primary">{show ? 'Hide' : 'Show'}</button></div></label></div><div className="flex items-center justify-between"><label className="flex items-center gap-2 text-sm text-muted-foreground"><input data-testid="input-remember" type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" /> Remember this session</label><button type="button" data-testid="button-forgot-password" onClick={() => setError('Password reset is not needed for this local demo.')} className="rex-focus text-sm font-bold text-primary hover:underline">Forgot password?</button></div>{error && <p data-testid="status-login-error" className="rounded-xl bg-primary/10 px-3.5 py-3 text-sm font-semibold text-primary">{error}</p>}<Button type="submit" testId="button-login" className="w-full">Log in <ArrowRight size={17} /></Button><div className="relative py-1 text-center text-xs text-muted-foreground before:absolute before:left-0 before:top-1/2 before:h-px before:w-[42%] before:bg-border after:absolute after:right-0 after:top-1/2 after:h-px after:w-[42%] after:bg-border"><span className="bg-background px-2">or use the demo</span></div><Button type="button" testId="button-demo-login" variant="outline" className="w-full" onClick={() => login(demoLogin)}><Sparkles size={16} className="text-primary" /> Enter as Aarav Menon</Button><p className="text-center text-sm text-muted-foreground">New to the circle? <Link href="/register" data-testid="link-login-register" className="font-bold text-primary hover:underline">Create an account</Link></p></form></AuthLayout>;
}

function VerifyPage() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useDemo();
  const pending = readStore<DemoUser | null>('rexchange-pending', user);
  const verify = () => { if (pending) { const next = { ...pending, verified: true }; setUser(next); writeStore('rexchange-pending', null); setLocation('/browse'); } };
  if (!pending) return <AuthLayout eyebrow="One step earlier" title={<>Let's find<br /><span className="text-primary">your details.</span></>} description="Start by creating your local demo profile."><Button onClick={() => setLocation('/register')} testId="button-go-register" className="mt-9 w-full">Go to registration <ArrowRight size={17} /></Button></AuthLayout>;
  const masked = `${pending.registrationNumber.slice(0, 5)}••••••••${pending.registrationNumber.slice(-2)}`;
  return <AuthLayout eyebrow="Demo verification" title={<>You are<br /><span className="text-primary">nearly in.</span></>} description="This step mirrors the campus identity check without pretending to send anything."><div className="mt-9 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"><div className="flex items-start gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8d8ca] text-[#75434a]"><ShieldCheck size={20} /></div><div><p className="font-bold">Identity reserved for {pending.name}</p><p className="mt-1 text-sm text-muted-foreground">{pending.email}</p></div></div><div className="mt-6 border-t border-border pt-5"><p className="text-xs font-bold uppercase tracking-[.15em] text-muted-foreground">Registration number</p><p data-testid="text-masked-registration" className="mt-2 text-lg font-bold tracking-wider">{masked}</p></div></div><div className="mt-4 rounded-xl bg-[#f3e8b8]/55 px-4 py-3 text-sm leading-relaxed text-[#614f1d]"><strong>Prototype caveat:</strong> this button is a local demo action. No email is sent and no production identity is verified.</div><Button onClick={verify} testId="button-complete-verification" className="mt-6 w-full">Complete demo verification <Check size={17} /></Button><button onClick={() => setLocation('/')} data-testid="button-cancel-verification" className="rex-focus mt-4 block w-full text-center text-sm font-bold text-muted-foreground hover:text-primary">Not you? Start over</button></AuthLayout>;
}

function ListingCard({ listing }: { listing: Listing }) {
  const { favorites, requested, toggleFavorite, requestListing } = useDemo();
  const [feedback, setFeedback] = useState('');
  const favorite = favorites.includes(listing.id);
  const hasRequested = requested.includes(listing.id);
  const request = () => { requestListing(listing.id); setFeedback('Request noted — you can coordinate in your space.'); };
  return <article data-testid={`card-listing-${listing.id}`} className="rex-card group flex flex-col overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(56,18,28,.13)]"><div className="relative h-44 overflow-hidden bg-[#3a2027]"><div className={`absolute inset-0 ${listing.type === 'skill' ? 'bg-[radial-gradient(circle_at_75%_25%,#e8d19a_0,transparent_25%),linear-gradient(140deg,#4c242e,#25151a_65%)' : 'bg-[linear-gradient(135deg,#4c242e_0%,#342029_45%,#9d4e4c_100%)]'}`} /><div className="rex-grid-bg absolute inset-0 opacity-20" /><div className="absolute left-5 top-5 flex items-center gap-2"><span className="rounded-full bg-[#f8e9dd] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-[#3a2027]">{listing.type}</span><span className="rounded-full border border-[#f8e9dd]/30 bg-[#3a2027]/30 px-2.5 py-1 text-[10px] font-bold text-[#f8e9dd]">{listing.category}</span></div><button onClick={() => toggleFavorite(listing.id)} data-testid={`button-favorite-${listing.id}`} aria-label={favorite ? `Remove ${listing.title} from saves` : `Save ${listing.title}`} className={`rex-focus absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${favorite ? 'bg-[#ef625e] text-[#261318]' : 'bg-[#261318]/35 text-[#f8e9dd] hover:bg-[#f8e9dd] hover:text-[#261318]'}`}><Heart size={16} fill={favorite ? 'currentColor' : 'none'} /></button><div className="absolute bottom-4 left-5 text-[#f8e9dd]"><p className="text-xs font-medium text-[#e2c3b9]">{listing.campus}</p><p className="mt-1 text-sm font-bold">{listing.deliveryMode}</p></div></div><div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-4"><h3 className="text-[17px] font-bold leading-snug tracking-[-.025em]">{listing.title}</h3><span data-testid={`text-price-${listing.id}`} className="shrink-0 text-right text-sm font-bold text-primary">{listing.price ? `₹${listing.price.toLocaleString('en-IN')}` : 'Free'}</span></div><p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-relaxed text-muted-foreground">{listing.description}</p><div className="mt-4 flex items-center justify-between border-t border-border pt-4"><div className="flex items-center gap-2"><Avatar initials={listing.ownerAvatar} small /><div><p className="text-xs font-bold">{listing.ownerName}</p><p className="text-[11px] text-muted-foreground">{listing.condition}</p></div></div><span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground"><Clock3 size={12} /> {listing.requestedCount} interested</span></div><div className="mt-4 flex items-center gap-2"><Button onClick={request} disabled={hasRequested} testId={`button-request-${listing.id}`} variant={hasRequested ? 'soft' : 'dark'} className="flex-1 py-2.5">{hasRequested ? <><Check size={15} /> Requested</> : <>Request this <ArrowRight size={15} /></>}</Button><span className="rounded-lg bg-muted px-2.5 py-2 text-[11px] font-bold text-muted-foreground">{listing.exchangeMode}</span></div>{feedback && <p data-testid={`status-request-${listing.id}`} className="mt-2 text-xs font-semibold text-[#2f806e]">{feedback}</p>}</div></article>;
}

function BrowsePage() {
  const { listings, favorites } = useDemo();
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    const result = listings.filter((listing) => (!query || `${listing.title} ${listing.description} ${listing.category}`.toLowerCase().includes(query)) && (type === 'all' || listing.type === type) && (category === 'All' || listing.category === category) && (!onlyFavorites || favorites.includes(listing.id)));
    return [...result].sort((a, b) => sort === 'price-low' ? a.price - b.price : sort === 'price-high' ? b.price - a.price : b.createdDate.localeCompare(a.createdDate));
  }, [category, favorites, listings, onlyFavorites, search, sort, type]);
  return <AppShell><div className="mx-auto max-w-[1440px] px-5 pb-20 pt-10 sm:px-8 lg:px-12"><div className="rex-enter flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-primary"><span className="h-2 w-2 rounded-full bg-primary" /> Kattankulathur / live now</div><h1 className="rex-display mt-4 text-5xl font-bold sm:text-7xl">Find your<br /><span className="text-primary">next useful.</span></h1><p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">Objects with another semester in them. Skills worth sharing. Browse the student-to-student signal.</p></div><div className="flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3"><div className="flex -space-x-2"><Avatar initials="IR" small /><Avatar initials="RK" small /><Avatar initials="NS" small /></div><div><p className="text-sm font-bold">2,418 students</p><p className="text-xs text-muted-foreground">active in the circle</p></div><div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-[#2f806e]" /></div></div><div className="mt-10 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:p-4"><div className="flex flex-col gap-3 lg:flex-row"><label className="rex-focus flex flex-1 items-center gap-3 rounded-xl bg-muted px-4 py-3"><Search size={19} className="text-muted-foreground" /><input data-testid="input-search-listings" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search books, cycles, skills..." className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground/70" /></label><div className="flex gap-2 overflow-x-auto pb-0.5"><div className="flex shrink-0 rounded-xl bg-muted p-1">{['all', 'item', 'skill'].map((value) => <button key={value} data-testid={`button-type-${value}`} onClick={() => setType(value)} className={`rounded-lg px-3.5 py-2 text-xs font-bold capitalize transition ${type === value ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{value === 'all' ? 'Everything' : `${value}s`}</button>)}</div><Button variant={showFilters ? 'soft' : 'outline'} onClick={() => setShowFilters((current) => !current)} testId="button-toggle-filters" className="shrink-0 py-2.5"><SlidersHorizontal size={16} /> Filters</Button><label className="flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold"><input data-testid="input-favorites-filter" type="checkbox" checked={onlyFavorites} onChange={(event) => setOnlyFavorites(event.target.checked)} className="h-4 w-4 accent-[hsl(var(--primary))]" /> Saved</label></div></div>{showFilters && <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3"><span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</span>{categories.map((item) => <button key={item} data-testid={`button-category-${item.toLowerCase()}`} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${category === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'}`}>{item}</button>)}</div>}</div><div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p data-testid="text-results-count" className="text-sm font-bold">{filtered.length} {filtered.length === 1 ? 'signal' : 'signals'} found</p><p className="mt-1 text-xs text-muted-foreground">Every listing is local-first and student-owned.</p></div><label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">Sort by<select data-testid="select-sort-listings" value={sort} onChange={(event) => setSort(event.target.value)} className="rex-focus rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground outline-none"><option value="recent">Recently added</option><option value="price-low">Price: low first</option><option value="price-high">Price: high first</option></select></label></div>{filtered.length ? <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((listing, index) => <div key={listing.id} className={`rex-enter rex-delay-${Math.min(index + 1, 3)}`}><ListingCard listing={listing} /></div>)}</div> : <div data-testid="empty-listings" className="rex-card mt-5 flex flex-col items-center rounded-2xl px-6 py-20 text-center"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted text-primary"><Search size={27} /></div><h2 className="mt-5 text-xl font-bold">No signal here yet.</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Try a wider search, or switch off Saved to see more of the campus.</p><Button variant="soft" onClick={() => { setSearch(''); setCategory('All'); setType('all'); setOnlyFavorites(false); }} testId="button-clear-filters" className="mt-6">Clear filters</Button></div>}</div></AppShell>;
}

function CreateListing({ onClose }: { onClose: () => void }) {
  const { user, addListing } = useDemo();
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState<'item' | 'skill'>('item');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!title.trim() || !description.trim()) return; addListing({ id: `rx-${Date.now()}`, type: kind, title: title.trim(), description: description.trim(), category: kind === 'skill' ? 'Skills' : 'Hostel', condition: kind === 'skill' ? 'Peer-led' : 'Good', price: Number(price) || 0, exchangeMode: Number(price) ? 'Sell' : 'Give away', campus: 'Kattankulathur', deliveryMode: 'Agree with owner', ownerName: user?.name || 'You', ownerAvatar: user?.name?.slice(0, 2).toUpperCase() || 'YU', requestedCount: 0, createdDate: new Date().toISOString().slice(0, 10) }); onClose(); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-[#261318]/60 px-5 backdrop-blur-sm"><div role="dialog" aria-modal="true" className="rex-card w-full max-w-lg rounded-2xl p-6 sm:p-8"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Add to the circle</p><h2 className="rex-display mt-2 text-3xl font-bold">Pass it forward.</h2></div><button onClick={onClose} data-testid="button-close-listing-modal" className="rex-focus grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground"><X size={17} /></button></div><form onSubmit={submit} className="mt-7 space-y-4"><Field label="What are you sharing?" id="listing-title" value={title} onChange={setTitle} placeholder="e.g. Calculus notes, guitar basics" /><label className="block text-sm font-semibold">Type<select data-testid="select-listing-type" value={kind} onChange={(event) => setKind(event.target.value as 'item' | 'skill')} className="rex-focus mt-2 w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm outline-none"><option value="item">Item</option><option value="skill">Skill</option></select></label><Field label="Price in INR (optional)" id="listing-price" value={price} onChange={setPrice} type="number" placeholder="0 for free" /><label className="block text-sm font-semibold">A short description<textarea data-testid="input-listing-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What should another student know?" rows={3} className="rex-focus mt-2 w-full resize-none rounded-xl border border-border bg-card px-4 py-3.5 text-sm outline-none transition placeholder:text-muted-foreground/65 focus:border-primary" /></label><div className="flex gap-3 pt-2"><Button type="button" variant="outline" onClick={onClose} testId="button-cancel-listing" className="flex-1">Cancel</Button><Button type="submit" testId="button-publish-listing" className="flex-1">Publish signal <ArrowRight size={16} /></Button></div></form></div></div>;
}

function ProfilePage() {
  const { user, listings, favorites, setUser } = useDemo();
  const [, setLocation] = useLocation();
  const [modal, setModal] = useState(false);
  const [tab, setTab] = useState<'listings' | 'saved'>('listings');
  const saved = listings.filter((listing) => favorites.includes(listing.id));
  const mine = listings.filter((listing) => listing.ownerName === user?.name);
  const logout = () => { setUser(null); setLocation('/'); };
  return <AppShell><div className="mx-auto max-w-[1200px] px-5 pb-20 pt-10 sm:px-8 lg:px-12"><div className="rex-card rex-enter relative overflow-hidden rounded-3xl bg-[#2a181d] p-6 text-[#f8e9dd] sm:p-10"><div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-[#ef625e]/20" /><div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#ef625e] text-xl font-bold text-[#261318]">{user?.name.slice(0, 2).toUpperCase() || 'AM'}</div><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#ef9b93]">Your RExchange space</p><h1 data-testid="text-profile-name" className="mt-1 text-3xl font-bold tracking-[-.04em]">{user?.name || 'Aarav Menon'}</h1><p className="mt-1 text-sm text-[#c9aaa3]">{user?.email || 'aarav.menon@srmuniv.edu.in'} <span className="mx-1 text-[#ef625e]">•</span> Kattankulathur</p></div></div><div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full bg-[#f8e9dd]/10 px-3 py-2 text-xs font-bold text-[#f8e9dd]"><BadgeCheck size={14} className="text-[#ef9b93]" /> Demo verified</span><Button onClick={() => setModal(true)} variant="primary" testId="button-create-listing" className="bg-[#f8e9dd] text-[#2a181d] hover:bg-white">+ Create listing</Button></div></div><div className="relative mt-8 grid max-w-lg grid-cols-3 gap-2 border-t border-[#f8e9dd]/15 pt-6"><div><p className="text-2xl font-bold">{mine.length}</p><p className="mt-1 text-xs text-[#c9aaa3]">Your listings</p></div><div><p className="text-2xl font-bold">{saved.length}</p><p className="mt-1 text-xs text-[#c9aaa3]">Saved</p></div><div><p className="text-2xl font-bold">18</p><p className="mt-1 text-xs text-[#c9aaa3]">Trust points</p></div></div></div><div className="mt-10 flex flex-col justify-between gap-4 border-b border-border sm:flex-row sm:items-center"><div className="flex gap-5"><button onClick={() => setTab('listings')} data-testid="button-tab-listings" className={`border-b-2 px-1 pb-3 text-sm font-bold ${tab === 'listings' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Personal listings</button><button onClick={() => setTab('saved')} data-testid="button-tab-saved" className={`border-b-2 px-1 pb-3 text-sm font-bold ${tab === 'saved' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>Saved signals <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{saved.length}</span></button></div><button onClick={logout} data-testid="button-logout" className="rex-focus mb-3 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary sm:mb-0"><LogOut size={16} /> Log out</button></div>{tab === 'listings' && !mine.length ? <div data-testid="empty-personal-listings" className="rex-card mt-6 flex flex-col items-center rounded-2xl px-6 py-16 text-center"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Tag size={24} /></div><h2 className="mt-5 text-xl font-bold">Your shelf is empty.</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">Have something useful sitting idle? Give it a second life with one clear listing.</p><Button onClick={() => setModal(true)} testId="button-empty-create-listing" className="mt-6">Create your first listing <ArrowRight size={16} /></Button></div> : <div className="mt-6 grid gap-5 md:grid-cols-2">{(tab === 'saved' ? saved : mine).map((listing) => <ListingCard listing={listing} key={listing.id} />)}</div>}<div className="mt-10 grid gap-4 md:grid-cols-2"><div className="rex-card rounded-2xl p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e8d8ca] text-[#75434a]"><ShieldCheck size={19} /></div><div><p className="font-bold">Your safety toolkit</p><p className="mt-1 text-sm text-muted-foreground">Meet in public campus spots. Keep exchanges clear.</p></div></div><button data-testid="button-safety-guide" onClick={() => window.alert('Choose public campus meeting points and keep conversations on-platform.')} className="rex-focus mt-5 text-sm font-bold text-primary hover:underline">Read the guide <ArrowRight size={14} className="ml-1 inline" /></button></div><div className="rex-card rounded-2xl p-5"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3e8b8] text-[#614f1d]"><Star size={19} /></div><div><p className="font-bold">Trust points</p><p className="mt-1 text-sm text-muted-foreground">Reply promptly to grow your campus reputation.</p></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full w-[64%] rounded-full bg-[#ef625e]" /></div><p className="mt-2 text-xs font-bold text-muted-foreground">18 of 28 points to the next badge</p></div></div></div>{modal && <CreateListing onClose={() => setModal(false)} />}</AppShell>;
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <DemoProvider>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/verify" component={VerifyPage} />
          <Route path="/browse" component={BrowsePage} />
          <Route path="/profile" component={ProfilePage} />
          <Route component={NotFound} />
        </Switch>
      </DemoProvider>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
