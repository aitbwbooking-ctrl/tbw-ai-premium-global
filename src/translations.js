// translations.js – jezici + osnovne fraze

export const LANGS = {
  hr: "Hrvatski",
  en: "English",
  de: "Deutsch",
  it: "Italiano",
  fr: "Français",
  es: "Español",
  pt: "Português",
  ru: "Русский",
  pl: "Polski",
  cs: "Čeština",
  sl: "Slovenščina",
  tr: "Türkçe",
  ne: "नेपाली",
  hi: "हिन्दी",
  bg: "Български",
  ro: "Română",
  ko: "한국어",
  sv: "Svenska",
  no: "Norsk",
  fi: "Suomi",
  ar: "العربية",
  sq: "Shqip",
  nl: "Nederlands",
  uk: "Українська",
  zh: "中文",
  ja: "日本語"
};

// osnovne fraze – potpuna podrška za hr/en/de,
// ostali jezici fallback na en da sve radi
export const T = {
  hr: {
    searchPlaceholder: "Pitaj TBW…",
    navigation: "Navigacija",
    weather: "Vrijeme",
    accommodation: "Smještaj",
    events: "Eventi",
    traffic: "Promet uživo",
    shops: "Trgovine & energija",
    sos: "Sigurnost & SOS",
    cityLabel: "Grad",
    premiumNavTitle: "TBW premium navigacija",
    premiumNavText:
      "Vrhunska TBW AI navigacija s glasom, kamerama, radovima, truck profilom i prometom u realnom vremenu.",
    freeNavText:
      "Osnovna navigacija – otvara Google Maps. Pun TBW AI motor dostupan je u Premium modu.",
    weatherTitleModal: "Detaljna prognoza",
    weatherText:
      "Vrijeme, temperatura, vjetar i uvjeti na ruti. U premium modu koristiš live API podatke.",
    accommodationText:
      "TBW filtrira smještaj prema cijeni, lokaciji i recenzijama. U demo modu otvaraju se vanjski servisi.",
    trafficText:
      "Stanje na cestama, radovi, nesreće i zastoje. Premium koristi TBW motor i prometne izvore.",
    eventsText:
      "Koncerti, događanja, nightlife i lokalne preporuke po gradu koji je odabran.",
    shopsText:
      "Trgovine, shopping centri, benzinske i punjači u tvojoj blizini.",
    sosText:
      "SOS profil, ICE kontakti i brzi pozivi hitnim službama. TBW je informativan alat – uvijek slijedi upute službi."
  },
  en: {
    searchPlaceholder: "Ask TBW…",
    navigation: "Navigation",
    weather: "Weather",
    accommodation: "Accommodation",
    events: "Events",
    traffic: "Live traffic",
    shops: "Shops & energy",
    sos: "Safety & SOS",
    cityLabel: "City",
    premiumNavTitle: "TBW premium navigation",
    premiumNavText:
      "Top-level TBW AI navigation with voice, cameras, road works, truck profile and live traffic.",
    freeNavText:
      "Basic navigation – opens Google Maps. Full TBW AI engine is available in Premium mode.",
    weatherTitleModal: "Detailed forecast",
    weatherText:
      "Weather, temperature, wind and conditions along your route. Premium uses live API data.",
    accommodationText:
      "TBW filters stays by price, location and reviews. In demo mode external booking sites open.",
    trafficText:
      "Road conditions, road works, incidents and delays. Premium uses TBW engine and traffic sources.",
    eventsText:
      "Concerts, events, nightlife and local recommendations for the selected city.",
    shopsText:
      "Groceries, shopping malls, gas stations and EV chargers around you.",
    sosText:
      "SOS profile, ICE contacts and quick emergency calls. TBW is an informational tool – always follow official emergency instructions."
  },
  de: {
    searchPlaceholder: "Frag TBW…",
    navigation: "Navigation",
    weather: "Wetter",
    accommodation: "Unterkunft",
    events: "Events",
    traffic: "Live Verkehr",
    shops: "Geschäfte & Energie",
    sos: "Sicherheit & SOS",
    cityLabel: "Stadt",
    premiumNavTitle: "TBW Premium Navigation",
    premiumNavText:
      "Hochwertige TBW AI Navigation mit Stimme, Kameras, Baustellen, LKW-Profil und Live-Verkehr.",
    freeNavText:
      "Basisnavigation – öffnet Google Maps. Voller TBW AI Motor ist im Premium-Modus verfügbar.",
    weatherTitleModal: "Detaillierte Vorhersage",
    weatherText:
      "Wetter, Temperatur, Wind und Bedingungen entlang der Route. Premium nutzt Live-API-Daten.",
    accommodationText:
      "TBW filtert Unterkünfte nach Preis, Lage und Bewertungen. Im Demo-Modus werden externe Seiten geöffnet.",
    trafficText:
      "Verkehrslage, Baustellen, Unfälle und Staus. Premium nutzt den TBW Motor und Verkehrsquellen.",
    eventsText:
      "Konzerte, Veranstaltungen, Nightlife und lokale Empfehlungen für die ausgewählte Stadt.",
    shopsText:
      "Lebensmittel, Einkaufszentren, Tankstellen und EV-Ladestationen in deiner Nähe.",
    sosText:
      "SOS-Profil, ICE-Kontakte und schnelle Notrufe. TBW ist ein Informations-Tool – folge immer offiziellen Anweisungen."
  }
};

// fallback: svi ostali jezici koriste en tekstove
Object.keys(LANGS).forEach((code) => {
  if (!T[code]) {
    T[code] = { ...T.en };
  }
});
