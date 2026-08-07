# FrontDesk PRD (Product Requirement Document) & Engineering Blueprint

**Project Name:** FrontDesk  
**Target User:** Solo Service Providers (Tutors, Photographers, Consultants, Freelancers)  
**Core Value:** A unified public page displaying real-time service availability, service blocks, and capturing structured client booking requests into a private owner inbox.

---

## 1. Product Core & Tenancy Model

### A. Core Workflows

1. **The Status Update:** Provider logs into `/admin`, toggles status (e.g. `AVAILABLE`, `BUSY`, `OFFLINE`). The public profile (`/[username]`) instantly reflects real-time status with an animated pulse badge.
2. **Service Catalog (Blocks):** Provider configures service blocks in `/admin` (Title, Description, Price, Duration, Category, Image Cover URL). Public visitors see the catalog on `/[username]` with interactive category filter pills and title search.
3. **The Request Pipeline:** Visitor views a service block on `/[username]`, clicks "Request Service", submits a structured modal form. A new request lands in the provider's `/admin/inbox` with an unread badge counter. Provider updates request status (`PENDING`, `CONTACTED`, `DECLINED`) or expunges/deletes requests.
4. **Profile & Branding:** Provider customizes custom Avatar photo URL, Cover banner image URL, Bio, GitHub, X/Twitter, Website, and Theme accent color swatches.

### B. Tenancy & Isolation

- **Multi-Tenant Row-Level Isolation:** Every table with user-owned data includes `user_id` / `provider_id`.
- **Security First:** All database reads/writes enforce ownership checking (`user_id = auth.uid()` / `provider_id = auth.uid()`) via Supabase Row Level Security (RLS) policies and Next.js server guards.

### C. Out of Scope (Strict V1)

- **No In-App Payments / Checkout:** Booking requests only; no Stripe/PayPal integration in V1.
- **No Custom Domains:** All profiles hosted on `frontdesk.app/[username]` or `localhost:3000/[username]`.

---

## 2. Technical Stack Architecture

- **Framework:** Next.js 16 (App Router, React 19, TypeScript, Server Actions)
- **Styling:** Tailwind CSS (Vanilla CSS variable design tokens)
- **Database & Auth:** Supabase (Managed PostgreSQL + Supabase Auth via `@supabase/ssr`)
- **Validation:** Zod (Type-safe input schemas for all server actions and API payloads)
- **Client/Server Auth:** `@supabase/ssr` (HttpOnly, SameSite=Lax, Secure session cookies managed seamlessly via Next.js Middleware Edge Proxy)
- **Deployment:** Vercel + Supabase Cloud

---

## 3. Engineering & Architecture Principles (Mandatory)

All code developed in FrontDesk strictly adheres to the **6 Core Engineering Principles**:

1. **State Management & Immutability Architecture:** Unidirectional data flow, non-mutating state updates, single source of truth (derived state computed on the fly).
2. **Asynchronous Flow & Network Optimization:** Non-blocking main thread, 0-query hidden form redirects, resilient error handling with graceful UI alert states.
3. **Memory Management & Resource Lifecycle:** Explicit cleanup of event listeners and timers on unmount, avoiding detached DOM references and closure memory leaks.
4. **Software Design & Code Structure (SOLID):** Single Responsibility Principle (UI vs Data vs Business Logic), Dependency Inversion, Encapsulation via module boundaries.
5. **Defense-in-Depth Security:** HttpOnly session cookies (Supabase SSR), input validation with Zod, DOM sanitization against XSS, RLS on database tables.
6. **Performance & Loading Patterns:** Route code-splitting, Core Web Vitals layout reservation (CLS/LCP optimization for image containers).

---

## 4. Execution Roadmap (Step-by-Step Curriculum)

### Step 1: Project Setup & Supabase Auth Foundations
- Initialize Next.js App Router project with TypeScript and Tailwind CSS.
- Configure `@supabase/ssr` client for Browser, Server Components, and Next.js Middleware.
- Implement `/login` and `/signup` using Supabase Auth with HttpOnly cookies.

### Step 2: Database Schema & Row Level Security (RLS)
- Define Supabase tables: `profiles`, `blocks` (services), `requests`.
- Write PostgreSQL migration scripts and enable RLS on all tables.
- Define RLS policies ensuring providers can only mutate their own rows (`user_id = auth.uid()`) while public users can read active profiles and blocks.

### Step 3: Admin Dashboard & Service Block CRUD
- Build protected route `/admin` guarded by Supabase Auth Edge Proxy (`proxy.ts`).
- Build server actions with Zod validation to Create, Read, Pause/Activate, and Delete service blocks.
- Support profile status toggling (`AVAILABLE`, `BUSY`, `OFFLINE`), avatar URL, cover photo banner, preset theme color swatches, bio, and social links (`github_url`, `x_url`, `website_url`).
- Add one-click **Copy Public Profile Link** button with clipboard feedback state.

### Step 4: Public Provider Profile & Dynamic Routing
- Create dynamic route `app/[username]/page.tsx`.
- Render cover photo banner and overlapping circular avatar profile photo.
- Add interactive category filter pills (`[All]`, `[Consulting]`, etc.) and title search bar.
- Display live status indicator badge (`AVAILABLE`, `BUSY`, `OFFLINE`) and bio/social link pills.

### Step 5: Service Request Pipeline & Inbox
- Implement `RequestModal` on public page for visitors to submit service requests.
- Create `submitRequest` server action with Zod schema validation and 0-query hidden form redirects.
- Build `/admin/inbox` where logged-in providers can view, filter by status (`PENDING`, `CONTACTED`, `DECLINED`), and update or delete requests via `deleteRequest` action.
- Display live unread request count badge (`📬 Inbox (3)`) on `/admin` dashboard header.

### Step 6: Production Polish & Security Audit
- Run full security audit across the 6 Core Engineering Principles.
- Add application showcase screenshots to `README.md` and complete final production build verification.
