# Maanvik Poddar — Portfolio & Blog

Source code for my personal portfolio and blog, with a private admin dashboard for managing everything without touching code.

**Live:** [maanvikpoddar.vercel.app](https://maanvikpoddar.vercel.app)

---

## Features

- **Blog** — Markdown articles in Software, Electronics and Calculator Games, with drafts and cover images.
- **Projects** — A page per project (Markdown write-up, status, source and live-demo links), grouped by category.
- **Experience, skills and certifications** — Managed from the dashboard and shown on the portfolio page.
- **Admin dashboard** — Password-protected create / edit / delete for all content, with image uploads to Cloudinary.
- **Contact form** — Sends messages to my inbox through Resend, with rate limiting.
- **SEO and sharing** — Per-page titles and descriptions, Open Graph / Twitter images, sitemap, robots.txt and structured data.
- **Accessible by default** — Light and dark themes, keyboard-friendly menu, labelled forms, reduced-motion support.

---

## Tech Stack

| Layer     | Technology                        |
| --------- | --------------------------------- |
| Framework | Next.js 16 (App Router), React 19 |
| Database  | MongoDB + Mongoose                |
| Media     | Cloudinary                        |
| Email     | Resend                            |
| Styling   | Tailwind CSS v4, Framer Motion    |
| Hosting   | Vercel                            |

---

## Local Development

Requires Node.js 20.9 or newer.

```bash
git clone https://github.com/maanvikp20/portfolio.git
cd portfolio
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Variable                                                               | Required             | What it's for                                                                |
| ---------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------- |
| `MONGODB_URI`                                                          | yes                  | MongoDB connection string                                                    |
| `JWT_SECRET`                                                           | yes                  | Signs the admin login cookie. 16+ random characters (`openssl rand -hex 32`) |
| `RESEND_API_KEY`                                                       | for the contact form | Resend API key                                                               |
| `CONTACT_TO_EMAIL`                                                     | for the contact form | Inbox that receives messages                                                 |
| `CONTACT_FROM_EMAIL`                                                   | no                   | Sender on a domain verified in Resend (defaults to Resend's sandbox sender)  |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for image uploads    | Cloudinary credentials                                                       |
| `NEXT_PUBLIC_SITE_URL`                                                 | no                   | Live URL used in the sitemap and share links                                 |

### Create the admin account

There is no sign-up page. Create the account once from the command line:

```bash
ADMIN_PASSWORD='a-long-password' npm run create-admin -- you@example.com "Your Name"
```

Running it again for the same email resets that account's password.

### Scripts

| Command                       | What it does                        |
| ----------------------------- | ----------------------------------- |
| `npm run dev`                 | Start the dev server                |
| `npm run build` / `npm start` | Production build / serve it         |
| `npm run lint`                | ESLint                              |
| `npm test`                    | Unit tests for the helper functions |

---

## Managing content

1. Go to `/admin/login` and sign in.
2. Pick a section (Articles, Projects, Skills, Certifications, Experience).
3. Add, edit or delete items. Changes appear on the site immediately.

Add your résumé by placing a PDF at `public/resume.pdf`. Social links are set in `src/lib/socials.js` (empty ones are hidden).

---

## How it works

- Public pages read content through a cache (`src/lib/publicData.js`). Every save or delete in the dashboard clears it (`src/lib/cache.js`), so visitors see changes right away without hitting the database on every page view. As a safety net, the cache also expires after an hour.
- Admin API routes check a signed, HTTP-only cookie. Login is rate limited and constant-time.
- Security headers and a Content-Security-Policy are set in `next.config.ts`.

---

## Deployment

The project deploys on Vercel; pushing to `main` triggers a production build, and GitHub Actions runs lint, tests and a build on every push and pull request.

Before the first deploy:

1. Add every variable above to the Vercel project's environment settings.
2. Allow Vercel to reach MongoDB Atlas (Network Access → allow `0.0.0.0/0`, or use the Atlas–Vercel integration).
3. Verify a sending domain in Resend and set `CONTACT_FROM_EMAIL`.
4. Add Vercel Firewall rate-limit rules for `/api/auth/login` and `/api/contact` (the built-in limiter is per server instance, so this is the real protection).

---

## License

Code is released under the [MIT License](LICENSE). The written content, photos and résumé are © Maanvik Poddar, all rights reserved.
