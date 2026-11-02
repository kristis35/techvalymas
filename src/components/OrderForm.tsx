"use client";

import Script from "next/script";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitOrder, type OrderFormState } from "@/app/actions";
import { devices, services, type DeviceType } from "@/lib/services";
import { track } from "./analytics";

export const SELECT_SERVICE_EVENT = "techvalymas:select-service";

const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const input =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 aria-[invalid=true]:border-red-500";

function FieldError({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {msg}
    </p>
  );
}

export default function OrderForm() {
  const [state, action, pending] = useActionState<OrderFormState, FormData>(submitOrder, { ok: false });
  const v = state.values ?? {};
  const e = state.errors ?? {};

  const [device, setDevice] = useState<DeviceType | "">((v.device as DeviceType) ?? "");
  const [service, setService] = useState(v.service ?? "");
  const [pickup, setPickup] = useState(v.pickup === "on");
  // Kontroliuojamos reikšmės, kad React jų neatstatytų po formos pateikimo.
  const [meta, setMeta] = useState({ startedAt: 0, source: "" });
  const tracked = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reikšmės žinomos tik naršyklėje
    setMeta({
      startedAt: Date.now(),
      source: p.get("utm_source") ?? (document.referrer ? new URL(document.referrer).hostname : ""),
    });
    const onSelect = (ev: Event) => {
      const id = (ev as CustomEvent<string>).detail;
      const s = services.find((x) => x.id === id);
      if (s) {
        setDevice(s.device);
        setService(s.id);
      }
    };
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  useEffect(() => {
    if (state.ok && !tracked.current) {
      tracked.current = true;
      track("Užklausa pateikta");
    }
  }, [state.ok]);

  if (state.ok) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="text-4xl" aria-hidden>
          ✅
        </div>
        <h3 className="mt-3 text-xl font-semibold text-emerald-900">Užklausa gauta!</h3>
        <p className="mt-2 text-emerald-800">
          Ačiū! Patvirtinimą išsiuntėme el. paštu. Susisieksime per 1 darbo dieną ir suderinsime
          kainą, laiką bei įrenginio perdavimą.
        </p>
      </div>
    );
  }

  const deviceServices = services.filter((s) => s.device === device);

  return (
    <form action={action} noValidate className="space-y-6" onSubmit={() => track("Formos pateikimas")}>
      {/* Apsauga nuo botų */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Svetainė
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={meta.startedAt} readOnly />
      <input type="hidden" name="source" value={meta.source} readOnly />

      <fieldset>
        <legend className="mb-3 block font-medium text-slate-900">1. Koks įrenginys?</legend>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {devices.map((d) => (
            <label
              key={d.id}
              className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-slate-300 bg-white p-4 text-center text-sm font-medium text-slate-700 transition hover:border-sky-400 has-[:checked]:border-sky-500 has-[:checked]:bg-sky-50 has-[:checked]:text-sky-900 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-sky-100"
            >
              <input
                type="radio"
                name="device"
                value={d.id}
                checked={device === d.id}
                onChange={() => {
                  setDevice(d.id);
                  const only = services.filter((s) => s.device === d.id);
                  setService(only.length === 1 ? only[0].id : "");
                }}
                className="sr-only"
              />
              <span className="text-2xl" aria-hidden>
                {d.icon}
              </span>
              {d.label}
            </label>
          ))}
        </div>
        <FieldError id="err-device" msg={e.device} />
      </fieldset>

      <div>
        <label htmlFor="service" className="mb-2 block font-medium text-slate-900">
          2. Paslauga
        </label>
        <select
          id="service"
          name="service"
          className={input}
          value={service}
          onChange={(ev) => setService(ev.target.value)}
          disabled={!device}
          aria-invalid={Boolean(e.service)}
          aria-describedby={e.service ? "err-service" : undefined}
        >
          <option value="">{device ? "Pasirinkite paslaugą" : "Pirmiausia pasirinkite įrenginį"}</option>
          {deviceServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.price}
            </option>
          ))}
        </select>
        <FieldError id="err-service" msg={e.service} />
      </div>

      <div>
        <p className="mb-2 font-medium text-slate-900">3. Jūsų kontaktai</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className="mb-1 block text-sm text-slate-700">
              Vardas *
            </label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              defaultValue={v.name}
              className={input}
              aria-invalid={Boolean(e.name)}
              aria-describedby={e.name ? "err-name" : undefined}
              required
            />
            <FieldError id="err-name" msg={e.name} />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm text-slate-700">
              Telefonas *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+370 6xx xxxxx"
              defaultValue={v.phone}
              className={input}
              aria-invalid={Boolean(e.phone)}
              aria-describedby={e.phone ? "err-phone" : undefined}
              required
            />
            <FieldError id="err-phone" msg={e.phone} />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-slate-700">
              El. paštas *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={v.email}
              className={input}
              aria-invalid={Boolean(e.email)}
              aria-describedby={e.email ? "err-email" : undefined}
              required
            />
            <FieldError id="err-email" msg={e.email} />
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 text-slate-800">
          <input
            type="checkbox"
            name="pickup"
            checked={pickup}
            onChange={(ev) => setPickup(ev.target.checked)}
            className="mt-1 size-5 accent-sky-600"
          />
          <span>
            <span className="font-medium">Reikia paėmimo ir pristatymo</span>
            <span className="block text-sm text-slate-500">Nuo 5 € į vieną pusę, tiksli kaina derinama</span>
          </span>
        </label>
        {pickup && (
          <div className="mt-3">
            <label htmlFor="address" className="mb-1 block text-sm text-slate-700">
              Adresas arba rajonas *
            </label>
            <input
              id="address"
              name="address"
              autoComplete="street-address"
              placeholder="Pvz. Žirmūnai, Kalvarijų g."
              defaultValue={v.address}
              className={input}
              aria-invalid={Boolean(e.address)}
              aria-describedby={e.address ? "err-address" : undefined}
            />
            <FieldError id="err-address" msg={e.address} />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="comment" className="mb-1 block font-medium text-slate-900">
          Komentaras apie įrenginio būklę
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          maxLength={2000}
          placeholder="Modelis, kiek laiko nevalytas, ar kaista, triukšmauja, ar buvo užlietas…"
          defaultValue={v.comment}
          className={input}
          aria-invalid={Boolean(e.comment)}
        />
        <FieldError id="err-comment" msg={e.comment} />
      </div>

      {turnstileKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
          <div className="cf-turnstile" data-sitekey={turnstileKey} data-language="lt" />
        </>
      )}

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={v.consent === "on"}
            className="mt-0.5 size-5 accent-sky-600"
            aria-invalid={Boolean(e.consent)}
            aria-describedby={e.consent ? "err-consent" : undefined}
          />
          <span>
            Sutinku, kad mano pateikti duomenys būtų naudojami susisiekti dėl šios užklausos, kaip
            aprašyta{" "}
            <Link href="/privatumo-politika" className="text-sky-700 underline" target="_blank">
              privatumo politikoje
            </Link>
            . *
          </span>
        </label>
        <FieldError id="err-consent" msg={e.consent} />
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-sky-600 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:opacity-60"
      >
        {pending ? "Siunčiama…" : "Pateikti užklausą"}
      </button>
      <p className="text-center text-sm text-slate-500">
        Tai užklausa, o ne galutinė rezervacija – kainą ir laiką suderinsime telefonu.
      </p>
    </form>
  );
}
