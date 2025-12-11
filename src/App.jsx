import { useEffect, useState } from "react";
import { LANGS, T } from "./translations";
import "./App.css";

const HERO_MAP = {
  Zagreb: "/hero-zagreb.jpg",
  Split: "/hero-split.jpg",
  Karlovac: "/hero-karlovac.jpg",
  Zadar: "/hero-zadar.jpg"
};

const CITIES = ["Zadar", "Split", "Zagreb", "Karlovac"];

export default function App() {
  const [lang, setLang] = useState("hr");
  const [mode, setMode] = useState("trial"); // trial | demo | premium
  const [city, setCity] = useState("Zadar");
  const [hero, setHero] = useState(HERO_MAP["Zadar"]);
  const [search, setSearch] = useState("");
  const [activeWindow, setActiveWindow] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [listening, setListening] = useState(false);

  const dict = T[lang];

  // INTRO – svaki ulazak
  useEffect(() => {
    const vid = document.getElementById("tbw-intro-video");
    if (!vid) {
      const t = setTimeout(() => setShowIntro(false), 2500);
      return () => clearTimeout(t);
    }
    vid.onended = () => setShowIntro(false);
  }, []);

  // HERO slika po gradu
  useEffect(() => {
    setHero(HERO_MAP[city] || HERO_MAP["Zadar"]);
  }, [city]);

  // TIKER tekst
  const tickerText =
    "Traffic · Weather · Sea · Events · Shops · Airports · TBW AI LIVE · Informational only – always follow official sources.";

  const runSearch = (query) => {
    const q = query.trim();
    if (!q) return;

    // prepoznavanje grada iz govora/teksta
    const lower = q.toLowerCase();
    if (lower.includes("split")) setCity("Split");
    if (lower.includes("zadar")) setCity("Zadar");
    if (lower.includes("zagreb")) setCity("Zagreb");
    if (lower.includes("karlovac")) setCity("Karlovac");

    // smještaj
    if (
      lower.includes("apartman") ||
      lower.includes("apartmane") ||
      lower.includes("smještaj") ||
      lower.includes("apartment") ||
      lower.includes("hotel")
    ) {
      setActiveWindow("accommodation");
      return;
    }

    // navigacija
    if (
      lower.includes("navigiraj") ||
      lower.includes("vodi me") ||
      lower.includes("route") ||
      lower.includes("navigate")
    ) {
      openNav();
      return;
    }

    // default – demo TBW AI engine
    if (mode === "premium") {
      alert("TBW AI premium engine – synced search for:\n\n" + q);
    } else {
      window.open(
        "https://www.google.com/search?q=" + encodeURIComponent(q),
        "_blank"
      );
    }
  };

  const handleSearch = () => {
    runSearch(search);
  };

  const handleMic = () => {
    // voice samo u premium modu
    if (mode !== "premium") {
      alert("Voice TBW AI dostupna je u Premium modu.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Tvoj uređaj/browser ne podržava voice recognition.");
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = lang === "hr" ? "hr-HR" : "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
      runSearch(text);
    };

    rec.start();
  };

  const openNav = () => {
    if (mode !== "premium") {
      window.open("https://www.google.com/maps/dir/", "_blank");
      return;
    }
    setActiveWindow("navigation");
  };

  const openWindow = (id) => setActiveWindow(id);
  const closeWindow = () => setActiveWindow(null);

  // tekst u prozorima
  const renderWindowContent = () => {
    if (!activeWindow) return null;
    const isPremium = mode === "premium";

    switch (activeWindow) {
      case "navigation":
        return (
          <>
            <h2>{dict.premiumNavTitle}</h2>
            <p className="modal-text">
              {isPremium ? dict.premiumNavText : dict.freeNavText}
            </p>
            {isPremium && (
              <>
                <ul className="modal-list">
                  <li>Glasovne upute (hands–free, Bluetooth u autu).</li>
                  <li>Live promet, kamere, radovi i alternativne rute.</li>
                  <li>Truck profil: visine, mase, zabrane i odmor.</li>
                  <li>
                    AI suputnik: „hej TBW, vodi me najbrže i najsigurnije do
                    odredišta“.
                  </li>
                </ul>
                <p className="modal-text">
                  Ovo je frontend cockpit – pravi TBW NavEngine backend i
                  senzori (umor, alkohol, nasilje, child mode) dolaze kroz
                  Premium backend.
                </p>
              </>
            )}
          </>
        );
      case "weather":
        return (
          <>
            <h2>{dict.weatherTitleModal}</h2>
            <p className="modal-text">{dict.weatherText}</p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Temperatura: 18–21°C (primjer)</li>
              <li>Vjetar: 12 km/h, umjereno</li>
              <li>More: smireno, kupanje moguće (ovisno o sezoni)</li>
            </ul>
          </>
        );
      case "accommodation":
        return (
          <>
            <h2>{dict.accommodation}</h2>
            <p className="modal-text">{dict.accommodationText}</p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>
                Filteri: cijena, lokacija, ocjene, parking, pogled na more.
              </li>
              <li>
                Premium: AI ranking po tvojem profilu (obitelj, posao, solo).
              </li>
            </ul>
            <a
              href={
                "https://www.booking.com/searchresults.html?ss=" +
                encodeURIComponent(city)
              }
              target="_blank"
              rel="noreferrer"
              className="link-out"
            >
              Otvori ponude (Booking.com demo)
            </a>
          </>
        );
      case "traffic":
        return (
          <>
            <h2>{dict.traffic}</h2>
            <p className="modal-text">{dict.trafficText}</p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Prosječna brzina kroz grad: 30–45 km/h.</li>
              <li>Gužve na ulazima i izlazima za vikend.</li>
              <li>Premium: live radari, kamere i upozorenja na ruti.</li>
            </ul>
          </>
        );
      case "events":
        return (
          <>
            <h2>{dict.events}</h2>
            <p className="modal-text">{dict.eventsText}</p>
            <ul className="modal-list">
              <li>Večeras: koncert na otvorenom u centru {city}.</li>
              <li>Klubovi: rad produžen do 05:00 (ovisno o gradu).</li>
              <li>Obitelj: dječje radionice, izložbe, šetnje.</li>
            </ul>
          </>
        );
      case "shops":
        return (
          <>
            <h2>{dict.shops}</h2>
            <p className="modal-text">{dict.shopsText}</p>
            <ul className="modal-list">
              <li>Najbliže trgovine: Konzum, Spar, Lidl (primjer).</li>
              <li>Shopping centri: po gradu {city} ili okolici.</li>
              <li>Benzinske: INA, Petrol, Crodux, EV punjači.</li>
            </ul>
          </>
        );
      case "sos":
        return (
          <>
            <h2>{dict.sos}</h2>
            <p className="modal-text">{dict.sosText}</p>
            <ul className="modal-list">
              <li>112 – EU hitne službe.</li>
              <li>Policija, vatrogasci, hitna pomoć.</li>
              <li>
                ICE kontakti (obitelj, partner, doktor) – pohranjeni lokalno na
                uređaju.
              </li>
            </ul>
            <div className="sos-buttons">
              <a href="tel:112" className="btn-sos">
                Call 112
              </a>
              <a href="tel:911" className="btn-sos-secondary">
                Call 911
              </a>
            </div>
          </>
        );
      case "child":
        return (
          <>
            <h2>{dict.childMode}</h2>
            <p className="modal-text">{dict.childModeText}</p>
            <ul className="modal-list">
              <li>
                TBW prati navike vozača, brzinu, nagla kočenja i umor (kamera +
                senzori).
              </li>
              <li>
                U child modu možeš upisati roditelja/guardiana za sigurnosne
                notifikacije.
              </li>
              <li>
                Ovo je frontend profil – stvarni backend za upozorenja i
                notifikacije dolazi uz TBW NavEngine.
              </li>
            </ul>
          </>
        );
      case "emergency":
        return (
          <>
            <h2>{dict.emergencyMode}</h2>
            <p className="modal-text">{dict.emergencyModeText}</p>
            <ul className="modal-list">
              <li>Kvar vozila, nesreća, nasilje ili prijetnja.</li>
              <li>
                TBW pomaže locirati vozilo, nazvati pomoć i voditi te kroz
                korake.
              </li>
              <li>
                Uvijek slijedi upute službenih hitnih službi – TBW je
                informativan alat.
              </li>
            </ul>
          </>
        );
      case "services":
        return (
          <>
            <h2>{dict.services}</h2>
            <p className="modal-text">{dict.servicesText}</p>
            <ul className="modal-list">
              <li>Auto servisi i vulkanizeri u blizini.</li>
              <li>Šlep službe i pomoć na cesti.</li>
              <li>Punionice (struja, plin) za vozilo.</li>
            </ul>
          </>
        );
      case "transport":
        return (
          <>
            <h2>{dict.transport}</h2>
            <p className="modal-text">{dict.transportText}</p>
            <ul className="modal-list">
              <li>Taxi i ride-share opcije u blizini.</li>
              <li>Javni prijevoz (bus, tramvaj, vlak).</li>
              <li>
                Preporuka TBW: ako si umoran ili pod utjecajem alkohola – nemoj
                voziti, koristi alternative.
              </li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-root">
      {/* INTRO */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-inner">
            <video
              id="tbw-intro-video"
              autoPlay
              muted={false}
              className="intro-video"
              src="/intro.mp4"
            />
            <div className="intro-fallback">TBW AI PREMIUM NAVIGATOR</div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="top-header">
        <div className="header-left">
          <div className="logo-circle">
            <img src="/tbw-logo.png" alt="TBW" />
          </div>
          <div className="brand-text">
            <div className="brand-title">TBW AI PREMIUM NAVIGATOR</div>
            <div className="brand-subtitle">
              Traffic · Weather · Sea · Stays · Safety
            </div>
          </div>
        </div>

        <div className="header-right">
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {Object.entries(LANGS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
          <div className="mode-switch">
            <button
              className={`mode-btn ${
                mode === "trial" ? "mode-trial active" : "mode-trial"
              }`}
              onClick={() => setMode("trial")}
            >
              Trial
            </button>
            <button
              className={`mode-btn ${
                mode === "demo" ? "mode-demo active" : "mode-demo"
              }`}
              onClick={() => setMode("demo")}
            >
              Demo
            </button>
            <button
              className={`mode-btn ${
                mode === "premium" ? "mode-premium active" : "mode-premium"
              }`}
              onClick={() => setMode("premium")}
            >
              Premium
            </button>
          </div>
        </div>
      </header>

      {/* TIKER */}
      <div
        className={`tbw-ticker ${
          mode === "premium" ? "ticker-premium" : "ticker-normal"
        }`}
      >
        <div className="ticker-inner">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-shell">
        <div className="hero" style={{ backgroundImage: `url(${hero})` }}>
          <div className="hero-overlay">
            <div className="hero-top-row">
              <div className="city-label">{dict.cityLabel}:</div>
              <div className="city-buttons">
                {CITIES.map((c) => (
                  <button
                    key={c}
                    className={c === city ? "city-btn active" : "city-btn"}
                    onClick={() => setCity(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-box">
              <input
                className="search-input"
                placeholder={dict.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="button"
                className={`search-mic ${listening ? "listening" : ""}`}
                onClick={handleMic}
              >
                🎤
              </button>
              <button
                type="button"
                className="search-btn"
                onClick={handleSearch}
              >
                TBW AI
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* KARTICE */}
      <main className="main-scroll">
        <div className="cards-grid">
          <article className="card" onClick={openNav}>
            <h3>{dict.navigation}</h3>
            <p>
              {city} · AI copilot · {mode === "premium" ? "full" : "basic"} mode
            </p>
          </article>

          <article className="card" onClick={() => openWindow("accommodation")}>
            <h3>{dict.accommodation}</h3>
            <p>{city} · apartmani, hoteli, sobe</p>
          </article>

          <article className="card" onClick={() => openWindow("weather")}>
            <h3>{dict.weather}</h3>
            <p>{city} · temperatura, vjetar, more</p>
          </article>

          <article className="card" onClick={() => openWindow("traffic")}>
            <h3>{dict.traffic}</h3>
            <p>{city} · gužve, radovi, nesreće</p>
          </article>

          <article className="card" onClick={() => openWindow("events")}>
            <h3>{dict.events}</h3>
            <p>{city} · koncerti, nightlife, događanja</p>
          </article>

          <article className="card" onClick={() => openWindow("shops")}>
            <h3>{dict.shops}</h3>
            <p>trgovine, shopping centri, benzinske</p>
          </article>

          <article className="card" onClick={() => openWindow("sos")}>
            <h3>{dict.sos}</h3>
            <p>SOS profil, ICE kontakti, 112/911</p>
          </article>

          <article className="card" onClick={() => openWindow("child")}>
            <h3>{dict.childMode}</h3>
            <p>sigurnost za mlade vozače</p>
          </article>

          <article className="card" onClick={() => openWindow("emergency")}>
            <h3>{dict.emergencyMode}</h3>
            <p>kvar, nesreća, nasilje – pomoć</p>
          </article>

          <article className="card" onClick={() => openWindow("services")}>
            <h3>{dict.services}</h3>
            <p>servisi, vulkanizeri, šlep</p>
          </article>

          <article className="card" onClick={() => openWindow("transport")}>
            <h3>{dict.transport}</h3>
            <p>taxi, javni prijevoz, shuttle</p>
          </article>
        </div>

        <footer className="tbw-footer">
          TBW AI PREMIUM NAVIGATOR is an informational tool only. It does not
          replace official traffic, weather, maritime or aviation sources.
          Always follow road signs, police instructions and official emergency
          services. All rights reserved. Dražen Halar – Founder &amp; IP Owner
          TBW.
        </footer>
      </main>

      {/* MODAL */}
      {activeWindow && (
        <div className="modal-overlay" onClick={closeWindow}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            {renderWindowContent()}
            <button className="modal-close" onClick={closeWindow}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
