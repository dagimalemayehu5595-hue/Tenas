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

function App() {
  const [content, setContent] = useState(null);
  const mapQuery = encodeURIComponent("Tenas Fitness Bole Bulbula Kidus gebreal Building Addis Ababa Ethiopia");
  const phone = content?.contact?.phone || "+251 912196096";
  const email = content?.contact?.email || "tenasgymandspa@gmail.com";
  const announcements = Array.isArray(content?.announcements) ? content.announcements.filter((item) => item?.title || item?.text) : [];

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
      <header className="hero">
        <nav className="nav">
          <a className="logo" href="./index.html">
            <img
              src="./images/tenas.jpeg"
              alt="Tenas Fitness logo"
              className="logo-image"
            />
            <span>Tenas Fitness</span>
          </a>
          <div className="nav-links">
            <a href="./gallery.html">Gallery</a>
            <a href="./machines.html">Machines</a>
            <a href="./programs.html">Programs</a>
            <a href="./coaches.html">Coaches</a>
            <a href="./membership.html">Membership</a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <a className="cta" href="./membership.html">Join Now</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Strength , Conditioning , Recovery</p>
            <h1>Train strong. Move fast. Recover smarter.</h1>
            <p className="lead">Black & blue performance gym with premium machines, coaching, and recovery built around your goals.</p>
            <div className="hero-actions">
              <a className="cta" href="./membership.html">Join Now</a>
              <a className="secondary" href="./programs.html">View Schedule</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>Today at Tenas</h3>
            <p>Strength foundations, performance conditioning, and mobility flows on tap.</p>
            <p><strong>Mon-Sat:</strong> {content?.hours?.monSat || "11:00 AM - 4:00 AM"}</p>
            <p><strong>Sunday:</strong> {content?.hours?.sunday || "Half day"}</p>
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
                  {item.img ? <img className="update-image" src={item.img} alt={item.title || "Tenas update"} /> : <div className="update-image update-image-fallback" />}
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
              <a className="secondary" href="./gallery.html">Open Full Gallery</a>
              <a className="secondary" href="./tour.html">Book a Tour</a>
            </div>
          </div>
          <div className="map-shell">
            <iframe
              className="location-map"
              title="Tenas Fitness location map"
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






