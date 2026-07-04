const MEMBER_TOKEN_KEY = "tenas_member_token";

function formatDateLabel(value) {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatDateTimeLabel(value) {
  if (!value) return "Recently";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function parseMembershipMonths(value) {
  const text = String(value || "").toLowerCase().trim();
  if (!text) return 0;
  if (text.includes("year")) return 12;
  const match = text.match(/(\d+)/);
  return match ? Number(match[1]) || 0 : 0;
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function buildMembershipMeta(membership) {
  if (!membership?.startDate) {
    return {
      renewalDate: "",
      daysLeft: null,
      isExpired: false
    };
  }
  const start = new Date(membership.startDate);
  if (Number.isNaN(start.getTime())) {
    return {
      renewalDate: "",
      daysLeft: null,
      isExpired: false
    };
  }
  const months = parseMembershipMonths(membership.membershipType);
  const renewal = months > 0 ? addMonths(start, months) : start;
  const diff = renewal.getTime() - Date.now();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return {
    renewalDate: formatDateLabel(renewal.toISOString()),
    daysLeft,
    isExpired: daysLeft < 0
  };
}

function getTimelineSteps(status) {
  const current = String(status || "Pending Approval").toLowerCase();
  const steps = [
    { key: "submitted", label: "Submitted" },
    { key: "review", label: "Under Review" },
    { key: "approved", label: "Approved" },
    { key: "ready", label: "Card Ready" }
  ];

  let activeIndex = 1;
  if (current.includes("submitted")) activeIndex = 0;
  if (current.includes("review")) activeIndex = 1;
  if (current.includes("approved")) activeIndex = 2;
  if (current.includes("ready") || current.includes("pickup") || current.includes("collec")) activeIndex = 3;
  if (current.includes("pending")) activeIndex = 1;

  return steps.map((step, index) => ({
    ...step,
    state: index < activeIndex ? "done" : index === activeIndex ? "active" : "idle"
  }));
}

function getPickupMessage(membership) {
  const status = String(membership?.status || "").toLowerCase();
  if (!membership) {
    return {
      tone: "idle",
      title: "No card is issued yet.",
      text: "Complete your membership form first so we can prepare your virtual and physical access card."
    };
  }
  if (status.includes("ready") || status.includes("pickup") || status.includes("collect")) {
    return {
      tone: "ready",
      title: "Your NFC card is ready for pickup.",
      text: "Visit the gym front desk and bring your phone number so the team can hand over your physical member card."
    };
  }
  if (status.includes("approved")) {
    return {
      tone: "approved",
      title: "Your payment is approved.",
      text: "Your membership is approved and your card is being prepared. You’ll be notified as soon as pickup is ready."
    };
  }
  return {
    tone: "pending",
    title: "Your membership is still under review.",
    text: "Once payment is confirmed, your status will move forward automatically and the card pickup notice will appear here."
  };
}

function DashboardCardPreview({ membership, member }) {
  if (!membership) {
    return (
      <div className="dashboard-empty-card">
        <p className="eyebrow">Virtual Card</p>
        <h3>Your access card will appear here.</h3>
        <p>Once you submit your membership form, this area will keep your saved NFC card ready whenever you log in.</p>
      </div>
    );
  }

  const memberName = membership.fullName || member?.fullName || "New Member";
  const memberStatus = membership.status || "Pending Approval";

  return (
    <div className="dashboard-card-preview">
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
                <img src="./images/tenas.jpeg" alt="Tenas Gym logo" className="nfc-front-emblem-image" />
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
                <span className="nfc-back-type-local">á‹¨áŠ á‰£áˆ áŠ«áˆ­á‹µ</span>
              </div>
              <div className="nfc-name-strip">
                <strong className="nfc-name-strip-text">{memberName}</strong>
              </div>
              <div className="nfc-back-footer">
                <span className="nfc-back-phone">+251-912 196096</span>
                <span className="nfc-card-state">{memberStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-card-tools">
        <button type="button" className="secondary" onClick={() => window.print()}>
          Print / Save Preview
        </button>
        <span>Keep this ready when you come for pickup or approval follow-up.</span>
      </div>
    </div>
  );
}

function DashboardList({ title, eyebrow, items, renderItem, emptyText }) {
  return (
    <section className="dashboard-card dashboard-list-card">
      <div className="dashboard-card-head">
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
      </div>
      {items.length ? (
        <div className="dashboard-list">
          {items.map(renderItem)}
        </div>
      ) : (
        <div className="dashboard-empty-card dashboard-empty-card-inline">
          <p>{emptyText}</p>
        </div>
      )}
    </section>
  );
}

function DashboardApp() {
  const [member, setMember] = React.useState(null);
  const [dashboard, setDashboard] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [profileForm, setProfileForm] = React.useState({ fullName: "", phone: "" });
  const [profileSaving, setProfileSaving] = React.useState(false);
  const [profileMessage, setProfileMessage] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem(MEMBER_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;
    fetch("/api/member/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Please log in again."))))
      .then((data) => {
        if (!mounted) return;
        const nextMember = data?.member ? { ...data.member, token } : null;
        setMember(nextMember);
        setDashboard(data || null);
        setProfileForm({
          fullName: nextMember?.fullName || "",
          phone: nextMember?.phone || ""
        });
      })
      .catch((err) => {
        if (!mounted) return;
        localStorage.removeItem(MEMBER_TOKEN_KEY);
        setMember(null);
        setDashboard(null);
        setError(err?.message || "Unable to load your dashboard.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
      window.location.href = "/membership#member-access";
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!member?.token) return;
    setProfileSaving(true);
    setProfileMessage("");
    try {
      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${member.token}`
        },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok || !data?.member) {
        throw new Error(data?.error || "Unable to save profile.");
      }
      setMember((current) => (current ? { ...current, ...data.member } : current));
      setDashboard((current) => (current ? { ...current, member: data.member } : current));
      setProfileMessage("Profile updated.");
    } catch (err) {
      setProfileMessage(err?.message || "Unable to save profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  const membership = dashboard?.membership || member?.membership || null;
  const shopOrders = dashboard?.shopOrders || [];
  const tourRequests = dashboard?.tourRequests || [];
  const announcements = dashboard?.announcements || [];
  const contact = dashboard?.contact || {};
  const recentActivity = dashboard?.recentActivity || [];
  const membershipMeta = buildMembershipMeta(membership);
  const pickupNotice = getPickupMessage(membership);
  const timelineSteps = getTimelineSteps(membership?.status);

  return (
    <div className="page-shell">
      <nav className="nav">
        <a className="logo" href="/">
          <img src="./images/tenas.jpeg" alt="Tenas Gym logo" className="logo-image" />
          <span>Tenas Gym and Spa</span>
        </a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/gallery">Gallery</a>
          <a href="/shop">Shop</a>
          <a href="/machines">Machines</a>
          <a href="/coaches">Coaches</a>
          <a href="/spa">Spa</a>
          <a href="/membership">Membership</a>
        </div>
        <div className="nav-actions">
          <ThemeToggle />
          <a className="cta" href="/membership?form=1">Open Form</a>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-grid dashboard-hero-grid">
          <div>
            <h1>Member Dashboard</h1>
            <p className="eyebrow">Saved Access</p>
            <p className="lead">Track your membership, card pickup, supplement orders, and member-only updates from one clean place.</p>
            <div className="hero-actions">
              <a className="cta" href="/membership?form=1">Open Membership Form</a>
              <a className="secondary" href="/shop">Shop Supplements</a>
            </div>
          </div>
          <div className="hero-card">
            <h3>Dashboard Highlights</h3>
            <p><strong>Renewal</strong> See your next renewal date and current membership status.</p>
            <p><strong>Orders</strong> Track recent supplement requests and their current stage.</p>
            <p><strong>Updates</strong> Get active discounts, events, and member notes in one place.</p>
          </div>
        </div>
      </header>

      <main className="page-main">
        {loading ? (
          <section className="section dashboard-shell">
            <div className="dashboard-card dashboard-loading-card">
              <p className="form-note">Loading your member dashboard...</p>
            </div>
          </section>
        ) : !member ? (
          <section className="section dashboard-shell">
            <div className="dashboard-card dashboard-auth-prompt">
              <p className="eyebrow">Member Access</p>
              <h2>Log in to open your dashboard.</h2>
              <p>Your saved card and member information stay connected to your account. Log in from the membership page to continue.</p>
              <div className="dashboard-actions">
                <a className="cta" href="/membership#member-access">Go to Member Login</a>
                <a className="secondary" href="/tour">Book a Tour</a>
              </div>
              {error ? <p className="form-error">{error}</p> : null}
            </div>
          </section>
        ) : (
          <section className="section dashboard-shell">
            <div className="dashboard-summary-strip">
              <div className="dashboard-summary-tile">
                <span>Status</span>
                <strong>{membership?.status || "Not submitted"}</strong>
              </div>
              <div className="dashboard-summary-tile">
                <span>Renewal</span>
                <strong>{membershipMeta.renewalDate || "Pending"}</strong>
              </div>
              <div className="dashboard-summary-tile">
                <span>Orders</span>
                <strong>{shopOrders.length}</strong>
              </div>
              <div className="dashboard-summary-tile">
                <span>Tours</span>
                <strong>{tourRequests.length}</strong>
              </div>
            </div>

            <div className="dashboard-club-note">
              <div>
                <p className="eyebrow">Member Access</p>
                <h3>Everything important stays here.</h3>
                <p>Your membership progress, card pickup notice, shop activity, and member-only updates are all tied to your account now.</p>
              </div>
              <div className="dashboard-actions">
                <a className="cta" href="/membership?form=1">Open Membership Form</a>
                <a className="secondary" href="/shop">Shop Supplements</a>
              </div>
            </div>

            <div className="dashboard-grid dashboard-grid-clean">
              <section className="dashboard-card dashboard-profile-card">
                <div className="dashboard-card-head">
                  <p className="eyebrow">Account</p>
                  <h3>{member.fullName || "Member Account"}</h3>
                </div>
                <form className="dashboard-profile-form" onSubmit={handleProfileSave}>
                  <div className="form-grid">
                    <div className="form-field">
                      <label htmlFor="dashboardFullName">Full Name</label>
                      <input
                        id="dashboardFullName"
                        type="text"
                        value={profileForm.fullName}
                        onChange={(event) => setProfileForm((current) => ({ ...current, fullName: event.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="dashboardPhone">Phone Number</label>
                      <input
                        id="dashboardPhone"
                        type="tel"
                        value={profileForm.phone}
                        onChange={(event) => setProfileForm((current) => ({ ...current, phone: event.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="dashboard-profile-lines">
                    <p><strong>Email</strong><span>{member.email}</span></p>
                    <p><strong>Joined</strong><span>{formatDateLabel(member.createdAt)}</span></p>
                  </div>
                  <div className="dashboard-actions">
                    <button type="submit" className="secondary" disabled={profileSaving}>
                      {profileSaving ? "Saving..." : "Save Profile"}
                    </button>
                    <button type="button" className="secondary" onClick={handleLogout}>Log Out</button>
                  </div>
                  {profileMessage ? <p className="form-note">{profileMessage}</p> : null}
                </form>
              </section>

              <section className="dashboard-card dashboard-status-card">
                <div className="dashboard-card-head">
                  <p className="eyebrow">Membership</p>
                  <h3>{membership?.plan || "Ready to start"}</h3>
                </div>
                <div className="dashboard-stat-grid">
                  <div className="dashboard-stat">
                    <span>Status</span>
                    <strong>{membership?.status || "Not submitted"}</strong>
                  </div>
                  <div className="dashboard-stat">
                    <span>Period</span>
                    <strong>{membership?.membershipType || "Choose a plan"}</strong>
                  </div>
                  <div className="dashboard-stat">
                    <span>Renewal</span>
                    <strong>{membershipMeta.renewalDate || "Pending"}</strong>
                  </div>
                  <div className="dashboard-stat">
                    <span>Days Left</span>
                    <strong>{membershipMeta.daysLeft == null ? "Pending" : membershipMeta.isExpired ? "Expired" : `${membershipMeta.daysLeft} days`}</strong>
                  </div>
                </div>
                {!membership ? (
                  <div className="dashboard-next-step">
                    <p><strong>Next step:</strong> complete your membership form so your card, plan, and approval status can be saved here automatically.</p>
                    <a className="cta" href="/membership?form=1">Complete Membership Form</a>
                  </div>
                ) : (
                  <div className="dashboard-next-step">
                    <p><strong>Renew Membership:</strong> when your period is close to ending, open your form and submit the next plan so your access stays smooth.</p>
                    <a className="cta" href="/membership?form=1">Renew / Update Membership</a>
                  </div>
                )}
                {membership?.notes ? (
                  <div className="dashboard-admin-note">
                    <strong>Admin Note</strong>
                    <p>{membership.notes}</p>
                  </div>
                ) : null}
              </section>

              <section className="dashboard-card dashboard-timeline-card">
                <div className="dashboard-card-head">
                  <p className="eyebrow">Payment Progress</p>
                  <h3>Approval Timeline</h3>
                </div>
                <div className="dashboard-timeline">
                  {timelineSteps.map((step) => (
                    <div className={`dashboard-timeline-step is-${step.state}`} key={step.key}>
                      <span className="dashboard-timeline-dot"></span>
                      <strong>{step.label}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section className={`dashboard-card dashboard-pickup-card tone-${pickupNotice.tone}`}>
                <div className="dashboard-card-head">
                  <p className="eyebrow">Card Pickup</p>
                  <h3>{pickupNotice.title}</h3>
                </div>
                <p>{pickupNotice.text}</p>
              </section>

              <section className="dashboard-card dashboard-card-stage dashboard-span-2">
                <div className="dashboard-card-head">
                  <p className="eyebrow">Virtual Card</p>
                  <h3>Your Access Preview</h3>
                </div>
                <DashboardCardPreview membership={membership} member={member} />
              </section>

              <DashboardList
                title="Recent Activity"
                eyebrow="History"
                items={recentActivity}
                emptyText="No member activity has been recorded yet."
                renderItem={(item) => (
                  <article className="dashboard-list-item" key={item.id}>
                    <div className="dashboard-list-main">
                      <strong>{item.title}</strong>
                      <span>{item.status}</span>
                    </div>
                    <p className="dashboard-note">{formatDateTimeLabel(item.createdAt)}</p>
                  </article>
                )}
              />

              <DashboardList
                title="Member Updates"
                eyebrow="What's New"
                items={announcements}
                emptyText="There are no active member updates right now."
                renderItem={(item) => (
                  <article className="dashboard-list-item" key={item.id}>
                    <div className="dashboard-list-main">
                      <strong>{item.title}</strong>
                      <span>{item.tag || item.dateLabel || "Update"}</span>
                    </div>
                    <p className="dashboard-note">{item.text}</p>
                    {item.link ? <a className="dashboard-inline-link" href={item.link}>Open update</a> : null}
                  </article>
                )}
              />

              <DashboardList
                title="Recent Supplement Orders"
                eyebrow="Shop"
                items={shopOrders}
                emptyText="No supplement orders are linked to this account yet."
                renderItem={(order) => (
                  <article className="dashboard-list-item" key={order.id}>
                    <div className="dashboard-list-main">
                      <strong>{formatDateLabel(order.createdAt)}</strong>
                      <span>{order.status}</span>
                    </div>
                    <p className="dashboard-note">{order.items.map((item) => `${item.name} x${Math.max(1, Number(item.quantity) || 1)}`).join(", ")}</p>
                    {order.notes ? <p className="dashboard-note">{order.notes}</p> : null}
                  </article>
                )}
              />

              <DashboardList
                title="Tour Requests"
                eyebrow="Visits"
                items={tourRequests}
                emptyText="No tour requests are linked to this account yet."
                renderItem={(tour) => (
                  <article className="dashboard-list-item" key={tour.id}>
                    <div className="dashboard-list-main">
                      <strong>{formatDateLabel(tour.createdAt)}</strong>
                      <span>{tour.status}</span>
                    </div>
                    <p className="dashboard-note">{tour.phone || member.phone || "Phone saved on request"}</p>
                    {tour.notes ? <p className="dashboard-note">{tour.notes}</p> : null}
                  </article>
                )}
              />

              <section className="dashboard-card dashboard-support-card dashboard-span-2">
                <div className="dashboard-card-head">
                  <p className="eyebrow">Support</p>
                  <h3>Need help fast?</h3>
                </div>
                <p>If you need help with card pickup, payment approval, or shop delivery, use one of the shortcuts below.</p>
                <div className="dashboard-actions">
                  {contact?.phone ? <a className="cta" href={`tel:${contact.phone}`}>Call Gym</a> : null}
                  {contact?.email ? <a className="secondary" href={`mailto:${contact.email}`}>Email Support</a> : null}
                  <a className="secondary" href="/tour">Book a Tour</a>
                </div>
              </section>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<DashboardApp />);
