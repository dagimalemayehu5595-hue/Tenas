const mediaShots = [
  {
    title: "Signature Wall",
    desc: "A strong first impression that captures the mood and identity of the gym.",
    img: "./images/IMG_3759.JPG",
    tone: "Mood"
  },
  {
    title: "Training Floor",
    desc: "A wider view that helps visitors understand the room layout before they visit.",
    img: "./images/IMG_3762.JPG",
    tone: "Space"
  },
  {
    title: "Machine Rhythm",
    desc: "Equipment spacing and clean movement lanes across the room.",
    img: "./images/IMG_3760.JPG",
    tone: "Equipment"
  },
  {
    title: "Detail Focus",
    desc: "A closer machine detail for visitors who care about equipment quality.",
    img: "./images/IMG_3770.JPG",
    tone: "Detail"
  },
  {
    title: "Free Weight Side",
    desc: "Free-weight and machine balance in one clean visual frame.",
    img: "./images/IMG_3772.JPG",
    tone: "Weights"
  },
  {
    title: "Open Finish",
    desc: "A brighter final frame that shows the gym feeling open, clean, and ready.",
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
            <span>Tenas Gym and Spa</span>
          </a>
          <div className="nav-links">
            <a href="./index.html">Home</a>
            <a href="./gallery.html">Gallery</a>
            <a href="./shop.html">Shop</a>
            <a href="./machines.html">Machines</a>
            <a href="./coaches.html">Coaches</a>
            <a href="./membership.html">Membership</a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <a className="cta" href="./tour.html">Book a Tour</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Photo + Video Preview</p>
            <h1>See the space, the machines, and the vibe.</h1>
            <p className="lead">A dedicated gallery page for people who want to feel the energy of Tenas before they walk through the door.</p>
            <div className="hero-actions">
              <a className="cta" href="#gallery-grid">Explore Gallery</a>
              <a className="secondary" href="https://www.tiktok.com/@tenas.gym.and.spa" target="_blank" rel="noreferrer">Watch TikTok</a>
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
