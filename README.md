# Usao Community Library — Version 1 Website

Community-owned library initiative in **Usao Sublocation, Mbita East Division, Mbita Constituency,
Homa Bay County, Kenya**. Tagline: **Read · Learn · Grow · Succeed** (brand: UCReCENT).

V1 is an **information, awareness, fundraising/support and community-engagement platform**.
It is NOT a library-management system: no borrowing, member accounts, online reading, or payments.

## Architecture

```text
Next.js 14 frontend (App Router, TypeScript, Tailwind)
        │  reads (ISR, 5-min revalidate; static fallback when API is absent)
        ▼
Django 5 + DRF API  ──►  PostgreSQL 16
        ▲
Django Admin (team manages updates, gallery, partners, impact stats, enquiries)
```

- `frontend/` — public website (9 content pages + `/support` + update detail pages + 404)
- `backend/` — REST API + admin (`apps/content`, `apps/enquiries`)
- `docs/` — `BACKEND.md` (API reference), `CONTENT_MODEL.md` (fact→source table),
  `VERIFICATION_NEEDED.md` (owner confirmations before launch)
- Root `.docx` files + `WhatsApp .../` photos — primary source material, preserved as-is

## Single source of truth

- Rarely-changing facts (budget, dates, vision/mission, partners baseline) live in
  **`frontend/lib/site.ts`** — never hardcode them in components.
- Managed content (updates, gallery, partners, impact stats) comes from the API when
  `NEXT_PUBLIC_API_URL` is set, with identical static fallback otherwise (`frontend/lib/content.ts`).

## Prerequisites

- Node.js 20+ and npm · Python 3.12+ · PostgreSQL 16 (or `docker compose up -d db`)

## Environment setup

```bash
cp frontend/.env.example frontend/.env.local   # NEXT_PUBLIC_SITE_URL is required;
                                               # set NEXT_PUBLIC_API_URL when backend is deployed
cp backend/.env.example backend/.env           # SECRET_KEY, POSTGRES_*, email, CORS origins
```

Never commit `.env` files. Production requires real values for `SECRET_KEY`,
`POSTGRES_PASSWORD`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and SMTP credentials.
The frontend falls back to `https://usaolibrary.example.org` — set the real domain via
`NEXT_PUBLIC_SITE_URL` before launch.

## Frontend startup / build

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
npm run typecheck && npm run lint && npm run build
npm run start        # serve the production build
```

## Backend startup / database

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_initial_content   # idempotent starter content from the Concept Note
python manage.py createsuperuser        # admin at /admin/
python manage.py runserver              # http://127.0.0.1:8000/api/
```

PostgreSQL is the only supported database (no SQLite). Test DB is created automatically.

## Testing

```bash
cd frontend && npm run typecheck && npm run lint && npm run build
cd ../backend && python manage.py check && python manage.py test   # 38 tests
```

## Deployment

- Frontend: any Node host (`npm run build && npm run start`) with `NEXT_PUBLIC_SITE_URL`
  and `NEXT_PUBLIC_API_URL` set; security headers ship in `next.config.mjs`.
- Backend: gunicorn + PostgreSQL, `DEBUG=False`, `SECURE_SSL_REDIRECT=True`,
  `ALLOWED_HOSTS` set to the API domain, CORS origins set to the frontend domain,
  SMTP configured, `NOTIFICATION_EMAIL` set to the team's inbox.
- Media: serve `MEDIA_ROOT` (`backend/media/`) for uploaded covers/logos/gallery images.

## Admin access / media handling

Create staff via `createsuperuser`; manage all content at `/admin/` (publish/unpublish
updates, partner statuses, gallery, impact stats, enquiry workflow). Uploads: JPG/PNG/WebP
≤ 5 MB, validated server-side. Use only supplied/approved logos and verified website URLs.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Frontend shows fallback content, not CMS content | Set `NEXT_PUBLIC_API_URL`; check backend is reachable; API failures always fall back silently |
| `SECRET_KEY must be set` | Set `SECRET_KEY` in `backend/.env` (any non-empty value works with `DEBUG=True` for local dev) |
| DB connection refused | Start Postgres (`docker compose up -d db`); check `POSTGRES_*` |
| Form submissions fail | Check `CORS_ALLOWED_ORIGINS` includes the site origin; check notification email config |
| Pillow errors | `pip install -r requirements.txt` (Pillow is required for `ImageField`) |

## Content rules (binding)

- Never invent payment numbers, M-Pesa Paybill/Till, bank details, social accounts, statistics, donor names, testimonials, or construction progress.
- No public payment details are published. The site uses a **Support enquiry flow** (`/support`).
- Partners page must keep the distinction: **confirmed** vs **strategic/named collaborators**
  vs **organisations being engaged** vs **individual champions** (roles to verify).
- Planned launch date **7 October 2026** is always labelled *planned / subject to readiness*.
