const fallbackShopProducts = [
  {
    category: "Protein",
    name: "Whey Protein",
    price: "ETB 8,900",
    desc: "Everyday whey support for recovery, lean muscle maintenance, and easy protein intake after training.",
    tag: "Best Seller",
    img: "./images/whey protein.avif"
  },
  {
    category: "Protein",
    name: "Plant-Based Protein",
    price: "ETB 9,400",
    desc: "A dairy-free protein option for members who want lighter digestion with daily protein support.",
    tag: "Plant Option",
    img: "./images/Plant-Based Protein.webp"
  },
  {
    category: "Mass",
    name: "Mass Gainer",
    price: "ETB 7,800",
    desc: "High-calorie shake support for members focused on size, weight gain, and fuller recovery nutrition.",
    tag: "Size Support",
    img: "./images/Mass Gainer.jpg"
  },
  {
    category: "Energy",
    name: "Pre Workout Engine",
    price: "ETB 4,600",
    desc: "A fast pre-training lift for energy, focus, and stronger gym sessions when you need extra drive.",
    tag: "Before Training",
    img: "./images/Pre Workout.jpg"
  },
  {
    category: "Hydration",
    name: "Electrolyte Powder",
    price: "ETB 2,400",
    desc: "Hydration support for long sessions, hot training days, and faster recovery after sweating hard.",
    tag: "Hydration",
    img: "./images/Electrolyte Powder.avif"
  },
  {
    category: "Wellness",
    name: "Omega-3 Fish Oil",
    price: "ETB 2,800",
    desc: "A simple daily wellness add-on for joint support, balance, and long-term recovery habits.",
    tag: "Daily Essential",
    img: "./images/Omega-3 (Fish Oil).avif"
  },
  {
    category: "Vitamins",
    name: "Multivitamins & Minerals",
    price: "ETB 3,200",
    desc: "One-daily vitamin support to help cover nutrition gaps and support energy, bones, and daily health.",
    tag: "Daily Formula",
    img: "./images/Multivitamins.jpg"
  }
];

