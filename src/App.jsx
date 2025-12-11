import { useEffect, useState } from "react";
import { LANGS, T } from "./translations";
import "./App.css";

const HERO_MAP = {
  Paris: {
    desktop: "/hero-paris-desktop.jpg",
    mobile: "/hero-paris-mobile.jpg"
  },
  Zadar: { desktop: "/hero-zadar.jpg", mobile: "/hero-zadar.jpg" },
  Split: { desktop: "/hero-split.jpg", mobile: "/hero-split.jpg" },
  Zagreb: { desktop: "/hero-zagreb.jpg", mobile: "/hero-zagreb.jpg" },
  Karlovac: { desktop: "/hero-karlovac.jpg", mobile: "/hero-karlovac.jpg" }
};

const CITIES = ["Paris", "Zadar", "Split", "Zagreb", "Karlovac"];

export default function App() {
  const [lang, setLang] = useState("hr");
  const [mode, setMode] = useState("trial"); // trial | demo | premium
  const [city, setCity] = useState("Paris");
  const [search, setSearch] = useState("");
  const [activeWindow, setActiveWindow] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [heroUrl, setHeroUrl] = useState("/hero-paris-desktop.jpg");

  const currentDict = T[lang];

  // INTRO
  useEffect(() => {
    const vid = document.getElementById("tbw-intro-video");
    if (!vid) {
      const t = setTimeout(() => setShowIntro(false), 3000);
      return () => clearTimeout(t);
    }
    vid.onended = () => setShowIntro(false);
  }, []);

  // HERO – desktop/mobile verzija
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const hero = HERO_MAP[city] || HERO_MAP["Paris"];
    setHeroUrl(isMobile ? hero.mobile : hero.desktop);
  }, [city]);

  // TICKER
  const tickerText =
    "Traffic · Weather · Sea · Events · Shops · Airports · TBW AI LIVE · Informational only – always follow official sources.";

  // SEARCH HANDLER
  const handleSearch = () => {
    const query = search.trim();
    if (!query) return;

    if (mode !== "premium") {
      // trial / demo – Google
      window.open(
        "https://www.google.com/search?q=" + encodeURIComponent(query),
        "_blank"
      );
      return;
    }

    alert("TBW AI premium engine – synced search for:\n\n" + query);
  };

  // MIC – Web Speech API (ako postoji)
  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang === "hr" ? "hr-HR" : "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => setIsListening(true);
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
      setTimeout(handleSearch, 150);
    };

    rec.start();
  };

  const openWindow = (id) => setActiveWindow(id);
  const closeWindow = () => setActiveWindow(null);

  // SADRŽAJ MODALA
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
                  odredišta“.
                </li>
                <li>
                  Ovo je frontend cockpit – pravi TBW NavEngine ide na backend.
                </li>
              </ul>
            )}
          </>
        );
      case "weather":
        return (
          <>
            <h2>{currentDict.weatherTitleModal}</h2>
            <p className="modal-text">{currentDict.weatherText}</p>
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
            <h2>{currentDict.accommodation}</h2>
            <p className="modal-text">{currentDict.accommodationText}</p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Filteri: cijena, lokacija, ocjene, parking, pogled na more.</li>
              <li>Premium: AI ranking po tvojem profilu.</li>
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
              <li>Premium: radari, kamere, TBW upozorenja.</li>
            </ul>
          </>
        );
      case "events":
        return (
          <>
            <h2>{currentDict.events}</h2>
            <p className="modal-text">{currentDict.eventsText}</p>
            <ul className="modal-list">
              <li>Večeras: koncert u centru {city} (primjer).</li>
              <li>Noćni život, barovi, klubovi.</li>
              <li>Obiteljski eventi, izložbe, šetnje.</li>
            </ul>
          </>
        );
      case "shops":
        return (
          <>
            <h2>{currentDict.shops}</h2>
            <p className="modal-text">{currentDict.shopsText}</p>
            <ul className="modal-list">
              <li>Najbliže trgovine i shopping centri.</li>
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
              <li>ICE kontakti – obitelj, doktor, partner.</li>
            </ul>
          </>
        );
      case "child":
        return (
          <>
            <h2>{currentDict.child}</h2>
            <p className="modal-text">{currentDict.childText}</p>
            <ul className="modal-list">
              <li>Profil mladog vozača (ime, auto, registracija).</li>
              <li>Praćenje umora, alkohola, rizične vožnje (backend).</li>
              <li>
                Notifikacije roditelju samo u hitnim slučajevima – štitiš sebe
                od odgovornosti.
              </li>
            </ul>
          </>
        );
      case "emergency":
        return (
          <>
            <h2>{currentDict.emergencyMode}</h2>
            <p className="modal-text">{currentDict.emergencyModeText}</p>
            <ul className="modal-list">
              <li>Nesreća, kvar, nasilje, potjera.</li>
              <li>AI koristi zvuk, kameru, senzore (backend TBW NavEngine).</li>
              <li>
                Poziv hitnim službama se radi samo kad je 100% sigurno da je
                život ugrožen.
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
              <li>Servisi i vulkanizeri u krugu 20 km (primjer).</li>
              <li>Premium: povezivanje s TBW partnerima.</li>
            </ul>
          </>
        );
      case "transport":
        return (
          <>
            <h2>{currentDict.transport}</h2>
            <p className="modal-text">{currentDict.transportText}</p>
            <ul className="modal-list">
              <li>Taxi, Bolt, Uber (ovisno o gradu).</li>
              <li>Shuttle do aerodroma i nazad.</li>
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
            <img src="/tbw-logo.png" alt="TBW AI" />
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
              className={
                "mode-btn " + (mode === "trial" ? "mode-trial active" : "")
              }
              onClick={() => setMode("trial")}
            >
              Trial
            </button>
            <button
              className={
                "mode-btn " + (mode === "demo" ? "mode-demo active" : "")
              }
              onClick={() => setMode("demo")}
            >
              Demo
            </button>
            <button
              className={
                "mode-btn " + (mode === "premium" ? "mode-premium active" : "")
              }
              onClick={() => setMode("premium")}
            >
              Premium
            </button>
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div
        className={
          "tbw-ticker " +
          (mode === "premium" ? "ticker-premium" : "ticker-normal")
        }
      >
        <div className="ticker-inner">
          <span>{tickerText}</span>
          <span>{tickerText}</span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero-shell">
        <div
          className="hero"
          style={{ backgroundImage: `url(${heroUrl})` }}
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

            <div className="hero-bottom">
              <div className="place-box">
                <div className="place-name">Eiffel Tower</div>
                <div className="place-meta">
                  Champ de Mars, 5 Avenue Anatole France, Paris · 14 min ·
                  Often visited
                </div>
              </div>

              <div className="hero-actions">
                <button
                  className="hero-btn"
                  onClick={() => openWindow("navigation")}
                >
                  NAVIGATE
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() => openWindow("events")}
                >
                  SAVE
                </button>
                <button
                  className="hero-btn secondary"
                  onClick={() =>
                    window.open(
                      "https://www.google.com/maps/@48.8584,2.2945,16z",
                      "_blank"
                    )
                  }
                >
                  STREET VIEW
                </button>
              </div>

              <div className="search-box">
                <input
                  className="search-input"
                  placeholder={currentDict.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  type="button"
                  className={
                    "search-mic " + (isListening ? "search-mic-on" : "")
                  }
                  onClick={handleMicClick}
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
        </div>
      </section>

      {/* SCROLL DIO */}
      <main className="main-scroll">
        <div className="cards-grid">
          <article className="card" onClick={() => openWindow("navigation")}>
            <h3>{currentDict.navigation}</h3>
            <p>{city} · AI copilot · {mode === "premium" ? "full" : "basic"}</p>
          </article>

          <article className="card" onClick={() => openWindow("accommodation")}>
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
            <p>trgovine, benzinske, punjači</p>
          </article>

          <article className="card" onClick={() => openWindow("sos")}>
            <h3>{currentDict.sos}</h3>
            <p>SOS profil, ICE kontakti, 112/911</p>
          </article>

          <article className="card" onClick={() => openWindow("child")}>
            <h3>{currentDict.child}</h3>
            <p>sigurnost mladih vozača, roditeljski uvid</p>
          </article>

          <article className="card" onClick={() => openWindow("emergency")}>
            <h3>{currentDict.emergencyMode}</h3>
            <p>kvar, nesreća, nasilje, potjera</p>
          </article>

          <article className="card" onClick={() => openWindow("services")}>
            <h3>{currentDict.services}</h3>
            <p>servisi, vulkanizeri, šlep</p>
          </article>

          <article className="card" onClick={() => openWindow("transport")}>
            <h3>{currentDict.transport}</h3>
            <p>taxi, shuttle, javni prijevoz</p>
          </article>
        </div>

        <footer className="tbw-footer">
          TBW AI PREMIUM NAVIGATOR is an informational tool only. It does not
          replace official traffic, weather, maritime or aviation sources.
          Always follow road signs, police instructions and official emergency
          services. All rights reserved. Dražen Halar – Founder & IP Owner TBW.
        </footer>
      </main>

      {/* MODAL */}
      {activeWindow && (
        <div className="modal-overlay" onClick={closeWindow}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
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
