const mediaShots = [
  {
    title: "Arrival",
    desc: "A first look at the training floor and machine layout.",
    img: "./images/IMG_3758.JPG",
    tone: "Space"
  },
  {
    title: "Shadow Wall",
    desc: "A darker, more focused view of the strength side of the gym.",
    img: "./images/IMG_3759.JPG",
    tone: "Strength"
  },
  {
    title: "Machine Rhythm",
    desc: "Equipment spacing and clean movement lanes across the room.",
    img: "./images/IMG_3760.JPG",
    tone: "Equipment"
  },
  {
    title: "Deep Floor",
    desc: "Another angle showing the machines, depth, and visual identity.",
    img: "./images/IMG_3761.JPG",
    tone: "Vibe"
  },
  {
    title: "Open Space",
    desc: "A wider floor shot that helps visitors understand the space.",
    img: "./images/IMG_3762.JPG",
    tone: "Space"
  },
  {
    title: "Precision Line",
    desc: "Clean machine lines and a premium studio atmosphere.",
    img: "./images/IMG_3763.JPG",
    tone: "Equipment"
  },
  {
    title: "Low Light",
    desc: "A moodier angle showing the darker side of the training floor.",
    img: "./images/IMG_3764.JPG",
    tone: "Mood"
  },
  {
    title: "Perspective",
    desc: "A strong perspective shot that highlights the room design.",
    img: "./images/IMG_3765.JPG",
    tone: "Design"
  },
  {
    title: "Power Zone",
    desc: "A wide look at multiple stations working together in one space.",
    img: "./images/IMG_3766.JPG",
    tone: "Space"
  },
  {
    title: "Walkthrough",
    desc: "Another broad view of the floor for visitors previewing the gym.",
    img: "./images/IMG_3767.JPG",
    tone: "Tour"
  },
  {
    title: "Window Side",
    desc: "A bright angle softened to keep the gallery cohesive.",
    img: "./images/IMG_3769.JPG",
    tone: "Light"
  },
  {
    title: "Machine Detail",
    desc: "A detailed machine shot for people who look closely at equipment.",
    img: "./images/IMG_3770.JPG",
    tone: "Detail"
  },
  {
    title: "Corner View",
    desc: "A wider corner shot showing more of the room and circulation.",
    img: "./images/IMG_3771.JPG",
    tone: "Space"
  },
  {
    title: "Free Weight Side",
    desc: "Free-weight and machine balance in one clean visual frame.",
    img: "./images/IMG_3772.JPG",
    tone: "Weights"
  },
  {
    title: "Closer Look",
    desc: "A closer equipment angle for visitors who want detail.",
    img: "./images/IMG_3773.JPG",
    tone: "Equipment"
  },
  {
    title: "Depth Frame",
    desc: "A floor view that shows depth, finish, and overall atmosphere.",
    img: "./images/IMG_3774.JPG",
    tone: "Vibe"
  },
  {
    title: "Premium Floor",
    desc: "A clean wide shot that helps the gym feel open and premium.",
    img: "./images/IMG_3775.JPG",
    tone: "Premium"
  },
  {
    title: "Entry Light",
    desc: "A brighter entry-side angle now softened for visual consistency.",
    img: "./images/IMG_3776.JPG",
    tone: "Light"
  },
  {
    title: "Final Angle",
    desc: "A final bright floor shot balanced to match the darker gallery mood.",
    img: "./images/IMG_3777.JPG",
    tone: "Finish"
  }
];

const vibePoints = [
  "See the room before your first session",
  "Preview the equipment quality and layout",
  "Get a feel for the coaching and community",
  "Jump into live short-form clips from social"
];

const galleryStats = [
  { value: "19", label: "real gym shots" },
  { value: "100%", label: "actual Tenas space" },
  { value: "1", label: "clear visual story" }
];

const galleryAtmosphere = [
  "moody lighting",
  "clean machine lines",
  "premium floor feel",
  "cinematic darkness"
];

function App() {
  return (
    <div>
      <header className="hero gallery-hero">
        <nav className="nav">
          <a className="logo" href="./index.html">
            <img src="./images/tenas.jpeg" alt="Tenas Fitness logo" className="logo-image" />
            <span>Tenas Fitness</span>
          </a>
          <div className="nav-links">
            <a href="./index.html">Home</a>
            <a href="./gallery.html">Gallery</a>
            <a href="./machines.html">Machines</a>
            <a href="./programs.html">Programs</a>
            <a href="./coaches.html">Coaches</a>
            <a href="./membership.html">Membership</a>
          </div>
          <a className="cta" href="./tour.html">Book a Tour</a>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Photo + Video Preview</p>
            <h1>See the space, the machines, and the vibe.</h1>
            <p className="lead">A dedicated gallery page for people who want to feel the energy of Tenas before they walk through the door.</p>
            <div className="hero-actions">
              <a className="cta" href="#gallery-grid">Explore Gallery</a>
              <a className="secondary" href="https://www.instagram.com/tenasgymandspa/" target="_blank" rel="noreferrer">Watch Reels</a>
            </div>
            <div className="gallery-atmosphere">
              {galleryAtmosphere.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <h3>Why this page works</h3>
            {vibePoints.map((point) => (
              <p key={point}>{point}</p>
            ))}
          </div>
        </div>
      </header>

      <section className="section gallery-page-section" id="gallery-grid">
        <div className="section-header">
          <p className="eyebrow">Gallery</p>
          <h2>Inside the Tenas experience</h2>
          <p className="lead">A focused look at the training environment, equipment choices, and the atmosphere members feel on the floor.</p>
        </div>
        <div className="gallery-curation">
          <div className="gallery-curation-copy">
            <span className="gallery-curation-label">Curated View</span>
            <h3>Dark, premium, and performance-first.</h3>
            <p>Instead of showing random photos, this gallery now reads more like a visual tour. The mix of wider hero frames and tighter equipment details gives the whole page a cleaner rhythm.</p>
          </div>
          <div className="gallery-stats">
            {galleryStats.map((item) => (
              <div className="gallery-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="gallery-page-grid">
          {mediaShots.map((item, index) => (
            <article
              className={`gallery-page-card ${
                index % 7 === 0
                  ? "gallery-page-card-feature"
                  : index % 5 === 0
                    ? "gallery-page-card-tall"
                    : index % 3 === 0
                      ? "gallery-page-card-wide"
                      : ""
              }`}
              key={item.title}
            >
              <img src={item.img} alt={item.title} className="gallery-page-image" />
              <div className="gallery-page-overlay">
                <span className="gallery-chip">{item.tone}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section media-band">
        <div className="media-band-copy">
          <p className="eyebrow">Video</p>
          <h2>Want motion, music, and real gym energy?</h2>
          <p className="lead">Social clips already show the pace, people, and personality of the space. This gives visitors a stronger feel than still images alone.</p>
        </div>
        <div className="media-band-actions">
          <a className="cta" href="https://www.instagram.com/tenasgymandspa/" target="_blank" rel="noreferrer">Open Instagram</a>
          <a className="secondary" href="https://www.tiktok.com/@tenas.gym.and.spa" target="_blank" rel="noreferrer">Open TikTok</a>
          <a className="secondary" href="./tour.html">Visit in Person</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
