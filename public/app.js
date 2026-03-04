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

  useEffect(() => {
    let mounted = true;
    fetch("./content.json?v=20260304184135")
      .then((res) => res.json())
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
            <a href="./machines.html">Machines</a>
            <a href="./programs.html">Programs</a>
            <a href="./coaches.html">Coaches</a>
            <a href="./membership.html">Membership</a>
          </div>
          <div className="nav-actions">
            <a className="cta secondary admin-link" href="./admin.html">Admin</a>
            <a className="cta" href="./membership.html">Join Now</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Strength , Conditioning , Recovery</p>
            <h1>Train strong. Move fast. Recover smarter.</h1>
            <p className="lead">Black & blue performance gym with premium machines, coaching, and recovery built around your goals.</p>
            <div className="hero-actions">
              <a className="cta" href="./membership.html">Start Free Trial</a>
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






