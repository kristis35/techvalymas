# TechValymas – elektronikos valymo paslaugų svetainė (MVP v1.0)

Vieno puslapio, mobiliesiems pritaikyta svetainė su paslaugų aprašymais, kainomis,
nuotraukomis prieš / po, DUK, užsakymo (užklausos) forma, automatiniais el. laiškais ir
paprasta administravimo panele.

**Pagrindinis rodiklis:** kiek lankytojų pateikia užklausas ir kiek jų virsta mokamais
klientais (būsena „Baigtas“). Abu skaičiai matomi `/admin` viršuje.

## Technologijos

Next.js 16 (App Router, Server Actions) · Tailwind CSS 4 · PostgreSQL / Supabase (arba JSON
failas) · Resend arba SMTP · Plausible (neprivaloma) · Cloudflare Turnstile (neprivaloma).

## Paleidimas

```bash
npm install
cp .env.example .env.local   # užpildykite reikšmes
npm run dev                  # http://localhost:3000
```

Produkcijai:

```bash
npm run build && npm start
```

Be jokių nustatymų svetainė veikia iškart: užsakymai saugomi `data/orders.json`, o laiškai
tik išvedami į serverio žurnalą. Administravimui reikia `ADMIN_PASSWORD`.

## Struktūra

| Kelias | Paskirtis |
| --- | --- |
| `/` | Pagrindinis puslapis: hero, kaip veikia, paslaugos ir kainos, prieš/po, procesas ir atsakomybė, DUK, užsakymo forma, kontaktai |
| `/privatumo-politika` | Privatumo politika (BDAR) |
| `/admin` | Užsakymų sąrašas, filtrai, būsenų keitimas, statistika |
| `/admin/prisijungti` | Prisijungimas slaptažodžiu |
| `/sitemap.xml`, `/robots.txt` | SEO |

### Ką redaguoti

- **Kainos, paslaugos, kas įeina / neįeina** – `src/lib/services.ts`
- **DUK, procesas, atsakomybė, nuotraukos prieš/po** – `src/lib/content.ts`
- **Kontaktai, miestas, darbo laikas** – aplinkos kintamieji `NEXT_PUBLIC_*` (`src/lib/site.ts`)
- **Nuotraukos** – `public/pries-po/`. Dabar ten pavyzdinės SVG iliustracijos: prieš paleidžiant
  pakeiskite jas **tikromis** savo darbų nuotraukomis ir atnaujinkite aprašymus `content.ts`.
- **Privatumo politika** – `src/app/privatumo-politika/page.tsx` (patikrinkite duomenų valdytojo
  rekvizitus ir saugojimo terminus).

## Užsakymo eiga

1. Klientas pasirenka įrenginį ir paslaugą (arba paspaudžia „Užsakyti“ prie kainos – paslauga
   pažymima automatiškai), įveda kontaktus, pasirinktinai – paėmimo adresą ir komentarą.
2. Serveris validuoja duomenis, patikrina apsaugą nuo botų ir išsaugo užklausą (būsena „Naujas“).
3. Administratoriui (`ADMIN_EMAIL`) siunčiamas pranešimas, klientui – gavimo patvirtinimas.
   Laiškai siunčiami po atsakymo naršyklei (`after()`), todėl forma neužtrunka.
4. Administratorius susisiekia ir keičia būseną: naujas → susisiekta → patvirtintas → baigtas
   (arba atšauktas).

Užklausa **nėra** rezervacija – tai aiškiai parašyta formoje, laiške ir DUK.

## Apsauga nuo automatinių užklausų

- Paslėptas „honeypot“ laukas;
- minimalus formos pildymo laikas (3 s);
- ne daugiau kaip 5 užklausos iš vieno IP per 10 min. (atmintyje);
- pasirinktinai Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`).

Botams grąžinamas „sėkmės“ atsakymas, kad jie nesužinotų, jog buvo atpažinti.

## Analitika

Nustačius `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` įjungiamas Plausible (be slapukų). Siunčiami įvykiai:
`CTA pagrindinis`, `CTA antraštėje`, `Paslaugos pasirinkimas`, `Formos pateikimas`,
`Užklausa pateikta`. Plausible nustatymuose juos pridėkite kaip „Goals“, kad matytumėte
konversijas. Užklausų → mokamų klientų santykis matomas `/admin`.

## Duomenų bazė

Nustačius `DATABASE_URL` naudojama PostgreSQL (tinka ir Supabase – naudokite „connection
string“ ir `DATABASE_SSL=true`). Lentelė sukuriama automatiškai; schema – `db/schema.sql`.

JSON failo režimas skirtas vystymui arba vienam VPS procesui. Vercel ar kitoje „serverless“
aplinkoje failų sistema nėra nuolatinė – ten **būtina** naudoti `DATABASE_URL`.

## Diegimas

- **Vercel:** importuokite repozitoriją, nustatykite aplinkos kintamuosius (`DATABASE_URL`
  būtinas), deploy.
- **VPS:** `npm ci && npm run build && npm start` (pvz. per `pm2` ar systemd) už Nginx/Caddy su
  HTTPS. Įsitikinkite, kad atvirkštinis tarpinis serveris perduoda `X-Forwarded-For` (reikia
  užklausų ribojimui pagal IP).

## Ko sąmoningai nėra (v1)

Klientų paskyrų, internetinių mokėjimų, rezervacijų kalendoriaus, nuolaidų sistemos, programėlės,
AI asistento, užsakymų sekimo, kainų redagavimo per panelę. Pridėsime, kai bus realių užsakymų.
