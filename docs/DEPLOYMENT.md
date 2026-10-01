# Deployment guide — Usao Community Library V1

No deployment target has been specified, so this documents a recommended architecture.
Nothing below purchases or modifies domains — all DNS/domain steps need owner authorization.

## Recommended architecture

```text
                    HTTPS (see Domain)
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
  frontend: Next.js         backend: gunicorn + Django
  (Node 20, next start)     + PostgreSQL 16
  e.g. example.org          e.g. api.example.org
```

Any host that runs Node 20 (frontend) and Python 3.12 + Postgres 16 (backend) works —
VPS, Render/Fly.io-style PaaS, or similar. Frontend and API may live on one machine
for V1; split when traffic grows.

## Production environment

Frontend (`frontend/.env.local` or host env — all `NEXT_PUBLIC_*` are baked in at build time,
so rebuild after changing them):

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://example.org` (real domain, required) |
| `NEXT_PUBLIC_API_URL` | `https://api.example.org` (omit only to serve static fallback) |

Backend (`backend/.env`, never committed):

| Variable | Notes |
|---|---|
| `SECRET_KEY` | Long random value; app refuses to start in production without it |
| `DEBUG` | `False` in production (default is `False`) |
| `ALLOWED_HOSTS` | `api.example.org` (comma-separated) |
| `POSTGRES_DB/USER/PASSWORD/HOST/PORT` | Production database credentials |
| `CORS_ALLOWED_ORIGINS` | `https://example.org` |
| `CSRF_TRUSTED_ORIGINS` | `https://api.example.org` |
| `EMAIL_BACKEND` | `django.core.mail.backends.smtp.EmailBackend` |
| `EMAIL_HOST/PORT/USER/PASSWORD/TLS` | SMTP provider credentials |
| `DEFAULT_FROM_EMAIL` | `noreply@example.org` |
| `NOTIFICATION_EMAIL` | Team inbox for support/contact notifications |
| `SECURE_SSL_REDIRECT` | `True` (behind HTTPS; set `SECURE_HSTS_SECONDS` as needed) |

Assumptions: HTTPS is terminated at the host/proxy (Django `SECURE_SSL_REDIRECT=True`
expects it); secure cookies are automatic when `DEBUG=False`; media is served from
`backend/media/` (map a persistent volume; serve via the proxy or object storage later).

## Deploy steps

```bash
# Backend
pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py seed_initial_content   # first deploy only (idempotent)
python backend/manage.py createsuperuser
python backend/manage.py check --deploy          # Django production checks
gunicorn config.wsgi --chdir backend --bind 127.0.0.1:8000 --workers 3

# Frontend
cd frontend && npm ci && npm run build && npm run start -- -p 3000
```

Run `manage.py check --deploy` on every deploy; keep `makemigrations --check` in CI.

## Backups

- **PostgreSQL** (daily, tested restores, off-site copy):
  `pg_dump -Fc -h $POSTGRES_HOST -U $POSTGRES_USER $POSTGRES_DB > usao_$(date +%F).dump`
  Restore drill monthly: `pg_restore -d usao_restore_test`. Retain 30 daily + 12 monthly copies.
- **Media** (`backend/media/` — uploaded covers/logos/gallery): snapshot with the same
  schedule as the database (volume snapshot or `rsync -a` to backup storage). Database
  without media (or vice versa) is an incomplete restore — back them up together.
- **Secrets** (`.env` files, SMTP credentials): store in the host's secret manager (or an
  encrypted offline copy held by two trustees). Never in Git, chat logs, or screenshots.
  Rotation: on staff change or suspected leak, rotate `SECRET_KEY` (invalidates sessions),
  DB password, and SMTP credentials, then redeploy.

## Domain & DNS (requires owner authorization — do not change without approval)

| Host | Purpose | DNS |
|---|---|---|
| `example.org` (apex) + `www` | Frontend | A/AAAA to frontend host (or CNAME `www`) |
| `api.example.org` | Django API + admin | A/AAAA to backend host |
| — | Email | SPF/DKIM/DMARC for the SMTP sender domain |

HTTPS everywhere (CA certificates via the host/proxy, auto-renew). After DNS cutover, set
`NEXT_PUBLIC_SITE_URL`, `ALLOWED_HOSTS`, `CORS/CSRF` origins to the real domains and rebuild.

## Analytics (opt-in integration point)

No tracking ships by default. If the owner approves privacy-respecting analytics later:

1. Frontend: add the provider's script in `frontend/app/layout.tsx` (or a `components/Analytics.tsx`
   client component gated on an explicit opt-in flag, e.g. `NEXT_PUBLIC_ANALYTICS_ID` — when
   unset, nothing loads). Prefer cookie-less, EU-hosted, or self-hosted options; document the
   choice in the site's contact/privacy note.
2. Backend: no change needed (server logs already give aggregate counts without cookies).
3. Never add: cross-site ad trackers, fingerprinting, or session-replay tooling.
