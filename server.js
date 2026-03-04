import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs/promises";
import crypto from "crypto";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }
});
const uploadDir = path.join(__dirname, "public", "uploads");
const uploadImage = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (err) {
        cb(err, uploadDir);
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase();
      const safeExt = ext && ext.length <= 6 ? ext : ".jpg";
      cb(null, `${crypto.randomUUID()}${safeExt}`);
    }
  }),
  limits: { fileSize: 6 * 1024 * 1024 }
});
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const OTP_SECRET = process.env.OTP_SECRET || crypto.randomBytes(32).toString("hex");
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, "admin.json");
const adminTokens = new Set();
const otpStore = new Map();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8476567885:AAFTbGjXc4g7CqNlHa-9fgzFyVK87ll-tNc";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7211124460";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "32mb" }));

let submissions = [];
let content = null;
let adminAuth = null;
const ensureDataFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const content = await fs.readFile(DATA_FILE, "utf8");
    submissions = JSON.parse(content || "[]");
  } catch (err) {
    submissions = [];
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  }
};

const defaultContent = {
  hours: {
    monSat: "11:00 AM - 4:00 AM",
    sunday: "Half day"
  },
  contact: {
    phone: "+251 9xx xxx xxx",
    email: "info@tenasgym.com"
  },
  payment: {
    link: ""
  },
  membershipTiers: [
    { name: "Unlimited", price: "$7000/mo", desc: "Full access, all classes, recovery suite." },
    { name: "3x / Week", price: "$6000/mo", desc: "Strength + conditioning sessions with open gym." },
    { name: "Starter", price: "$5000/mo", desc: "Open gym + 1 class weekly." }
  ],
  membershipPerks: [
    "Movement screen + onboarding",
    "Coach feedback and program updates",
    "Recovery suite access",
    "Community events + challenges"
  ],
  priceList: {
    periods: ["1 Month", "2 Month", "3 Month", "6 Month", "1 Year"],
    columns: [
      "Full Package (Gym, Spa, Aerobics)",
      "Gym and Spa",
      "Gym and Aerobics",
      "Gym Only",
      "Aerobics Only",
      "Off Peak Hour"
    ],
    prices: [
      ["9,999", "7,499", "7,499", "5,499", "2,999", "4,499"],
      ["18,799", "13,999", "13,999", "10,199", "5,499", "8,499"],
      ["23,999", "18,499", "18,499", "13,199", "7,499", "10,999"],
      ["39,999", "30,999", "30,999", "23,999", "13,499", "19,999"],
      ["69,999", "53,999", "53,999", "39,999", "24,999", "35,999"]
    ]
  },
  dailyPass: [
    { label: "Daily pass F.P", price: "1,099" },
    { label: "Daily pass Gym", price: "499" },
    { label: "Daily pass Aerobics", price: "499" }
  ],
  discounts: [
    { label: "3 person", value: "5% each" },
    { label: ">= 4 person", value: "7% each" }
  ],
  priceNote: "The above price does not include donation for 500.00 to Samrawit Foundation.",
  programs: [
    {
      name: "Strength Track",
      desc: "Barbell progressions with weekly performance tracking and coaching feedback.",
      focus: ["Squat/Bench/Deadlift", "Progressive overload", "Technique coaching"]
    },
    {
      name: "Hybrid Conditioning",
      desc: "Engine-building sessions that mix cardio, sled work, and functional strength.",
      focus: ["Intervals", "Sled work", "Athletic conditioning"]
    },
    {
      name: "Recovery Flow",
      desc: "Mobility classes, breathwork, and guided stretching for longevity.",
      focus: ["Mobility", "Breathing", "Post-session recovery"]
    },
    {
      name: "Athlete Performance",
      desc: "Power, speed, and agility for sport-specific results.",
      focus: ["Sprint mechanics", "Explosive power", "Change of direction"]
    }
  ],
  schedule: [
    { time: "06:00", name: "Strength Foundations" },
    { time: "12:15", name: "Hyrox Conditioning" },
    { time: "18:30", name: "Power + Mobility" }
  ],
  coaches: [
    {
      name: "Kidus Mulgeta",
      role: "Head Strength Coach",
      img: "/images/kidus%20mulgeta.png",
      bio: "10+ years coaching strength athletes and general population clients.",
      skills: ["CSCS", "Powerlifting", "Mobility"],
      exp: "Focus: Maximum strength, clean technique, injury-proof mechanics."
    },
    {
      name: "Abebe Tadesse",
      role: "Performance & Conditioning",
      img: "/images/kidus%20mulgeta.png",
      bio: "Hybrid endurance specialist with a focus on sustainable intensity.",
      skills: ["USAW", "HIIT", "Hyrox"],
      exp: "Focus: Engine building, athletic conditioning, interval systems."
    },
    {
      name: "Abel Tesfaye",
      role: "Mobility & Recovery",
      img: "/images/kidus%20mulgeta.png",
      bio: "Movement coach helping members improve range and reduce pain.",
      skills: ["FRC", "Stretch Therapy", "Recovery"],
      exp: "Focus: Mobility systems, tissue care, pre-hab and post-hab."
    }
  ],
  machines: [
    {
      name: "Apex Power Rack",
      desc: "Heavy-duty rack for squats, bench, and pull-ups.",
      img: "/images/apex.png",
      targets: "Quads, glutes, back",
      bestFor: "Compound strength",
      tip: "Brace your core before every rep."
    },
    {
      name: "Vector Cable Station",
      desc: "Dual-stack cables for full-range strength work.",
      img: "/images/victor-cable.png",
      targets: "Chest, shoulders, arms",
      bestFor: "Cables, flyes, rows",
      tip: "Keep constant tension."
    },
    {
      name: "Storm Air Bike",
      desc: "Assault-style bike with infinite resistance.",
      img: "/images/bike.png",
      targets: "Full body engine",
      bestFor: "Intervals, warm-ups",
      tip: "Push and pull together for max output."
    },
    {
      name: "Precision Leg Press",
      desc: "45-degree sled with smooth rails and oversized footplate.",
      img: "/images/leg press.png",
      targets: "Quads, glutes, calves",
      bestFor: "Strength & volume",
      tip: "Drive through mid-foot for control."
    },
    {
      name: "Crossover Fly Station",
      desc: "Adjustable fly station for chest and shoulder isolation.",
      img: "/images/cross.png",
      targets: "Chest, shoulders",
      bestFor: "Flyes, isolation",
      tip: "Keep elbows soft through the arc."
    },
    {
      name: "Functional Trainer Pro",
      desc: "Versatile cable unit for full-body training.",
      img: "/images/functional.png",
      targets: "Full body",
      bestFor: "Functional strength",
      tip: "Control the negative on every rep."
    },
    {
      name: "Power Rack Elite",
      desc: "Heavy rack for max strength and safe spotting.",
      img: "/images/power.png",
      targets: "Quads, glutes, back",
      bestFor: "Squats, presses",
      tip: "Set safety pins before lifting heavy."
    },
    {
      name: "Hydro Row Elite",
      desc: "Water-resistance rower with smooth glide.",
      img: "images/hydro.png",
      targets: "Back, legs, core",
      bestFor: "Cardio endurance",
      tip: "Drive with legs, finish with arms."
    },
    {
      name: "Glide Leg Press",
      desc: "45-degree sled with wide foot plate.",
      img: "/images/leg press.png",
      targets: "Quads, glutes, calves",
      bestFor: "Hypertrophy blocks",
      tip: "Control the descent for growth."
    },
    {
      name: "Pulse Sled Track",
      desc: "Turf lane for sled pushes and pulls.",
      img: "images/pulse-sled.png",
      targets: "Legs, lungs",
      bestFor: "Conditioning",
      tip: "Stay low and drive through the floor."
    }
  ]
};

const ensureContentFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    content = JSON.parse(raw || "{}");
  } catch (err) {
    content = defaultContent;
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
  }
};

const hashPassword = (password, salt) => {
  const actualSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, actualSalt, 310000, 32, "sha256").toString("hex");
  return { salt: actualSalt, hash };
};

const verifyPassword = (password, auth) => {
  if (!password || !auth?.salt || !auth?.hash) return false;
  const hash = crypto.pbkdf2Sync(password, auth.salt, 310000, 32, "sha256").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(auth.hash, "hex"));
};

const saveAdminAuth = async (password) => {
  const { salt, hash } = hashPassword(password);
  adminAuth = { salt, hash, updatedAt: new Date().toISOString() };
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(ADMIN_CONFIG_FILE, JSON.stringify(adminAuth, null, 2));
};

const ensureAdminFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(ADMIN_CONFIG_FILE, "utf8");
    adminAuth = JSON.parse(raw || "{}");
    if (!adminAuth?.salt || !adminAuth?.hash) {
      await saveAdminAuth(ADMIN_PASSWORD);
    }
  } catch (err) {
    await saveAdminAuth(ADMIN_PASSWORD);
  }
};

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const getAdminEmail = () => normalizeEmail(ADMIN_EMAIL || content?.contact?.email || "info@tenasgym.com");

const getMailer = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true" || port === 465;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
};

const createOtp = (email) => {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const hash = crypto.createHash("sha256").update(code + OTP_SECRET).digest("hex");
  otpStore.set(email, {
    hash,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
    lastSentAt: Date.now()
  });
  return code;
};

