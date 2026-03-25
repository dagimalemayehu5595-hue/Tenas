const tiers = [
  {
    name: "Unlimited",
    price: "$7000/mo",
    desc: "Full access, all classes, recovery suite."
  },
  {
    name: "3x / Week",
    price: "$6000/mo",
    desc: "Strength + conditioning sessions with open gym."
  },
  {
    name: "Starter",
    price: "$5000/mo",
    desc: "Open gym + 1 class weekly."
  }
];

const perks = [
  "Movement screen + onboarding",
  "Coach feedback and program updates",
  "Recovery suite access",
  "Community events + challenges"
];

const goalOptions = [
  "Weight Loss",
  "Muscle Gain",
  "General Fitness",
  "Sports Performance",
  "Cardio Endurance",
  "Flexibility + Mobility",
  "Strength Training"
];

const conditionOptions = [
  "Heart Disease",
  "High Blood Pressure",
  "Diabetes",
  "Asthma",
  "Joint Pain",
  "Recent Surgery",
  "Pregnancy",
  "Other",
  "None"
];

function MembershipForm() {
  const [submitted, setSubmitted] = React.useState(false);
  const [submittedCard, setSubmittedCard] = React.useState(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("online");
  const [proofName, setProofName] = React.useState("");
  const [photoName, setPhotoName] = React.useState("");
  const [content, setContent] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState("");
  const [selectedPeriod, setSelectedPeriod] = React.useState("");

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

  const planOptions =
    (content?.priceList?.columns || []).length > 0
      ? content.priceList.columns
      : (content?.membershipTiers || tiers).map((tier) => tier.name);

  const periodOptions =
    (content?.priceList?.periods || []).length > 0
      ? content.priceList.periods
      : ["1 Month", "2 Month", "3 Month", "6 Month", "1 Year"];

  React.useEffect(() => {
    if (planOptions.length && (!selectedPlan || !planOptions.includes(selectedPlan))) {
      setSelectedPlan(planOptions[0]);
    }
    if (periodOptions.length && (!selectedPeriod || !periodOptions.includes(selectedPeriod))) {
      setSelectedPeriod(periodOptions[0]);
    }
  }, [planOptions.join("|"), periodOptions.join("|")]);

  const getSelectedPrice = () => {
    const columns = content?.priceList?.columns || [];
    const periods = content?.priceList?.periods || [];
    const prices = content?.priceList?.prices || [];
    const colIndex = columns.indexOf(selectedPlan);
    const rowIndex = periods.indexOf(selectedPeriod);
    if (colIndex < 0 || rowIndex < 0) return "";
    return prices?.[rowIndex]?.[colIndex] || "";
  };

  if (submitted) {
    const memberName = submittedCard?.fullName || "New Member";
    const memberPlan = submittedCard?.plan || selectedPlan || "Membership";
    const memberPeriod = submittedCard?.membershipType || selectedPeriod || "Pending";
    const memberPrice = submittedCard?.price || "";

    return (
      <div className="tour-confirm membership-success">
        <div className="membership-success-copy">
          <span className="eyebrow">Card Preview Ready</span>
          <h2>Your membership request has been received.</h2>
          <p>
            Your NFC access card has been prepared under your name. Once your payment is approved,
            you&apos;ll be notified to collect your card.
          </p>
          <div className="membership-success-meta">
            <div className="membership-success-pill">
              <strong>Plan</strong>
              <span>{memberPlan}</span>
            </div>
            <div className="membership-success-pill">
              <strong>Period</strong>
              <span>{memberPeriod}</span>
            </div>
            <div className="membership-success-pill">
              <strong>Status</strong>
              <span>Pending Approval</span>
            </div>
            {memberPrice ? (
              <div className="membership-success-pill">
                <strong>Amount</strong>
                <span>ETB {memberPrice}</span>
              </div>
            ) : null}
          </div>
          <div className="membership-success-actions">
            <a className="cta" href="./">Back to Home</a>
            <a className="secondary" href="./tour.html">Book a Tour</a>
          </div>
        </div>

        <div className="nfc-preview-shell" aria-hidden="true">
          <div className="nfc-orbit-glow"></div>
          <div className="nfc-card-rotator">
            <div className="nfc-card-face nfc-card-front">
              <div className="nfc-card-cross nfc-cross-top-left"></div>
              <div className="nfc-card-cross nfc-cross-top-right"></div>
              <div className="nfc-card-cross nfc-cross-bottom-left"></div>
              <div className="nfc-card-cross nfc-cross-bottom-right"></div>
              <div className="nfc-front-mark">
                <div className="nfc-front-emblem">
                  <span className="nfc-front-emblem-mark"></span>
                </div>
                <span className="nfc-front-divider"></span>
                <div className="nfc-front-copy">
                  <strong className="nfc-front-title">TENAS GYM</strong>
                  <span className="nfc-front-mini">Fitness and wellness</span>
                  <span className="nfc-front-sub">Smart Management System</span>
                </div>
              </div>
            </div>

            <div className="nfc-card-face nfc-card-back">
              <div className="nfc-card-cross nfc-cross-top-left"></div>
              <div className="nfc-card-cross nfc-cross-top-right"></div>
              <div className="nfc-card-cross nfc-cross-bottom-left"></div>
              <div className="nfc-card-cross nfc-cross-bottom-right"></div>
              <div className="nfc-back-copy">
                <div className="nfc-back-header">
                  <span className="nfc-back-brand">TENAS GYM</span>
                  <span className="nfc-back-type">Member Pass Card</span>
                  <span className="nfc-back-type-local">የአባል ካርድ</span>
                </div>
                <div className="nfc-name-strip">
                  <strong className="nfc-name-strip-text">{memberName}</strong>
                </div>
                <div className="nfc-back-footer">
                  <span className="nfc-back-phone">+251-912 196096</span>
                  <span className="nfc-card-state">Pending Approval</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = event.currentTarget;

    const goals = Array.from(form.querySelectorAll("input[name='goals']:checked")).map((input) => input.value);
    const conditions = Array.from(form.querySelectorAll("input[name='conditions']:checked")).map((input) => input.value);

    const file = form.paymentProof?.files?.[0];
    if (paymentMethod === "manual") {
      if (!file) {
        setError("Please upload your payment screenshot.");
        setLoading(false);
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("Payment screenshot must be smaller than 4MB.");
        setLoading(false);
        return;
      }
    }

    const photoFile = form.profilePhoto?.files?.[0];
    if (!photoFile) {
      setError("Please upload your profile photo.");
      setLoading(false);
      return;
    }
    if (photoFile.size > 4 * 1024 * 1024) {
      setError("Profile photo must be smaller than 4MB.");
      setLoading(false);
      return;
    }
    const payload = new FormData();
    const fullName = form.fullName.value.trim();
    const plan = form.plan.value;
    const membershipType = form.membershipType.value;
    const selectedPrice = getSelectedPrice();
    payload.append("fullName", fullName);
    payload.append("phone", form.phone.value.trim());
    payload.append("email", form.email.value.trim());
    payload.append("dob", form.dob.value);
    payload.append("gender", form.gender.value);
    payload.append("emergencyContact", form.emergencyContact.value.trim());
    payload.append("emergencyPhone", form.emergencyPhone.value.trim());
    payload.append("emergencyRelationship", form.emergencyRelationship.value.trim());
    payload.append("plan", plan);
    payload.append("membershipType", membershipType);
    payload.append("startDate", form.startDate.value);
    payload.append("preferredTime", form.preferredTime.value);
    payload.append("training", form.training.value);
    goals.forEach((goal) => payload.append("goals", goal));
    payload.append("medicalConditions", form.medicalConditions.value);
    payload.append("medicalDetails", form.medicalDetails.value.trim());
    payload.append("medications", form.medications.value);
    payload.append("medicationDetails", form.medicationDetails.value.trim());
    conditions.forEach((condition) => payload.append("conditions", condition));
    payload.append("doctorAdvised", form.doctorAdvised.value);
    payload.append("paymentMethod", paymentMethod);
    payload.append("paymentReference", form.paymentReference.value.trim());
    payload.append("profilePhoto", photoFile);
    if (paymentMethod === "manual" && file) {
      payload.append("paymentProof", file);
    }

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        body: payload
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
      setSubmittedCard({
        fullName,
        plan,
        membershipType,
        price: selectedPrice
      });
      setSubmitted(true);
    } catch (err) {
      setError(String(err.message || err || "Network error. Make sure you opened the site at http://localhost:3001"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="membership-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Personal Information / የግል መረጃ</h3>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="fullName">Full name / ሙሉ ስም</label>
            <input id="fullName" name="fullName" type="text" placeholder="Your full name" required />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number / ስልክ ቁጥር</label>
            <input id="phone" name="phone" type="tel" placeholder="+251 9xx xxx xxx" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email address / ኢሜይል</label>
            <input id="email" name="email" type="email" placeholder="you@email.com" required />
          </div>
          <div className="form-field">
            <label htmlFor="dob">Date of birth / የትውልድ ቀን</label>
            <input id="dob" name="dob" type="date" />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="profilePhoto">Upload your photo / ፎቶ ላክ</label>
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name || "")}
            required
          />
          {photoName ? <span className="file-name">Selected: {photoName}</span> : null}
        </div>
        <div className="form-inline">
          <label className="form-label">Gender / ጾታ</label>
          <div className="radio-group">
            <label><input type="radio" name="gender" value="Male" required /> Male / ወንድ</label>
            <label><input type="radio" name="gender" value="Female" /> Female / ሴት</label>
            <label><input type="radio" name="gender" value="Other" /> Other / ሌላ</label>
          </div>
        </div>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="emergencyContact">Emergency contact name / የአስቸኳይ ግንኙነት ስም</label>
            <input id="emergencyContact" name="emergencyContact" type="text" placeholder="Contact name" />
          </div>
          <div className="form-field">
            <label htmlFor="emergencyPhone">Emergency contact phone / የአስቸኳይ ግንኙነት ስልክ</label>
            <input id="emergencyPhone" name="emergencyPhone" type="tel" placeholder="+251 9xx xxx xxx" />
          </div>
          <div className="form-field">
            <label htmlFor="emergencyRelationship">Emergency contact relationship / የግንኙነት ግለጽ</label>
            <input id="emergencyRelationship" name="emergencyRelationship" type="text" placeholder="Relationship (e.g., parent, sibling)" />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Membership Details / የአባልነት ዝርዝር</h3>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="plan">Plan / አቅጣጫ</label>
            <select
              id="plan"
              name="plan"
              required
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
            >
              {planOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="membershipType">Membership period / የአባልነት ጊዜ</label>
            <select
              id="membershipType"
              name="membershipType"
              required
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periodOptions.map((period) => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="startDate">Start date / የመጀመሪያ ቀን</label>
            <input id="startDate" name="startDate" type="date" required />
          </div>
        </div>
        {content?.priceList ? (
          <div className="price-preview">
            <div>
              <span>Selected price / የተመረጠ ዋጋ</span>
              <strong>{getSelectedPrice() ? `ETB ${getSelectedPrice()}` : "-"}</strong>
            </div>
            <p className="form-note">Price is based on the plan and period you choose. / ዋጋው በመረጡት አቅጣጫ እና ጊዜ ይመሰረታል።</p>
          </div>
        ) : null}
        <div className="form-inline">
          <label className="form-label">Preferred workout time / የተመረጠ ጊዜ</label>
          <div className="radio-group">
            <label><input type="radio" name="preferredTime" value="Morning" required /> Morning (6 AM - 12 PM) / ጥዋት</label>
            <label><input type="radio" name="preferredTime" value="Afternoon" /> Afternoon (12 PM - 6 PM) / ከሰአት</label>
            <label><input type="radio" name="preferredTime" value="Evening" /> Evening (6 PM - 10 PM) / ማታ</label>
          </div>
        </div>
        <div className="form-inline">
          <label className="form-label">Trainer preference / የአሰልጣኝ ምርጫ</label>
          <div className="radio-group">
            <label><input type="radio" name="training" value="Personal Trainer" required /> Personal Trainer / ግል አሰልጣኝ</label>
            <label><input type="radio" name="training" value="Group Training" /> Group Training / የቡድን ስልጠና</label>
            <label><input type="radio" name="training" value="No Trainer" /> No Trainer / አሰልጣኝ አይደለም</label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Fitness Goals / የእንቅስቃሴ ግቦች</h3>
        <div className="check-grid">
          {goalOptions.map((goal) => (
            <label key={goal}><input type="checkbox" name="goals" value={goal} /> {goal}</label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h3>Health and Fitness Information / ጤና መረጃ</h3>
        <div className="form-inline">
          <label className="form-label">Any medical conditions or injuries? / የጤና ችግር አለ?</label>
          <div className="radio-group">
            <label><input type="radio" name="medicalConditions" value="Yes" required /> Yes / አዎ</label>
            <label><input type="radio" name="medicalConditions" value="No" /> No / አይ</label>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="medicalDetails">If yes, please specify / ካለ ዝርዝር</label>
          <input id="medicalDetails" name="medicalDetails" type="text" placeholder="Add details" />
        </div>
        <div className="form-inline">
          <label className="form-label">Currently taking any medications? / መድሀኒት ትወስዳለህ?</label>
          <div className="radio-group">
            <label><input type="radio" name="medications" value="Yes" required /> Yes / አዎ</label>
            <label><input type="radio" name="medications" value="No" /> No / አይ</label>
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="medicationDetails">If yes, list them / ካለ ዝርዝር</label>
          <input id="medicationDetails" name="medicationDetails" type="text" placeholder="Medication list" />
        </div>
        <div className="form-inline">
          <label className="form-label">Have you ever had any of the following? / የሚከተሉት ነገሮች ነበሩ?</label>
          <div className="check-grid">
            {conditionOptions.map((condition) => (
              <label key={condition}><input type="checkbox" name="conditions" value={condition} /> {condition}</label>
            ))}
          </div>
        </div>
        <div className="form-inline">
          <label className="form-label">Has a doctor advised against physical exercise? / ዶክተር እንቅስቃሴ እንዳትሠራ አስተያየት ሰጥቷል?</label>
          <div className="radio-group">
            <label><input type="radio" name="doctorAdvised" value="Yes" required /> Yes / አዎ</label>
            <label><input type="radio" name="doctorAdvised" value="No" /> No / አይ</label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Payment / ክፍያ</h3>
        <div className="form-inline">
          <label className="form-label">Choose payment method / የክፍያ መንገድ</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Pay online here / በመስመር ላይ ክፈል
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="Manual"
                checked={paymentMethod === "manual"}
                onChange={() => setPaymentMethod("manual")}
              />
              Pay manually and upload screenshot / በእጅ ክፈል እና ማረጋገጫ ላክ
            </label>
          </div>
        </div>

        {paymentMethod === "online" ? (
          <div className="payment-box">
            <p>Complete your payment using the online link below, then enter the reference code. / በሚከተለው ሊንክ ክፈል እና ማጣቀሻ ኮድ አስገባ።</p>
            <a
              className="secondary"
              href={(content?.payment?.link || "").trim() || "#"}
              target={(content?.payment?.link || "").trim() ? "_blank" : undefined}
              rel={(content?.payment?.link || "").trim() ? "noreferrer" : undefined}
              onClick={(e) => {
                if (!((content?.payment?.link || "").trim())) {
                  e.preventDefault();
                }
              }}
            >
              Open Payment Page
            </a>
            <div className="form-field">
              <label htmlFor="paymentReference">Payment reference (optional) / የክፍያ መለያ (አማራጭ)</label>
              <input id="paymentReference" name="paymentReference" type="text" placeholder="Transaction or receipt ID" />
            </div>
          </div>
        ) : (
          <div className="payment-box">
            <p>Pay manually and upload a screenshot of your payment confirmation. / በእጅ ክፈል እና ማረጋገጫ ስክሪንሹት ላክ።</p>
            <div className="form-field">
              <label htmlFor="paymentProof">Upload payment screenshot / የክፍያ ስክሪንሹት ላክ</label>
              <input
                id="paymentProof"
                name="paymentProof"
                type="file"
                accept="image/*"
                onChange={(e) => setProofName(e.target.files?.[0]?.name || "")}
              />
              {proofName ? <span className="file-name">Selected: {proofName}</span> : null}
            </div>
            <div className="form-field">
              <label htmlFor="paymentReference">Payment reference (optional) / የክፍያ መለያ (አማራጭ)</label>
              <input id="paymentReference" name="paymentReference" type="text" placeholder="Receipt ID or note" />
            </div>
          </div>
        )}
      </div>

      <button type="submit" className="cta" disabled={loading}>
        {loading ? "Submitting..." : "Submit Membership / ምዝገባ አስገባ"}
      </button>
      <p className="form-note">We will confirm your membership and payment via phone or message. / በስልክ ወይም መልዕክት እናረጋግጣለን።</p>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}

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

  const [showForm, setShowForm] = React.useState(false);
  return (
    <div className="page-shell">
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
          <a className="cta" href="./membership.html">Join Now</a>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Membership</p>
            <h1>Choose a Plan That Fits Your Life.</h1>
            <p className="lead">Premium equipment, expert coaching, and recovery support — without the chaos.</p>
            <div className="hero-actions">
              <a className="cta" href="#tiers">Claim Free Trial</a>
              <a className="secondary" href="./coaches.html">Meet Coaches</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>What’s Included</h3>
            {(content?.membershipPerks || perks).map((perk) => (
              <p key={perk}>• {perk}</p>
            ))}
          </div>
        </div>
      </header>

      <main className="page-main">
        <section id="tiers" className="section pricing">
          <div className="section-header">
            <h2>Membership Options</h2>
            <p>Updated price list and membership choices.</p>
          </div>
          {content?.priceList ? (
            <div className="price-table">
              <table>
                <thead>
                  <tr>
                    <th>Period</th>
                    {content.priceList.columns.map((col) => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {content.priceList.periods.map((period, rowIndex) => (
                    <tr key={period}>
                      <td><strong>{period}</strong></td>
                      {content.priceList.prices[rowIndex].map((price, colIndex) => (
                        <td key={`${period}-${colIndex}`}>{price}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="pricing-grid">
              {(content?.membershipTiers || tiers).map((tier) => (
                <div className="price-card" key={tier.name}>
                  <h3>{tier.name}</h3>
                  <p className="price">{tier.price}</p>
                  <p>{tier.desc}</p>
                </div>
              ))}
            </div>
          )}

          {content?.dailyPass?.length ? (
            <div className="price-extra">
              <h3>Daily Pass</h3>
              <div className="extra-grid">
                {content.dailyPass.map((item) => (
                  <div className="extra-card" key={item.label}>
                    <p>{item.label}</p>
                    <p className="price">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {content?.discounts?.length ? (
            <div className="price-extra">
              <h3>Discounts</h3>
              <div className="extra-grid">
                {content.discounts.map((item) => (
                  <div className="extra-card" key={item.label}>
                    <p>{item.label}</p>
                    <p className="price">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {content?.priceNote ? <p className="form-note">{content.priceNote}</p> : null}
        </section>

        <section className="section cta-band">
          <div>
            <h2>Start Your Trial This Week</h2>
            <p>Tour the facility, meet a coach, and get your plan built fast.</p>
          </div>
          <a className="cta" href="./tour.html">Book a Tour</a>
        </section>

        <section className="section membership-start">
          <div className="section-header">
            <h2>Membership Form</h2>
            <p>Fill out the form below and complete your payment to join.</p>
          </div>
          {showForm ? (
            <div className="membership-card">
              <MembershipForm />
            </div>
          ) : (
            <div className="membership-card membership-intro">
              <p className="form-note">Press the button to start your membership application.</p>
              <button
                type="button"
                className="cta"
                onClick={() => setShowForm(true)}
              >
                Start Membership Form
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);











