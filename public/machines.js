const { useState } = React;

const machines = [
  {
    name: "Apex Power Rack",
    desc: "Heavy-duty rack for squats, bench, and pull-ups.",
    img: "./images/apex.png",
    targets: "Quads, glutes, back",
    bestFor: "Compound strength",
    tip: "Brace your core before every rep."
  },
  {
    name: "Vector Cable Station",
    desc: "Dual-stack cables for full-range strength work.",
    img: "./images/victor-cable.png",
    targets: "Chest, shoulders, arms",
    bestFor: "Cables, flyes, rows",
    tip: "Keep constant tension."
  },
  {
    name: "Storm Air Bike",
    desc: "Assault-style bike with infinite resistance.",
    img: "./images/bike.png",
    targets: "Full body engine",
    bestFor: "Intervals, warm-ups",
    tip: "Push and pull together for max output."
  },
  {
    name: "Precision Leg Press",
    desc: "45-degree sled with smooth rails and oversized footplate.",
    img: "./images/leg press.png",
    targets: "Quads, glutes, calves",
    bestFor: "Strength & volume",
    tip: "Drive through mid-foot for control."
  },
  {
    name: "Crossover Fly Station",
    desc: "Adjustable fly station for chest and shoulder isolation.",
    img: "./images/cross.png",
    targets: "Chest, shoulders",
    bestFor: "Flyes, isolation",
    tip: "Keep elbows soft through the arc."
  },
  {
    name: "Functional Trainer Pro",
    desc: "Versatile cable unit for full-body training.",
    img: "./images/functional.png",
    targets: "Full body",
    bestFor: "Functional strength",
    tip: "Control the negative on every rep."
  },
  {
    name: "Power Rack Elite",
    desc: "Heavy rack for max strength and safe spotting.",
    img: "./images/power.png",
    targets: "Quads, glutes, back",
    bestFor: "Squats, presses",
    tip: "Set safety pins before lifting heavy."
  },
  {
    name: "Hydro Row Elite",
    desc: "Water-resistance rower with smooth glide.",
    img: "images/hydro.png",
    targets: "Back, legs, core",
    bestFor: "Cardio endurance",
    tip: "Drive with legs, finish with arms."
  },
  {
    name: "Glide Leg Press",
    desc: "45-degree sled with wide foot plate.",
    img: "./images/leg press.png",
    targets: "Quads, glutes, calves",
    bestFor: "Hypertrophy blocks",
    tip: "Control the descent for growth."
  },
  {
    name: "Pulse Sled Track",
    desc: "Turf lane for sled pushes and pulls.",
    img: "images/pulse-sled.png",
    targets: "Legs, lungs",
    bestFor: "Conditioning",
    tip: "Stay low and drive through the floor."
  }
];

function App() {
  const [selected, setSelected] = useState(0);
  const [content, setContent] = useState(null);

  React.useEffect(() => {
    let mounted = true;
    fetch("./content.json?v=20260304184135")
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

  const machineList = content?.machines || machines;
  const total = machineList.length;

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
            <a href="./machines.html">Machines</a>
            <a href="./programs.html">Programs</a>
            <a href="./coaches.html">Coaches</a>
            <a href="./membership.html">Membership</a>
          </div>
          <a className="cta" href="./membership.html">Join Now</a>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Machine Intelligence</p>
            <h1>Precision Equipment That Performs.</h1>
            <p className="lead">Select a machine to see specs, coaching tips, and training focus.</p>
            <div className="hero-actions">
              <a className="cta" href="./tour.html">Book a Tour</a>
              <a className="secondary" href="./programs.html">See Programs</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>Machine Standards</h3>
            <p><strong>Biomechanics First</strong> - calibrated movement paths.</p>
            <p><strong>Performance Load</strong> - heavy, smooth, and stable.</p>
            <p><strong>Recovery Ready</strong> - low-impact conditioning options.</p>
          </div>
        </div>
      </header>

      <section className="section machines">
        <div className="section-header">
          <h2>3D Machine Showcase</h2>
          <p>Auto-rotating equipment. Tap one to enlarge and see details.</p>
        </div>

        <div className="carousel-scene">
          <div className="carousel-ring" style={{ "--total": total }}>
            {machineList.map((machine, index) => (
              <article
                key={machine.name}
                className={`machine-card ${selected === index ? "selected" : ""}`}
                style={{ "--i": index }}
                onClick={() => setSelected(index)}
              >
                <img src={machine.img} alt={machine.name} />
                <div className="info">
                  <h3>{machine.name}</h3>
                  <p>{machine.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="machine-details">
            <h3>{machineList[selected]?.name}</h3>
            <p>{machineList[selected]?.desc}</p>
            <div className="machine-detail-layout">
              <div className="machine-detail-photo">
                <img src={machineList[selected]?.img} alt={machineList[selected]?.name} />
              </div>
              <div className="detail-grid">
                <div className="detail-box">
                  <strong>Targets</strong>
                  <p>{machineList[selected]?.targets}</p>
                </div>
                <div className="detail-box">
                  <strong>Best For</strong>
                  <p>{machineList[selected]?.bestFor}</p>
                </div>
                <div className="detail-box">
                  <strong>Coach Tip</strong>
                  <p>{machineList[selected]?.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);