const verifyOtp = (email, code) => {
  const entry = otpStore.get(email);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email);
    return false;
  }
  if (entry.attempts >= 6) {
    otpStore.delete(email);
    return false;
  }
  const hash = crypto.createHash("sha256").update(String(code || "") + OTP_SECRET).digest("hex");
  const ok = crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(entry.hash, "hex"));
  if (!ok) {
    entry.attempts += 1;
    return false;
  }
  otpStore.delete(email);
  return true;
};

const sendOtpEmail = async (email, code) => {
  const transporter = getMailer();
  if (!transporter) {
    throw new Error("Email not configured");
  }
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@tenasgym.com";
  const subject = "Tenas Admin Password Reset Code";
  const text = `Your password reset code is: ${code}\nThis code expires in 10 minutes.`;
  await transporter.sendMail({ from, to: email, subject, text });
};
const saveSubmission = async (entry) => {
  submissions.unshift(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
};

const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  return next();
};

app.get(["/coaches", "/coaches.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "coaches.html"));
});

app.get(["/machines", "/machines.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "machines.html"));
});

app.get(["/programs", "/programs.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "programs.html"));
});

app.get(["/membership", "/membership.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "membership.html"));
});

app.get(["/tour", "/tour.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "tour.html"));
});

app.get(["/admin", "/admin.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});
app.post("/api/tour", async (req, res) => {
  try {
    const { fullName, phone } = req.body || {};
    if (!fullName || !phone) {
      return res.status(400).json({ ok: false, error: "Missing full name or phone" });
    }
    const message = "New tour request\nName: " + fullName + "\nPhone: " + phone + "\nTime: " + new Date().toISOString();
    const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
    });
    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return res.status(502).json({ ok: false, error: errText });
    }
    await saveSubmission({
      id: crypto.randomUUID(),
      type: "tour",
      fullName,
      phone,
      createdAt: new Date().toISOString()
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body || {};
  if (!verifyPassword(password, adminAuth)) {
    return res.status(401).json({ ok: false, error: "Invalid password" });
  }
  const token = crypto.randomBytes(24).toString("hex");
  adminTokens.add(token);
  return res.json({ ok: true, token });
});

app.post("/api/admin/password", requireAdmin, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!verifyPassword(currentPassword, adminAuth)) {
    return res.status(401).json({ ok: false, error: "Invalid current password" });
  }
  if (!newPassword || String(newPassword).length < 8) {
    return res.status(400).json({ ok: false, error: "New password must be at least 8 characters" });
  }
  await saveAdminAuth(String(newPassword));
  return res.json({ ok: true });
});

app.post("/api/admin/forgot", async (req, res) => {
  const { email } = req.body || {};
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return res.status(400).json({ ok: false, error: "Email is required" });
  }
  const adminEmail = getAdminEmail();
  if (normalized !== adminEmail) {
    return res.json({ ok: true });
  }
  const existing = otpStore.get(normalized);
  if (existing && Date.now() - existing.lastSentAt < OTP_COOLDOWN_MS) {
    return res.status(429).json({ ok: false, error: "Please wait before requesting another code" });
  }
  try {
    const code = createOtp(normalized);
    await sendOtpEmail(normalized, code);
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/admin/reset", async (req, res) => {
  const { email, otp, newPassword } = req.body || {};
  const normalized = normalizeEmail(email);
  const adminEmail = getAdminEmail();
  if (!normalized || normalized !== adminEmail) {
    return res.status(400).json({ ok: false, error: "Invalid request" });
  }
  if (!otp) {
    return res.status(400).json({ ok: false, error: "OTP is required" });
  }
  if (!newPassword || String(newPassword).length < 8) {
    return res.status(400).json({ ok: false, error: "New password must be at least 8 characters" });
  }
  if (!verifyOtp(normalized, otp)) {
    return res.status(401).json({ ok: false, error: "Invalid or expired OTP" });
  }
  await saveAdminAuth(String(newPassword));
  return res.json({ ok: true });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token) adminTokens.delete(token);
  return res.json({ ok: true });
});

app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const total = submissions.length;
  const membership = submissions.filter((item) => item.type === "membership").length;
  const tour = submissions.filter((item) => item.type === "tour").length;
  const last = submissions[0]?.createdAt || null;
  return res.json({ ok: true, total, membership, tour, last });
});

app.get("/api/admin/submissions", requireAdmin, (req, res) => {
  return res.json({ ok: true, submissions });
});

app.post("/api/admin/upload", requireAdmin, uploadImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ ok: false, error: "No file uploaded" });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  return res.json({ ok: true, path: urlPath });
});

app.patch("/api/admin/submissions/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body || {};
  const idx = submissions.findIndex((item) => item.id === id);
  if (idx === -1) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  submissions[idx] = {
    ...submissions[idx],
    status: updates.status ?? submissions[idx].status ?? "new",
    notes: updates.notes ?? submissions[idx].notes ?? ""
  };
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  return res.json({ ok: true, submission: submissions[idx] });
});

