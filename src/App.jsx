import { useEffect, useRef, useState } from "react";
import { LANGS, T } from "./translations";
import "./App.css";

const CITIES = ["Paris", "Zadar", "Split", "Zagreb", "Karlovac"];

const HERO = {
  Paris: {
    title: "Eiffel Tower",
    subtitle: "Champ de Mars, 5 Avenue Anatole France, Paris",
    eta: "14 min",
    note: "Often visited",
    image: "/hero-paris.jpg" // ako nemaš sliku, privremeno stavi hero-zadar.jpg
  },
  Zadar: {
    title: "Old Town Zadar",
    subtitle: "Poluotok, Zadar · Sea & sunsets",
    eta: "8 min",
    note: "Sea & nightlife",
    image: "/hero-zadar.jpg"
  },
  Split: {
    title: "Split Riva",
    subtitle: "Obala hrvatskog narodnog preporoda",
    eta: "10 min",
    note: "Harbour & ferries",
    image: "/hero-split.jpg"
  },
  Zagreb: {
    title: "Zagreb Center",
    subtitle: "Trg bana Jelačića · City center",
    eta: "6 min",
    note: "Business & culture",
    image: "/hero-zagreb.jpg"
  },
  Karlovac: {
    title: "Karlovac",
    subtitle: "Grad na 4 rijeke · Old town",
    eta: "5 min",
    note: "Rijeke & zelene zone",
    image: "/hero-karlovac.jpg"
  }
};

