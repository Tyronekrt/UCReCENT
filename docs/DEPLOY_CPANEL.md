# Auto-deploy to cPanel VPS — UCReCENT (frontend + backend)

Every **push or merge to `main`** redeploys automatically via GitHub Actions → SSH → `scripts/cpanel-deploy.sh`.

## 0. What this does (and does NOT touch)

**Touches ONLY (isolated):**

| Item | Path / name |
|---|---|
| Repo clone | `~/ucrecent` (`main` branch only) |
| Backend app | `~/ucrecent/backend` + venv `~/virtualenv/ucrecent-api` |
| Frontend app | `~/ucrecent/frontend` + venv `~/nodevenv/ucrecent-frontend` |
| Backups | `~/ucrecent-backups/` |
| Database | `ucrecent_prod` (new, dedicated PostgreSQL DB + user) |
| Domains | Your addon domain (e.g. `ucrecent.org`) + `api.ucrecent.org` subdomain only |
| Restarts | `touch tmp/restart.txt` on the two apps only (Passenger soft restart) |

**NEVER touches:**

- Any other domain's document root (`~/public_html/*`, other addon domains)
- Other databases / DB users
- Apache global config, other vhosts, `.htaccess` of other sites
- No `httpd restart`, no WHM global changes during deploys
- No `SECRET_KEY`, SMTP, or DB passwords (stay in `backend/.env` on server, never in git)

If a deploy fails, the previous build keeps serving (we `migrate` before `restart`, and abort on `manage.py check --deploy` failure).

---

## 1. One-time server setup (do once, ~30 min)

Do these as the **cPanel account user** (not root), except WHM Postgres install.

### 1.1 SSH key for GitHub Actions (no passwords in GitHub)

```bash
# On your laptop:
ssh-keygen -t ed25519 -f ~/.ssh/ucrecent-deploy -C "github-ucrecent-deploy" -N ""
cat ~/.ssh/ucrecent-deploy.pub   # copy this
```

In cPanel → **SSH Access → Manage SSH Keys → Import Key** (paste `.pub`), then **Authorize**.
Test from laptop:

```bash
ssh -i ~/.ssh/ucrecent-deploy -p 22 CPANEL_USER@CPANEL_HOST "whoami; pwd"
```

Keep the **private** key (`~/.ssh/ucrecent-deploy`, no `.pub`) — it becomes the `CPANEL_SSH_KEY` GitHub secret. Never commit it (`*.pem` is gitignored).

> Note the exact `CPANEL_HOST` (server hostname), `CPANEL_USER`, and SSH `PORT` (usually 22, some hosts use 21098). You need these for secrets.

### 1.2 PostgreSQL 16 + DB (VPS/WHM only)

On a VPS you can install Postgres once (root/WHM):

```bash
# As root on the VPS (via WHM Terminal or sudo):
dnf install -y postgresql16-server postgresql16  # AlmaLinux/RHEL; use apt on Ubuntu
/usr/pgsql-16/bin/postgresql-16-setup initdb
systemctl enable --now postgresql-16
```

Then as the cPanel user (or postgres superuser), create an isolated DB:

```bash
sudo -u postgres psql -c "CREATE USER ucrecent_prod WITH PASSWORD 'GENERATE-LONG-RANDOM';"
sudo -u postgres psql -c "CREATE DATABASE ucrecent_prod OWNER ucrecent_prod;"
```

Record `POSTGRES_DB=ucrecent_prod`, `POSTGRES_USER=ucrecent_prod`, password, `HOST=127.0.0.1`, `PORT=5432`. These go into `~/ucrecent/backend/.env` only.

### 1.3 Clone the repo (isolated dir)

```bash
ssh CPANEL_USER@CPANEL_HOST
mkdir -p ~/ucrecent-backups
git clone -b main https://github.com/Tyronekrt/UCReCENT.git ~/ucrecent
cd ~/ucrecent && git rev-parse --abbrev-ref HEAD  # must print "main"
chmod +x scripts/cpanel-deploy.sh
```

> Already-added addon domain: confirm its **Document Root** in cPanel → **Addon Domains**. Example: `ucrecent.org → ~/public_html/ucrecent.org`. Do NOT change it yet — we wire Node/Python apps to it in 1.5/1.6. Do not edit any other domain's root.

### 1.4 Backend `.env` (on server only, never commit)

```bash
cp ~/ucrecent/backend/.env.example ~/ucrecent/backend/.env
nano ~/ucrecent/backend/.env
```

Set real values:

```
SECRET_KEY=<openssl rand -hex 32>
DEBUG=False
ALLOWED_HOSTS=api.<your-domain>
FRONTEND_URL=https://<your-domain>
POSTGRES_DB=ucrecent_prod
POSTGRES_USER=ucrecent_prod
POSTGRES_PASSWORD=<from 1.2>
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
CORS_ALLOWED_ORIGINS=https://<your-domain>
CSRF_TRUSTED_ORIGINS=https://api.<your-domain>
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
... SMTP ...
DEFAULT_FROM_EMAIL=noreply@<your-domain>
NOTIFICATION_EMAIL=<team inbox>
SECURE_SSL_REDIRECT=True
```

### 1.5 Backend app: cPanel → Setup Python App

