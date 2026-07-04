const spaServices = [
  {
    title: "Recovery Massage",
    desc: "Focused massage for tired muscles after training, long workdays, or high-stress weeks.",
    tag: "Recovery",
    time: "45-60 min"
  },
  {
    title: "Deep Tissue Work",
    desc: "Firm pressure for knots, tight shoulders, back tension, and heavy training fatigue.",
    tag: "Strength Reset",
    time: "60 min"
  },
  {
    title: "Relaxation Massage",
    desc: "A calmer full-body session for stress relief, circulation, and total nervous-system reset.",
    tag: "Relax",
    time: "45 min"
  },
  {
    title: "Steam & Wellness",
    desc: "A simple spa add-on to help you feel lighter, cleaner, and refreshed after your session.",
    tag: "Wellness",
    time: "Add-on"
  }
];

const spaBenefits = [
  "Better recovery between workouts",
  "Reduced stress and muscle tension",
  "A smoother gym + wellness experience"
];

function App() {
  return (
    <div className="page-shell">
      <nav className="nav">
        <a className="logo" href="/">
          <img src="./images/tenas.jpeg" alt="Tenas Gym and Spa logo" className="logo-image" />
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
          <a className="cta" href="/tour">Book Now</a>
        </div>
      </nav>

      <header className="hero spa-hero">
        <div className="hero-grid spa-hero-grid">
          <div>
            <p className="eyebrow">Spa & Massage</p>
            <h1>Recover deeper. Relax better. Leave renewed.</h1>
            <p className="lead">
              Tenas is not only a training floor. It is a place to reset your body with massage, wellness care, and recovery support.
            </p>
            <div className="hero-actions">
              <a className="cta" href="/tour">Book a Visit</a>
              <a className="secondary" href="/membership">Join Tenas</a>
            </div>
          </div>
          <div className="spa-hero-card">
            <img src="./images/spa.PNG" alt="Tenas Day Spa Therapy and Wellness" loading="lazy" decoding="async" />
            <div>
              <span>Therapy and Wellness</span>
              <strong>Gym energy. Spa calm.</strong>
            </div>
          </div>
        </div>
      </header>

      <section className="section spa-section">
        <div className="section-header">
          <p className="eyebrow">What We Offer</p>
          <h2>Recovery services with a premium touch</h2>
          <p>Simple, useful spa options for members who want to train hard and still feel fresh.</p>
        </div>
        <div className="spa-service-grid">
          {spaServices.map((service) => (
            <article className="spa-service-card" key={service.title}>
              <div className="spa-service-topline">
                <span>{service.tag}</span>
                <small>{service.time}</small>
              </div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section spa-split">
        <div className="spa-photo-panel">
          <img src="./images/spa.PNG" alt="Spa and wellness logo" loading="lazy" decoding="async" />
        </div>
        <div className="spa-benefit-panel">
          <p className="eyebrow">Why Add Spa?</p>
          <h2>Training feels better when recovery is part of the plan.</h2>
          <p>
            Massage and wellness care help members stay consistent, reduce tension, and make the gym feel like a full lifestyle space.
          </p>
          <div className="spa-benefit-list">
            {spaBenefits.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="cta" href="/tour">Ask About Spa</a>
        </div>
      </section>

      <section className="section spa-cta-strip">
        <div>
          <p className="eyebrow">Ready To Reset?</p>
          <h2>Book your spa or massage visit with Tenas.</h2>
        </div>
        <a className="cta" href="/tour">Book Now</a>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