export default function App() {
  const [lang, setLang] = useState("hr");
  const [mode, setMode] = useState("demo"); // trial | demo | premium
  const [city, setCity] = useState("Paris");
  const [search, setSearch] = useState("");
  const [activeWindow, setActiveWindow] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const dict = T[lang];

  // INTRO – sakrij nakon videa ili nakon 4s
  useEffect(() => {
    const video = document.getElementById("tbw-intro-video");
    if (!video) {
      const t = setTimeout(() => setShowIntro(false), 4000);
      return () => clearTimeout(t);
    }

    const onEnded = () => setShowIntro(false);
    video.addEventListener("ended", onEnded);

    const fallback = setTimeout(() => setShowIntro(false), 8000);

    return () => {
      video.removeEventListener("ended", onEnded);
      clearTimeout(fallback);
    };
  }, []);

  // automatski odabir jezika po browseru
  useEffect(() => {
    const browser = navigator.language?.slice(0, 2);
    if (browser && LANGS[browser]) setLang(browser);
  }, []);

  // inicijalizacija Web Speech mikrofona
  useEffect(() => {
    const SR =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SR) return;

    const recog = new SR();
    recog.lang = lang === "hr" ? "hr-HR" : lang === "de" ? "de-DE" : "en-US";
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearch(text);
      runSearch(text);
      setListening(false);
    };

    recog.onerror = () => setListening(false);
    recog.onend = () => setListening(false);

    recognitionRef.current = recog;
  }, [lang, mode, city]);

  const tickerText =
    "Traffic · Weather · Sea · Events · Shops · Airports · TBW AI LIVE · Informational only – always follow official sources.";

  const currentHero = HERO[city] || HERO.Paris;

  function toggleMode(next) {
    setMode(next);
  }

  function handleCityClick(c) {
    setCity(c);
  }

  // glavna tražilica – ručni klik na TBW AI
  function runSearch(text) {
    const query = text || search;
    if (!query.trim()) return;

    if (mode !== "premium") {
      window.open(
        "https://www.google.com/search?q=" + encodeURIComponent(query),
        "_blank"
      );
      return;
    }

    alert(`TBW AI premium engine – synced search for:\n\n${query}`);
  }

  function handleSearchClick() {
    runSearch();
  }

  // MIC – pravi voice input gdje je moguće
  function handleMicClick() {
    const recog = recognitionRef.current;
    if (!recog) {
      alert(
        lang === "hr"
          ? "Tvoj uređaj ne podržava web voice recognition. I dalje možeš tipkati upite."
          : "Your device does not support web voice recognition. You can still type your query."
      );
      return;
    }

    if (listening) {
      recog.stop();
      setListening(false);
      return;
    }

    try {
      recog.start();
      setListening(true);
    } catch (e) {
      setListening(false);
    }
  }

  // navigacija – otvara TBW nav ekran umjesto direktno Google
  function openNavigation() {
    setActiveWindow("navigation");
  }

  function openWindow(id) {
    setActiveWindow(id);
  }

  function closeWindow() {
    setActiveWindow(null);
  }

  // sadržaj svih prozora (kartice)
  function renderWindow() {
    if (!activeWindow) return null;

    const isPremium = mode === "premium";

    switch (activeWindow) {
      case "navigation":
        return (
          <>
            <h2>TBW premium navigacija</h2>
            <p className="modal-text">
              Vrhunska TBW AI navigacija s glasom, kamerama, radovima, truck
              profilom i prometom u realnom vremenu.
            </p>
            <ul className="modal-list">
              <li>Glasovne upute (hands–free, Bluetooth u autu).</li>
              <li>Live promet, kamere, radovi i alternativne rute.</li>
              <li>Truck profil: visine, mase, zabrane i odmorišta.</li>
              <li>
                AI suputnik: “hej TBW, vodi me najbrže i najsigurnije do
                odredišta”.
              </li>
            </ul>
            <div className="nav-mini">
              <input
                className="nav-input"
                placeholder="Polazište (npr. Karlovac)…"
              />
              <input
                className="nav-input"
                placeholder="Odredište (npr. Split aerodrom)…"
              />
              <button
                className="nav-start-btn"
                onClick={() =>
                  alert(
                    isPremium
                      ? "TBW NavEngine frontend spreman – backend će računati rutu."
                      : "U Demo/Trial modu rutu vodi Google Maps."
                  )
                }
              >
                Pokreni rutu
              </button>
            </div>
          </>
        );

      case "booking":
        return (
          <>
            <h2>Smještaj · TBW Booking AI</h2>
            <p className="modal-text">
              TBW filtrira smještaj prema cijeni, lokaciji, recenzijama i profilu
              korisnika (obitelj, par, mladi, freelancer…).
            </p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Filteri: cijena, lokacija, parking, pogled na more.</li>
              <li>Premium: AI ranking po tvom profilu.</li>
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

      case "weather":
        return (
          <>
            <h2>Detaljna prognoza</h2>
            <p className="modal-text">
              Vrijeme, temperatura, vjetar i uvjeti na ruti. U premium modu TBW
              koristi live API podatke.
            </p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Temperatura: 18–21°C (primjer)</li>
              <li>Vjetar: 12 km/h, umjereno</li>
              <li>More: smireno, kupanje moguće (ovisno o sezoni)</li>
            </ul>
          </>
        );

      case "traffic":
        return (
          <>
            <h2>Promet uživo</h2>
            <p className="modal-text">
              Stanje na cestama, radovi, nesreće i zastoje. Premium koristi TBW
              motor i prometne izvore.
            </p>
            <ul className="modal-list">
              <li>Grad: {city}</li>
              <li>Prosječna brzina: 30–45 km/h (primjer).</li>
              <li>Gužve na ulazima i izlazima za vikend.</li>
            </ul>
          </>
        );

      case "events":
        return (
          <>
            <h2>Eventi & nightlife</h2>
            <p className="modal-text">
              Koncerti, događanja, nightlife i lokalne preporuke.
            </p>
            <ul className="modal-list">
              <li>Večeras: koncert na otvorenom u centru {city}.</li>
              <li>Klubovi: rad do 05:00 (ovisno o gradu).</li>
              <li>Obitelj: dječje radionice, izložbe, šetnje.</li>
            </ul>
          </>
        );

      case "shops":
        return (
          <>
            <h2>Trgovine & energija</h2>
            <ul className="modal-list">
              <li>Najbliže trgovine: Konzum, Spar, Lidl (primjer).</li>
              <li>Shopping centri u i oko grada {city}.</li>
              <li>Benzinske, EV punjači, LPG.</li>
            </ul>
          </>
        );

      case "child":
        return (
          <>
            <h2>Child mode</h2>
            <p className="modal-text">
              Poseban mod za mlade i neiskusne vozače – TBW prati brzinu, stil
              vožnje i daje savjete kao roditelj.
            </p>
            <ul className="modal-list">
              <li>Upozorenja na prebrzu vožnju i opasne dionice.</li>
              <li>Savjeti za kružne tokove, pretjecanja, loše vrijeme.</li>
              <li>
                Kontakt roditelja / skrbnika upisan u profil (backend dio u
                Premiumu).
              </li>
            </ul>
          </>
        );

      case "emergency":
        return (
          <>
            <h2>Emergency mode</h2>
            <p className="modal-text">
              Mod za kvar vozila, nesreće, nasilje ili druge opasne situacije.
            </p>
            <ul className="modal-list">
              <li>Brzi pristup 112 / 911 (ovisno o državi).</li>
              <li>
                U Premiumu: TBW priprema podatke za razgovor s dispečerom
                (lokacija, smjer, broj putnika…).
              </li>
            </ul>
          </>
        );

      case "services":
        return (
          <>
            <h2>Servisi & vulkanizeri</h2>
            <p className="modal-text">
              TBW pomaže pronaći najbliži servis, vulkanizera ili pomoć na
              cesti.
            </p>
          </>
        );

      case "transport":
        return (
          <>
            <h2>Prijevoz & taxi</h2>
            <p className="modal-text">
              Taxi, javni prijevoz, shuttle i prijevoz do aerodroma.
            </p>
          </>
        );

      case "sos":
        return (
          <>
            <h2>Sigurnost & SOS</h2>
            <p className="modal-text">
              SOS profil, ICE kontakti i brzi pozivi hitnim službama. TBW je
              informativan alat – uvijek slijedi upute službenih službi.
            </p>
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

      default:
        return null;
    }
  }

  return (
    <div className="app-root">
      {showIntro && (
        <div className="intro-overlay">
          <video
            id="tbw-intro-video"
            className="intro-video"
            src="/intro.mp4"
            autoPlay
            muted={false}
            playsInline
          />
          <div className="intro-title">TBW AI PREMIUM NAVIGATOR</div>
        </div>
      )}

      {/* HEADER */}
      <header className="tbw-header">
        <div className="brand-left">
          <div className="brand-logo">
            <img src="/tbw-logo.png" alt="TBW AI" />
          </div>
          <div className="brand-text">
            <div className="brand-name">TBW AI PREMIUM</div>
            <div className="brand-sub">Traffic · Weather · Sea · Safety</div>
          </div>
        </div>

        <div className="brand-right">
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
              onClick={() => toggleMode("trial")}
              className={`mode-btn ${
                mode === "trial" ? "mode-trial active" : "mode-trial"
              }`}
            >
              Trial
            </button>
            <button
              onClick={() => toggleMode("demo")}
              className={`mode-btn ${
                mode === "demo" ? "mode-demo active" : "mode-demo"
              }`}
            >
              Demo
            </button>
            <button
              onClick={() => toggleMode("premium")}
              className={`mode-btn ${
                mode === "premium" ? "mode-premium active" : "mode-premium"
              }`}
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
      <section className="hero-section">
        <div
          className="hero-image"
          style={{ backgroundImage: `url(${currentHero.image})` }}
        >
          <div className="hero-top-row">
            <div className="hero-city-pill">{city}</div>
            <div className="hero-city-switch">
              {CITIES.map((c) => (
                <button
                  key={c}
                  className={c === city ? "active" : ""}
                  onClick={() => handleCityClick(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-place-card">
            <div className="hero-place-title">{currentHero.title}</div>
            <div className="hero-place-sub">{currentHero.subtitle}</div>
            <div className="hero-place-meta">
              <span>{currentHero.eta}</span> · <span>{currentHero.note}</span>
            </div>
            <div className="hero-cta-row">
              <button className="hero-cta" onClick={openNavigation}>
                NAVIGATE
              </button>
              <button
                className="hero-cta secondary"
                onClick={() => alert("Saved to favourites (demo).")}
              >
                SAVE
              </button>
              <button
                className="hero-cta secondary"
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/@48.8584,2.2945,16z/data=!3m1!1e3",
                    "_blank"
                  )
                }
              >
                STREET VIEW
              </button>
            </div>
          </div>

          <div className="hero-search">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={dict.searchPlaceholder}
            />
            <button
              className={`mic-btn ${listening ? "listening" : ""}`}
              onClick={handleMicClick}
            >
              🎤
            </button>
            <button className="search-btn" onClick={handleSearchClick}>
              TBW AI
            </button>
          </div>
        </div>
      </section>

      {/* KARTICE */}
      <main className="cards-section">
        <div className="cards-row">
          <article className="tbw-card" onClick={openNavigation}>
            <h3>Navigacija</h3>
            <p>{city} · AI copilot · {mode === "premium" ? "full" : "basic"}</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("booking")}>
            <h3>Smještaj</h3>
            <p>{city} · apartmani, hoteli, sobe</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("weather")}>
            <h3>Vrijeme</h3>
            <p>{city} · temperatura, vjetar, more</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("traffic")}>
            <h3>Promet uživo</h3>
            <p>{city} · gužve, radovi, nesreće</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("events")}>
            <h3>Eventi</h3>
            <p>{city} · koncerti, nightlife, događanja</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("shops")}>
            <h3>Trgovine & energija</h3>
            <p>trgovine, shopping centri, benzinske</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("child")}>
            <h3>Child mode</h3>
            <p>sigurnost za mlade vozače</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("emergency")}>
            <h3>Emergency mode</h3>
            <p>kvar, nesreća, nasilje – pomoć</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("services")}>
            <h3>Servisi & vulkanizeri</h3>
            <p>servisi, vulkanizer, šlep</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("transport")}>
            <h3>Prijevoz & taxi</h3>
            <p>taxi, javni prijevoz, shuttle</p>
          </article>

          <article className="tbw-card" onClick={() => openWindow("sos")}>
            <h3>Sigurnost & SOS</h3>
            <p>SOS profil, ICE kontakti, 112/911</p>
          </article>
        </div>

        <footer className="tbw-footer">
          TBW AI PREMIUM NAVIGATOR is an informational tool only. It does not
          replace official traffic, weather, maritime or aviation sources.
          Always follow road signs, police instructions and official emergency
          services. All rights reserved. Dražen Halar – Founder & IP Owner TBW.
        </footer>
      </main>

      {activeWindow && (
        <div className="modal-backdrop" onClick={closeWindow}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            {renderWindow()}
            <button className="modal-close" onClick={closeWindow}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
