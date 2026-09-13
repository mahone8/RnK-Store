# R&K — Full Stack E-commerce Store

A full-stack e-commerce platform for **wallets, bracelets, caps, and glasses**, built with:

- **Database:** PostgreSQL
- **Backend:** Node.js + Express + JWT auth
- **Storefront:** React + Vite + Tailwind CSS
- **Admin Panel:** Separate React + Vite + Tailwind app

Developed by **levelose.tech**

---

## Project Structure

```
RnK/
├── database/
│   ├── schema.sql       # Tables, constraints, triggers
│   └── seed.sql         # Sample categories, products, default admin
├── server/              # Express API (port 5000)
│   ├── src/
│   │   ├── index.js
│   │   ├── db.js
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── .env.example
├── client/              # Customer storefront (port 5173)
│   ├── src/
│   └── package.json
└── admin-panel/         # Admin dashboard (port 5174)
    ├── src/
    └── package.json
```

---

## 1. Database Setup (PostgreSQL)

You can run this on local PostgreSQL, or on a free hosted **Neon** database (recommended — no local install needed, works great for deploying the backend later).

### Option A — Neon (hosted Postgres)

1. Go to [neon.tech](https://neon.tech) and create a free account, then create a new project (any region).
2. On your project dashboard, open **Connection Details** and copy the connection string. It looks like:
   ```
   postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
3. In `server/.env` (copy from `.env.example` first), paste it as:
   ```
   DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
   The backend (`server/src/db.js`) automatically detects `DATABASE_URL` and connects over SSL — you don't need to set `PGHOST`/`PGUSER`/etc. when using this option.
4. Run the schema and seed against your Neon database. Easiest way — open the **SQL Editor** in the Neon dashboard, paste the contents of `database/schema.sql`, run it, then paste `database/seed.sql` and run that too.

   Or, from your terminal, using the same connection string:
   ```bash
   psql "postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require" -f database/schema.sql
   psql "postgresql://neondb_owner:YOUR_PASSWORD@ep-xxxx-xxxx.region.aws.neon.tech/neondb?sslmode=require" -f database/seed.sql
   ```
5. Start the backend as usual (see step 2 below) — it will connect to Neon instead of a local database.

> Neon gives you two connection strings: a **pooled** one (has `-pooler` in the hostname) and a **direct** one. For this app's normal traffic, use the pooled connection string in `DATABASE_URL`.

### Option B — Local PostgreSQL

Make sure PostgreSQL is installed and running locally.

```bash
# Create the database
createdb rnk_store

# Run schema
psql -d rnk_store -f database/schema.sql

# Load sample data (categories, products, admin user)
psql -d rnk_store -f database/seed.sql
```

With this option, leave `DATABASE_URL` unset in `.env` and instead fill in `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (already the default in `.env.example`).

**Default admin login (from seed.sql):**
- Email: `admin@rnk.com`
- Password: `Admin@123`

> ⚠️ The password hash in `seed.sql` is a placeholder. Before using it, generate a real bcrypt hash and replace it — see **Important: Fix the Admin Password Hash** below.

### Important: Fix the Admin Password Hash

Run this once to generate a valid hash for `Admin@123` (or your own password), then update `seed.sql` or the `users` table directly:

```bash
cd server
npm install
node -e "console.log(require('bcryptjs').hashSync('Admin@123', 10))"
```

Copy the output and run:

```sql
UPDATE users SET password_hash = '<paste_hash_here>' WHERE email = 'admin@rnk.com';
```

---

## 2. Backend API Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and a strong `JWT_SECRET`.

```bash
npm run dev      # starts on http://localhost:5000 (nodemon)
# or
npm start
```

Health check: `GET http://localhost:5000/api/health`

### Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Customer signup |
| POST | `/api/auth/login` | Login (customer or admin) |
| GET | `/api/products` | List products (filter/search/paginate) |
| GET | `/api/products/:slug` | Product detail |
| POST | `/api/products` | Create product (admin) |
| PUT/DELETE | `/api/products/:id` | Update/delete product (admin) |
| GET/POST | `/api/categories` | List/create categories |
| GET/POST/PUT/DELETE | `/api/cart` | Manage cart (auth required) |
| POST | `/api/orders` | Checkout (auth required) |
| GET | `/api/orders/mine` | Customer order history |
| GET | `/api/orders` | All orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |
| GET | `/api/admin/stats` | Dashboard metrics (admin) |

---

## 3. Customer Storefront Setup

```bash
cd client
npm install
cp .env.example .env   # points VITE_API_URL to your backend
npm run dev             # http://localhost:5173
```

---

## 4. Admin Panel Setup

```bash
cd admin-panel
npm install
cp .env.example .env
npm run dev             # http://localhost:5174
```

Log in with the admin account created in step 1. Only users with `role = 'admin'` can access the panel.

---

## 5. Production Build

For both `client/` and `admin-panel/`:

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

Deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS, etc.), and deploy `client/dist` and `admin-panel/dist` as static sites (Vercel, Netlify, Nginx). Point each frontend's `VITE_API_URL` to your deployed backend URL, and update `CLIENT_ORIGIN` in the backend `.env` to match your deployed frontend URLs (comma-separated).

