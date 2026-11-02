// Paslaugų katalogas: naudojamas kainų sekcijoje, užsakymo formoje ir serverio validacijoje.
// Norint pakeisti kainą ar aprašymą – pakanka redaguoti šį failą.

export type DeviceType = "pc" | "keyboard" | "console" | "other";

export type Service = {
  id: string;
  device: DeviceType;
  name: string;
  price: string; // rodoma kaina, pvz. „Nuo 25 €“
  duration: string;
  description: string;
  includes: string[];
  excludes: string[];
};

export const devices: { id: DeviceType; label: string; icon: string }[] = [
  { id: "pc", label: "Kompiuteris", icon: "🖥️" },
  { id: "keyboard", label: "Klaviatūra", icon: "⌨️" },
  { id: "console", label: "Konsolė", icon: "🎮" },
  { id: "other", label: "Kita / biuro įranga", icon: "🖨️" },
];

export const services: Service[] = [
  {
    id: "keyboard-mechanical",
    device: "keyboard",
    name: "Mechaninės klaviatūros valymas",
    price: "Nuo 25 €",
    duration: "1–2 d. d.",
    description:
      "Visų klavišų nuėmimas, korpuso ir plokštės valymas, klavišų dangtelių plovimas ultragarsu.",
    includes: [
      "Visų klavišų dangtelių nuėmimas ir plovimas",
      "Plokštės (plate) ir korpuso valymas nuo dulkių, plaukų, trupinių",
      "Paviršių dezinfekavimas",
      "Veikimo patikrinimas po valymo",
    ],
    excludes: [
      "Jungiklių (switch) išlitavimas ir tepimas",
      "Skysčiu užlietos klaviatūros remontas",
    ],
  },
  {
    id: "pc-desktop",
    device: "pc",
    name: "Stacionaraus PC valymas",
    price: "Nuo 35 €",
    duration: "1–2 d. d.",
    description:
      "Korpuso, ventiliatorių, aušintuvų, maitinimo bloko išorės ir filtrų valymas nuo dulkių.",
    includes: [
      "Dulkių pašalinimas suspaustu oru ir antistatiniais šepetėliais",
      "Ventiliatorių, radiatorių ir dulkių filtrų valymas",
      "Korpuso išorės ir vidaus nuvalymas",
      "Kabelių sutvarkymas (jei įmanoma be papildomų detalių)",
      "Temperatūrų patikrinimas po valymo",
    ],
    excludes: [
      "Termopastos keitimas (+10 € už procesorių, +15 € už vaizdo plokštę)",
      "Maitinimo bloko ardymas",
      "Skystinio aušinimo (custom loop) aptarnavimas",
    ],
  },
  {
    id: "pc-laptop",
    device: "pc",
    name: "Nešiojamojo kompiuterio valymas",
    price: "Nuo 40 €",
    duration: "1–3 d. d.",
    description:
      "Nešiojamojo kompiuterio išardymas, aušinimo sistemos valymas ir temperatūrų patikra.",
    includes: [
      "Apatinio dangčio nuėmimas ir vidinis valymas",
      "Ventiliatoriaus ir radiatoriaus valymas",
      "Klaviatūros ir korpuso paviršių valymas",
      "Temperatūrų patikrinimas po valymo",
    ],
    excludes: [
      "Termopastos / termo pagalvėlių keitimas (+15 €)",
      "Pilnas išardymas, kai reikia nuimti pagrindinę plokštę (kaina derinama)",
      "Detalių keitimas ir remontas",
    ],
  },
  {
    id: "console",
    device: "console",
    name: "Žaidimų konsolės valymas",
    price: "Nuo 40 €",
    duration: "1–3 d. d.",
    description:
      "PlayStation, Xbox ar Nintendo konsolės išardymas, ventiliatoriaus ir radiatoriaus valymas.",
    includes: [
      "Konsolės išardymas ir surinkimas",
      "Ventiliatoriaus, radiatoriaus ir oro kanalų valymas",
      "Korpuso valymas",
      "Veikimo ir triukšmo patikrinimas",
    ],
    excludes: [
      "Termopastos / skysto metalo keitimas (+15–25 €)",
      "Pultelių (valdiklių) valymas (+10 € už vienetą)",
      "Remontas po skysčio išsiliejimo",
    ],
  },
  {
    id: "office",
    device: "other",
    name: "Biuro įrangos valymas",
    price: "Individualus pasiūlymas",
    duration: "Pagal susitarimą",
    description:
      "Kelių ar keliolikos biuro kompiuterių, monitorių ir periferijos valymas jūsų biure arba pas mus.",
    includes: [
      "Įrangos apžiūra ir darbų sąmata",
      "Valymas jūsų patalpose arba dirbtuvėje",
      "Sąskaita faktūra įmonei",
    ],
    excludes: ["Spausdintuvų techninis aptarnavimas ir remontas"],
  },
];

export const pickup = {
  title: "Paėmimas ir pristatymas",
  price: "Nuo 5 € į vieną pusę",
  description:
    "Galime įrenginį paimti iš jūsų namų ar biuro ir grąžinti po valymo. Kaina priklauso nuo rajono – suderinsime skambučio metu. Įrenginį taip pat galite atnešti patys nemokamai.",
};

export function getService(id: string) {
  return services.find((s) => s.id === id);
}

export function getDevice(id: string) {
  return devices.find((d) => d.id === id);
}
