// Tekstinis turinys: kaip veikia, procesas, DUK, nuotraukos prieš/po.

export const howItWorks = [
  {
    title: "Pasirenkate įrenginį",
    text: "Kompiuteris, klaviatūra ar konsolė – pažymite formoje ir trumpai aprašote būklę.",
  },
  {
    title: "Pateikiate užklausą",
    text: "Užtrunka mažiau nei minutę. Iškart gaunate patvirtinimą el. paštu.",
  },
  {
    title: "Susisiekiame",
    text: "Per 1 darbo dieną paskambiname, suderiname tikslią kainą, laiką ir perdavimą.",
  },
  {
    title: "Išvalome ir grąžiname",
    text: "Atnešate patys arba paimame. Po valymo – patikra ir nuotraukos prieš / po.",
  },
];

export const processSteps = [
  {
    title: "Apžiūra ir nuotraukos",
    text: "Priėmę įrenginį jį nufotografuojame ir patikriname, ar veikia. Jei pastebime gedimų – informuojame prieš pradedant darbus.",
  },
  {
    title: "Saugus išardymas",
    text: "Dirbame ant antistatinio kilimėlio su įžeminimo apyranke, naudojame tinkamus atsuktuvus ir plastikinius įrankius.",
  },
  {
    title: "Valymas",
    text: "Suspaustas oras, antistatiniai šepetėliai, izopropilo alkoholis (99 %), ultragarsinė vonelė klaviatūrų dangteliams. Ventiliatoriai fiksuojami, kad nesisuktų per greitai.",
  },
  {
    title: "Surinkimas ir testavimas",
    text: "Surenkame, išmatuojame temperatūras ir triukšmą apkrovos metu, palyginame su būkle prieš valymą.",
  },
];

export const safety = [
  "Kiekvienas įrenginys fotografuojamas priimant ir grąžinant.",
  "Jūsų duomenų (failų) nežiūrime ir nekopijuojame – įrenginio net nereikia įjungti su jūsų paskyra.",
  "Darbai, kurių nėra kainoje (pvz. termopastos keitimas), atliekami tik jums sutikus.",
  "Jei per valymą įrenginys sugadinamas dėl mūsų kaltės – atlyginame remontą arba žalą.",
  "Neatsakome už iki valymo buvusius ar paslėptus gedimus (pvz. po skysčio išsiliejimo), bet apie juos informuojame.",
];

export const faq = [
  {
    q: "Kiek kainuoja valymas?",
    a: "Kainos prasideda nuo 25 € (klaviatūra), 35 € (stacionarus PC), 40 € (nešiojamasis ar konsolė). Tiksli kaina priklauso nuo modelio ir užterštumo – ją visada suderiname prieš pradedant darbus.",
  },
  {
    q: "Ar užklausa įpareigoja užsisakyti?",
    a: "Ne. Užklausa nėra rezervacija ar sutartis. Paskambinsime, pasakysime kainą ir tik jums sutikus sutarsime laiką.",
  },
  {
    q: "Kiek laiko trunka valymas?",
    a: "Dažniausiai 1–3 darbo dienas. Skubiais atvejais galime padaryti tą pačią dieną – paminėkite tai komentare.",
  },
  {
    q: "Kaip dažnai reikia valyti kompiuterį ar konsolę?",
    a: "Rekomenduojame kas 12–18 mėnesių, o jei namuose yra gyvūnų ar rūkoma – kas 6–12 mėnesių. Ženklai, kad laikas: triukšmingas ventiliatorius, aukšta temperatūra, strigimai žaidžiant.",
  },
  {
    q: "Ar reikia keisti termopastą?",
    a: "Ne visada. Jei įrenginiui daugiau nei 3–4 metai arba temperatūros išlieka aukštos po valymo, rekomenduosime keitimą. Tai papildoma paslauga ir atliekama tik jums sutikus.",
  },
  {
    q: "Ar prarasiu garantiją?",
    a: "Išorinis valymas garantijos nepažeidžia. Jei įrenginys dar turi gamintojo garantiją, o valymui reikia jį ardyti, apie tai įspėsime iš anksto ir sprendimą priimsite jūs.",
  },
  {
    q: "Ar galite paimti įrenginį iš namų?",
    a: "Taip, paėmimo ir pristatymo paslauga kainuoja nuo 5 € į vieną pusę. Formoje pažymėkite „Reikia paėmimo“ ir nurodykite rajoną.",
  },
  {
    q: "Kaip galiu atsiskaityti?",
    a: "Grynaisiais arba banko pavedimu atsiimant įrenginį. Įmonėms išrašome sąskaitą faktūrą.",
  },
];

// Nuotraukos prieš / po. Pakeiskite failus public/pries-po/ kataloge tikromis savo darbų
// nuotraukomis (rekomenduojama 1200×900 px, JPG/WebP) ir atnaujinkite kelius čia.
// Kol tikrų nuotraukų nėra, skiltis paslėpta. Įkėlę nuotraukas, pakeiskite į `true` –
// skiltis ir nuoroda meniu atsiras automatiškai.
export const showBeforeAfter = false;

export const beforeAfter = [
  {
    title: "Žaidimų PC",
    caption: "Pakeiskite šį aprašymą tikru rezultatu (pvz. temperatūra prieš ir po).",
    before: "/pries-po/pc-pries.svg",
    after: "/pries-po/pc-po.svg",
  },
  {
    title: "Mechaninė klaviatūra",
    caption: "Pakeiskite šį aprašymą tikru rezultatu.",
    before: "/pries-po/klaviatura-pries.svg",
    after: "/pries-po/klaviatura-po.svg",
  },
  {
    title: "PlayStation 5",
    caption: "Pakeiskite šį aprašymą tikru rezultatu.",
    before: "/pries-po/konsole-pries.svg",
    after: "/pries-po/konsole-po.svg",
  },
];
