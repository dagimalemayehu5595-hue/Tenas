# Deploy Tenas Gym to Plesk

Target domain: `tenasgymandspa.com.et`

## Required Hosting Capability

The Plesk panel must show **Node.js** for this domain. This website uses an
Express backend for member accounts, the dashboard, uploads, admin tools, and
forms. PHP/MySQL hosting alone cannot run those features.

If Node.js is not shown in Plesk, ask Ethio Telecom to enable the Plesk Node.js
extension for the subscription or move the domain to a Node.js-capable VPS.

## Build the Upload Package

From the project directory:

```powershell
npm run check
npm run prepare:plesk
```

Upload `deploy/tenas-plesk.zip`. The package intentionally contains empty
`members.json` and `submissions.json` files and excludes `.env`.

## Plesk Setup

1. Open **Plesk Control Panel** and select `tenasgymandspa.com.et`.
2. Open **Files** and upload/extract `tenas-plesk.zip` into the application
   directory. Using `httpdocs` is acceptable when Plesk manages Node.js.
3. Open **Node.js** and configure:
   - Node.js version: `18` or newer
   - Document root: `/public`
   - Application root: the folder containing `server.js`
   - Application startup file: `app.cjs`
   - Application mode: `production`
4. Click **NPM Install**.
5. Add the environment variables listed below.
6. Click **Restart App**.
7. Open `https://tenasgymandspa.com.et/api/health`. It should return JSON with
   `"ok": true`.

Do not manually set `PORT` in Plesk unless its Node.js screen requires it.
Plesk normally supplies the application port automatically.

## Environment Variables

Generate unique private values. Do not reuse the examples:

```env
NODE_ENV=production
FORCE_HTTPS=true
DATA_DIR=data
UPLOAD_DIR=public/uploads

ADMIN_PASSWORD=use-a-unique-password-with-at-least-12-characters
ADMIN_EMAIL=your-real-admin-email@example.com
OTP_SECRET=use-a-random-secret-with-at-least-32-characters

SMTP_HOST=your-mail-server
SMTP_PORT=587
SMTP_USER=your-mail-user
SMTP_PASS=your-mail-password
SMTP_SECURE=false
SMTP_FROM=no-reply@tenasgymandspa.com.et

TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
```

SMTP and Telegram are optional, but admin password-reset email requires SMTP.

## Permissions and Persistence

The Node.js application user needs write permission for:

- `data/`
- `public/uploads/`

Back up those folders regularly. They contain member accounts, form
submissions, admin settings, edited site content, and uploaded images.

Do not configure more than one application instance while JSON storage is in
use. A future MySQL migration is recommended before horizontal scaling.

## Domain and SSL

The screenshot shows the domain already using Ethio Telecom nameservers, but
SSL is not installed.

1. In Plesk, open **SSL/TLS Certificates** or **Let's Encrypt**.
2. Issue a certificate for:
   - `tenasgymandspa.com.et`
   - `www.tenasgymandspa.com.et`
3. Enable **Redirect from HTTP to HTTPS** and certificate renewal.
4. Keep `FORCE_HTTPS=true` after the certificate is active.

If certificate issuance fails, confirm both domain records point to the hosting
server and wait for DNS propagation before retrying.

## Final Checks

- `/api/health` returns HTTP 200.
- A new member account opens the membership form.
- The new account dashboard has no membership or activity before submission.
- Membership submission appears in admin.
- Admin can update status and the member dashboard reflects it.
- Image upload works and remains available after an app restart.
- Password-reset email works when SMTP is configured.
- Both HTTP and `www` redirect to the HTTPS primary domain.
