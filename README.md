# Tradition Maps — Χαρτογράφηση Ελληνικής Παράδοσης

An interactive web application for digitally mapping the musical and cultural traditions of Greece. Developed as part of an MSc thesis by **Χαράλαμπος Παυλόπουλος**.

The app lets anyone explore Greek regional traditions through an interactive map, rich place pages, and a full admin panel for managing content.

---

## Features

- **Interactive map** (Leaflet.js) with marker clustering, category filters, search, and a "locate me" button. Cluster bubbles are coloured by the dominant tradition category they contain. Filtering auto-fits the map to visible markers.
- **Place pages** with a mini-map belt, tradition cards, multi-image galleries, a full-screen lightbox, collapsible detailed descriptions, and links to YouTube / Google / Visit Greece.
- **Info page** with sortable place cards (alphabetical, by region, by tradition count) and live search.
- **About page** with live stats (total places, total traditions, per-category breakdown) fetched from the API.
- **Admin panel** (React SPA at `/admin`) with JWT authentication, full CRUD for places and traditions, a rich text editor (Quill), multi-image upload with server-side resizing to WebP, and inline confirm dialogs.
- Uploaded images are resized to max 1200 px width and converted to WebP via **sharp**.
- Server-side input validation with **express-validator**.
- Custom 404 / 500 error pages in Greek.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js + Express + EJS |
| Database | PostgreSQL 16 + Sequelize 6 |
| Map | Leaflet.js 1.9.4 + Leaflet.markercluster |
| Admin UI | React 18 + Vite 5 + Bootstrap 5 |
| Rich text | Quill 2 |
| Image processing | multer + sharp |
| Auth | JWT (jsonwebtoken) |
| Containerisation | Docker + Docker Compose |

---

## Project Structure

```
tradition_maps/
├── backend/
│   ├── models/          # Sequelize models (Place, Tradition)
│   ├── routes/          # Express routes (api, auth, upload, pages)
│   ├── middleware/      # JWT auth middleware
│   ├── views/           # EJS templates (pages + partials)
│   ├── public/          # Static assets + uploaded images
│   ├── seed.js          # Database seeder
│   └── server.js        # Entry point
├── admin/               # React admin SPA (Vite)
│   └── src/
│       ├── pages/       # Dashboard, Places, PlaceDetail
│       └── components/  # PlaceForm, TraditionForm, RichTextEditor, …
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## Running with Docker (recommended)

**1. Copy the environment file and fill in your secrets:**

```bash
cp .env.example .env
```

Key variables in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret for signing admin tokens |
| `ADMIN_USER` | Admin login username |
| `ADMIN_PASS` | Admin login password |
| `PORT` | App port (default `3000`) |

**2. Build and start:**

```bash
docker compose up --build
```

The app is available at [http://localhost:3000](http://localhost:3000).  
The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

**3. (Optional) Seed the database with sample Greek regions:**

```bash
docker compose exec app node seed.js
```

This creates 6 places (Κρήτη, Κυκλάδες, Επτάνησα, Πελοπόννησος, Ήπειρος, Μακεδονία) each with one tradition. **Warning:** this runs `sync({ force: true })` and wipes existing data.

---

## Running locally (without Docker)

You need Node.js 20+ and a running PostgreSQL instance.

```bash
# Backend
cd backend
npm install
# Set DATABASE_URL, JWT_SECRET, ADMIN_USER, ADMIN_PASS in your environment
node server.js

# Admin (separate terminal, for development)
cd admin
npm install
npm run dev   # Vite dev server with proxy to backend on :3000
```

---

## Data Model

```
Place
  id, name, description, region, latitude, longitude, image, timestamps

Tradition  (belongs to Place)
  id, name, description, detailedDescription, category, image,
  images (JSONB array), youtube, google, visitgreece, placeId, timestamps
```

Tradition categories: `festival`, `museum`, `church`, `music`, `dance`, `food`, `custom`.

---

## Uploading Images

Images are uploaded via the admin panel. The server accepts any common image format, resizes it to a maximum of 1200 px wide, and converts it to WebP (quality 82). Files are stored under `backend/public/uploads/` and persisted across rebuilds via a Docker named volume (`uploads_data`).

---

## Deployment notes

- Run `docker compose up --build` whenever you change backend or admin source files.
- Uploaded images survive rebuilds because they live in the `uploads_data` Docker volume.
- Database data persists in the `postgres_data` volume.
- To wipe everything and start fresh: `docker compose down -v`.
