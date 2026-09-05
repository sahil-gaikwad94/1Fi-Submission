# 1Fi Marketplace — SDE Intern Assignment

A complete **MERN** implementation of the **1Fi Marketplace** section inside the Shop page of the existing 1Fi app, built as per the assignment PDF.

LINK TO DEMO: [https://onefi1.onrender.com](https://onefi-submission.onrender.com)

## What's inside

- **Server**: Node.js + Express + Mongoose (with a JSON-file fallback when `MONGO_URI` is not set, so it runs out-of-the-box on Render free tier).
- **Client**: React + Vite, single-page app with mobile-first UI matching the 1Fi design language (purple `#6E2EE6` primary, rounded cards, soft shadows, bottom navigation).
- **Three shop tabs**:
  - **Top Brands** — blank placeholder (per assignment).
  - **Nearby Stores** — blank placeholder (per assignment).
  - **1Fi Marketplace** — fully implemented (product list → variants → EMI plan selection → proceed CTA).
- **Dynamic data** coming from `GET /api/products` and `GET /api/products/:id` — no hard-coded UI strings for products / EMI plans.
- **Loading + error states** on every async view.

## Folder layout

```
1fi-marketplace/
├── package.json                # root scripts (install:all, build, start)
├── server/
│   ├── package.json
│   ├── index.js                # express app, serves client dist + API
│   ├── db.js                   # mongoose + JSON fallback persistence
│   ├── seed.js                 # one-shot seed (called automatically on boot)
│   ├── data/seed.json          # mock products, brands, EMI plans
│   ├── models/Product.js
│   ├── models/Order.js
│   └── routes/products.js
│   └── routes/orders.js
└── client/
    ├── package.json
    ├── vite.config.js          # proxies /api → http://localhost:4000 in dev
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js              # tiny fetch wrapper
        ├── styles.css          # 1Fi design tokens
        ├── components/
        │   ├── BottomNav.jsx
        │   ├── ProductCard.jsx
        │   ├── EMISelector.jsx
        │   └── Spinner.jsx
        └── pages/
            ├── Shop.jsx        # tab toggle: Top Brands / Nearby Stores / 1Fi Marketplace
            ├── Marketplace.jsx # product grid
            ├── ProductDetail.jsx
            ├── Home.jsx        # placeholder consistent with 1Fi home
            └── Placeholder.jsx # "Top Brands" / "Nearby Stores" empty state
```

## Local development

```bash
# from the repo root
npm run install:all              # installs root, client, and server deps
npm run dev:both                 # runs server (4000) + Vite client (5173) concurrently
# open http://localhost:5173
```

## Deploy on Render (single Web Service)

1. Push this repo to GitHub.
2. On Render → **New +** → **Web Service** → pick the repo.
3. Settings:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `PORT=10000`, optionally `MONGO_URI=<your mongo atlas uri>`.
4. Render will install all dependencies, build the React client into `client/dist`, and the Express server will serve both the API and the SPA on the same port.

If you don't set `MONGO_URI`, the server automatically uses an on-disk JSON file store (`server/data/db.json`) so it works on the free tier without an external DB.

## API contract (used by the client)

| Method | Path                       | Purpose                                    |
|--------|----------------------------|--------------------------------------------|
| GET    | `/api/products`            | List Marketplace products (with brand)     |
| GET    | `/api/products/:id`        | Product detail incl. variants + EMI plans  |
| GET    | `/api/brands`              | Brand chips used in the Marketplace filter |
| POST   | `/api/orders`              | Create an order with chosen EMI plan       |
| GET    | `/api/orders`              | List past orders (for the success screen)  |
| GET    | `/api/health`              | Health check                               |

`POST /api/orders` body:
```json
{
  "productId": "...",
  "variantId": "...",
  "emiPlanTenureMonths": 12,
  "fullName": "...",
  "phone": "..."
}
```

## Implementation notes / checklist mapping

| Assignment item | Where it lives |
|---|---|
| Shop page with three options | `client/src/pages/Shop.jsx` |
| Top Brands + Nearby Stores blank | `client/src/pages/Placeholder.jsx` |
| Product listing for 1Fi Marketplace | `client/src/pages/Marketplace.jsx`, `server/routes/products.js` |
| Product image / name / price / MRP | `ProductCard.jsx`, `seed.json` |
| Product variants | `ProductDetail.jsx`, `seed.json` `variants[]` |
| EMI options / plans + relevant details | `EMISelector.jsx`, `seed.json` `emiPlans[]` |
| Ability to select an EMI plan | `EMISelector.jsx` (radio list, live monthly + total) |
| CTA to proceed with the selected plan | `ProductDetail.jsx` "Proceed with this plan" → `POST /api/orders` |
| Dynamic data, no UI hardcoding | Centralised `seed.json`, served from API, consumed via `client/src/api.js` |
| Mock APIs / data sources | `seed.json` + JSON file fallback in `server/db.js` |
| UI consistency (purple, rounded, bottom nav) | `client/src/styles.css` tokens, `BottomNav.jsx` |
| Loading + error states | `Spinner.jsx` + retry buttons in `Marketplace.jsx`, `ProductDetail.jsx` |
| Render-deployable | `server/index.js` `app.use(express.static(client/dist))`, root `npm start` |


## UI/UX redesign update

The marketplace UI has been refreshed into a modern, mobile-first 1Fi experience while keeping the original assignment architecture and API contract intact. The redesign adds a clearer brand hierarchy, stronger marketplace entry point, accessible typography, higher-contrast cards, product ratings, live result counts, clear filter/search states, a sticky EMI CTA, and working routes for every bottom-navigation item. Product cards and product detail now use locally bundled product photography under `server/public/products`, so Render does not depend on a third-party image host at runtime.

### Verified interaction checklist

- Search products by keyword, submit with Enter, and clear search with one tap.
- Filter by brand chips and reset filters from the empty state.
- Open a product from any card, switch variants, choose an EMI tenure, and submit an order.
- Confirm the order-success screen with the selected plan and monthly payment.
- Navigate Home, Shop, EMI Dues, Limit, and Profile from the persistent bottom navigation.
- Serve the SPA and `/api/*` routes from one Express process in production.

### Render settings

- **Build command:** `npm run install:all && npm run build`
- **Start command:** `npm start`
- **Environment:** `PORT=10000` (optional `MONGO_URI` remains supported)

The local photo assets are downloaded by `scripts/download-assets.sh` and the seed paths are updated by `scripts/update-image-paths.js`. The downloaded images are already included in this submission, so the script is only needed when refreshing assets.