---

## Branding & Contact

- The R&K logo (`logo-mark.png`, `logo-full.png`, `favicon.png`) is placed in `client/public/` and `admin-panel/public/` and is used across the storefront navbar/footer, browser tab icon, and admin login/sidebar. Replace these files with your own (same names) to update the logo everywhere.
- Store address is set to **Faisalabad, Punjab, Pakistan** in the storefront footer, and the checkout form defaults the shipping city to Faisalabad.
- A floating **WhatsApp** button appears on every storefront page (bottom-right). It opens a small picker with two contacts — **Sales: +92 348 0165169** and **Support: +92 301 7989770** — both defined in `client/src/data/contacts.js`. Edit that file to change the numbers, labels, or default message.
- All prices are shown in **PKR** (Pakistani Rupees, formatted as `Rs 2,499`) across the storefront and admin panel — see `client/src/utils/currency.js` and `admin-panel/src/utils/currency.js`.

## Product Images — Local Upload

Product photos are uploaded as real files from the admin panel (not just external URLs):

- In **Admin → Products → New/Edit Product**, use the "Product Image" file picker to choose a JPG/PNG/WEBP/GIF (max 5MB) from your computer.
- The backend (`server/src/middleware/upload.js`, via `multer`) saves the file to `server/uploads/` and serves it at `http://<backend-host>/uploads/<filename>`.
- Product records store just the path (e.g. `/uploads/1699999999-123456789.jpg`); the frontend resolves this to a full URL automatically (`client/src/utils/image.js` / `admin-panel/src/utils/image.js`), so it keeps working whether you're running locally or deployed.
- Uploading a new image on an existing product automatically deletes the old uploaded file; deleting a product does the same.
- The seeded demo products still use external Unsplash URLs — both external URLs and local uploads work side by side; the resolver handles either.
- `server/uploads/` is gitignored (only a `.gitkeep` is committed) — when you deploy, make sure this folder persists (many platforms wipe the filesystem on redeploy; consider mounting a persistent volume, or swapping to S3/Cloudinary storage for production).

## Product Descriptions Throughout the Order Flow

Every product now carries a fuller description (see the seed data), and it's surfaced everywhere a customer reviews their order — not just the product page:

- Product cards on the shop grid show a short one-line snippet.
- The **cart** and **checkout summary** show a truncated description under each item.
- **Order history** (customer-facing) and the **admin order detail view** both show the description that was on the product at the time of purchase — it's snapshotted into `order_items.product_description` at checkout, so it stays accurate even if the product is edited or removed later.
- If you already created your database before this change, run the small migration: `psql <your-connection> -f database/migrations/001_add_order_item_description.sql` (a fresh `schema.sql` already includes this column).

## Storefront Design

The storefront homepage now follows a Shopify-style layout (inspired by capsclubpk.com):

- Auto-rotating hero slideshow
- "Best Sellers" featured product grid with sale badges
- Large category banner tiles ("Shop our Collections")
- A "Why R&K" features strip (quality, delivery, reviews, pricing)
- Customer testimonials
- Email newsletter signup
- A richer multi-column footer with a "Powered by levelose.tech" credit

All product photography uses real photos (sourced from Unsplash, free for commercial use) instead of placeholders — see `client/src/data/images.js` for the shared image set used in banners, and `database/seed.sql` for the per-product photos. Swap any `image_url` value for your own product photos at any time (via the admin panel or directly in the database).

## Features Summary

**Storefront**
- Browse by category (Wallets, Bracelets, Caps, Glasses), search, pagination
- Product detail pages with stock awareness and full descriptions
- Cart (add/update/remove) with product descriptions shown per item, persisted per logged-in user
- Checkout with shipping details (defaults to Faisalabad) → creates an order and decrements stock
- Customer registration/login (JWT) and order history with per-item descriptions
- Prices shown in PKR throughout
- Floating WhatsApp button with Sales/Support contacts

**Admin Panel**
- Secure admin-only login
- Dashboard: revenue (PKR), order count, product count, customer count, low-stock alerts, recent orders
- Full product CRUD with local image upload (file picker + thumbnail preview), price, stock, category, featured/active flags
- Category CRUD
- Order management with status updates (pending → processing → shipped → delivered/cancelled), showing item descriptions
- Customer list

---

## Notes

- Passwords are hashed with bcrypt; sessions use JWT (7-day expiry by default).
- Checkout is wrapped in a PostgreSQL transaction — stock is validated and deducted atomically.
- Payment integration (Stripe/PayPal/etc.) is not included — `payment_method` currently supports Cash on Delivery and a mock "card" option. Swap in a real gateway before going live.
- Product images are uploaded as local files by default (see "Product Images — Local Upload" above). For production deployments, consider swapping the local disk storage for S3/Cloudinary so images survive redeploys.

---

**Developed by [levelose.tech](https://levelose.tech)**
