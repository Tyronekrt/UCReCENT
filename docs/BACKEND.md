# Backend — Django + DRF + PostgreSQL

Production API and content-management system for the Usao Community Library website.
The project team manages updates, gallery, partners and impact statistics in Django Admin —
no React changes needed. Core project facts (budget, dates, vision/mission) intentionally
stay in `frontend/lib/site.ts` as the verified static source of truth.

No `Event` model exists: the source material contains no events (the launch is a milestone,
covered by `Project.launch_date` and the timeline). If real events are later confirmed, add
an `Event` model following the `ProjectUpdate` pattern.

## Quick start (local, with Docker Postgres)

```bash
cd backend
cp .env.example .env            # edit POSTGRES_PASSWORD, SECRET_KEY, etc.
docker compose up -d db         # from repo root (see docker-compose.yml)
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_initial_content   # idempotent starter content from the Concept Note
python manage.py createsuperuser
python manage.py runserver      # http://127.0.0.1:8000/api/
```

Frontend integration: set `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` in `frontend/.env.local`.
Without it, the site renders identical verified static fallback content.

## Environment variables

See `.env.example` (never commit `.env`). Required in production: `SECRET_KEY`,
`POSTGRES_PASSWORD`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`. Email provider is fully
configurable: `EMAIL_BACKEND` (default console for dev), `EMAIL_HOST/PORT/USER/PASSWORD/TLS`,
`DEFAULT_FROM_EMAIL`, `NOTIFICATION_EMAIL` (+ `NOTIFICATION_EXTRA_EMAILS`) — notifications for
support requests and contact messages go here. Notification failures are logged, never shown
to visitors.

## Public API

| Method | Endpoint | Returns |
|---|---|---|
| GET | `/api/` | Endpoint index |
| GET | `/api/health/` | Service status |
| GET | `/api/project/` | Active project (404 when none) |
| GET | `/api/partners/` | Active partners, ordered (no admin fields) |
| GET | `/api/updates/` | Published updates, newest first |
| GET | `/api/updates/{slug}/` | One published update (404 for drafts/unknown) |
| GET | `/api/gallery/` | Active images, ordered |
| GET | `/api/impact/` | Active statistics, ordered |
| POST | `/api/support/` | Create support request → 201 |
| POST | `/api/contact/` | Create contact message → 201 |

Legacy V1 paths (`/api/enquiries/support/`, `/api/enquiries/contact/`, `/api/content/updates|partners|gallery/`)
are still served by the same views for already-deployed frontends.

POST endpoints: throttled (`submit` scope, 10/min), length-validated, with a `website`
honeypot field (real forms never send it; filled submissions are rejected 400). Public
serializers expose only safe fields — never `is_active`, workflow internals, or timestamps
beyond what the UI needs. Uploads (partner logos, covers, gallery): JPG/PNG/WebP only, 5 MB max.

## Admin (`/admin/`)

Login required for everything. `ProjectAdmin` (singleton convention: keep one active row),
`PartnerAdmin` (status filter, logo preview, ordering), `ProjectUpdateAdmin` (publish/unpublish
actions, slug prepopulation, date hierarchy), `GalleryImageAdmin` (thumbnail, category filter),
`ImpactStatisticAdmin` (inline ordering), `SupportRequestAdmin` / `ContactMessageAdmin`
(submission fields read-only, workflow actions: contacted → in progress → completed → closed).

## Tests

```bash
python manage.py test   # 38 tests: models, serializers, endpoints, validation,
                        # update slug/404 behavior, admin login boundary, legacy paths
```

PostgreSQL is the test database (no SQLite anywhere in this backend).
