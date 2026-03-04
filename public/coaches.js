const coaches = [
  {
    name: "Kidus Mulgeta",
    role: "Head Strength Coach",
    img: "/images/kidus%20mulgeta.png",
    bio: "10+ years coaching strength athletes and general population clients.",
    skills: ["CSCS", "Powerlifting", "Mobility"],
    exp: "Focus: Maximum strength, clean technique, injury-proof mechanics."
  },
  {
    name: "Eskinder Worku",
    role: "Performance & Conditioning",
    img: "/images/my%20co2.jpg",
    bio: "Hybrid endurance specialist with a focus on sustainable intensity.",
    skills: ["USAW", "HIIT", "Hyrox"],
    exp: "Focus: Engine building, athletic conditioning, interval systems."
  },
  {
    name: "Niah Hassen",
    role: "Mobility & Recovery",
    img: "/images/noh%20co.png",
    bio: "Movement coach helping members improve range and reduce pain.",
    skills: ["FRC", "Stretch Therapy", "Recovery"],
    exp: "Focus: Mobility systems, tissue care, pre-hab and post-hab."
  }
];

function App() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data && data.ok) {
          setContent(data.content);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const coachList = content?.coaches || coaches;

  return (
    <div>
      <header className="hero">
        <nav className="nav">
          <a className="logo" href="/index.html">
            <img src="/images/tenas.jpeg" alt="Tenas Fitness logo" className="logo-image" />
            <span>Tenas Fitness</span>
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/machines.html">Machines</a>
            <a href="/programs.html">Programs</a>
            <a href="/coaches.html">Coaches</a>
            <a href="/membership.html">Membership</a>
          </div>
          <a className="cta" href="/membership.html">Join Now</a>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Elite Coaching Team</p>
            <h1>Coaches Who Build Performance, Not Just Physique.</h1>
            <p className="lead">Certified experts in strength, conditioning, mobility, and recovery with individualized programs for every goal.</p>
            <div className="hero-actions">
              <a className="secondary" href="/programs.html">View Programs</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>Coaching Pillars</h3>
            <p><strong>Assessment First</strong> - movement screen and baseline testing.</p>
            <p><strong>Progressive Plan</strong> - data-driven programming every month.</p>
            <p><strong>Recovery Built In</strong> - mobility + breathwork + lifestyle.</p>
          </div>
        </div>
      </header>

      <section id="coaches" className="section coaches">
        <div className="section-header">
          <h2>Meet The Coaches</h2>
          <p>Every coach is chosen for technical skill, care, and performance mindset.</p>
        </div>
        <div className="coach-grid">
          {coachList.map((coach) => (
            <article className="coach-card" key={coach.name}>
              <img src={coach.img} alt={coach.name} className="coach-photo" />
              <div>
                <h3>{coach.name}</h3>
                <p className="role">{coach.role}</p>
                <p>{coach.bio}</p>
                <div className="tags">
                  {coach.skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
                <p className="exp">{coach.exp}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section programs">
        <div className="section-header">
          <h2>What You Get</h2>
          <p>Coaching that feels premium from day one.</p>
        </div>
        <div className="program-grid">
          <div className="program-card">
            <h3>Movement Assessment</h3>
            <p>Baseline testing to build a plan matched to your body and goals.</p>
          </div>
          <div className="program-card">
            <h3>Monthly Progress Review</h3>
            <p>Coach check-ins with measurable metrics and training adjustments.</p>
          </div>
          <div className="program-card">
            <h3>Recovery Protocols</h3>
            <p>Mobility flows, breathwork, and recovery sequencing after sessions.</p>
          </div>
        </div>
      </section>

      <section className="section pricing">
        <div className="section-header">
          <h2>Book A Session</h2>
          <p>Train with a coach, see the facility, and get a custom plan.</p>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <h3>Coach Intro</h3>
            <p className="price">Free</p>
            <p>Movement screen + gym tour.</p>
          </div>
          <div className="price-card">
            <h3>Performance Consult</h3>
            <p className="price">$29</p>
            <p>Baseline metrics + 4-week plan.</p>
          </div>
          <div className="price-card">
            <h3>1-on-1 Session</h3>
            <p className="price">$49</p>
            <p>Technique coaching + recovery session.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);





