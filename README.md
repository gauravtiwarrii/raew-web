# M/s Raj Agro Engineering Works — Full-Stack Business Website

Full-stack production-ready business website and admin portal for **M/s Raj Agro Engineering Works**, an agricultural machinery and engineering equipment manufacturer/dealer.

---

## 🚀 Key Features

1. **Public Agricultural Machinery Catalog**:
   - High-performance product showcase (Rotavators, Laser Land Levelers, Multi-Crop Threshers, Hydraulic Tipping Trailers, Seed Drills, Cultivators).
   - Real-time product search, category filtering, sorting, specs breakdown, and features checklists.
2. **Quotation & Lead Generation System**:
   - Interactive quote request form with Zod schema validation.
   - Dynamic WhatsApp integration with prefilled product parameters.
3. **Centralized Business Settings & Placeholder Management**:
   - Centralized configuration system storing phone numbers, factory address, WhatsApp contact, and email details.
   - Live admin editor allowing full site setting updates without code redeployments.
4. **Admin Control Center** (`/admin/dashboard`):
   - Secure JWT authentication with bcryptjs password hashing.
   - Overview metric cards (Total Products, Active Catalog, Total Leads, New Enquiries, Quote Requests).
   - Complete CRUD management for Products, Categories, Customer Enquiries, and Gallery photos.
5. **SEO & Performance Optimization**:
   - Dynamic `sitemap.xml` and `robots.txt`.
   - LocalBusiness and Product Schema.org structured data.
   - Next.js App Router with Server Components and static site generation/ISR.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Lucide Icons, Framer Motion
- **Backend API**: Next.js Server Handlers (`/api/...`)
- **Database & ORM**: Prisma ORM with SQLite (Local Zero-Config) and PostgreSQL (Production Ready)
- **Authentication**: JWT authentication via HTTP-only cookies & bcryptjs
- **Form Validation**: Zod + React Hook Form

---

## 🔑 Default Admin Credentials

- **Admin Login URL**: `https://raew.in/admin/login`
- **Email**: `admin@rajagro.com`
- **Password**: `Admin@RajAgro2026!`

*(Note: Passwords can be changed in `prisma/seed.ts` or updated in the database).*

---

## 📦 Getting Started & Setup

### 1. Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` settings:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="raj-agro-secret-jwt-token-key-2026-production-change-me"
NEXT_PUBLIC_BUSINESS_NAME="M/s Raj Agro Engineering Works"
NEXT_PUBLIC_BUSINESS_PHONE="+91 98765 43210"
NEXT_PUBLIC_BUSINESS_WHATSAPP="919876543210"
NEXT_PUBLIC_BUSINESS_EMAIL="info@rajagroengineering.com"
NEXT_PUBLIC_BUSINESS_ADDRESS="Industrial Area, Phase 2, Near Focal Point, Punjab, India - 141003"
NEXT_PUBLIC_SITE_URL="https://raew.in"
```

### 3. Database Initialization & Seeding
Push the Prisma schema and run the seed script to populate products, categories, gallery items, and admin credentials:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏭 Production Build & Deployment

To generate a production build:
```bash
npm run build
```
To run the production server:
```bash
npm run start
```

---

## ⚙️ How to Update Business Information & Replace Images

1. **Business Phone / Address / Email**:
   - Log into `/admin/login` and navigate to **Site Settings**.
   - Update phone numbers, WhatsApp digits, email addresses, or factory address directly.
   - Click **Save All Site Settings**. All public pages update instantly.

2. **Adding New Products**:
   - Go to `/admin/products` -> Click **Add New Product**.
   - Enter machine name, category, image URL, specifications JSON, and mark active/featured.

3. **Replacing Product & Gallery Photographs**:
   - Store real factory photographs under `public/images/products/` or host on a CDN/Unsplash.
   - Update image URLs in `/admin/products` or `/admin/gallery`.
