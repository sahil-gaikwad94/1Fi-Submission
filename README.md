# 1Fi Marketplace

## SDE Intern Assignment Submission

**Live demo:** [onefi-submission.onrender.com](https://onefi-submission.onrender.com)

out-of-assignment: https://emi-marketplace-1m7l.onrender.com/


I built this project as a marketplace experience inside the 1Fi app. The idea is to let users browse products from trusted brands, view product details, choose a suitable variant, and purchase through a no-cost EMI plan backed by their investments.

I focused on keeping the experience simple, mobile-first, and easy to understand. The interface uses the purple visual language associated with 1Fi, but with clearer hierarchy, more readable typography, stronger product cards, and a smoother path from discovery to checkout.

## What I implemented

The Shop section includes three options: Top Brands, Nearby Stores, and the 1Fi Marketplace. The Marketplace is the main assignment flow and includes product discovery, search, brand filtering, product details, variants, EMI plans, and order confirmation.

Users can search for products such as iPhones, filter the collection by brand, open a product, compare variants, select an EMI tenure, and continue with the selected plan. I also added loading, error, empty-result, and retry states so the interface remains understandable when data is loading or unavailable.

The bottom navigation includes Home, Shop, EMI Dues, Limit, and Profile. The assignment-specific marketplace flow is fully implemented, while the remaining navigation destinations have clear placeholder states for future expansion.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 and Vite |
| Routing | React Router |
| Backend | Node.js and Express |
| Database | MongoDB through Mongoose, with JSON-file fallback |
| Styling | Custom responsive CSS |
| Deployment | Render single web service |

## Project structure

```
.
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── styles.css
│   ├── index.html
│   └── vite.config.js
├── server/
│   ├── data/seed.json
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── index.js
├── package.json
└── README.md
```

## Running the project locally

First, install the dependencies from the root directory:

```bash
npm run install:all
```

To run the frontend and backend together in development mode:

```bash
npm run dev:both
```

The Vite frontend runs at:

```
http://localhost:5173
```

The Express API runs at:

```
http://localhost:4000
```

To run the production-style server locally:

```bash
npm start
```

The production server builds the React client before starting Express. The complete app is then available at:

```
http://localhost:4000
```

## Render deployment

I deployed the application as a single Render Web Service. Express serves both the API and the compiled React application, which keeps the deployment simple and avoids needing separate frontend and backend services.

Use the following Render settings:

| Setting | Value |
| --- | --- |
| Build command | `npm run install:all && npm run build` |
| Start command | `npm start` |
| Environment variable | `PORT=10000` |
| Optional environment variable | `MONGO_URI` |

If `MONGO_URI` is not provided, the server uses the included JSON-file fallback so the project can run without a separate database service.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Check whether the server is running |
| GET | `/api/products` | Fetch marketplace products |
| GET | `/api/products/:id` | Fetch one product with variants and EMI plans |
| GET | `/api/brands` | Fetch available marketplace brands |
| POST | `/api/orders` | Create an order for a selected EMI plan |
| GET | `/api/orders` | Fetch created orders |

The product list and EMI plan data are served through the API instead of being duplicated inside the React components. This makes it easier to replace the mock data with a real database or external service later.

## Assignment flow

The main user journey is:

```
Shop → 1Fi Marketplace → Search or filter products → Product details → Choose variant → Choose EMI plan → Proceed → Order confirmation
```

The product detail page displays the product image, brand, rating, pricing, savings, description, highlights, available variants, EMI plans, cashback information, and the monthly payment CTA.

## Design decisions

I used a mobile-first layout because the original product is a finance application and the marketplace is expected to be used primarily on smaller screens. Cards, pills, and bottom navigation make the experience familiar for mobile users, while the layout expands into a responsive grid on wider screens.

I kept the color scheme close to the 1Fi visual identity and used purple for primary actions, selected states, and important marketplace interactions. Product images are stored locally in the server public directory so the deployed application does not depend on third-party image URLs at runtime.

I also prioritized readable body text, visible savings, clear EMI explanations, and useful empty states. These details help users understand the financial commitment before proceeding.

## Notes

This project uses mock marketplace and order data for the assignment. The database layer is structured so MongoDB can be enabled through `MONGO_URI`, while the JSON fallback keeps the application easy to run locally and on a free Render instance.



[2]: https://onefi-submission.onrender.com "1Fi Marketplace live demo" paths are updated by `scripts/update-image-paths.js`. The downloaded images are already included in this submission, so the script is only needed when refreshing assets.
