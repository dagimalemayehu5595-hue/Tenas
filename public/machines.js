const { useState } = React;

const machines = [
  {
    name: "Multi-Station Cable Machine",
    desc: "Functional trainer with adjustable pulleys for upper body, core, and full-body cable work.",
    img: "./images/functional.png",
    targets: "Chest, back, arms, shoulders, core",
    bestFor: "Cable flyes, pulldowns, pushdowns, rows",
    tip: "Set both pulleys evenly and stay controlled through the full range."
  },
  {
    name: "Seated Chest Press Machine",
    desc: "Guided chest press machine that lets members load the chest, triceps, and front delts safely.",
    img: "./images/Seated Chest Press Machine.png",
    targets: "Chest, triceps, shoulders",
    bestFor: "Pressing strength with guided mechanics",
    tip: "Keep your shoulders down and drive straight through the handles."
  },
  {
    name: "Pec Deck / Chest Fly Machine",
    desc: "Chest isolation station built for controlled inward pressing and fly movement.",
    img: "./images/cross.png",
    targets: "Chest",
    bestFor: "Chest flyes and inner-chest focus",
    tip: "Keep a soft bend in the elbows and squeeze at the center."
  },
  {
    name: "Seated Calf Raise",
    desc: "Lower-leg machine designed to load the calves in a seated position for controlled plantar flexion work.",
    img: "./images/Seated Calf Raise.png",
    targets: "Calves, soleus, lower legs",
    bestFor: "Calf strength, ankle support, lower-leg development",
    tip: "Pause at the top, lower slowly, and move through the full ankle range."
  },
  {
    name: "Inclined Leg Press Machine",
    desc: "Angled sled machine for heavy lower-body pressing with stable foot placement.",
    img: "./images/leg press.png",
    targets: "Quads, glutes, calves",
    bestFor: "Leg strength and high-volume lower-body work",
    tip: "Drive through the mid-foot and avoid locking the knees hard."
  },
  {
    name: "Smith Machine",
    desc: "Barbell-on-rails setup for safer pressing and squat patterns with guided movement.",
    img: "./images/Smith Machine.png",
    targets: "Quads, glutes, chest, shoulders",
    bestFor: "Squats, bench press, shoulder press",
    tip: "Set the safeties before loading the bar and keep your path stacked."
  },
  {
    name: "Adjustable Benches",
    desc: "Flat and incline benches used throughout the free-weight area for pressing and dumbbell work.",
    img: "./images/Adjustable Benches.png",
    targets: "Chest, shoulders, arms, full body",
    bestFor: "Dumbbell presses, rows, incline work",
    tip: "Lock the bench angle first so the setup stays solid through the set."
  },
  {
    name: "Abductors Machine",
    desc: "Seated lower-body machine designed to strengthen the outer hips through controlled abduction.",
    img: "./images/Abductors Machine.png",
    targets: "Glute medius, outer hips, hip stabilizers",
    bestFor: "Hip strength, lower-body balance, glute activation",
    tip: "Stay tall in the seat and press outward with control instead of jerking the weight."
  },
  {
    name: "Dumbbell Rack",
    desc: "Full rack of dumbbells for progressive free-weight training across all major movement patterns.",
    img: "./images/Dumbbell Rack.png",
    targets: "Full body",
    bestFor: "Presses, rows, lunges, carries",
    tip: "Choose the pair you can control cleanly for every rep."
  },
  {
    name: "Leg Extension Machine",
    desc: "Seated lower-body machine designed to isolate the quadriceps through controlled knee extension.",
    img: "./images/Leg Extension Machine.png",
    targets: "Quadriceps, knees, lower legs",
    bestFor: "Quad isolation, knee strength, lower-body development",
    tip: "Extend smoothly, pause at the top, and lower the weight under control."
  },
  {
    name: "Treadmills",
    desc: "Multiple treadmills positioned near the windows for walking, runs, and conditioning blocks.",
    img: "./images/Treadmills.png",
    targets: "Cardio, legs",
    bestFor: "Walking, running, intervals",
    tip: "Start with a steady pace before adding speed or incline."
  },
  {
    name: "Elliptical Machines",
    desc: "Low-impact cross-trainers for steady cardio and recovery-oriented conditioning.",
    img: "./images/Elliptical Machines.png",
    targets: "Cardio, legs, glutes",
    bestFor: "Low-impact endurance work",
    tip: "Keep the motion smooth and drive evenly through both pedals."
  },
  {
    name: "Stair Climber",
    desc: "Stepper-style cardio machine for intense leg-focused conditioning.",
    img: "./images/Stair Climber.png",
    targets: "Cardio, quads, glutes, calves",
    bestFor: "High-intensity cardio and leg burn",
    tip: "Stay upright and let the legs do the work instead of leaning on the rails."
  },
  {
    name: "Punching Bag",
    desc: "Heavy bag station for boxing drills, conditioning rounds, and athletic movement work.",
    img: "./images/Punching Bag.png",
    targets: "Shoulders, core, cardio",
    bestFor: "Boxing, conditioning, coordination",
    tip: "Brace your core and rotate through the hips, not just the arms."
  },
  {
    name: "Spin Bikes",
    desc: "Indoor cycling bikes used for cardio blocks, endurance rides, and class-style sessions.",
    img: "./images/Spin Bikes.png",
    targets: "Cardio, legs",
    bestFor: "Cycling sessions and interval work",
    tip: "Set the saddle height first so the knees stay comfortable through the ride."
  },
  {
    name: "Preacher Curl Machine",
    desc: "Arm-focused machine built to isolate the biceps with a supported upper-arm position and strict curl path.",
    img: "./images/Preacher Curl Machine.png",
    targets: "Biceps, brachialis, forearms",
    bestFor: "Biceps isolation, strict curls, arm development",
    tip: "Keep your upper arms planted on the pad and control the lowering phase."
  },
  {
    name: "Mats / Functional Space",
    desc: "Open floor area for stretching, mobility drills, bodyweight work, and general movement prep.",
    img: "./images/Mats  Functional Space.png",
    targets: "Mobility, core, bodyweight training",
    bestFor: "Stretching, warm-ups, functional exercise",
    tip: "Use the space for prep work before loading the main lifts."
  }
];

function App() {
  const [selected, setSelected] = useState(0);
  const [content, setContent] = useState(null);

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