function ProductVisual({ product, featured = false }) {
  const initials = (product?.name || "Tenas").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return (
    <div className={`shop-jar-visual ${featured ? "shop-jar-visual-featured" : ""}`}>
      <div className="shop-jar-glow" />
      <div className="shop-jar-shell">
        <div className="shop-jar-cap" />
        <div className="shop-jar-body">
          <div className="shop-jar-label">
            <span className="shop-jar-brand">TENAS</span>
            <strong className="shop-jar-name">{product?.category || "Supplement"}</strong>
            <span className="shop-jar-mark">{initials}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderForm({ products }) {
  const [selected, setSelected] = React.useState({});
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const selectedItems = products
    .map((product) => {
      const entry = selected[product.name];
      if (!entry?.checked) return null;
      return {
        name: product.name,
        price: product.price || "",
        quantity: Math.max(1, Number(entry.quantity) || 1)
      };
    })
    .filter(Boolean);

  const toggleProduct = (name) => {
    setSelected((current) => {
      const next = { ...current };
      next[name] = {
        checked: !current[name]?.checked,
        quantity: current[name]?.quantity || 1
      };
      return next;
    });
  };

  const setQuantity = (name, value) => {
    setSelected((current) => ({
      ...current,
      [name]: {
        checked: current[name]?.checked || false,
        quantity: Math.max(1, Number(value) || 1)
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName.trim() || !phone.trim()) {
      setError("Please enter your full name and phone number.");
      setLoading(false);
      return;
    }
    if (!selectedItems.length) {
      setError("Please choose at least one item.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/shop-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          items: selectedItems
        })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Order failed");
      setSubmitted(true);
    } catch (err) {
      setError(String(err.message || err || "Network error. Make sure you opened the site at http://localhost:3001"));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="shop-order-success">
        <p className="eyebrow">Order Received</p>
        <h3>Your supplement order has been sent.</h3>
        <p>We received your request and we’ll call you to confirm the order and let you know how many days delivery will take.</p>
        <div className="shop-order-summary">
          {selectedItems.map((item) => (
            <span key={item.name}>{item.name} x{item.quantity}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form className="shop-order-form" onSubmit={handleSubmit}>
      <div className="shop-order-head">
        <p className="eyebrow">Place Order</p>
        <h3>Tell us what you want and we’ll call you back.</h3>
        <p className="lead">Choose the items, leave your phone number, and we’ll confirm availability and delivery timing with you directly.</p>
      </div>

      <div className="shop-order-product-list">
        {products.map((product) => {
          const entry = selected[product.name] || { checked: false, quantity: 1 };
          return (
            <label className={`shop-order-item ${entry.checked ? "shop-order-item-selected" : ""}`} key={product.name}>
              <div className="shop-order-item-main">
                <input
                  type="checkbox"
                  checked={entry.checked}
                  onChange={() => toggleProduct(product.name)}
                />
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.price || "Ask in gym"}</span>
                </div>
              </div>
              <input
                type="number"
                min="1"
                value={entry.quantity}
                onChange={(e) => setQuantity(product.name, e.target.value)}
                disabled={!entry.checked}
              />
            </label>
          );
        })}
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="shopFullName">Full name</label>
          <input id="shopFullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="shopPhone">Phone number</label>
          <input id="shopPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="shopNotes">Notes</label>
        <textarea
          id="shopNotes"
          rows="4"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add flavor, preferred contact time, or any extra note."
        />
      </div>

      <button type="submit" className="cta" disabled={loading}>
        {loading ? "Sending Order..." : "Send Order Request"}
      </button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}

function App() {
  const [content, setContent] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    fetch("/api/content")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("api"))))
      .catch(() => fetch("./content.json?v=20260325203227").then((res) => res.json()))
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

  const shopProducts = Array.isArray(content?.shopProducts) && content.shopProducts.length
    ? content.shopProducts
    : fallbackShopProducts;
  const featuredProduct = shopProducts[0] || null;
  const restProducts = shopProducts.slice(1);
  return (
    <div>
      <header className="hero shop-hero">
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
            <a className="cta" href="#shop-order">Order Now</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Supplements + Fuel</p>
            <h1>Supplements organized for strength, recovery, and daily wellness.</h1>
            <p className="lead">Built around the products you actually sell in the gym: whey, plant protein, mass gainer, pre-workout, hydration, fish oil, and vitamins.</p>
            <div className="hero-actions">
              <a className="cta" href="#shop-floor">Browse Products</a>
              <a className="secondary" href="#shop-order">Order Items</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>How orders work</h3>
            <p>Choose the supplements you want.</p>
            <p>Send your name and phone number.</p>
            <p>We receive it on Telegram and call you back with timing.</p>
          </div>
        </div>
      </header>

      <section className="section shop-page-section" id="shop-floor">
          <div className="section-header">
            <p className="eyebrow">Shop</p>
            <h2>Supplements your members can actually order</h2>
            <p className="lead">This shop is now based on the real product images you added, with clearer supplement categories and direct order requests.</p>
          </div>

          <div className="shop-curation">
          <div className="shop-curation-copy">
            <span className="gallery-curation-label">In-Gym Fuel</span>
            <h3>From recovery protein to wellness support, everything is laid out clearly.</h3>
            <p>Members can browse what you stock, send an order request, and wait for the gym to call back with confirmation and delivery timing.</p>
          </div>
        </div>

        <div className="shop-grid">
          {featuredProduct ? (
            <article className="shop-feature">
              <div className="shop-feature-media">
                {featuredProduct.img ? (
                  <img className="shop-feature-image" src={featuredProduct.img} alt={featuredProduct.name || "Featured supplement"} />
                ) : (
                  <ProductVisual product={featuredProduct} featured />
                )}
                <div className="shop-feature-glow" />
              </div>
              <div className="shop-feature-copy">
                <div className="shop-meta">
                  {featuredProduct.category ? <span className="shop-category">{featuredProduct.category}</span> : null}
                  {featuredProduct.tag ? <span className="shop-tag">{featuredProduct.tag}</span> : null}
                </div>
                <h3>{featuredProduct.name || "Shop Highlight"}</h3>
                {featuredProduct.desc ? <p>{featuredProduct.desc}</p> : null}
                <div className="shop-feature-footer">
                  {featuredProduct.price ? <strong className="shop-price">{featuredProduct.price}</strong> : null}
                  <span className="shop-note">Available by direct order request and call-back confirmation.</span>
                </div>
              </div>
            </article>
          ) : null}

          <div className="shop-card-grid">
            {restProducts.map((item, index) => (
              <article className="shop-card" key={`${item.name || "shop"}-${index}`}>
                <div className="shop-card-media">
                  {item.img ? (
                    <img className="shop-card-image" src={item.img} alt={item.name || "Supplement"} />
                  ) : (
                    <ProductVisual product={item} />
                  )}
                  <div className="shop-card-overlay" />
                  {item.category ? <span className="shop-category shop-category-float">{item.category}</span> : null}
                </div>
                <div className="shop-card-copy">
                  <div className="shop-card-heading">
                    <h3>{item.name || "Supplement"}</h3>
                    {item.price ? <strong className="shop-price">{item.price}</strong> : null}
                  </div>
                  {item.desc ? <p>{item.desc}</p> : null}
                  {item.tag ? <span className="shop-tag">{item.tag}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section shop-order-band" id="shop-order">
        <div className="shop-order-shell">
          <div className="shop-order-copy">
            <p className="eyebrow">Order Section</p>
            <h2>Order the products you want and we’ll call you back.</h2>
            <p className="lead">Once you send your request, it goes to the gym on Telegram. Then we can contact you and let you know how many days delivery will take.</p>
          </div>
          <div className="shop-order-card">
            <OrderForm products={shopProducts} />
          </div>
        </div>
      </section>

      <section className="section media-band">
          <div className="media-band-copy">
            <p className="eyebrow">Next Step</p>
            <h2>The shop is now built around your real supplement images.</h2>
            <p className="lead">Next we can fine-tune the exact prices, add brands if you want them shown, or create a fuller product page for each supplement later.</p>
          </div>
        <div className="media-band-actions">
          <a className="cta" href="./membership.html">Join Tenas</a>
          <a className="secondary" href="./tour.html">Visit the Gym</a>
          <a className="secondary" href="./index.html">Back Home</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
