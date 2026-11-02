// Pagrindiniai svetainės nustatymai. Kontaktus galima keisti per aplinkos kintamuosius
// (žr. .env.example), kad nereikėtų keisti kodo.

export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "TechValymas",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  city: process.env.NEXT_PUBLIC_CITY ?? "Vilnius",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+370 600 00000",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "info@techvalymas.lt",
  workingHours: process.env.NEXT_PUBLIC_WORKING_HOURS ?? "I–V 9:00–19:00, VI 10:00–15:00",
  // Duomenų valdytojas privatumo politikoje (vardas, pavardė arba įmonė / individuali veikla).
  controller: process.env.NEXT_PUBLIC_DATA_CONTROLLER ?? "TechValymas (individuali veikla)",
  tagline: "Profesionalus kompiuterių, klaviatūrų ir konsolių valymas",
  description:
    "Profesionalus stacionarių ir nešiojamųjų kompiuterių, mechaninių klaviatūrų bei žaidimų konsolių valymas. Aiškios kainos, saugus darbas, paėmimas ir pristatymas.",
};

export function phoneHref(phone = site.phone) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
