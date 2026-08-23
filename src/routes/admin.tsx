import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Админ панел | MIK Clima" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Вътрешен административен панел на MIK Clima." },
    ],
  }),
  component: AdminLayout,
});

function LoginScreen({ onSignedIn }: { onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      setError("Грешен имейл или парола.");
      return;
    }
    onSignedIn();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-brand-navy">MIK Clima - Админ панел</h1>
        <p className="mt-1 text-sm text-slate-500">Вход само за оторизиран потребител.</p>

        <label className="mt-6 block text-sm font-medium text-slate-700">Имейл</label>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />

        <label className="mt-4 block text-sm font-medium text-slate-700">Парола</label>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-navy"
        />

        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Влизане..." : "Вход"}
        </button>
      </form>
    </div>
  );
}

const NAV = [
  { to: "/admin", label: "Табло", icon: LayoutDashboard, exact: true },
  { to: "/admin/porachki", label: "Поръчки", icon: ClipboardList },
  { to: "/admin/kalendar", label: "Календар", icon: CalendarDays },
  { to: "/admin/klienti", label: "Клиенти", icon: Users },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  async function refresh() {
    const { data } = await supabase.auth.getSession();
    setSession(data.session ?? null);
    if (!data.session) {
      setIsAdmin(null);
      setChecking(false);
      return;
    }
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.session.user.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!roles);
    setChecking(false);
  }

  useEffect(() => {
    void refresh();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void refresh();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(null);
    navigate({ to: "/admin", replace: true });
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Зареждане...
      </div>
    );
  }

  if (!session) return <LoginScreen onSignedIn={() => void refresh()} />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        <p className="text-sm text-slate-600">Този профил няма достъп до админ панела.</p>
        <button
          onClick={handleSignOut}
          className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white"
        >
          Изход
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <span className="font-semibold text-brand-navy">MIK Clima Админ</span>
        <button aria-label="Меню" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        className={`${menuOpen ? "block" : "hidden"} border-b border-slate-200 bg-white p-3 md:sticky md:top-0 md:block md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r md:p-4`}
      >
        <div className="mb-6 hidden px-2 text-lg font-semibold text-brand-navy md:block">
          MIK Clima
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              activeProps={{ className: "bg-brand-navy text-white" }}
              inactiveProps={{ className: "text-slate-600 hover:bg-slate-100" }}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Изход
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
