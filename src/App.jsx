import { useEffect, useState, useMemo } from "react";
import { LANGS, T } from "./translations";
import "./App.css";

const HERO_MAP = {
  Zagreb: "/assets/hero-zagreb.jpg",
  Split: "/assets/hero-split.jpg",
  Karlovac: "/assets/hero-karlovac.jpg",
  Zadar: "/assets/hero-zadar.jpg"
};

const CITIES = ["Zagreb", "Split", "Zadar", "Karlovac"];

export default function App() {
  const [lang, setLang] = useState("hr");
  const [mode, setMode] = useState("trial"); // trial | demo | premium
  const [city, setCity] = useState("Zadar");
  const [hero, setHero] = useState(HERO_MAP["Zadar"]);
  const [search, setSearch] = useState("");
  const [activeWindow, setActiveWindow] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState("home"); // home | nav
  const [navFrom, setNavFrom] = useState("");
  const [navTo, setNavTo] = useState("");

  const currentDict = T[lang];

  // INTRO – sigurnosni timeout + skip
  useEffect(() => {
    const vid = document.getElementById("tbw-intro-video");
    const timer = setTimeout(() => setShowIntro(false), 6000);

    if (vid) {
      vid.onended = () => {
        clearTimeout(timer);
        setShowIntro(false);
      };
    }

    return () => clearTimeout(timer);
  }, []);

  // HERO po gradu
  useEffect(() => {
    setHero(HERO_MAP[city] || HERO_MAP["Zadar"]);
  }, [city]);

  // ticker tekst
  const tickerText = useMemo(
    () =>
      "Traffic · Weather · Sea · Events · Shops · Airports · TBW AI LIVE · Informational only – always follow official sources.",
    []
  );

  const handleSearch = () => {
    const q = search.trim();
    if (!q) return;

    if (mode === "premium") {
      // Ovdje će kasnije TBW NavEngine backend
      window.alert("TBW AI premium engine – synced search for:\n\n" + q);
    } else {
      window.open(
        "https://www.google.com/search?q=" + encodeURIComponent(q),
        "_blank"
      );
    }
  };

  // MIC – Web Speech API ako postoji
  const handleMic = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      window.alert(
        lang === "hr"
          ? "Glasovno pretraživanje nije podržano u ovom pregledniku."
          : "Voice recognition is not supported in this browser."
      );
      return;
    }

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = lang === "hr" ? "hr-HR" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
      setTimeout(handleSearch, 200);
    };

    recognition.onerror = () => {
      window.alert(
        lang === "hr"
          ? "Greška pri slušanju mikrofona."
          : "Error while listening to microphone."
      );
    };

    recognition.start();
  };

  const openNav = () => {
    setView("nav");
    setNavFrom(city);
    setNavTo("");
  };

  const openWindow = (id) => setActiveWindow(id);
  const closeWindow = () => setActiveWindow(null);

  const exitNav = () => {
    setView("home");
  };

  const startRoute = () => {
    const from = navFrom || city;
    const to = navTo.trim();
    if (!to) {
      window.alert(
        lang === "hr"
          ? "Unesi odredište."
          : "Please enter a destination."
      );
      return;
    }

    // Za sada – otvara Google Maps; kasnije TBW NavEngine
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      from
    )}&destination=${encodeURIComponent(to)}`;
    window.open(url, "_blank");
  };

  // sadržaj prozora
  const renderWindowContent = () => {
    if (!activeWindow) return null;

    const isPremium = mode === "premium";

    switch (activeWindow) {
      case "navigation":
        return (
          <>
            <h2>{currentDict.premiumNavTitle}</h2>
            <p className="modal-text">
              {isPremium ? currentDict.premiumNavText : currentDict.freeNavText}
            </p>
            {isPremium && (
              <ul className="modal-list">
                <li>Glasovne upute (hands–free, Bluetooth u autu).</li>
                <li>Live promet, kamere, radovi i alternativne rute.</li>
                <li>Truck profil: visine, mase, zabrane i odmor.</li>
                <li>
                  AI suputnik: „hej TBW, vodi me najbrže i najsigurnije do
                  odredišta”.
                </li>
              </ul>
            )}
            {!isPremium && (
              <p className="modal-text">
                Premium senzori (umor, alkohol, nasilje, child mode) i TBW
                NavEngine dostupni su u plaćenoj verziji.
              </p>
            )}
          </>
        );
      case "weather":
        return (
          <>
            <h2>{currentDict.weatherTitleModal}</h2>
            <p className="modal-text">{currentDict.weatherText}</p>
            <ul className="modal-list">
              <li>
                Grad: <strong>{city}</strong>
              </li>
              <li>Temperatura: 18–21°C (primjer)</li>
              <li>Vjetar: 12 km/h, umjereno</li>
              <li>More: smireno, kupanje moguće (ovisno o sezoni)</li>
            </ul>
          </>
        );
      case "accommodation":
        return (
          <>
            <h2>{currentDict.accommodation}</h2>
            <p className="modal-text">{currentDict.accommodationText}</p>
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
            <h2>{currentDict.traffic}</h2>
            <p className="modal-text">{currentDict.trafficText}</p>
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
            <h2>{currentDict.events}</h2>
            <p className="modal-text">{currentDict.eventsText}</p>
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
            <h2>{currentDict.shops}</h2>
            <p className="modal-text">{currentDict.shopsText}</p>
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
            <h2>{currentDict.sos}</h2>
            <p className="modal-text">{currentDict.sosText}</p>
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
            <h2>{currentDict.child}</h2>
            <p className="modal-text">{currentDict.childText}</p>
            <ul className="modal-list">
              <li>Unos mladog vozača, vozila i kontakta roditelja.</li>
              <li>
                Savjeti za vožnju, ograničenja snage i upozorenja na rizične
                dionice.
              </li>
              <li>
                U Premiumu: TBW prati navike vožnje i pomaže učiti sigurniji
                stil.
              </li>
            </ul>
          </>
        );
      case "emergencyMode":
        return (
          <>
            <h2>{currentDict.emergencyMode}</h2>
            <p className="modal-text">{currentDict.emergencyModeText}</p>
            <ul className="modal-list">
              <li>Kvar vozila, djelomično mobilno vozilo.</li>
              <li>Opasne situacije, potjere, nasilje u vozilu.</li>
              <li>
                TBW te vodi prema sigurnom mjestu i po potrebi pomaže pozvati
                službe.
              </li>
            </ul>
          </>
        );
      case "services":
        return (
          <>
            <h2>{currentDict.services}</h2>
            <p className="modal-text">{currentDict.servicesText}</p>
            <ul className="modal-list">
              <li>Servisi i vulkanizeri u krugu oko {city}.</li>
              <li>Pomoć na cesti i vučna služba (demo linkovi).</li>
            </ul>
          </>
        );
      case "transport":
        return (
          <>
            <h2>{currentDict.transport}</h2>
            <p className="modal-text">{currentDict.transportText}</p>
            <ul className="modal-list">
              <li>Taxi i ride-hailing servisi.</li>
              <li>Javni prijevoz, shuttle, trajekti (ovisno o gradu).</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  // UI

  return (
    <div className="app-root">
      {/* INTRO */}
      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-inner">
            <video
              id="tbw-intro-video"
              className="intro-video"
              src="/intro.mp4"
              autoPlay
              muted
              playsInline
            />
            <div className="intro-fallback">TBW AI PREMIUM NAVIGATOR</div>
            <button
              className="intro-skip-btn"
              onClick={() => setShowIntro(false)}
            >
              Skip intro
            </button>
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

      {/* TICKER */}
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

      {/* HERO + SEARCH */}
      {view === "home" && (
        <>
          <section className="hero-shell">
            <div
              className="hero"
              style={{ backgroundImage: `url(${hero})` }}
            >
              <div className="hero-overlay">
                <div className="hero-top-row">
                  <div className="city-label">{currentDict.cityLabel}:</div>
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
                    placeholder={currentDict.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    className="search-mic"
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
                <h3>{currentDict.navigation}</h3>
                <p>
                  {city} · AI copilot ·{" "}
                  {mode === "premium" ? "full" : "basic"} mode
                </p>
              </article>

              <article
                className="card"
                onClick={() => openWindow("accommodation")}
              >
                <h3>{currentDict.accommodation}</h3>
                <p>{city} · apartmani, hoteli, sobe</p>
              </article>

              <article className="card" onClick={() => openWindow("weather")}>
                <h3>{currentDict.weather}</h3>
                <p>{city} · temperature, vjetar, more</p>
              </article>

              <article className="card" onClick={() => openWindow("traffic")}>
                <h3>{currentDict.traffic}</h3>
                <p>{city} · gužve, radovi, nesreće</p>
              </article>

              <article className="card" onClick={() => openWindow("events")}>
                <h3>{currentDict.events}</h3>
                <p>{city} · koncerti, nightlife, događanja</p>
              </article>

              <article className="card" onClick={() => openWindow("shops")}>
                <h3>{currentDict.shops}</h3>
                <p>trgovine, shopping centri, benzinske</p>
              </article>

              <article className="card" onClick={() => openWindow("sos")}>
                <h3>{currentDict.sos}</h3>
                <p>SOS profil, ICE kontakti, 112/911</p>
              </article>

              <article className="card" onClick={() => openWindow("child")}>
                <h3>{currentDict.child}</h3>
                <p>sigurnost za mlade vozače</p>
              </article>

              <article
                className="card"
                onClick={() => openWindow("emergencyMode")}
              >
                <h3>{currentDict.emergencyMode}</h3>
                <p>kvar, opasnost, nasilje – pomoć</p>
              </article>

              <article className="card" onClick={() => openWindow("services")}>
                <h3>{currentDict.services}</h3>
                <p>servisi, vulkanizeri, pomoć na cesti</p>
              </article>

              <article className="card" onClick={() => openWindow("transport")}>
                <h3>{currentDict.transport}</h3>
                <p>taxi, javni prijevoz, shuttle</p>
              </article>
            </div>

            <footer className="tbw-footer">
              TBW AI PREMIUM NAVIGATOR is an informational tool only. It does
              not replace official traffic, weather, maritime or aviation
              sources. Always follow road signs, police instructions and
              official emergency services. All rights reserved. Dražen Halar –
              Founder & IP Owner TBW.
            </footer>
          </main>
        </>
      )}

      {/* NAVIGACIJSKI EKRAN */}
      {view === "nav" && (
        <main className="nav-screen">
          <div className="nav-header">
            <button className="nav-back-btn" onClick={exitNav}>
              ← {currentDict.navBack}
            </button>
            <h1>{currentDict.navScreenTitle}</h1>
          </div>

          <div className="nav-panel">
            <label className="nav-label">
              {currentDict.navFrom}
              <input
                className="nav-input"
                value={navFrom}
                onChange={(e) => setNavFrom(e.target.value)}
              />
            </label>

            <label className="nav-label">
              {currentDict.navTo}
              <input
                className="nav-input"
                value={navTo}
                onChange={(e) => setNavTo(e.target.value)}
                placeholder={lang === "hr" ? "npr. Split aerodrom" : "e.g. airport"}
              />
            </label>

            <div className="nav-actions">
              <button className="nav-mic-btn" onClick={handleMic}>
                🎤
              </button>
              <button className="nav-start-btn" onClick={startRoute}>
                {currentDict.navStart}
              </button>
            </div>

            <p className="nav-note">
              TBW AI NavEngine (umor, alkohol, nasilje, child mode, senzori)
              radi u Premium modu preko backenda. Ovaj ekran je frontend
              cockpit, spreman za spajanje na tvoj engine.
            </p>
          </div>
        </main>
      )}

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
