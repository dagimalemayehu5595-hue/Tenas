const TENAS_THEME_KEY = "tenas_theme_mode";

function getPreferredTheme() {
  const saved = localStorage.getItem(TENAS_THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

applyTheme(getPreferredTheme());

function useThemeMode() {
  const [theme, setTheme] = React.useState(() => getPreferredTheme());

  React.useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(TENAS_THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeMode();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      <span className="theme-toggle-text">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <h3>Tenas Fitness</h3>
        <p>Bole Bulbula, Kidus gebreal Building</p>
        <p>Ethiopia, A.A</p>
      </div>
      <div className="footer-block">
        <h4>Contact</h4>
        <p>tenasgymandspa@gmail.com</p>
        <p>+25191 219 6096</p>
      </div>
      <div className="footer-block">
        <h4>Hours</h4>
        <p>Mon-Sat: 05:00 PM - 09:00 AM</p>
        <p>Sunday: Half day</p>
      </div>
      <div className="footer-block footer-social">
        <h4>Connect</h4>
        <div className="social-icons">
          <a href="https://www.instagram.com/tenasgymandspa/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm5.6-2.4a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@tenas.gym.and.spa" target="_blank" rel="noreferrer" aria-label="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.7 3c.4 2.6 2.2 4.3 4.3 4.5v2.6c-1.6.1-3.1-.4-4.3-1.3v6.3c0 3.3-2.7 5.9-6 5.9a6 6 0 0 1-6-5.9 6 6 0 0 1 7.7-5.7v2.8a3.3 3.3 0 1 0 1.9 3V3h2.4z"/>
            </svg>
          </a>
          <a href="mailto:tenasgymandspa@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 2v.2l8 5.1 8-5.1V7H4zm16 10V9.5l-7.5 4.8a1 1 0 0 1-1 0L4 9.5V17h16z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="footer-block footer-partner">
        <h4>Partners</h4>
        <div className="footer-partner-grid">
          <div className="partner">
            <img src="./images/samrawit.png" alt="Samrawit Foundation logo" className="partner-logo" />
            <p>Samrawit Foundation</p>
            <a
              href="https://samrawitfoundation.org.et"
              target="_blank"
              rel="noreferrer"
              className="partner-link"
            >
              Visit Website
            </a>
          </div>
          <div className="partner">
            <img src="./images/spa.PNG" alt="Tenas Day Spa Therapy and Wellness logo" className="partner-logo" />
            <p>Tenas Day Spa</p>
            <span className="partner-link">Therapy and Wellness</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          Tenas Fitness (c) <a href="./admin.html" className="footer-year-link">2026</a>
        </p>
        <p>Designed and developed by Dagim Alemayehu | Contact: 0930105595 / 0917923211</p>
      </div>
    </footer>
  );
}


