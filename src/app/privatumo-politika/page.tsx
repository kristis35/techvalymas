import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privatumo politika",
  description: `Kaip ${site.name} tvarko užsakymo formoje pateiktus asmens duomenis.`,
  alternates: { canonical: "/privatumo-politika" },
};

const analyticsOn = Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <Link href="/" className="text-sm text-sky-700 hover:underline">
        ← Grįžti į pradžią
      </Link>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Privatumo politika</h1>
      <p className="mt-2 text-sm text-slate-500">
        Šioje politikoje paaiškinama, kokius asmens duomenis renkame per svetainę, kodėl ir kaip juos
        tvarkome, vadovaudamiesi Bendruoju duomenų apsaugos reglamentu (BDAR, ES 2016/679) ir
        Lietuvos Respublikos asmens duomenų teisinės apsaugos įstatymu.
      </p>

      <div className="prose-like mt-8 space-y-8 leading-relaxed text-slate-700 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_li]:ml-5 [&_li]:list-disc [&_ul]:mt-2 [&_ul]:space-y-1">
        <section>
          <h2>1. Duomenų valdytojas</h2>
          <p className="mt-2">
            {site.controller}. Kontaktai: el. paštas{" "}
            <a className="text-sky-700 underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            , tel. {site.phone}.
          </p>
        </section>

        <section>
          <h2>2. Kokius duomenis renkame</h2>
          <ul>
            <li>Vardą, telefono numerį ir el. pašto adresą;</li>
            <li>adresą arba rajoną – tik jei pasirenkate paėmimo ir pristatymo paslaugą;</li>
            <li>pasirinktą įrenginio tipą, paslaugą ir jūsų komentarą apie įrenginio būklę;</li>
            <li>užklausos pateikimo laiką ir šaltinį (pvz. iš kurios svetainės atėjote).</li>
          </ul>
          <p className="mt-2">
            Prašome komentare nenurodyti slaptažodžių, sveikatos ar kitų jautrių duomenų.
          </p>
        </section>

        <section>
          <h2>3. Tikslai ir teisinis pagrindas</h2>
          <ul>
            <li>
              Atsakyti į užklausą, suderinti kainą, laiką ir įrenginio perdavimą – veiksmai prieš
              sudarant sutartį jūsų prašymu (BDAR 6 str. 1 d. b p.);
            </li>
            <li>paslaugos suteikimas ir apskaita – sutarties vykdymas ir teisinės prievolės (b ir c p.);</li>
            <li>
              svetainės apsauga nuo automatinių (šlamšto) užklausų – teisėtas interesas (f p.).
            </li>
          </ul>
          <p className="mt-2">Duomenų nenaudojame tiesioginei rinkodarai be atskiro jūsų sutikimo.</p>
        </section>

        <section>
          <h2>4. Saugojimo terminai</h2>
          <ul>
            <li>Užklausos, iš kurių nebuvo užsakymo, – iki 12 mėnesių nuo pateikimo;</li>
            <li>
              užsakymų ir apskaitos duomenys – tiek, kiek reikalauja teisės aktai (buhalterinės
              apskaitos dokumentai – iki 10 metų).
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Duomenų gavėjai</h2>
          <p className="mt-2">
            Duomenų neparduodame. Jie gali būti tvarkomi mūsų paslaugų teikėjų (duomenų tvarkytojų)
            – svetainės talpinimo, duomenų bazės ir el. laiškų siuntimo paslaugų – tik tiek, kiek
            reikia šioms paslaugoms teikti, ir laikantis BDAR reikalavimų.
          </p>
        </section>

        <section>
          <h2>6. Slapukai ir analitika</h2>
          <p className="mt-2">
            Lankytojams svetainė nenaudoja reklaminių ar sekimo slapukų.{" "}
            {analyticsOn
              ? "Lankomumui matuoti naudojame Plausible Analytics – privatumą tausojantį įrankį, kuris nenaudoja slapukų ir nerenka asmenį identifikuojančių duomenų (statistika agreguota)."
              : "Jei įjungsime lankomumo statistiką, naudosime tik privatumą tausojantį įrankį, kuris nenaudoja slapukų ir nerenka asmenį identifikuojančių duomenų."}{" "}
            Administravimo dalyje naudojamas tik techniškai būtinas prisijungimo slapukas.
          </p>
        </section>

        <section>
          <h2>7. Jūsų teisės</h2>
          <p className="mt-2">Jūs turite teisę:</p>
          <ul>
            <li>susipažinti su savo duomenimis ir gauti jų kopiją;</li>
            <li>reikalauti ištaisyti netikslius duomenis;</li>
            <li>reikalauti ištrinti duomenis („teisė būti pamirštam“);</li>
            <li>apriboti duomenų tvarkymą ar nesutikti su juo;</li>
            <li>į duomenų perkeliamumą.</li>
          </ul>
          <p className="mt-2">
            Dėl šių teisių kreipkitės el. paštu {site.email}. Atsakysime ne vėliau kaip per 1 mėnesį.
            Jei manote, kad jūsų duomenys tvarkomi neteisėtai, galite pateikti skundą{" "}
            <a
              className="text-sky-700 underline"
              href="https://vdai.lrv.lt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Valstybinei duomenų apsaugos inspekcijai
            </a>
            .
          </p>
        </section>

        <section>
          <h2>8. Pakeitimai</h2>
          <p className="mt-2">
            Ši politika gali būti atnaujinama. Aktuali versija visada skelbiama šiame puslapyje.
          </p>
        </section>
      </div>
    </main>
  );
}
