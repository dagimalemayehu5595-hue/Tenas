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
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(16).toString("hex");
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const OTP_SECRET = process.env.OTP_SECRET || crypto.randomBytes(32).toString("hex");
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const PUBLIC_CONTENT_FILE = path.join(__dirname, "public", "content.json");
const ADMIN_CONFIG_FILE = path.join(DATA_DIR, "admin.json");
const MEMBERS_FILE = path.join(DATA_DIR, "members.json");
const adminTokens = new Set();
const memberTokens = new Map();
const otpStore = new Map();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "32mb" }));

let submissions = [];
let content = null;
let adminAuth = null;
let members = [];
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

const ensureMembersFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(MEMBERS_FILE, "utf8");
    members = JSON.parse(raw || "[]");
    if (!Array.isArray(members)) members = [];
  } catch (err) {
    members = [];
    await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
  }
};

const defaultContent = {
  hours: {
    monSat: "05:00 PM - 09:00 AM",
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
  referralCodes: [], 
  announcements: [],
  shopProducts: [
    {
      category: "Protein",
      name: "Whey Isolate",
      price: "ETB 8,500",
      desc: "Fast-digesting post-workout protein to support lean muscle recovery and daily intake.",
      tag: "Best Seller",
      img: ""
    },
    {
      category: "Creatine",
      name: "Creatine Monohydrate",
      price: "ETB 3,200",
      desc: "A simple strength staple for power output, performance, and steady progress.",
      tag: "Strength Essential",
      img: ""
    },
    {
      category: "Recovery",
      name: "BCAA + Electrolytes",
      price: "ETB 2,900",
      desc: "Hydration and recovery support for long sessions, hot days, and high-volume training.",
      tag: "Recovery Stack",
      img: ""
    },
    {
      category: "Energy",
      name: "Pre-Workout Blend",
      price: "ETB 4,400",
      desc: "A focus and energy boost before demanding sessions without needing to leave the gym.",
      tag: "Before Training",
      img: ""
    }
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

const hasTelegramConfig = () => Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
const saveSubmission = async (entry) => {
  submissions.unshift(entry);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
};

const saveMembers = async () => {
  await fs.writeFile(MEMBERS_FILE, JSON.stringify(members, null, 2));
};

const getMemberPublic = (member) => {
  if (!member) return null;
  return {
    id: member.id,
    email: member.email,
    fullName: member.fullName || "",
    phone: member.phone || "",
    membership: member.membership || null,
    createdAt: member.createdAt || null
  };
};

const syncMemberMembershipFromSubmission = (member, submission) => {
  if (!member || !submission || submission.type !== "membership") return;
  member.fullName = submission.fullName || member.fullName || "";
  member.phone = submission.phone || member.phone || "";
  member.membership = {
    submissionId: submission.id,
    fullName: submission.fullName || member.fullName || "",
    email: submission.email || member.email,
    phone: submission.phone || member.phone || "",
    plan: submission.plan || "",
    membershipType: submission.membershipType || "",
    startDate: submission.startDate || "",
    paymentMethod: submission.paymentMethod || "",
    paymentReference: submission.paymentReference || "",
    referralCode: submission.referralCode || "",
    referralPercent: Number(submission.referralDiscountPercent || 0) || 0,
    calculatedPrice: submission.calculatedPrice || "",
    status: submission.status || "pending",
    notes: submission.notes || "",
    createdAt: submission.createdAt || new Date().toISOString()
  };
};

const requireMember = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  const memberId = token ? memberTokens.get(token) : "";
  const member = memberId ? members.find((item) => item.id === memberId) : null;
  if (!token || !member) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  req.member = member;
  req.memberToken = token;
  return next();
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

app.get(["/shop", "/shop.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "shop.html"));
});

app.get(["/machines", "/machines.html"], (req, res) => {
  res.sendFile(path.join(__dirname, "public", "machines.html"));
});

app.get(["/programs", "/programs.html"], (req, res) => {
  res.redirect(302, "/");
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
    if (hasTelegramConfig()) {
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

app.post("/api/shop-order", async (req, res) => {
  try {
    const payload = req.body || {};
    const fullName = String(payload.fullName || "").trim();
    const phone = String(payload.phone || "").trim();
    const notes = String(payload.notes || "").trim();
    const items = Array.isArray(payload.items) ? payload.items.filter((item) => item?.name) : [];

    if (!fullName || !phone) {
      return res.status(400).json({ ok: false, error: "Missing full name or phone" });
    }
    if (!items.length) {
      return res.status(400).json({ ok: false, error: "Please select at least one item" });
    }

    const itemLines = items.map((item) => {
      const qty = Math.max(1, Number(item.quantity) || 1);
      return `${item.name} x${qty}${item.price ? ` (${item.price})` : ""}`;
    });

    if (hasTelegramConfig()) {
      const message = [
        "New shop order",
        "Name: " + fullName,
        "Phone: " + phone,
        "Items:",
        ...itemLines.map((line) => "- " + line),
        "Notes: " + (notes || "N/A"),
        "Submitted: " + new Date().toISOString()
      ].join("\n");

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
    }

    await saveSubmission({
      id: crypto.randomUUID(),
      type: "shop",
      fullName,
      phone,
      items,
      notes,
      createdAt: new Date().toISOString()
    });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/member/signup", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const fullName = String(req.body?.fullName || "").trim();
    const phone = String(req.body?.phone || "").trim();
    if (!email || !password || !fullName) {
      return res.status(400).json({ ok: false, error: "Full name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, error: "Password must be at least 6 characters" });
    }
    if (members.some((item) => item.email === email)) {
      return res.status(409).json({ ok: false, error: "An account already exists for this email" });
    }
    const passwordAuth = hashPassword(password);
    const member = {
      id: crypto.randomUUID(),
      email,
      fullName,
      phone,
      passwordSalt: passwordAuth.salt,
      passwordHash: passwordAuth.hash,
      membership: null,
      createdAt: new Date().toISOString()
    };
    const previousMembership = submissions.find((item) => item.type === "membership" && normalizeEmail(item.email) === email);
    if (previousMembership) {
      previousMembership.memberId = member.id;
      syncMemberMembershipFromSubmission(member, previousMembership);
      await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
    }
    members.unshift(member);
    await saveMembers();
    const token = crypto.randomBytes(24).toString("hex");
    memberTokens.set(token, member.id);
    return res.json({ ok: true, token, member: getMemberPublic(member) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/member/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = String(req.body?.password || "");
    const member = members.find((item) => item.email === email);
    const auth = member ? { salt: member.passwordSalt, hash: member.passwordHash } : null;
    if (!member || !verifyPassword(password, auth)) {
      return res.status(401).json({ ok: false, error: "Invalid email or password" });
    }
    if (!member.membership) {
      const previousMembership = submissions.find((item) => item.type === "membership" && normalizeEmail(item.email) === email);
      if (previousMembership) {
        previousMembership.memberId = member.id;
        syncMemberMembershipFromSubmission(member, previousMembership);
        await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
        await saveMembers();
      }
    }
    const token = crypto.randomBytes(24).toString("hex");
    memberTokens.set(token, member.id);
    return res.json({ ok: true, token, member: getMemberPublic(member) });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});

app.post("/api/member/logout", requireMember, (req, res) => {
  memberTokens.delete(req.memberToken);
  return res.json({ ok: true });
});

app.get("/api/member/me", requireMember, async (req, res) => {
  const latestMembership = submissions.find((item) => item.type === "membership" && (item.memberId === req.member.id || normalizeEmail(item.email) === req.member.email));
  if (latestMembership) {
    latestMembership.memberId = req.member.id;
    syncMemberMembershipFromSubmission(req.member, latestMembership);
    await saveMembers();
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));
  }
  return res.json({ ok: true, member: getMemberPublic(req.member) });
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
  if (submissions[idx].type === "membership" && submissions[idx].memberId) {
    const member = members.find((item) => item.id === submissions[idx].memberId);
    if (member) {
      syncMemberMembershipFromSubmission(member, submissions[idx]);
      await saveMembers();
    }
  }
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
    await fs.writeFile(PUBLIC_CONTENT_FILE, JSON.stringify(content, null, 2));
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
    const auth = req.headers.authorization || "";
    const memberToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const memberId = memberToken ? memberTokens.get(memberToken) : "";
    const member = memberId ? members.find((item) => item.id === memberId) : null;
    const normalizedEmail = normalizeEmail(payload.email);
    if (member) {
      if (member.email !== normalizedEmail) {
        return res.status(400).json({ ok: false, error: "Please use the same email as your member account" });
      }
      member.fullName = payload.fullName || member.fullName || "";
      member.phone = payload.phone || member.phone || "";
    }
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
      "Referral Code: " + (payload.referralCode || "N/A"),
      "Referral Discount: " + (payload.referralDiscountPercent ? payload.referralDiscountPercent + "%" : "N/A"),
      "Calculated Price: " + (payload.calculatedPrice || "N/A"),
      "Submitted: " + new Date().toISOString()
    ];

    if (hasTelegramConfig()) {
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
    }

    const submission = {
      id: crypto.randomUUID(),
      type: "membership",
      memberId: member?.id || "",
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
      paymentReference: payload.paymentReference || "",
      referralCode: payload.referralCode || "",
      referralDiscountPercent: payload.referralDiscountPercent || "",
      calculatedPrice: payload.calculatedPrice || "",
      status: "pending",
      notes: "",
      createdAt: new Date().toISOString()
    };
    await saveSubmission(submission);
    if (member) {
      syncMemberMembershipFromSubmission(member, submission);
      await saveMembers();
    }
    return res.json({ ok: true, membership: member ? member.membership : null });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const start = async () => {
  await ensureDataFile();
  await ensureMembersFile();
  await ensureContentFile();
  await ensureAdminFile();
  app.listen(PORT, () => {
    console.log(`Tenas Fitness running on http://localhost:${PORT}`);
  });
};

start();
