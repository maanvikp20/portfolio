# Maanvik Poddar — Portfolio & Blog

Source code for my personal portfolio and CMS, featuring a dynamic blog, project showcase, and a secure admin workspace for managing content in real-time.

**Live:** [maanvikpoddar.vercel.app](https://maanvikpoddar.vercel.app)

---

## Features

- **Dynamic Blog Engine** — Multi-category publishing across Software Engineering, Electrical & Electronics, and Calculator Games, with full Markdown support.
- **Project Showcase** — Filterable grid of production-ready projects with links to source repositories and live deployments.
- **Admin Workspace** — Secure dashboard for full CRUD operations on all database records directly through the UI.
- **Media Pipelines** — Binary stream uploads piped directly to Cloudinary's CDN for all image assets.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database | MongoDB + Mongoose |
| Media | Cloudinary CDN |
| Styling | Tailwind CSS |

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the local deployment.

---

## Deployment

This project is configured for deployment on Vercel. Pushing to `main` automatically triggers a production build.

Before deploying, make sure to:

1. Mirror all `.env.local` keys in your Vercel project's environment variable settings.
2. Whitelist all incoming traffic in MongoDB Atlas network access (`0.0.0.0/0`).

# How to Add Things to the Portfolio

## Access the Website

You can access the portfolio locally or through the deployed site:

- Local: `http://localhost:3000`
- Production: `https://maanvikpoddar.vercel.app`

---

## Admin Login

To add or manage portfolio content, go to the admin login page:

- Local: `http://localhost:3000/admin/login`
- Production: `https://maanvikpoddar.vercel.app/admin/login`

---

## Steps to Add Portfolio Content

1. Open the admin login page.
2. Sign in with your admin credentials.
3. Navigate to the dashboard.
4. Add, edit, or remove portfolio items.
5. Save your changes to publish them to the site.

---

## Quick Links

```txt
Local:
http://localhost:3000/admin/login

Production:
https://maanvikpoddar.vercel.app/admin/login