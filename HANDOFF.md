# FindDOTPhysical.com — Developer Handoff Doc

## Stack at a Glance
| Layer | Tool |
|---|---|
| Frontend | React 18 + Vite |
| Hosting | Vercel (auto-deploy from GitHub) |
| Database | Supabase (PostgreSQL) |
| Payments | Stripe Checkout (Option B) + Webhooks |
| Email | Resend.com |
| Forms | Tally.so embed |
| Domain | Namecheap → Vercel DNS |

---

## How to Add a Listing (Admin Panel)
1. Go to `https://www.finddotphysical.com/admin`
2. Enter your admin password (set in `VITE_ADMIN_PASSWORD` env var)
3. Click **+ Add Examiner** and fill in the form
4. Set **Active = true** to make it visible on the site
5. Set **Verified = true** once you've confirmed their FMCSA number
6. Save — the listing appears immediately

## How to Change a Tier (Admin Panel)
- In the admin table, use the **Tier dropdown** on any row to switch between `free / featured / premium`
- Changes take effect immediately (no page reload needed)
- For billing: when an examiner pays via Stripe Checkout, their tier updates automatically via webhook

## How to Update City Page Copy
- Open `src/pages/CityPage.jsx`
- Find the `CITY_META` object at the top
- Edit the `intro` text for each city
- Push to GitHub — Vercel redeploys automatically

## Stripe Setup (one-time)
1. Create two recurring prices in Stripe Dashboard:
   - Featured: $49/month → copy the `price_xxx` ID → set as `VITE_STRIPE_PRICE_FEATURED`
   - Premium: $99/month → copy the `price_xxx` ID → set as `VITE_STRIPE_PRICE_PREMIUM`
2. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel environment variables
3. In Stripe → Webhooks, add endpoint: `https://www.finddotphysical.com/api/stripe-webhook`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`

## Tally Form Setup
1. Create your form at tally.so
2. Copy your form ID from the URL (e.g. `tally.so/r/ABCDE` → ID is `ABCDE`)
3. Open `src/pages/GetListedPage.jsx` and replace `YOUR_TALLY_FORM_ID` with your real ID

## Resend Email Setup
1. Verify your domain at resend.com
2. Set `RESEND_API_KEY` in Vercel environment variables
3. The confirmation email fires from `api/send-confirmation.js` — call it from your Tally webhook or admin flow

## Supabase Setup
1. Run `supabase-schema.sql` in your Supabase SQL Editor (creates table + 5 seed rows)
2. Go to Supabase → Settings → API → copy Project URL and anon key
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel
4. Set `SUPABASE_SERVICE_ROLE_KEY` (from same page) — used by the webhook server function

## Vercel Deployment
1. Push this repo to GitHub
2. Import project at vercel.com
3. Set all environment variables from `.env.example`
4. Point `finddotphysical.com` DNS to Vercel (Namecheap → Custom DNS → Vercel nameservers)
5. Submit `sitemap.xml` to Google Search Console

## File Map
```
src/
  components/   ExaminerCard, SearchBar, SEOHead, Header, Footer
  pages/        HomePage, CityPage, GetListedPage, AdminPage, UpgradeSuccessPage
  lib/          supabase.js, stripe.js
  styles/       global.css
api/
  create-checkout-session.js   (Stripe Checkout — server)
  stripe-webhook.js            (auto-tier update — server)
  send-confirmation.js         (Resend email — server)
supabase-schema.sql            (run once in Supabase SQL editor)
```
