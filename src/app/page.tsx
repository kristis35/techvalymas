import Link from "next/link";
import OrderForm from "@/components/OrderForm";
import OrderButton from "@/components/OrderButton";
import { services, pickup } from "@/lib/services";
import { beforeAfter, faq, showBeforeAfter, howItWorks, processSteps, safety } from "@/lib/content";
import { phoneHref, site } from "@/lib/site";

const nav = [
  { href: "#paslaugos", label: "Paslaugos ir kainos" },
  ...(showBeforeAfter ? [{ href: "#pries-po", label: "Prieš / Po" }] : []),
  { href: "#procesas", label: "Procesas" },
  { href: "#duk", label: "DUK" },
  { href: "#kontaktai", label: "Kontaktai" },
];

const ctaPrimary =
  "inline-flex items-center justify-center rounded-xl bg-sky-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-600/25 transition hover:bg-sky-700";

function SectionTitle({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-sky-600">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-slate-600">{intro}</p>}
    </div>
  );
}

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    areaServed: site.city,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "LT" },
    makesOffer: services.map((s) => ({
      "@type": "Offer",
      name: s.name,
      description: s.description,
      ...(s.price.match(/\d+/) ? { priceSpecification: { "@type": "PriceSpecification", minPrice: Number(s.price.match(/\d+/)![0]), priceCurrency: "EUR" } } : {}),
    })),
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
    </>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd />
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <a href="#" className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <span className="grid size-8 place-items-center rounded-lg bg-sky-600 text-white" aria-hidden>
              ✦
            </span>
            {site.name}
          </a>
          <nav className="hidden gap-6 text-sm font-medium text-slate-600 md:flex" aria-label="Pagrindinė navigacija">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-sky-700">
                {n.label}
              </a>
            ))}
          </nav>
          <OrderButton
            trackAs="CTA antraštėje"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Užsisakyti
          </OrderButton>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 to-white">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm font-medium text-sky-700 ring-1 ring-sky-200">
                📍 {site.city} · paėmimas ir pristatymas
              </p>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Jūsų technika vėl tyli, vėsi ir švari
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">
                Profesionaliai išvalome stacionarius ir nešiojamuosius kompiuterius, mechanines
                klaviatūras ir žaidimų konsoles. Mažiau triukšmo, žemesnės temperatūros, ilgesnis
                įrenginio tarnavimas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <OrderButton className={ctaPrimary} trackAs="CTA pagrindinis">
                  Užsisakyti valymą
                </OrderButton>
                <a
                  href="#paslaugos"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-800 hover:border-sky-400"
                >
                  Žiūrėti kainas
                </a>
              </div>
              <ul className="mt-8 grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-3">
                <li>✔ Kaina suderinama iš anksto</li>
                <li>✔ Nuotraukos prieš ir po</li>
                <li>✔ Atsakome per 1 d. d.</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["🖥️", "PC", "nuo 35 €"],
                ["💻", "Nešiojamieji", "nuo 40 €"],
                ["⌨️", "Klaviatūros", "nuo 25 €"],
                ["🎮", "Konsolės", "nuo 40 €"],
              ].map(([icon, label, price]) => (
                <div key={label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="text-4xl" aria-hidden>
                    {icon}
                  </div>
                  <p className="mt-3 font-semibold text-slate-900">{label}</p>
                  <p className="text-sm text-sky-700">{price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KAIP VEIKIA */}
        <section className="py-16 sm:py-20" aria-labelledby="kaip-veikia">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="Kaip tai veikia" title="Keturi paprasti žingsniai" />
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" id="kaip-veikia">
              {howItWorks.map((s, i) => (
                <li key={s.title} className="rounded-2xl border border-slate-200 p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-sky-100 font-bold text-sky-700">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PASLAUGOS IR KAINOS */}
        <section id="paslaugos" className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle
              eyebrow="Paslaugos ir kainos"
              title="Aiškios kainos be staigmenų"
              intro="Nurodytos orientacinės kainos. Tikslią kainą pagal modelį ir užterštumą suderiname prieš pradedant darbus."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article key={s.id} className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">{s.name}</h3>
                  <p className="mt-1 text-2xl font-bold text-sky-700">{s.price}</p>
                  <p className="text-xs text-slate-500">Trukmė: {s.duration}</p>
                  <p className="mt-3 text-sm text-slate-600">{s.description}</p>
                  <h4 className="mt-4 text-sm font-semibold text-slate-900">Kas įeina</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                    {s.includes.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="text-emerald-600" aria-hidden>
                          ✔
                        </span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-4 text-sm font-semibold text-slate-900">Neįeina (papildomai)</h4>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-500">
                    {s.excludes.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span aria-hidden>–</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    <OrderButton
                      serviceId={s.id}
                      trackAs="Paslaugos pasirinkimas"
                      className="block w-full rounded-xl border border-sky-600 px-4 py-2.5 text-center font-semibold text-sky-700 transition hover:bg-sky-600 hover:text-white"
                    >
                      Užsakyti
                    </OrderButton>
                  </div>
                </article>
              ))}
              <article className="flex flex-col rounded-2xl bg-sky-600 p-6 text-white shadow-sm">
                <div className="text-3xl" aria-hidden>
                  🚗
                </div>
                <h3 className="mt-3 text-lg font-semibold">{pickup.title}</h3>
                <p className="mt-1 text-2xl font-bold">{pickup.price}</p>
                <p className="mt-3 text-sm text-sky-50">{pickup.description}</p>
              </article>
            </div>
          </div>
        </section>

        {/* PRIEŠ / PO – rodoma tik kai showBeforeAfter = true (src/lib/content.ts) */}
        {showBeforeAfter && (
        <section id="pries-po" className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <SectionTitle eyebrow="Prieš / Po" title="Rezultatas, kurį matote" intro="Kiekvieną įrenginį fotografuojame prieš ir po valymo." />
            <div className="grid gap-8 md:grid-cols-3">
              {beforeAfter.map((b) => (
                <figure key={b.title} className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <div className="grid grid-cols-2">
                    {[
                      [b.before, "Prieš"],
                      [b.after, "Po"],
                    ].map(([src, label]) => (
                      <div key={label} className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${b.title} – ${label.toLowerCase()} valymą`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                        <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white">{label}</span>
                      </div>
                    ))}
                  </div>
                  <figcaption className="p-4">
                    <p className="font-semibold text-slate-900">{b.title}</p>
                    <p className="text-sm text-slate-600">{b.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* PROCESAS IR SAUGUMAS */}
        <section id="procesas" className="bg-slate-900 py-16 text-slate-100 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-400">Valymo procesas</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Kaip valome</h2>
              <ol className="mt-8 space-y-6">
                {processSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sky-500/20 font-bold text-sky-300">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold text-white">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl bg-white/5 p-8 ring-1 ring-white/10">
              <p className="text-sm font-semibold uppercase tracking-wider text-sky-400">Atsakomybė ir saugumas</p>
              <h2 className="mt-2 text-2xl font-bold text-white">Jūsų įrenginys – saugiose rankose</h2>
              <ul className="mt-6 space-y-4">
                {safety.map((s) => (
                  <li key={s} className="flex gap-3 text-sm leading-relaxed text-slate-300">
                    <span className="text-sky-400" aria-hidden>
                      🛡
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* DUK */}
        <section id="duk" className="py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <SectionTitle eyebrow="DUK" title="Dažniausiai užduodami klausimai" />
            <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200">
              {faq.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-medium text-slate-900">
                    {f.q}
                    <span className="text-xl text-sky-600 transition group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* UŽSAKYMAS */}
        <section id="uzsakymas" className="bg-gradient-to-b from-sky-50 to-white py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-4">
            <SectionTitle
              eyebrow="Užsakymas"
              title="Užsisakykite valymą"
              intro="Užpildykite formą – susisieksime per 1 darbo dieną ir suderinsime kainą bei laiką."
            />
            <div className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200 sm:p-8">
              <OrderForm />
            </div>
          </div>
        </section>
      </main>

      {/* KONTAKTAI */}
      <footer id="kontaktai" className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900">{site.name}</p>
            <p className="mt-2 text-sm text-slate-600">{site.tagline}.</p>
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Kontaktai</p>
            <p className="mt-2">📍 Aptarnaujame: {site.city} ir apylinkės</p>
            <p className="mt-1">
              📞 <a href={phoneHref()} className="hover:text-sky-700">{site.phone}</a>
            </p>
            <p className="mt-1">
              ✉️ <a href={`mailto:${site.email}`} className="hover:text-sky-700">{site.email}</a>
            </p>
            <p className="mt-1">🕒 {site.workingHours}</p>
          </div>
          <div className="text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Informacija</p>
            <p className="mt-2">
              <Link href="/privatumo-politika" className="hover:text-sky-700">
                Privatumo politika
              </Link>
            </p>
            <p className="mt-1">
              <a href="#duk" className="hover:text-sky-700">DUK</a>
            </p>
          </div>
        </div>
        <p className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © {site.name}. Visos teisės saugomos.
        </p>
      </footer>
    </>
  );
}
