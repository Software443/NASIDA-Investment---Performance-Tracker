# NASIDA Performance & Investment Register

A React (Vite) dashboard for tracking department appraisals, investment records,
and workforce data — backed by a real Supabase project (Postgres + Auth + Realtime).

## What's in this project

```
nasida-preview-local/
├── supabase/
│   └── schema.sql          # Full database schema + Row Level Security policies
├── src/
│   ├── App.jsx             # The whole app (single component, ~2000 lines)
│   ├── main.jsx            # React entry point
│   └── supabaseClient.js   # Supabase client setup (reads .env)
├── .env.example            # Copy to .env and fill in your project's values
├── index.html
├── package.json
└── vite.config.js
```

## 1. Create your Supabase project

1. Go to https://supabase.com, sign in, and create a new project (pick any name/region).
2. Wait for it to finish provisioning (a couple of minutes).
3. In the left sidebar, go to **SQL Editor** → **New query**, paste in the entire contents
   of `supabase/schema.sql`, and run it. This creates every table (`profiles`,
   `appraisals`, `investments`, `employees`, `kpi_definitions`), sets up Row Level
   Security so the permission rules (staff only edit their own department, only admin
   touches investments/employees/KPIs) are enforced by the database itself, and turns
   on realtime sync for all four data tables.

## 2. Create your first admin account

Accounts are created from the Supabase Dashboard (there's no self-service signup in
the app, since this is an internal tool):

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter an email and password.
3. Expand **User Metadata** (or edit the user after creating them) and add:
   ```json
   { "name": "Your Name", "role": "admin" }
   ```
   A trigger in `schema.sql` automatically creates a matching row in the `profiles`
   table the moment the user is created, using this metadata.
4. For department staff accounts, use `"role": "staff"` plus a `"department"` field,
   e.g. `{ "name": "Tamuno Wagbara", "role": "staff", "department": "IPF" }`. Valid
   department codes are: `IPF`, `PPP`, `EODB`, `S&I`, `ACCOUNT`, `COMMS`, `ADMIN`.

If you ever create a user without setting `role` in metadata, the trigger defaults
them to `"staff"` with no department — you can fix this later by editing their row
directly in the **Table Editor → profiles**.

## 3. Get your project's API keys

In your Supabase project: **Settings → API**. You need two values:
- **Project URL**
- **anon / public key** (NOT the `service_role` key — that one must never go in a
  frontend app, since it bypasses Row Level Security entirely)

## 4. Configure and run locally

```bash
cp .env.example .env
# open .env and paste in your Project URL and anon key

npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`) and sign in with the
account you created in step 2.

## 5. How data flows

- **Amounts** in `investments` are stored in USD; the currency switcher in the app
  only converts for *display* — the underlying value in the database never changes.
- **Realtime**: every add/edit/delete to appraisals, investments, employees, or
  custom KPIs is pushed live to every other open tab/browser via Supabase's realtime
  subscriptions — no manual refresh needed, and no polling.
- **Custom KPI formulas** are parsed and evaluated entirely in the browser (see the
  `evaluateKpiFormula` function in `App.jsx`) against data already fetched through
  Supabase's normal RLS-protected API. Formulas are never sent to Postgres as SQL,
  so there's no injection risk in letting admins write their own formula text.

## 6. Deploying it for real use

Push this project to GitHub, then deploy the frontend on **Vercel** or **Netlify**:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the
  hosting platform's dashboard (same values as your local `.env`)

Supabase itself is already hosted — there's no separate backend to deploy.

## 7. Things worth adding next

- **In-app user invites**: right now, new accounts are created manually in the
  Supabase Dashboard because creating auth users requires a `service_role` key,
  which can't safely live in frontend code. The proper fix is a small **Supabase
  Edge Function** that holds that key server-side and exposes a safe
  "admin invites a user" endpoint the app can call — happy to build this next.
- **Excel/CSV import** for bulk-loading appraisal, investment, or employee records.
- **Self-service password reset** (`supabase.auth.resetPasswordForEmail`).
- **Audit log** of who changed what, using a Postgres trigger that writes to a
  separate `audit_log` table.
