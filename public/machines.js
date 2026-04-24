const { useState } = React;

const machines = [
  {
    name: "Commercial Treadmill (LCD Screen)",
    desc: "Motorized treadmill built for steady cardio, incline walks, and running sessions.",
    img: "./images/Treadmillsc.png",
    targets: "Cardio, legs, endurance",
    bestFor: "Walking, running, intervals",
    tip: "Start smooth, then build speed or incline once your stride feels stable."
  },
  {
    name: "Curved Treadmill (LED Screen)",
    desc: "Self-powered curved treadmill for sprint work and harder conditioning blocks.",
    img: "./images/Treadmills.png",
    targets: "Cardio, speed, legs",
    bestFor: "Sprints, conditioning, power output",
    tip: "Stay tall, drive through the forefoot, and let the belt respond to your effort."
  },
  {
    name: "Elliptical",
    desc: "Low-impact cardio machine that keeps the heart rate up without heavy joint stress.",
    img: "./images/Elliptical Machines.png",
    targets: "Cardio, legs, glutes",
    bestFor: "Endurance and recovery cardio",
    tip: "Keep the motion even and avoid bouncing through the pedals."
  },
  {
    name: "Recumbent Bike",
    desc: "Back-supported bike setup for low-impact cardio and longer steady sessions.",
    img: "./images/bike.png",
    targets: "Cardio, legs",
    bestFor: "Comfortable endurance work",
    tip: "Set the seat so the knee stays slightly bent at the far end of the pedal stroke."
  },
  {
    name: "Spinning Bike",
    desc: "Indoor cycling bike with magnetic resistance for classes, intervals, and conditioning work.",
    img: "./images/Spin Bikes.png",
    targets: "Cardio, quads, glutes",
    bestFor: "Cycling workouts and interval sessions",
    tip: "Dial the resistance before standing so the ride stays controlled."
  },
  {
    name: "Hack Squat Machine",
    desc: "Plate-loaded lower-body machine for heavy quad-focused squat work with back support.",
    img: "./images/leg press.png",
    targets: "Quads, glutes, calves",
    bestFor: "Lower-body strength and quad focus",
    tip: "Keep your back flat against the pad and drive through the full foot."
  },
  {
    name: "Incline Squat Machine (45 Degree)",
    desc: "Angled squat and leg drive machine for heavy lower-body loading in a stable track.",
    img: "./images/leg press.png",
    targets: "Quads, glutes, hamstrings",
    bestFor: "Heavy leg work and lower-body progression",
    tip: "Keep the knees tracking over the toes and do not rush the bottom."
  },
  {
    name: "Seated Row Machine",
    desc: "Guided rowing station for building upper-back strength through a supported pulling path.",
    img: "./images/gym machine.png",
    targets: "Back, lats, rear delts, biceps",
    bestFor: "Back thickness and seated pulling",
    tip: "Lead with the elbows and squeeze the shoulder blades together at the finish."
  },
  {
    name: "High Pulley Machine",
    desc: "Cable-based upper-body station for pulldowns, triceps work, and other vertical pulling movements.",
    img: "./images/functional.png",
    targets: "Back, lats, arms, shoulders",
    bestFor: "Pulldowns, pushdowns, cable accessories",
    tip: "Keep the ribcage down and pull through the elbows instead of the hands alone."
  },
  {
    name: "Seated Chest Press",
    desc: "Chest press machine for controlled pressing with a guided path and stable seat position.",
    img: "./images/Seated Chest Press Machine.png",
    targets: "Chest, triceps, shoulders",
    bestFor: "Pressing strength and chest development",
    tip: "Press straight through the handles and keep the shoulders packed."
  },
  {
    name: "Seated Straight Arm Chest Machine",
    desc: "Chest-focused machine that supports a strict pressing or fly-style path through the front body.",
    img: "./images/cross.png",
    targets: "Chest, front delts, triceps",
    bestFor: "Chest isolation and controlled pressing",
    tip: "Stay tall in the seat and squeeze the chest instead of shrugging the shoulders."
  },
  {
    name: "Leg Curl & Leg Extension",
    desc: "Two-in-one lower-body station for isolating the hamstrings and quadriceps in one setup.",
    img: "./images/Leg Extension Machine.png",
    targets: "Quads, hamstrings, knees",
    bestFor: "Lower-body isolation work",
    tip: "Control both the lift and the lowering phase to keep tension where it belongs."
  },
  {
    name: "Seated Calf Machine",
    desc: "Calf-focused station for building the soleus and lower-leg strength with seated loading.",
    img: "./images/Seated Calf Raise.png",
    targets: "Calves, soleus, lower legs",
    bestFor: "Calf strength and ankle support",
    tip: "Pause at the top and lower slowly through a full ankle range."
  },
  {
    name: "Multi Adjustable Bench",
    desc: "Adjustable bench used for flat, incline, seated, and accessory free-weight work.",
    img: "./images/Adjustable Benches.png",
    targets: "Chest, shoulders, arms, full body",
    bestFor: "Presses, rows, bench-supported movements",
    tip: "Lock the angle securely before the set starts."
  },
  {
    name: "Preacher Curl Attachment",
    desc: "Bench attachment used to isolate the biceps with a strict upper-arm support position.",
    img: "./images/Preacher Curl Machine.png",
    targets: "Biceps, forearms",
    bestFor: "Strict curls and arm isolation",
    tip: "Keep the upper arm planted and do not swing through the curl."
  },
  {
    name: "Hip Adductor & Abductor Machine",
    desc: "Dual-direction hip machine for training both inner and outer thigh movement patterns.",
    img: "./images/Abductors Machine.png",
    targets: "Inner thighs, outer hips, glutes",
    bestFor: "Hip strength and lower-body balance",
    tip: "Move with control and avoid bouncing off the end range."
  },
  {
    name: "Smith Machine",
    desc: "Guided barbell station for safer squats, benching, and overhead pressing patterns.",
    img: "./images/Smith Machine.png",
    targets: "Quads, glutes, chest, shoulders",
    bestFor: "Guided strength training",
    tip: "Set the bar height and safeties before loading up."
  },
  {
    name: "Rubber Dumbbell Set",
    desc: "Rubber-coated dumbbells for progressive free-weight training across all major movements.",
    img: "./images/Dumbbell Rack.png",
    targets: "Full body",
    bestFor: "Presses, rows, carries, lunges",
    tip: "Choose a pair you can control from the first rep to the last."
  },
  {
    name: "Rubber Coated Weight Plates",
    desc: "Coated plates for loading bars, machines, and plate-loaded strength equipment.",
    img: "./images/power.png",
    targets: "Strength loading",
    bestFor: "Barbell and machine progression",
    tip: "Match plate sizes evenly so the setup stays balanced."
  },
  {
    name: "Power Lifting Weight Plate",
    desc: "Heavy-duty plates built for serious barbell loading and strength-focused sessions.",
    img: "./images/power.png",
    targets: "Strength loading",
    bestFor: "Squats, deadlifts, presses",
    tip: "Load both sides evenly before unracking the bar."
  },
  {
    name: "Abs Wheel",
    desc: "Simple core tool for anti-extension ab work and trunk control.",
    img: "./images/gym.png",
    targets: "Core, abs, shoulders",
    bestFor: "Rollouts and trunk stability",
    tip: "Brace hard and keep the ribs tucked as you roll out."
  },
  {
    name: "Step Platform",
    desc: "Portable step used for cardio circuits, warm-ups, and lower-body conditioning drills.",
    img: "./images/Mats  Functional Space.png",
    targets: "Cardio, legs, coordination",
    bestFor: "Step work and conditioning circuits",
    tip: "Plant the whole foot on the platform before driving up."
  },
  {
    name: "Straight Bar",
    desc: "Straight cable or accessory bar used for pulling, pressing, and arm work.",
    img: "./images/power.png",
    targets: "Arms, back, shoulders",
    bestFor: "Cable rows, pushdowns, curls",
    tip: "Keep the wrists stacked and let the elbows guide the movement."
  },
  {
    name: "Curved Bar",
    desc: "Curved cable bar for more comfortable wrist angles during upper-body accessories.",
    img: "./images/power.png",
    targets: "Arms, back, shoulders",
    bestFor: "Pushdowns, curls, cable accessories",
    tip: "Use the curve to find the most natural grip for your joints."
  },
  {
    name: "Three-Tier Dumbbell Rack",
    desc: "Storage rack that keeps the dumbbell area organized and easy to load from.",
    img: "./images/Dumbbell Rack.png",
    targets: "Storage and setup",
    bestFor: "Organizing free weights",
    tip: "Return pairs to the right level so the floor stays clear and safe."
  },
  {
    name: "Dual Cable Cross",
    desc: "Dual-stack cable station for flyes, rows, pulldowns, curls, and full-body cable work.",
    img: "./images/functional.png",
    targets: "Chest, back, arms, shoulders, core",
    bestFor: "Versatile cable training",
    tip: "Set both sides evenly before you begin the set."
  },
  {
    name: "Barbell",
    desc: "Main free-weight bar used for foundational strength lifts and loaded compounds.",
    img: "./images/power.png",
    targets: "Full body strength",
    bestFor: "Squats, presses, deadlifts, rows",
    tip: "Center the bar before loading so the plates balance correctly."
  },
  {
    name: "Vinyl Kettlebell",
    desc: "Kettlebell used for swings, carries, conditioning, and dynamic full-body training.",
    img: "./images/gymv.png",
    targets: "Full body, grip, core",
    bestFor: "Swings, carries, conditioning drills",
    tip: "Drive from the hips instead of lifting with the arms."
  },
  {
    name: "Boxing Gloves",
    desc: "Protective gloves used for bag work, boxing drills, and conditioning rounds.",
    img: "./images/Punching Bag.png",
    targets: "Boxing setup",
    bestFor: "Bag work and striking practice",
    tip: "Wrap or secure the wrist properly before starting rounds."
  },
  {
    name: "Shoulder Protection",
    desc: "Supportive gear used to make loaded movements feel more stable around the shoulders.",
    img: "./images/gym.png",
    targets: "Joint support",
    bestFor: "Support during selected lifts",
    tip: "Use support gear to assist good technique, not replace it."
  },
  {
    name: "Sand Bag",
    desc: "Conditioning bag for carries, shouldering, and functional strength work.",
    img: "./images/Punching Bag.png",
    targets: "Full body, grip, core",
    bestFor: "Carries, throws, loaded conditioning",
    tip: "Hug the bag tight and keep the core braced while moving."
  },
  {
    name: "Weight Lifting Belt",
    desc: "Support belt for heavy compound lifts where bracing matters most.",
    img: "./images/gym.png",
    targets: "Bracing support",
    bestFor: "Heavy squats, presses, deadlifts",
    tip: "Push your core into the belt instead of just tightening it."
  },
  {
    name: "Speed Rope",
    desc: "Jump rope for cardio, coordination, warm-ups, and athletic rhythm work.",
    img: "./images/gyms.png",
    targets: "Cardio, calves, coordination",
    bestFor: "Warm-ups and fast footwork",
    tip: "Keep the elbows close and turn the rope from the wrists."
  },
  {
    name: "Cable Handles",
    desc: "Accessory handles for cable stations that open up rows, flyes, curls, and press variations.",
    img: "./images/functional.png",
    targets: "Accessory attachment",
    bestFor: "Cable customization",
    tip: "Choose the handle width that matches the movement, not just comfort."
  },
  {
    name: "Barbell Rack",
    desc: "Storage rack for barbells and free-weight bar organization in the strength area.",
    img: "./images/power.png",
    targets: "Storage and setup",
    bestFor: "Keeping bars organized and ready",
    tip: "Rack the bars carefully so the sleeves and floor stay protected."
  },
  {
    name: "Kettlebell Rack",
    desc: "Storage rack that keeps kettlebells organized for faster workout setup.",
    img: "./images/gymr.png",
    targets: "Storage and setup",
    bestFor: "Organizing kettlebells",
    tip: "Return bells by size so the rack stays easy to use."
  },
  {
    name: "Stair Trainer",
    desc: "Stepping cardio machine that drives heart rate and leg endurance hard.",
    img: "./images/Stair Climber.png",
    targets: "Cardio, quads, glutes, calves",
    bestFor: "Leg-focused conditioning",
    tip: "Stand tall and let the legs work instead of leaning on the rails."
  },
  {
    name: "Olympic Squat Rack",
    desc: "Free barbell squat station for heavy lower-body training and big compound work.",
    img: "./images/apex-power-rack.jpg",
    targets: "Quads, glutes, hamstrings, core",
    bestFor: "Barbell squats and rack-based lifts",
    tip: "Set the J-hooks and safeties before you unrack the bar."
  },
  {
    name: "Olympic Flat Bench With Weight Storage",
    desc: "Flat bench press station with built-in plate storage for efficient setup.",
    img: "./images/Adjustable Benches.png",
    targets: "Chest, triceps, shoulders",
    bestFor: "Bench press and flat pressing",
    tip: "Plant the feet hard and keep the upper back set before every rep."
  },
  {
    name: "Sled",
    desc: "Push and pull sled for conditioning, power work, and leg drive training.",
    img: "./images/pulse-sled.png",
    targets: "Legs, lungs, full body",
    bestFor: "Conditioning pushes and loaded drags",
    tip: "Keep a forward lean and drive through short, powerful steps."
  },
  {
    name: "Hip Thrust Machine",
    desc: "Lower-body machine built to load hip extension and glute strength directly.",
    img: "./images/Hip.png",
    targets: "Glutes, hamstrings",
    bestFor: "Hip thrusts and glute development",
    tip: "Lock the ribs down and squeeze hard at the top."
  },
  {
    name: "Water Tanker",
    desc: "Hydration station for members between sets, sessions, and long training days.",
    img: "./images/Hydro.png",
    targets: "Recovery support",
    bestFor: "Hydration between workouts",
    tip: "Keep water intake steady before, during, and after training."
  }
];

