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

const MEMBER_TOKEN_KEY = "tenas_member_token";

function MembershipForm({ member, savedMembership, onMembershipSaved }) {
  const [submitted, setSubmitted] = React.useState(Boolean(savedMembership));
  const [submittedCard, setSubmittedCard] = React.useState(savedMembership || null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [paymentMethod, setPaymentMethod] = React.useState("online");
  const [proofName, setProofName] = React.useState("");
  const [photoName, setPhotoName] = React.useState("");
  const [content, setContent] = React.useState(null);
  const [selectedPlan, setSelectedPlan] = React.useState("");
  const [selectedPeriod, setSelectedPeriod] = React.useState("");
  const [referralCode, setReferralCode] = React.useState("");

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

  const toPriceNumber = (value) => {
    const cleaned = String(value || "").replace(/[^0-9.]/g, "");
    if (!cleaned) return 0;
    return Number.parseFloat(cleaned) || 0;
  };

  const formatPriceNumber = (value) =>
    Number(value || 0).toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

  const isActiveUntil = (value) => {
    if (!value) return true;
    const normalized = String(value).trim();
    const parsed = new Date(normalized.length <= 10 ? `${normalized}T23:59:59` : normalized);
    if (Number.isNaN(parsed.getTime())) return true;
    return parsed.getTime() >= Date.now();
  };

  const normalizedReferralCode = referralCode.trim().toLowerCase();
  const matchedReferral = (content?.referralCodes || []).find((item) => {
    const code = String(item?.code || "").trim().toLowerCase();
    return code && code === normalizedReferralCode && isActiveUntil(item?.expiresAt);
  }) || null;
  const referralPercent = matchedReferral ? Math.max(0, Math.min(100, Number(matchedReferral.percent) || 0)) : 0;
  const selectedPriceValue = getSelectedPrice();
  const selectedPriceNumber = toPriceNumber(selectedPriceValue);
  const discountedPriceNumber = referralPercent > 0
    ? selectedPriceNumber * (1 - referralPercent / 100)
    : selectedPriceNumber;
  const discountedPriceLabel = selectedPriceNumber > 0 ? formatPriceNumber(discountedPriceNumber) : "";
  const activeCard = submittedCard || savedMembership || null;

  React.useEffect(() => {
    if (savedMembership) {
      setSubmitted(true);
      setSubmittedCard(savedMembership);
    }
  }, [savedMembership]);

  if (activeCard) {
    const memberName = activeCard?.fullName || member?.fullName || "New Member";
    const memberPlan = activeCard?.plan || selectedPlan || "Membership";
    const memberPeriod = activeCard?.membershipType || selectedPeriod || "Pending";
    const memberPrice = activeCard?.calculatedPrice || activeCard?.price || "";
    const memberReferralCode = activeCard?.referralCode || "";
    const memberReferralPercent = activeCard?.referralPercent || 0;
    const memberStatus = activeCard?.status || "Pending Approval";

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
              <span>{memberStatus}</span>
            </div>
            {memberReferralCode ? (
              <div className="membership-success-pill">
                <strong>Referral</strong>
                <span>{memberReferralCode} ({memberReferralPercent}% off)</span>
              </div>
            ) : null}
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
                  <img
                    src="./images/nfc.png"
                    alt="Tenas Gym logo"
                    className="nfc-front-emblem-image"
                  />
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

    if (!member?.token) {
      setError("Please sign in first to save your membership.");
      setLoading(false);
      return;
    }

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
    const selectedPrice = discountedPriceLabel || selectedPriceValue;
    const appliedReferralCode = matchedReferral ? referralCode.trim() : "";
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
    payload.append("referralCode", appliedReferralCode);
    payload.append("referralDiscountPercent", referralPercent ? String(referralPercent) : "");
    payload.append("calculatedPrice", selectedPrice);
    payload.append("profilePhoto", photoFile);
    if (paymentMethod === "manual" && file) {
      payload.append("paymentProof", file);
    }

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${member.token}`
        },
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
      const data = await res.json();
      const nextMembership = data.membership || {
        fullName,
        plan,
        membershipType,
        calculatedPrice: selectedPrice,
        referralCode: appliedReferralCode,
        referralPercent,
        status: "Pending Approval"
      };
      setSubmittedCard(nextMembership);
      setSubmitted(true);
      onMembershipSaved?.(nextMembership);
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
            <input id="fullName" name="fullName" type="text" placeholder="Your full name" defaultValue={member?.fullName || ""} required />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone number / ስልክ ቁጥር</label>
            <input id="phone" name="phone" type="tel" placeholder="+251 9xx xxx xxx" defaultValue={member?.phone || ""} required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email address / ኢሜይል</label>
            <input id="email" name="email" type="email" placeholder="you@email.com" defaultValue={member?.email || ""} required />
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
              <strong>{selectedPriceValue ? `ETB ${discountedPriceLabel || selectedPriceValue}` : "-"}</strong>
            </div>
            {matchedReferral && selectedPriceNumber > 0 ? (
              <p className="price-preview-discount">
                Code <strong>{matchedReferral.code}</strong> applied for {referralPercent}% off.
                Original price: ETB {selectedPriceValue}
              </p>
            ) : null}
            {!matchedReferral && normalizedReferralCode ? (
              <p className="price-preview-discount">Referral code not found. Standard pricing will be used.</p>
            ) : null}
            <p className="form-note">Price is based on the plan and period you choose. / ዋጋው በመረጡት አቅጣጫ እና ጊዜ ይመሰረታል።</p>
          </div>
        ) : null}
        <div className="form-field">
          <label htmlFor="referralCode">Referral code / የቅናሽ ኮድ</label>
          <input
            id="referralCode"
            name="referralCodeInput"
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter code if you have one"
            autoComplete="off"
          />
        </div>
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

function MembershipPageApp() {
  const [content, setContent] = React.useState(null);
  const [member, setMember] = React.useState(null);
  const [memberLoading, setMemberLoading] = React.useState(true);
  const [authMode, setAuthMode] = React.useState("signup");
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const [authForm, setAuthForm] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    password: ""
  });

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

  React.useEffect(() => {
    const token = localStorage.getItem(MEMBER_TOKEN_KEY);
    if (!token) {
      setMemberLoading(false);
      return undefined;
    }

    let mounted = true;
    fetch("/api/member/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("auth"))))
      .then((data) => {
        if (!mounted) return;
        setMember(data?.member ? { ...data.member, token } : null);
      })
      .catch(() => {
        if (!mounted) return;
        localStorage.removeItem(MEMBER_TOKEN_KEY);
        setMember(null);
      })
      .finally(() => {
        if (mounted) setMemberLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthFieldChange = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const endpoint = authMode === "signup" ? "/api/member/signup" : "/api/member/login";
      const payload =
        authMode === "signup"
          ? authForm
          : {
              email: authForm.email,
              password: authForm.password
            };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.token || !data?.member) {
        throw new Error(data?.error || "Unable to continue.");
      }

      localStorage.setItem(MEMBER_TOKEN_KEY, data.token);
      setMember({ ...data.member, token: data.token });
      setAuthForm((current) => ({
        ...current,
        password: ""
      }));
    } catch (err) {
      setAuthError(err?.message || "Unable to continue.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = member?.token;
    try {
      if (token) {
        await fetch("/api/member/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(() => {});
      }
    } finally {
      localStorage.removeItem(MEMBER_TOKEN_KEY);
      setMember(null);
      setAuthError("");
      setAuthMode("login");
      setAuthForm({
        fullName: "",
        phone: "",
        email: "",
        password: ""
      });
    }
  };

  const handleMembershipSaved = (savedMembership) => {
    setMember((current) =>
      current
        ? {
            ...current,
            membership: savedMembership || current.membership || null,
            fullName: savedMembership?.fullName || current.fullName,
            phone: savedMembership?.phone || current.phone
          }
        : current
    );
  };

  return (
    <div className="page-shell">
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
            <a className="cta" href="#member-access">Join Now</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Membership</p>
            <h1>Choose a Plan That Fits Your Life.</h1>
            <p className="lead">Create your member account once, save your details, and come back anytime to view your virtual access card.</p>
            <div className="hero-actions">
              <a className="cta" href="#member-access">Join Now</a>
              <a className="secondary" href="./coaches.html">Meet Coaches</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>What's Included</h3>
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

        <section className="section membership-start" id="member-access">
          <div className="section-header">
            <h2>Member Access</h2>
            <p>Create your account once, then log back in anytime to view your saved membership and virtual NFC card.</p>
          </div>

          {memberLoading ? (
            <div className="membership-card membership-intro">
              <p className="form-note">Loading your member access...</p>
            </div>
          ) : !member ? (
            <div className="membership-card member-auth-card">
              <div className="member-auth-head">
                <p className="eyebrow">Member Login</p>
                <h3>{authMode === "signup" ? "Create your member account" : "Welcome back"}</h3>
                <p>
                  {authMode === "signup"
                    ? "Sign up once so your membership details, payment status, and virtual access card stay saved to your account."
                    : "Log in with your email to pick up where you left off and view your saved membership card."}
                </p>
              </div>

              <div className="member-auth-toggle">
                <button
                  type="button"
                  className={`secondary ${authMode === "signup" ? "is-active" : ""}`}
                  onClick={() => {
                    setAuthMode("signup");
                    setAuthError("");
                  }}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  className={`secondary ${authMode === "login" ? "is-active" : ""}`}
                  onClick={() => {
                    setAuthMode("login");
                    setAuthError("");
                  }}
                >
                  Log In
                </button>
              </div>

              <form className="member-auth-form" onSubmit={handleAuthSubmit}>
                {authMode === "signup" ? (
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="memberFullName">Full Name</label>
                      <input
                        id="memberFullName"
                        name="fullName"
                        type="text"
                        required
                        value={authForm.fullName}
                        onChange={handleAuthFieldChange}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="memberPhone">Phone Number</label>
                      <input
                        id="memberPhone"
                        name="phone"
                        type="tel"
                        required
                        value={authForm.phone}
                        onChange={handleAuthFieldChange}
                        placeholder="+251..."
                      />
                    </div>
                  </div>
                ) : null}

                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="memberEmail">Email</label>
                    <input
                      id="memberEmail"
                      name="email"
                      type="email"
                      required
                      value={authForm.email}
                      onChange={handleAuthFieldChange}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="memberPassword">Password</label>
                    <input
                      id="memberPassword"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      value={authForm.password}
                      onChange={handleAuthFieldChange}
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                <button type="submit" className="cta" disabled={authLoading}>
                  {authLoading
                    ? authMode === "signup"
                      ? "Creating Account..."
                      : "Signing In..."
                    : authMode === "signup"
                      ? "Create Account"
                      : "Log In"}
                </button>
                {authError ? <p className="form-error">{authError}</p> : null}
              </form>
            </div>
          ) : (
            <>
              <div className="membership-card member-summary-card">
                <div className="member-summary-head">
                  <div>
                    <p className="eyebrow">Logged In</p>
                    <h3>{member.fullName || "Member Account"}</h3>
                    <p>{member.email}</p>
                    {member.phone ? <p>{member.phone}</p> : null}
                  </div>
                  <button type="button" className="secondary" onClick={handleLogout}>
                    Log Out
                  </button>
                </div>

                <div className="member-summary-grid">
                  <div className="member-summary-pill">
                    <strong>Membership: </strong>
                    <span>{member.membership?.plan || "Not submitted yet"}</span>
                  </div>
                  <div className="member-summary-pill">
                    <strong>Status: </strong>
                    <span>{member.membership?.status || "Ready to apply"}</span>
                  </div>
                  <div className="member-summary-pill">
                    <strong>Saved Card: </strong>
                    <span>{member.membership ? "Available in your account" : "Will appear after submission"}</span>
                  </div>
                </div>
              </div>

              <div className="membership-card">
                <MembershipForm
                  member={member}
                  savedMembership={member.membership}
                  onMembershipSaved={handleMembershipSaved}
                />
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
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

  const [showForm, setShowForm] = React.useState(false);
  return (
    <div className="page-shell">
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

ReactDOM.createRoot(document.getElementById("root")).render(<MembershipPageApp />);











