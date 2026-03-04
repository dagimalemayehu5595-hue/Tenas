# Tenas Fitness Web Platform

Modern gym website and lightweight admin system for handling memberships, tour bookings, and content updates.

## Live Project
- GitHub Repo: https://github.com/dagimalemayehu5595-hue/Tenas
- Demo: https://dagimalemayehu5595-hue.github.io/Tenas/

## Screenshots
![Home](public/images/screenshots/home.jpeg)
![Machines](public/images/screenshots/machines.png)
![Coaches](public/images/screenshots/coaches.png)
![Membership](public/images/screenshots/membership.png)

## Overview
Tenas Fitness is a full-stack web project built for a gym business. It includes a public-facing website, membership registration flow with file uploads, tour booking, and an admin dashboard for reviewing submissions and updating site content.

## Key Features
- Multi-page gym website: Home, Coaches, Machines, Programs, Membership, and Tour pages.
- Membership form with required validation and image upload support.
- Tour booking form with instant notification flow.
- Admin login and token-based protected admin API routes.
- Admin password reset flow with OTP verification.
- Editable dynamic content served via API.
- Submission tracking with update/delete actions.
- Media upload endpoint for admin content management.

## Tech Stack
- Backend: Node.js, Express
- Frontend: HTML/CSS, React (CDN + Babel in browser)
- File handling: Multer
- Email: Nodemailer (OTP reset)
- Notifications: Telegram Bot API
- Data storage: JSON files (`/data`)

## Project Structure
```text
.
|- public/                # UI pages, scripts, styles, images, uploads
|- data/                  # JSON data store (content + submissions + admin auth)
|- server.js              # Express server + API routes
|- package.json
`- .gitignore
```

## Getting Started
### 1. Clone
```bash
git clone https://github.com/dagimalemayehu5595-hue/Tenas.git
cd Tenas
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
PORT=3001
ADMIN_PASSWORD=your_strong_admin_password
ADMIN_EMAIL=your_admin_email@example.com
OTP_SECRET=replace_with_long_random_secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_SECURE=false
SMTP_FROM=no-reply@tenasgym.com

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### 4. Run locally
```bash
npm run dev
```
Open `http://localhost:3001`

## API Highlights
- Public
  - `POST /api/membership`
  - `POST /api/tour`
  - `GET /api/content`
  - `GET /api/stats`
- Admin (requires Bearer token)
  - `POST /api/admin/login`
  - `POST /api/admin/logout`
  - `POST /api/admin/forgot`
  - `POST /api/admin/reset`
  - `POST /api/admin/password`
  - `GET /api/admin/stats`
  - `GET /api/admin/submissions`
  - `PATCH /api/admin/submissions/:id`
  - `DELETE /api/admin/submissions/:id`
  - `GET /api/admin/content`
  - `PUT /api/admin/content`
  - `POST /api/admin/upload`

## Portfolio Notes
If you are showcasing this project in your portfolio, highlight:
- Real business use case (gym operations + member onboarding)
- Full-stack integration (frontend + backend + external APIs)
- Admin security workflow (auth + OTP reset)
- File upload and data handling

## Security Note
Before production use:
- Move all sensitive values to environment variables.
- Rotate exposed secrets/tokens if they were committed before.
- Add rate limiting and stronger session/token handling.

## Author
Dagim Alemayehu
- GitHub: https://github.com/dagimalemayehu5595-hue
- Email: dagimalemayehu5595@gmail.com