function getMachineCardLabel(name) {
  const labels = {
    "Commercial Treadmill (LCD Screen)": "Treadmill",
    "Curved Treadmill (LED Screen)": "Curved Treadmill",
    "Recumbent Bike": "Recumbent Bike",
    "Spinning Bike": "Spin Bike",
    "Incline Squat Machine (45 Degree)": "Incline Squat",
    "Seated Straight Arm Chest Machine": "Straight Arm Chest",
    "Leg Curl & Leg Extension": "Leg Curl + Extension",
    "Seated Calf Machine": "Seated Calf",
    "Multi Adjustable Bench": "Adjustable Bench",
    "Preacher Curl Attachment": "Preacher Curl",
    "Hip Adductor & Abductor Machine": "Adductor + Abductor",
    "Rubber Dumbbell Set": "Dumbbells",
    "Rubber Coated Weight Plates": "Weight Plates",
    "Power Lifting Weight Plate": "Power Plates",
    "Step Platform": "Step Platform",
    "Three-Tier Dumbbell Rack": "Dumbbell Rack",
    "Dual Cable Cross": "Cable Cross",
    "Cable Handles": "Cable Handles",
    "Olympic Flat Bench With Weight Storage": "Olympic Flat Bench",
    "Hip Thrust Machine": "Hip Thrust",
    "Water Tanker": "Water Station"
  };

  return labels[name] || name;
}

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

  const machineList = machines;
  const total = machineList.length;

  return (
    <div>
      <header className="hero">
        <nav className="nav">
          <a className="logo" href="./index.html">
            <img src="./images/tenas.jpeg" alt="Tenas Fitness logo" className="logo-image" />
            <span>Tenas Gym and Spa</span>
          </a>
          <div className="nav-links">
            <a href="./">Home</a>
            <a href="./gallery.html">Gallery</a>
            <a href="./shop.html">Shop</a>
            <a href="./machines.html">Machines</a>
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
              <a className="secondary" href="./coaches.html">Meet Coaches</a>
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
                  <h3>{getMachineCardLabel(machine.name)}</h3>
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