app.delete("/api/admin/submissions/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const next = submissions.filter((item) => item.id !== id);
  if (next.length === submissions.length) {
    return res.status(404).json({ ok: false, error: "Not found" });
  }
  submissions = next;
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  return res.json({ ok: true });
});

app.get("/api/admin/content", requireAdmin, (req, res) => {
  return res.json({ ok: true, content });
});

app.put("/api/admin/content", requireAdmin, async (req, res) => {
  try {
    const payload = req.body || {};
    content = payload;
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.get("/api/content", (req, res) => {
  return res.json({ ok: true, content });
});

app.get("/api/stats", (req, res) => {
  const total = submissions.length;
  const membership = submissions.filter((item) => item.type === "membership").length;
  const tour = submissions.filter((item) => item.type === "tour").length;
  const last = submissions[0]?.createdAt || null;
  return res.json({ ok: true, total, membership, tour, last });
});

app.post(
  "/api/membership",
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 }
  ]),
  async (req, res) => {
  try {
    const payload = req.body || {};
    const required = ["fullName", "phone", "email", "plan", "membershipType", "startDate", "paymentMethod"];
    for (const field of required) {
      if (!payload[field]) {
        return res.status(400).json({ ok: false, error: "Missing required field: " + field });
      }
    }

    const profilePhoto = req.files?.profilePhoto?.[0];
    const paymentProof = req.files?.paymentProof?.[0];
    if (!profilePhoto) {
      return res.status(400).json({ ok: false, error: "Missing required field: profilePhoto" });
    }

    const goalsArr = Array.isArray(payload.goals) ? payload.goals : payload.goals ? [payload.goals] : [];
    const conditionsArr = Array.isArray(payload.conditions) ? payload.conditions : payload.conditions ? [payload.conditions] : [];
    const goals = goalsArr.length ? goalsArr.join(", ") : "None";
    const conditions = conditionsArr.length ? conditionsArr.join(", ") : "None";

    const messageLines = [
      "New membership request",
      "Name: " + payload.fullName,
      "Phone: " + payload.phone,
      "Email: " + payload.email,
      "DOB: " + (payload.dob || "N/A"),
      "Gender: " + (payload.gender || "N/A"),
      "Emergency Contact: " + (payload.emergencyContact || "N/A"),
      "Emergency Phone: " + (payload.emergencyPhone || "N/A"),
      "Plan: " + payload.plan,
      "Membership Type: " + payload.membershipType,
      "Start Date: " + payload.startDate,
      "Preferred Time: " + (payload.preferredTime || "N/A"),
      "Training: " + (payload.training || "N/A"),
      "Goals: " + goals,
      "Medical Conditions: " + (payload.medicalConditions || "N/A"),
      "Medical Details: " + (payload.medicalDetails || "N/A"),
      "Medications: " + (payload.medications || "N/A"),
      "Medication Details: " + (payload.medicationDetails || "N/A"),
      "Past Conditions: " + conditions,
      "Doctor Advised Against Exercise: " + (payload.doctorAdvised || "N/A"),
      "Payment Method: " + payload.paymentMethod,
      "Payment Reference: " + (payload.paymentReference || "N/A"),
      "Submitted: " + new Date().toISOString()
    ];

    const message = messageLines.join("\n");
    const messageUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
    const tgRes = await fetch(messageUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message })
    });
    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return res.status(502).json({ ok: false, error: errText });
    }

    const sendPhotoToTelegram = async (photo) => {
      const form = new FormData();
      form.append("chat_id", TELEGRAM_CHAT_ID);
      if (typeof Blob !== "undefined") {
        form.append("photo", new Blob([photo.buffer], { type: photo.mimetype }), photo.originalname || "upload");
      } else {
        form.append("photo", photo.buffer, photo.originalname || "upload");
      }
      const photoUrl = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendPhoto";
      const photoRes = await fetch(photoUrl, { method: "POST", body: form });
      if (!photoRes.ok) {
        const errText = await photoRes.text();
        throw new Error(errText);
      }
    };

    await sendPhotoToTelegram(profilePhoto);

    if (paymentProof) {
      await sendPhotoToTelegram(paymentProof);
    }

    await saveSubmission({
      id: crypto.randomUUID(),
      type: "membership",
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email,
      plan: payload.plan,
      membershipType: payload.membershipType,
      startDate: payload.startDate,
      preferredTime: payload.preferredTime || "",
      training: payload.training || "",
      goals: goalsArr,
      paymentMethod: payload.paymentMethod,
      createdAt: new Date().toISOString()
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const start = async () => {
  await ensureDataFile();
  await ensureContentFile();
  await ensureAdminFile();
  app.listen(PORT, () => {
    console.log(`Tenas Fitness running on http://localhost:${PORT}`);
  });
};

start();



