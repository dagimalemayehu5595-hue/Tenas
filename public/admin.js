const { useEffect, useState } = React;

function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem("tenas_admin_token") || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changeStatus, setChangeStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [stats, setStats] = useState({ total: 0, membership: 0, tour: 0, last: null });
  const [submissions, setSubmissions] = useState([]);
  const emptyDraft = {
    hours: { monSat: "", sunday: "" },
    contact: { phone: "", email: "" },
    payment: { link: "" },
    membershipTiers: [],
    membershipPerks: [],
    priceList: { periods: [], columns: [], prices: [] },
    dailyPass: [],
    discounts: [],
    priceNote: "",
    programs: [],
    schedule: [],
    coaches: [],
    machines: []
  };
  const [contentDraft, setContentDraft] = useState(emptyDraft);

  const authFetch = async (url) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) {
      setToken("");
      localStorage.removeItem("tenas_admin_token");
      throw new Error("Session expired. Please log in again.");
    }
    return res;
  };

  const normalizeContent = (src) => ({
    hours: { ...emptyDraft.hours, ...(src?.hours || {}) },
    contact: { ...emptyDraft.contact, ...(src?.contact || {}) },
    payment: { ...emptyDraft.payment, ...(src?.payment || {}) },
    membershipTiers: Array.isArray(src?.membershipTiers) ? src.membershipTiers : [],
    membershipPerks: Array.isArray(src?.membershipPerks) ? src.membershipPerks : [],
    priceList: src?.priceList || { periods: [], columns: [], prices: [] },
    dailyPass: Array.isArray(src?.dailyPass) ? src.dailyPass : [],
    discounts: Array.isArray(src?.discounts) ? src.discounts : [],
    priceNote: src?.priceNote || "",
    programs: Array.isArray(src?.programs) ? src.programs : [],
    schedule: Array.isArray(src?.schedule) ? src.schedule : [],
    coaches: Array.isArray(src?.coaches) ? src.coaches : [],
    machines: Array.isArray(src?.machines) ? src.machines : []
  });

  const loadData = async () => {
    const statsRes = await authFetch("/api/admin/stats");
    const statsJson = await statsRes.json();
    if (statsJson.ok) setStats(statsJson);
    const submissionsRes = await authFetch("/api/admin/submissions");
    const submissionsJson = await submissionsRes.json();
    if (submissionsJson.ok) setSubmissions(submissionsJson.submissions || []);
    const contentRes = await authFetch("/api/admin/content");
    const contentJson = await contentRes.json();
    if (contentJson.ok) {
      setContentDraft(normalizeContent(contentJson.content));
    }
  };

  useEffect(() => {
    if (!token) return;
    loadData().catch((err) => setError(String(err.message || err)));
  }, [token]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Login failed");
      setToken(data.token);
      localStorage.setItem("tenas_admin_token", data.token);
      setPassword("");
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setError("");
    setForgotStatus("");
    if (!forgotEmail) {
      setError("Email is required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to send OTP");
      setForgotStatus("OTP sent. Check your email.");
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setError("");
    setForgotStatus("");
    if (!forgotEmail || !otp || !resetPassword) {
      setError("Email, OTP, and new password are required.");
      return;
    }
    if (resetPassword !== resetConfirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const res = await fetch("/api/admin/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword: resetPassword })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Reset failed");
      setForgotStatus("Password reset. You can sign in now.");
      setOtp("");
      setResetPassword("");
      setResetConfirm("");
      setForgotOpen(false);
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleLogout = async () => {
    if (!token) return;
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {}
    setToken("");
    localStorage.removeItem("tenas_admin_token");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setChangeStatus("");
    if (!currentPassword || !newPassword) {
      setError("Current and new password are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Password update failed");
      setChangeStatus("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleContentSave = async () => {
    setError("");
    setSaveStatus("");
    try {
      const next = normalizeContent(contentDraft);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(next)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to save content");
      setContentDraft(next);
      setSaveStatus("Content saved.");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) return;
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Upload failed");
      onSuccess(data.path);
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleSubmissionUpdate = async (id, updates) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to update");
      setSubmissions((prev) => prev.map((item) => (item.id === id ? data.submission : item)));
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  const handleSubmissionDelete = async (id) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed to delete");
      setSubmissions((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(String(err.message || err));
    }
  };

  return (
    <div>
      <header className="hero admin-hero">
        <nav className="nav">
          <a className="logo" href="/index.html">
            <img src="/images/tenas.jpeg" alt="Tenas Fitness logo" className="logo-image" />
            <span>Tenas Fitness</span>
          </a>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/membership.html">Membership</a>
            <a href="/tour.html">Tour</a>
          </div>
          {token ? (
            <button className="cta" type="button" onClick={handleLogout}>Logout</button>
          ) : (
            <span className="cta admin-badge">Admin</span>
          )}
        </nav>

        <div className="hero-grid">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Manage submissions and keep tabs on activity.</h1>
            <p className="lead">Secure dashboard with membership and tour requests.</p>
          </div>
          <div className="hero-card">
            <h3>Access</h3>
            <p>Use the admin password to access submissions.</p>
            <p>Use the reset form below if you forgot the password.</p>
          </div>
        </div>
      </header>

      <section className="section">
        {!token ? (
          <div className="admin-card">
            <h2>Admin Login</h2>
            <form className="tour-form" onSubmit={handleLogin}>
              <div className="form-field">
                <label htmlFor="adminPassword">Password</label>
                <input
                  id="adminPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="cta" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
              {error ? <p className="form-error">{error}</p> : null}
            </form>
            <div className="admin-auth-actions">
              <button
                type="button"
                className="secondary admin-link-button"
                onClick={() => setForgotOpen((prev) => !prev)}
              >
                {forgotOpen ? "Hide Password Reset" : "Forgot Password?"}
              </button>
            </div>
            {forgotOpen ? (
              <form className="tour-form admin-forgot" onSubmit={handleResetPassword}>
                <div className="form-field">
                  <label htmlFor="adminEmail">Admin Email</label>
                  <input
                    id="adminEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="adminOtp">OTP Code</label>
                  <input
                    id="adminOtp"
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit code"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="adminNewPassword">New Password</label>
                  <input
                    id="adminNewPassword"
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="adminNewPasswordConfirm">Confirm Password</label>
                  <input
                    id="adminNewPasswordConfirm"
                    type="password"
                    value={resetConfirm}
                    onChange={(e) => setResetConfirm(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-auth-actions">
                  <button type="button" className="secondary" onClick={handleSendOtp}>
                    Send OTP
                  </button>
                  <button type="submit" className="cta">
                    Reset Password
                  </button>
                </div>
                {forgotStatus ? <p className="form-note">{forgotStatus}</p> : null}
                {error ? <p className="form-error">{error}</p> : null}
              </form>
            ) : null}
          </div>
        ) : (
          <div className="admin-dashboard">
            <div className="admin-stats">
              <div className="stat-card">
                <h3>Total Requests</h3>
                <p>{stats.total}</p>
              </div>
              <div className="stat-card">
                <h3>Memberships</h3>
                <p>{stats.membership}</p>
              </div>
              <div className="stat-card">
                <h3>Tours</h3>
                <p>{stats.tour}</p>
              </div>
              <div className="stat-card">
                <h3>Last Request</h3>
                <p>{stats.last ? new Date(stats.last).toLocaleString() : "No data yet"}</p>
              </div>
            </div>

            <div className="admin-card admin-password-card">
              <h2>Change Password</h2>
              <form className="tour-form" onSubmit={handleChangePassword}>
                <div className="form-field">
                  <label htmlFor="currentAdminPassword">Current Password</label>
                  <input
                    id="currentAdminPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="newAdminPassword">New Password</label>
                  <input
                    id="newAdminPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="confirmAdminPassword">Confirm New Password</label>
                  <input
                    id="confirmAdminPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="cta">
                  Update Password
                </button>
                {changeStatus ? <p className="form-note">{changeStatus}</p> : null}
                {error ? <p className="form-error">{error}</p> : null}
              </form>
            </div>

            <div className="admin-list">
              <h2>Submissions</h2>
              {submissions.length === 0 ? (
                <p className="form-note">No submissions yet.</p>
              ) : (
                <div className="submission-grid">
                  {submissions.map((item) => (
                    <div className="submission-card" key={item.id}>
                      <p className="submission-type">{item.type.toUpperCase()}</p>
                      <h3>{item.fullName || "Unknown"}</h3>
                      <p>{item.phone || "No phone"}</p>
                      {item.email ? <p>{item.email}</p> : null}
                      {item.plan ? <p>Plan: {item.plan}</p> : null}
                      {item.membershipType ? <p>Type: {item.membershipType}</p> : null}
                      <p className="submission-time">{new Date(item.createdAt).toLocaleString()}</p>
                      <div className="submission-actions">
                        <label>
                          Status
                          <select
                            value={item.status || "new"}
                            onChange={(e) => handleSubmissionUpdate(item.id, { status: e.target.value })}
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="paid">Paid</option>
                            <option value="closed">Closed</option>
                          </select>
                        </label>
                        <label>
                          Notes
                          <textarea
                            rows="2"
                            value={item.notes || ""}
                            onChange={(e) => handleSubmissionUpdate(item.id, { notes: e.target.value })}
                          />
                        </label>
                        <button type="button" className="secondary" onClick={() => handleSubmissionDelete(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-editor">
              <h2>Edit Site Content</h2>
              <p className="form-note">Edit fields below. Changes update the live site.</p>

              <div className="editor-grid">
                <div className="editor-block">
                  <h3>Hours</h3>
                  <div className="editor-item">
                    <label>
                      Mon-Sat
                      <input
                        type="text"
                        value={contentDraft.hours.monSat}
                        onChange={(e) => setContentDraft({ ...contentDraft, hours: { ...contentDraft.hours, monSat: e.target.value } })}
                      />
                    </label>
                    <label>
                      Sunday
                      <input
                        type="text"
                        value={contentDraft.hours.sunday}
                        onChange={(e) => setContentDraft({ ...contentDraft, hours: { ...contentDraft.hours, sunday: e.target.value } })}
                      />
                    </label>
                  </div>
                </div>

                <div className="editor-block">
                  <h3>Contact</h3>
                  <div className="editor-item">
                    <label>
                      Phone
                      <input
                        type="text"
                        value={contentDraft.contact.phone}
                        onChange={(e) => setContentDraft({ ...contentDraft, contact: { ...contentDraft.contact, phone: e.target.value } })}
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={contentDraft.contact.email}
                        onChange={(e) => setContentDraft({ ...contentDraft, contact: { ...contentDraft.contact, email: e.target.value } })}
                      />
                    </label>
                  </div>
                </div>

                <div className="editor-block">
                  <h3>Payment Link</h3>
                  <div className="editor-item">
                    <label>
                      URL
                      <input
                        type="text"
                        value={contentDraft.payment.link}
                        onChange={(e) => setContentDraft({ ...contentDraft, payment: { ...contentDraft.payment, link: e.target.value } })}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Price List Table</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      const nextPeriods = [...contentDraft.priceList.periods, ""];
                      const nextPrices = [...contentDraft.priceList.prices, Array(contentDraft.priceList.columns.length).fill("")];
                      setContentDraft({
                        ...contentDraft,
                        priceList: { ...contentDraft.priceList, periods: nextPeriods, prices: nextPrices }
                      });
                    }}
                  >
                    Add Row
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      const nextColumns = [...contentDraft.priceList.columns, ""];
                      const nextPrices = contentDraft.priceList.prices.map((row) => [...row, ""]);
                      setContentDraft({
                        ...contentDraft,
                        priceList: { ...contentDraft.priceList, columns: nextColumns, prices: nextPrices }
                      });
                    }}
                  >
                    Add Column
                  </button>
                </div>
                <div className="editor-item">
                  <label>
                    Columns (edit names)
                    <div className="inline-grid">
                      {contentDraft.priceList.columns.map((col, index) => (
                        <input
                          key={`col-${index}`}
                          type="text"
                          value={col}
                          onChange={(e) => {
                            const nextCols = [...contentDraft.priceList.columns];
                            nextCols[index] = e.target.value;
                            setContentDraft({
                              ...contentDraft,
                              priceList: { ...contentDraft.priceList, columns: nextCols }
                            });
                          }}
                        />
                      ))}
                    </div>
                  </label>
                </div>
                {contentDraft.priceList.periods.map((period, rowIndex) => (
                  <div className="editor-item" key={`period-${rowIndex}`}>
                    <label>
                      Period
                      <input
                        type="text"
                        value={period}
                        onChange={(e) => {
                          const nextPeriods = [...contentDraft.priceList.periods];
                          nextPeriods[rowIndex] = e.target.value;
                          setContentDraft({
                            ...contentDraft,
                            priceList: { ...contentDraft.priceList, periods: nextPeriods }
                          });
                        }}
                      />
                    </label>
                    <label>
                      Prices
                      <div className="inline-grid">
                        {contentDraft.priceList.columns.map((_, colIndex) => (
                          <input
                            key={`price-${rowIndex}-${colIndex}`}
                            type="text"
                            value={contentDraft.priceList.prices[rowIndex]?.[colIndex] || ""}
                            onChange={(e) => {
                              const nextPrices = contentDraft.priceList.prices.map((row) => [...row]);
                              if (!nextPrices[rowIndex]) nextPrices[rowIndex] = [];
                              nextPrices[rowIndex][colIndex] = e.target.value;
                              setContentDraft({
                                ...contentDraft,
                                priceList: { ...contentDraft.priceList, prices: nextPrices }
                              });
                            }}
                          />
                        ))}
                      </div>
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const nextPeriods = contentDraft.priceList.periods.filter((_, i) => i !== rowIndex);
                        const nextPrices = contentDraft.priceList.prices.filter((_, i) => i !== rowIndex);
                        setContentDraft({
                          ...contentDraft,
                          priceList: { ...contentDraft.priceList, periods: nextPeriods, prices: nextPrices }
                        });
                      }}
                    >
                      Remove Row
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Daily Pass</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        dailyPass: [...contentDraft.dailyPass, { label: "", price: "" }]
                      })
                    }
                  >
                    Add Daily Pass
                  </button>
                </div>
                {contentDraft.dailyPass.map((item, index) => (
                  <div className="editor-item" key={`daily-${index}`}>
                    <label>
                      Label
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.dailyPass];
                          next[index] = { ...next[index], label: e.target.value };
                          setContentDraft({ ...contentDraft, dailyPass: next });
                        }}
                      />
                    </label>
                    <label>
                      Price
                      <input
                        type="text"
                        value={item.price || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.dailyPass];
                          next[index] = { ...next[index], price: e.target.value };
                          setContentDraft({ ...contentDraft, dailyPass: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.dailyPass.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, dailyPass: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Discounts</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        discounts: [...contentDraft.discounts, { label: "", value: "" }]
                      })
                    }
                  >
                    Add Discount
                  </button>
                </div>
                {contentDraft.discounts.map((item, index) => (
                  <div className="editor-item" key={`discount-${index}`}>
                    <label>
                      Label
                      <input
                        type="text"
                        value={item.label || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.discounts];
                          next[index] = { ...next[index], label: e.target.value };
                          setContentDraft({ ...contentDraft, discounts: next });
                        }}
                      />
                    </label>
                    <label>
                      Value
                      <input
                        type="text"
                        value={item.value || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.discounts];
                          next[index] = { ...next[index], value: e.target.value };
                          setContentDraft({ ...contentDraft, discounts: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.discounts.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, discounts: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Price Note</h3>
                </div>
                <div className="editor-item">
                  <label>
                    Note
                    <input
                      type="text"
                      value={contentDraft.priceNote}
                      onChange={(e) => setContentDraft({ ...contentDraft, priceNote: e.target.value })}
                    />
                  </label>
                </div>
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Membership Tiers</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        membershipTiers: [...contentDraft.membershipTiers, { name: "", price: "", desc: "" }]
                      })
                    }
                  >
                    Add Tier
                  </button>
                </div>
                {contentDraft.membershipTiers.map((tier, index) => (
                  <div className="editor-item" key={`tier-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={tier.name || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.membershipTiers];
                          next[index] = { ...next[index], name: e.target.value };
                          setContentDraft({ ...contentDraft, membershipTiers: next });
                        }}
                      />
                    </label>
                    <label>
                      Price
                      <input
                        type="text"
                        value={tier.price || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.membershipTiers];
                          next[index] = { ...next[index], price: e.target.value };
                          setContentDraft({ ...contentDraft, membershipTiers: next });
                        }}
                      />
                    </label>
                    <label>
                      Description
                      <input
                        type="text"
                        value={tier.desc || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.membershipTiers];
                          next[index] = { ...next[index], desc: e.target.value };
                          setContentDraft({ ...contentDraft, membershipTiers: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.membershipTiers.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, membershipTiers: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Membership Perks</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        membershipPerks: [...contentDraft.membershipPerks, ""]
                      })
                    }
                  >
                    Add Perk
                  </button>
                </div>
                {contentDraft.membershipPerks.map((perk, index) => (
                  <div className="editor-item" key={`perk-${index}`}>
                    <label>
                      Perk
                      <input
                        type="text"
                        value={perk}
                        onChange={(e) => {
                          const next = [...contentDraft.membershipPerks];
                          next[index] = e.target.value;
                          setContentDraft({ ...contentDraft, membershipPerks: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.membershipPerks.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, membershipPerks: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Programs</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        programs: [...contentDraft.programs, { name: "", desc: "", focus: [] }]
                      })
                    }
                  >
                    Add Program
                  </button>
                </div>
                {contentDraft.programs.map((program, index) => (
                  <div className="editor-item" key={`program-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={program.name || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.programs];
                          next[index] = { ...next[index], name: e.target.value };
                          setContentDraft({ ...contentDraft, programs: next });
                        }}
                      />
                    </label>
                    <label>
                      Description
                      <input
                        type="text"
                        value={program.desc || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.programs];
                          next[index] = { ...next[index], desc: e.target.value };
                          setContentDraft({ ...contentDraft, programs: next });
                        }}
                      />
                    </label>
                    <label>
                      Focus (comma separated)
                      <input
                        type="text"
                        value={(program.focus || []).join(", ")}
                        onChange={(e) => {
                          const next = [...contentDraft.programs];
                          next[index] = {
                            ...next[index],
                            focus: e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                          };
                          setContentDraft({ ...contentDraft, programs: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.programs.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, programs: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Schedule</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        schedule: [...contentDraft.schedule, { time: "", name: "" }]
                      })
                    }
                  >
                    Add Slot
                  </button>
                </div>
                {contentDraft.schedule.map((item, index) => (
                  <div className="editor-item" key={`schedule-${index}`}>
                    <label>
                      Time
                      <input
                        type="text"
                        value={item.time || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.schedule];
                          next[index] = { ...next[index], time: e.target.value };
                          setContentDraft({ ...contentDraft, schedule: next });
                        }}
                      />
                    </label>
                    <label>
                      Name
                      <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.schedule];
                          next[index] = { ...next[index], name: e.target.value };
                          setContentDraft({ ...contentDraft, schedule: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.schedule.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, schedule: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Coaches</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        coaches: [...contentDraft.coaches, { name: "", role: "", img: "", bio: "", skills: [], exp: "" }]
                      })
                    }
                  >
                    Add Coach
                  </button>
                </div>
                {contentDraft.coaches.map((coach, index) => (
                  <div className="editor-item" key={`coach-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={coach.name || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = { ...next[index], name: e.target.value };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <label>
                      Role
                      <input
                        type="text"
                        value={coach.role || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = { ...next[index], role: e.target.value };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <label>
                      Image Path
                      <input
                        type="text"
                        value={coach.img || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = { ...next[index], img: e.target.value };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <label>
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0], (path) => {
                            const next = [...contentDraft.coaches];
                            next[index] = { ...next[index], img: path };
                            setContentDraft({ ...contentDraft, coaches: next });
                          })
                        }
                      />
                    </label>
                    <label>
                      Bio
                      <input
                        type="text"
                        value={coach.bio || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = { ...next[index], bio: e.target.value };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <label>
                      Skills (comma separated)
                      <input
                        type="text"
                        value={(coach.skills || []).join(", ")}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = {
                            ...next[index],
                            skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                          };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <label>
                      Focus
                      <input
                        type="text"
                        value={coach.exp || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.coaches];
                          next[index] = { ...next[index], exp: e.target.value };
                          setContentDraft({ ...contentDraft, coaches: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.coaches.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, coaches: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="editor-list">
                <div className="editor-row">
                  <h3>Machines</h3>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setContentDraft({
                        ...contentDraft,
                        machines: [...contentDraft.machines, { name: "", desc: "", img: "", targets: "", bestFor: "", tip: "" }]
                      })
                    }
                  >
                    Add Machine
                  </button>
                </div>
                {contentDraft.machines.map((machine, index) => (
                  <div className="editor-item" key={`machine-${index}`}>
                    <label>
                      Name
                      <input
                        type="text"
                        value={machine.name || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], name: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <label>
                      Description
                      <input
                        type="text"
                        value={machine.desc || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], desc: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <label>
                      Image Path
                      <input
                        type="text"
                        value={machine.img || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], img: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <label>
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleImageUpload(e.target.files?.[0], (path) => {
                            const next = [...contentDraft.machines];
                            next[index] = { ...next[index], img: path };
                            setContentDraft({ ...contentDraft, machines: next });
                          })
                        }
                      />
                    </label>
                    <label>
                      Targets
                      <input
                        type="text"
                        value={machine.targets || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], targets: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <label>
                      Best For
                      <input
                        type="text"
                        value={machine.bestFor || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], bestFor: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <label>
                      Coach Tip
                      <input
                        type="text"
                        value={machine.tip || ""}
                        onChange={(e) => {
                          const next = [...contentDraft.machines];
                          next[index] = { ...next[index], tip: e.target.value };
                          setContentDraft({ ...contentDraft, machines: next });
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => {
                        const next = contentDraft.machines.filter((_, i) => i !== index);
                        setContentDraft({ ...contentDraft, machines: next });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="admin-actions">
                <button type="button" className="cta" onClick={handleContentSave}>Save Content</button>
              </div>
              {saveStatus ? <p className="form-success">{saveStatus}</p> : null}
              {error ? <p className="form-error">{error}</p> : null}
            </div>

            <button
              type="button"
              className="scroll-top"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
            >
              ↑
            </button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);






