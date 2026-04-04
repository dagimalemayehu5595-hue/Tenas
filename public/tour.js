function TourForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  if (submitted) {
    return (
      <div className="tour-confirm">
        <h2>Thank you. We received your request.</h2>
        <p>We will call you to confirm your tour time and notify you when your tour is scheduled.</p>
        <a className="cta" href="./">Back to Home</a>
      </div>
    );
  }

  return (
    <form
      className="tour-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        const form = event.currentTarget;
        const payload = {
          fullName: form.fullName.value.trim(),
          phone: form.phone.value.trim()
        };
        try {
          const res = await fetch("/api/tour", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const text = await res.text();
            let msg = "Failed to submit";
            try {
              const data = JSON.parse(text);
              msg = data.error || msg;
            } catch {
              msg = text || msg;
            }
            throw new Error(msg);
          }
          setSubmitted(true);
        } catch (err) {
          setError(String(err.message || err || "Network error. Make sure you opened the site at http://localhost:3001"));
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="form-field">
        <label htmlFor="fullName">Full name</label>
        <input id="fullName" name="fullName" type="text" placeholder="Your full name" required />
      </div>
      <div className="form-field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" name="phone" type="tel" placeholder="+251 9xx xxx xxx" required />
      </div>
      <button type="submit" className="cta" disabled={loading}>
        {loading ? "Sending..." : "Request Tour"}
      </button>
      <p className="form-note">We will call you and notify you with your tour time.</p>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}

function App() {
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
            <a href="./shop.html">Shop</a>
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
            <p className="eyebrow">Book a Tour</p>
            <h1>See the Gym. Meet a Coach. Get Your Plan.</h1>
            <p className="lead">Fill in your details and we will call you to confirm your tour time.</p>
          </div>
          <div className="hero-card">
            <h3>What Happens Next</h3>
            <p><strong>Step 1</strong> Submit your full name and phone number.</p>
            <p><strong>Step 2</strong> We call you to schedule the tour.</p>
            <p><strong>Step 3</strong> You receive a confirmation.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section-header">
          <h2>Request a Tour</h2>
          <p>We will notify you with your confirmed time.</p>
        </div>
        <div className="tour-card">
          <TourForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);







