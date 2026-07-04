const { useState, useEffect } = React;

const highlights = [
  {
    title: "Performance First",
    desc: "Strength programming built around measurable progress and clean mechanics."
  },
  {
    title: "Recovery Built In",
    desc: "Mobility zones, breathwork flows, and recovery protocols after sessions."
  },
  {
    title: "Community Energy",
    desc: "Coaches who know your goals and a culture that keeps you consistent."
  }
];

const tech = [
  {
    title: "Velocity Track",
    desc: "Sprint lanes and sled pulls for explosive power and conditioning."
  },
  {
    title: "Precision Metrics",
    desc: "Monthly testing to keep your plan adaptive and results on track."
  },
  {
    title: "Recovery Suite",
    desc: "Mobility tools, stretch bays, and guided cooldowns."
  }
];

const heroSignals = [
  "Premium machine floor",
  "Smart gate member access",
  "Gym + spa experience"
];

const arrivalMoments = [
  {
    title: "Reception Feel",
    desc: "A calm first touchpoint before the training floor opens up.",
    tag: "Arrival",
    img: "./images/IMG_3766.JPG",
    className: "arrival-card-feature"
  },
  {
    title: "Building Presence",
    desc: "A polished exterior story that makes the location feel easy to trust and find.",
    tag: "Outside",
    img: "./images/IMG_3777.JPG"
  },
  {
    title: "Smart Gate Access",
    desc: "A smoother entry experience that makes membership feel premium from the door.",
    tag: "Access",
    img: "./images/IMG_3770.JPG"
  }
];

function isActiveUntil(value) {
  if (!value) return true;
  const normalized = String(value).trim();
  const parsed = new Date(normalized.length <= 10 ? `${normalized}T23:59:59` : normalized);
  if (Number.isNaN(parsed.getTime())) return true;
  return parsed.getTime() >= Date.now();
}

function App() {
  const [content, setContent] = useState(null);
  const mapQuery = encodeURIComponent("Tenas Gym and Spa Bole Bulbula Kidus gebreal Building Addis Ababa Ethiopia");
  const phone = content?.contact?.phone || "+25191 219 6096";
  const email = content?.contact?.email || "tenasgymandspa@gmail.com";
  const announcements = Array.isArray(content?.announcements)
    ? content.announcements.filter((item) => (item?.title || item?.text) && isActiveUntil(item?.expiresAt))
    : [];

  useEffect(() => {
    let mounted = true;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("api"))))
      .catch(() => fetch("./content.json?v=20260325203227").then((res) => res.json()))
      .then((data) => {
        if (mounted && data) {
          setContent(data.content || data);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <nav className="nav">
        <a className="logo" href="/">
          <img
            src="./images/tenas.jpeg"
            alt="Tenas Gym and Spa logo"
            className="logo-image"
          />
          <span>Tenas Gym and Spa</span>
        </a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a href="/shop">Shop</a>
          <a href="/machines">Machines</a>
          <a href="/coaches">Coaches</a>
          <a href="/spa">Spa</a>
          <a href="/membership">Membership</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="cta" href="/membership">Join Now</a>
        </div>
      </nav>
      <header className="hero hero-home">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Strength. Conditioning. Recovery.</p>
            <h1>Train strong. Move fast. Recover smarter.</h1>
            <p className="lead">A focused training space with premium machines, practical coaching, and recovery support built around real consistency.</p>
            <div className="hero-actions">
              <a className="cta" href="/membership">Join Now</a>
              <a className="secondary" href="/tour">Book a Tour</a>
            </div>
            <div className="hero-signal-row">
              {heroSignals.map((item) => (
                <span className="hero-signal" key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <h3>At Tenas</h3>
            <p>Strength foundations</p>
            <p>Performance conditioning</p>
            <p>Mobility flows on tap</p>
          </div>
        </div>
      </header>

      <section className="section highlights">
        <div className="section-header">
          <h2>Why Tenas</h2>
          <p>Built for athletes, busy professionals, and anyone who wants real performance.</p>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => (
            <div className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <h2>Performance Lab</h2>
          <p>Our space blends strength engineering, conditioning flow, and recovery systems to keep you consistent and injury-resistant.</p>
        </div>
        <div className="feature-grid">
          {tech.map((item) => (
            <div className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {announcements.length ? (
        <section className="section updates-section">
          <div className="section-header">
            <p className="eyebrow">New Updates</p>
            <h2>What&apos;s happening at Tenas</h2>
            <p className="lead">Announce discounts, events, special sessions, and important gym news in one polished place.</p>
          </div>
          <div className="updates-grid">
            {announcements.slice(0, 3).map((item, index) => (
              <article
                className={`update-card ${index === 0 ? "update-card-featured" : ""}`}
                key={`${item.title || "update"}-${index}`}
              >
                <div className="update-media">
                  {item.img ? <img className="update-image" src={item.img} alt={item.title || "Tenas update"} loading="lazy" decoding="async" /> : <div className="update-image update-image-fallback" />}
                  <div className="update-media-overlay" />
                  <div className="update-badges">
                    {item.tag ? <span className="update-tag">{item.tag}</span> : null}
                    {item.date ? <span className="update-date">{item.date}</span> : null}
                  </div>
                </div>
                <div className="update-copy">
                  <h3>{item.title || "New announcement"}</h3>
                  {item.text ? <p>{item.text}</p> : null}
                  <div className="update-actions">
                    {item.link ? (
                      <a className="secondary" href={item.link} target="_blank" rel="noreferrer">
                        Learn More
                      </a>
                    ) : (
                      <span className="update-status">Live at Tenas</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section arrival-section">
        <div className="section-header">
          <p className="eyebrow">First Impression</p>
          <h2>Show the arrival experience too</h2>
          <p className="lead">Reception, building presence, and smart access help visitors picture the full experience before they step inside.</p>
        </div>
        <div className="arrival-grid">
          {arrivalMoments.map((item) => (
            <article className={`arrival-card ${item.className || ""}`} key={item.title}>
              <img className="arrival-image" src={item.img} alt={item.title} loading="lazy" decoding="async" />
              <div className="arrival-overlay">
                <span className="arrival-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section location-section">
        <div className="section-header">
          <p className="eyebrow">Find Us</p>
          <h2>Train at the right spot</h2>
          <p className="lead">Easy to locate, simple to visit, and designed to feel like part of the Tenas experience before you even walk in.</p>
        </div>
        <div className="location-grid">
          <div className="location-card">
            <div className="location-copy">
              <span className="location-label">Visit</span>
              <h3>Bole Bulbula, Kidus gebreal Building</h3>
              <p>Addis Ababa, Ethiopia</p>
            </div>
            <div className="location-meta">
              <div className="location-pill">
                <strong>Hours</strong>
                <span>Mon-Sat: {content?.hours?.monSat || "5:00 AM - 9:00 PM"}</span>
              </div>
              <div className="location-pill">
                <strong>Contact</strong>
                <span>{phone}</span>
              </div>
              <div className="location-pill">
                <strong>Email</strong>
                <span>{email}</span>
              </div>
            </div>
            <div className="hero-actions">
              <a
                className="cta"
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
              <a className="secondary" href="/shop">Open Shop</a>
              <a className="secondary" href="/gallery">Open Full Gallery</a>
              <a className="secondary" href="/tour">Book a Tour</a>
            </div>
          </div>
          <div className="map-shell">
            <iframe
              className="location-map"
              title="Tenas Gym and Spa location map"
              src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div>
          <h2>Ready to feel the difference?</h2>
          <p>Tour the facility, meet a coach, and get a plan built for you.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);






