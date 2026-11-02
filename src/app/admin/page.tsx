import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { listOrders, ORDER_STATUSES, STATUS_LABELS, type Order, type OrderStatus } from "@/lib/orders";
import { getDevice, getService } from "@/lib/services";
import { phoneHref } from "@/lib/site";
import { logout, setStatus } from "./actions";

const STATUS_STYLES: Record<OrderStatus, string> = {
  naujas: "bg-sky-100 text-sky-800",
  susisiekta: "bg-amber-100 text-amber-800",
  patvirtintas: "bg-violet-100 text-violet-800",
  baigtas: "bg-emerald-100 text-emerald-800",
  atsauktas: "bg-slate-200 text-slate-600",
};

const fmt = new Intl.DateTimeFormat("lt-LT", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Vilnius",
});

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="p-8 text-slate-500">Kraunama…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  if (!(await isAdmin())) redirect("/admin/prisijungti");

  const sp = await searchParams;
  const filter = ORDER_STATUSES.includes(sp.busena as OrderStatus) ? (sp.busena as OrderStatus) : null;

  const all = await listOrders();
  const orders = filter ? all.filter((o) => o.status === filter) : all;
  const counts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, all.filter((o) => o.status === s).length])) as Record<
    OrderStatus,
    number
  >;
  const closed = all.length - counts.atsauktas;
  const conversion = all.length ? Math.round((counts.baigtas / all.length) * 100) : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Užsakymai</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-sky-700 hover:underline">
            Į svetainę
          </Link>
          <form action={logout}>
            <button className="rounded-lg bg-white px-3 py-1.5 ring-1 ring-slate-300 hover:bg-slate-50">Atsijungti</button>
          </form>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Statistika">
        <Stat label="Visos užklausos" value={all.length} />
        <Stat label="Naujos (neatsakytos)" value={counts.naujas} />
        <Stat label="Aktyvios (ne atšauktos)" value={closed} />
        <Stat label="Virto mokamais (baigta)" value={`${counts.baigtas} · ${conversion}%`} />
      </section>

      <nav className="mt-6 flex flex-wrap gap-2 text-sm" aria-label="Filtras pagal būseną">
        <FilterLink href="/admin" active={!filter}>
          Visi ({all.length})
        </FilterLink>
        {ORDER_STATUSES.map((s) => (
          <FilterLink key={s} href={`/admin?busena=${s}`} active={filter === s}>
            {STATUS_LABELS[s]} ({counts[s]})
          </FilterLink>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-10 rounded-xl bg-white p-8 text-center text-slate-500 ring-1 ring-slate-200">Užsakymų nėra.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </ul>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 ring-1 ${active ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"}`}
    >
      {children}
    </Link>
  );
}

function OrderCard({ order: o }: { order: Order }) {
  return (
    <li className="rounded-xl bg-white p-5 ring-1 ring-slate-200">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-900">
            {getService(o.service)?.name ?? o.service}{" "}
            <span className="font-normal text-slate-500">· {getDevice(o.device)?.label ?? o.device}</span>
          </p>
          <p className="text-xs text-slate-500">
            Gauta {fmt.format(new Date(o.createdAt))}
            {o.source ? ` · šaltinis: ${o.source}` : ""}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[o.status]}`}>
          {STATUS_LABELS[o.status]}
        </span>
      </div>

      <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Klientas</dt>
          <dd className="font-medium text-slate-900">{o.name}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Telefonas</dt>
          <dd>
            <a href={phoneHref(o.phone)} className="text-sky-700 hover:underline">
              {o.phone}
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-slate-500">El. paštas</dt>
          <dd className="break-all">
            <a href={`mailto:${o.email}`} className="text-sky-700 hover:underline">
              {o.email}
            </a>
          </dd>
        </div>
        <div className="sm:col-span-3">
          <dt className="text-slate-500">Paėmimas</dt>
          <dd>{o.pickup ? `Taip – ${o.address}` : "Ne, atneš pats"}</dd>
        </div>
        {o.comment && (
          <div className="sm:col-span-3">
            <dt className="text-slate-500">Komentaras</dt>
            <dd className="whitespace-pre-wrap">{o.comment}</dd>
          </div>
        )}
      </dl>

      <form action={setStatus} className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        <input type="hidden" name="id" value={o.id} />
        {ORDER_STATUSES.map((s) => (
          <button
            key={s}
            name="status"
            value={s}
            disabled={s === o.status}
            className="rounded-lg px-3 py-1.5 text-xs font-medium ring-1 ring-slate-300 hover:bg-slate-50 disabled:bg-slate-900 disabled:text-white disabled:ring-slate-900"
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </form>
    </li>
  );
}