- **Python version:** 3.12 (or highest available)
- **Application root:** `ucrecent/backend`
- **Application URL:** `https://api.<your-domain>` (create subdomain `api` for the addon domain first in cPanel → Subdomains)
- **Application startup file:** `passenger_wsgi.py` (provided in `deploy/cpanel/`)
- **Application Entry point:** `application`
- Click **Create**, then open the app's virtualenv path (usually `~/virtualenv/ucrecent-api`) — the deploy script auto-detects `~/virtualenv/ucrecent-api/bin/activate`.

First manual run (proves DB + env work before automation):

```bash
source ~/virtualenv/ucrecent-api/bin/activate
pip install -r ~/ucrecent/backend/requirements.txt
python ~/ucrecent/backend/manage.py check --deploy
python ~/ucrecent/backend/manage.py migrate
python ~/ucrecent/backend/manage.py seed_initial_content
python ~/ucrecent/backend/manage.py createsuperuser
```

### 1.6 Frontend app: cPanel → Setup Node.js App

- **Node version:** 20.x
- **Application root:** `ucrecent/frontend`
- **Application URL:** `https://<your-domain>` (the addon domain)
- **Application startup file:** `app.js` (wrapper in `deploy/cpanel/frontend-app.js`; deploy script copies it on first run — or copy manually: `cp ~/ucrecent/deploy/cpanel/frontend-app.js ~/ucrecent/frontend/app.js`)
- **Environment variables** in the Node app UI:
  - `NEXT_PUBLIC_SITE_URL=https://<your-domain>`
  - `NEXT_PUBLIC_API_URL=https://api.<your-domain>`
- `npm install` happens automatically on deploy (`npm ci` + `npm run build`).

First manual build test:

```bash
source ~/nodevenv/ucrecent-frontend/bin/activate  # path shown in Node app UI
cd ~/ucrecent/frontend && npm ci && npm run build
```

### 1.7 SSL (cPanel AutoSSL)

cPanel → **SSL/TLS Status** → run AutoSSL for `<your-domain>` + `api.<your-domain>`. Verify `https://<domain>` and `https://api.<domain>/api/health/` respond (API health returns `{"status":"ok",...}`).

---

## 2. GitHub Secrets (enables auto-deploy)

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
|---|---|
| `CPANEL_HOST` | server hostname (e.g. `server123.host.com`) |
| `CPANEL_USER` | cPanel username |
| `CPANEL_PORT` | `22` (or your host's SSH port) |
| `CPANEL_SSH_KEY` | full private key from 1.1 (including `-----BEGIN...`) |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-domain>` |
| `NEXT_PUBLIC_API_URL` | `https://api.<your-domain>` |

Workflow: `.github/workflows/deploy-cpanel.yml` — triggers on `push` to `main` (merges count as pushes) + manual `workflow_dispatch`. It first runs a CI gate (`typecheck` + `build`); only if green does it SSH and run `~/ucrecent/scripts/cpanel-deploy.sh`.

No secrets are written into git; backend secrets stay in `~/ucrecent/backend/.env`.

---

## 3. How auto-deploy works (every push/merge to main)

```
git push origin main  (or Merge PR into main)
  → GitHub Actions: CI gate (frontend build)
  → appleboy/ssh-action: ssh CPANEL_USER@CPANEL_HOST
  → bash ~/ucrecent/scripts/cpanel-deploy.sh
      1. backup backend/.env → ~/ucrecent-backups/
      2. git fetch + reset --hard origin/main (only ~/ucrecent)
      3. backend: pip install → check --deploy → migrate → collectstatic → restart.txt
      4. frontend: npm ci → build (with NEXT_PUBLIC_*) → restart.txt
      5. curl health check (non-fatal)
```

Check progress: GitHub → **Actions → Deploy to cPanel VPS → latest run** (green = live).

---

## 4. Verify + rollback

```bash
# On server:
cd ~/ucrecent && git log --oneline -3
curl -fsS https://api.<your-domain>/api/health/
curl -fsS https://<your-domain>/ | head
```

Rollback to previous commit (does not touch other domains):

```bash
cd ~/ucrecent
git log --oneline -5
git reset --hard <previous-sha>
bash scripts/cpanel-deploy.sh   # rebuilds that version
```

DB backup before risky changes:

```bash
pg_dump -Fc -h 127.0.0.1 -U ucrecent_prod ucrecent_prod > ~/ucrecent-backups/db_$(date +%F).dump
tar -czf ~/ucrecent-backups/media_$(date +%F).tar.gz -C ~/ucrecent/backend media
```

---

## 5. Troubleshooting

| Symptom | Fix |
|---|---|
| Action fails `Permission denied (publickey)` | Re-authorize key in cPanel SSH Access; check `CPANEL_USER/HOST/PORT`; key must be private (not `.pub`) |
| `SECRET_KEY must be set` | `~/ucrecent/backend/.env` missing — redo 1.4; never commit `.env` |
| `DB connection refused` | Wrong `POSTGRES_*` / Postgres not running: `systemctl status postgresql-16`; check `pg_hba.conf` allows `127.0.0.1` md5 |
| `ALLOWED_HOSTS` error | `ALLOWED_HOSTS` must include `api.<domain>` exactly (no `https://`) |
| Frontend shows fallback, not API data | `NEXT_PUBLIC_API_URL` wrong or API down; rebuild after changing it (baked at build time); check CORS origins |
| `npm run build` OOM on small VPS | Add swap or build with `NODE_OPTIONS=--max-old-space-size=2048`; or build in CI and rsync `out/` (ask to switch to static export) |
| Other domains down after deploy | This pipeline never restarts Apache — check WHM for unrelated issue; our restarts are `tmp/restart.txt` scoped to the two apps only |
