const programs = [
  {
    name: "Strength Track",
    desc: "Barbell progressions with weekly performance tracking and coaching feedback.",
    focus: ["Squat/Bench/Deadlift", "Progressive overload", "Technique coaching"]
  },
  {
    name: "Hybrid Conditioning",
    desc: "Engine-building sessions that mix cardio, sled work, and functional strength.",
    focus: ["Intervals", "Sled work", "Athletic conditioning"]
  },
  {
    name: "Recovery Flow",
    desc: "Mobility classes, breathwork, and guided stretching for longevity.",
    focus: ["Mobility", "Breathing", "Post-session recovery"]
  },
  {
    name: "Athlete Performance",
    desc: "Power, speed, and agility for sport-specific results.",
    focus: ["Sprint mechanics", "Explosive power", "Change of direction"]
  }
];

const schedule = [
  { time: "06:00", name: "Strength Foundations" },
  { time: "12:15", name: "Hyrox Conditioning" },
  { time: "18:30", name: "Power + Mobility" }
];

function App() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    fetch("./content.json?v=20260325203227")
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

  const programList = content?.programs || programs;
  const scheduleList = content?.schedule || schedule;

  return (
    <div>
      <header className="hero">
        <nav className="nav">
          <a className="logo" href="./index.html">
            <img src="./images/tenas.jpeg" alt="Tenas Fitness logo" className="logo-image" />
            <span>Tenas Fitness</span>
          </a>
          <div className="nav-links">
            <a href="./">Home</a>
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
            <p className="eyebrow">Smart Programming</p>
            <h1>Programs Built For Real Life.</h1>
            <p className="lead">Choose guided strength, conditioning, or recovery - with a plan you can stick to.</p>
            <div className="hero-actions">
              <a className="cta" href="./membership.html">Start Free Trial</a>
              <a className="secondary" href="./coaches.html">Meet Coaches</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>Today at Tenas</h3>
            {scheduleList.map((item) => (
              <p key={item.time}><strong>{item.time}</strong> {item.name}</p>
            ))}
          </div>
        </div>
      </header>

      <section className="section programs">
        <div className="section-header">
          <h2>Programs</h2>
          <p>Focused, coach-led blocks designed for real progress.</p>
        </div>
        <div className="program-grid">
          {programList.map((program) => (
            <div className="program-card" key={program.name}>
              <h3>{program.name}</h3>
              <p>{program.desc}</p>
              <div className="tags">
                {program.focus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <h2>How It Works</h2>
          <p>Start with a movement screen, then train with a personalized plan that adapts every month.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Assessment</h3>
            <p>Baseline testing to identify strengths and gaps.</p>
          </div>
          <div className="feature-card">
            <h3>Programming</h3>
            <p>Weekly structure built around your schedule and goals.</p>
          </div>
          <div className="feature-card">
            <h3>Feedback</h3>
            <p>Coach check-ins to adjust training and recovery.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);











