# CeroVacio - Chile Backhaul Matching Platform

A digital logistics platform that matches **transportistas** (truckers making empty return trips) with **enviadores** (shippers who need cargo transported). Shippers save ~24% on transport costs by sharing trucks that are already traveling their route, while truckers earn $200k-$500k CLP per trip instead of driving back empty.

## Tech Stack

| Layer        | Technology                                    |
|--------------|-----------------------------------------------|
| Framework    | Next.js 16 (App Router) + React 19            |
| Language     | TypeScript                                    |
| Styling      | Tailwind CSS 4                                |
| Database     | PostgreSQL (Neon serverless)                  |
| ORM          | Drizzle ORM                                   |
| Email        | AWS SES (transactional verification codes)    |
| Maps         | Leaflet + React Leaflet                       |
| Geocoding    | OpenStreetMap Nominatim (free, no API key)    |
| Routing      | OpenRouteService API (driving distances)      |
| Analytics    | Google Analytics 4                            |
| Deployment   | Vercel                                        |

## Project Structure

```
Chile Backhaul/
├── backhaul-match/               # Main Next.js application
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages & API routes
│   │   │   ├── page.tsx          # Landing page with live match checker
│   │   │   ├── layout.tsx        # Root layout (GA script, metadata)
│   │   │   ├── globals.css       # Global styles (Tailwind)
│   │   │   │
│   │   │   ├── enviador/         # Shipper registration flow
│   │   │   │   └── page.tsx      # Multi-step form for shippers
│   │   │   ├── transportista/    # Trucker registration flow
│   │   │   │   └── page.tsx      # Multi-step form for truckers
│   │   │   │
│   │   │   ├── admin/            # Admin dashboard
│   │   │   │   ├── page.tsx      # Route management + match algorithm
│   │   │   │   └── matched/
│   │   │   │       └── page.tsx  # Matched routes history
│   │   │   │
│   │   │   ├── faq/              # FAQ page
│   │   │   │   └── page.tsx
│   │   │   ├── privacidad/       # Privacy policy
│   │   │   │   └── page.tsx
│   │   │   ├── terminos/         # Terms of service
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── api/              # Backend API endpoints
│   │   │       ├── routes/
│   │   │       │   └── route.ts          # POST - publish a new route
│   │   │       ├── check-matches/
│   │   │       │   └── route.ts          # POST - find matches for coordinates
│   │   │       ├── admin/
│   │   │       │   └── routes/
│   │   │       │       └── route.ts      # GET/POST/DELETE - admin route mgmt
│   │   │       └── verify/
│   │   │           ├── send/
│   │   │           │   └── route.ts      # POST - send email verification code
│   │   │           └── check/
│   │   │               └── route.ts      # POST - validate verification code
│   │   │
│   │   ├── components/           # Reusable React components
│   │   │   ├── RouteForm.tsx     # 6-step multi-step form (both user types)
│   │   │   ├── AddressInput.tsx  # Autocomplete address input (OSM geocoding)
│   │   │   ├── MapPreview.tsx    # Static Leaflet map for route preview
│   │   │   ├── MapPreviewDynamic.tsx  # Client-side dynamic map wrapper
│   │   │   ├── RadiusSlider.tsx  # Admin match radius control (1-50km)
│   │   │   └── AdminActions.tsx  # Admin action buttons (match/archive/delete)
│   │   │
│   │   └── lib/                  # Utility modules
│   │       ├── db.ts             # Database connection (Drizzle + Neon)
│   │       ├── schema.ts         # Database schema & enum definitions
│   │       ├── haversine.ts      # Haversine distance formula
│   │       ├── driving-distance.ts  # OpenRouteService API wrapper
│   │       ├── geocode.ts        # OSM Nominatim geocoding
│   │       └── analytics.ts      # GA4 event tracking helpers
│   │
│   ├── drizzle/                  # Database migrations
│   │   └── migrations/
│   │       ├── 0000_brainy_legion.sql   # Initial schema migration
│   │       └── meta/                    # Migration metadata
│   │
│   ├── public/                   # Static assets (SVGs, favicon)
│   ├── seed.mjs                  # Database seeding script
│   ├── drizzle.config.ts         # Drizzle ORM configuration
│   ├── next.config.ts            # Next.js configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example              # Environment variable template
│
└── lead-gen/                     # Lead generation scripts (Python)
    ├── config.py                 # API keys, search areas, query config
    ├── run_all.py                # Master orchestrator for all scrapers
    ├── scrape_web_search.py      # Web search scraper
    ├── scrape_directories.py     # Business directory scraper
    ├── scrape_google_places.py   # Google Places API scraper
    ├── merge_results.py          # Deduplicate & merge CSV results
    ├── compile_final_csvs.py     # Final CSV compilation
    └── [output CSVs & reports]   # Generated lead lists
```

## Database Schema

The application uses PostgreSQL with four enums and three tables:

### Enums

| Enum           | Values                                  |
|----------------|-----------------------------------------|
| `role`         | `user`, `admin`                         |
| `user_type`    | `transportista`, `enviador`             |
| `cargo_type`   | `general`, `refrigerated`               |
| `route_status` | `active`, `inactive`, `archived`, `matched` |

### Tables

**`users`** - Registered platform users (both transportistas and enviadores)

| Column             | Type      | Description                          |
|--------------------|-----------|--------------------------------------|
| `id`               | UUID (PK) | Auto-generated unique identifier     |
| `email`            | text      | Unique email address                 |
| `name`             | text      | Full name                            |
| `phone`            | text      | Phone number                         |
| `role`             | enum      | `user` or `admin`                    |
| `emailVerified`    | boolean   | Whether email has been verified      |
| `verificationCode` | text      | 6-digit code (expires in 10 min)     |
| `codeExpiresAt`    | timestamp | Verification code expiry time        |
| `createdAt`        | timestamp | Account creation timestamp           |

**`routes`** - Published transportation routes

| Column         | Type      | Description                              |
|----------------|-----------|------------------------------------------|
| `id`           | UUID (PK) | Auto-generated unique identifier         |
| `userId`       | UUID (FK) | References `users.id` (cascade delete)   |
| `userType`     | enum      | `transportista` or `enviador`            |
| `originAddress`| text      | Human-readable origin address            |
| `originLat/Lng`| real      | Origin coordinates                       |
| `destAddress`  | text      | Human-readable destination address       |
| `destLat/Lng`  | real      | Destination coordinates                  |
| `pickupDate`   | date      | Requested pickup/travel date             |
| `cargoType`    | enum      | `general` or `refrigerated`              |
| `weight`       | real      | Cargo weight                             |
| `palletCount`  | integer   | Number of pallets                        |
| `description`  | text      | Cargo description                        |
| `status`       | enum      | `active`, `inactive`, `archived`, `matched` |
| `createdAt`    | timestamp | Route creation timestamp                 |

**`match_cache`** - Cached match results (24-hour TTL)

| Column       | Type      | Description                                 |
|--------------|-----------|---------------------------------------------|
| `id`         | UUID (PK) | Auto-generated unique identifier            |
| `coordKey`   | text      | Rounded coordinate key for cache lookup     |
| `matchCount` | integer   | Number of matches found today               |
| `tomorrowCount` | integer | Number of matches expected tomorrow        |
| `expiresAt`  | timestamp | Cache entry expiration (24 hours)           |

## API Endpoints

| Endpoint               | Method       | Description                                            |
|------------------------|--------------|--------------------------------------------------------|
| `/api/routes`          | `POST`       | Create a new route (requires verified email)           |
| `/api/check-matches`   | `POST`       | Check available matches for given origin/destination   |
| `/api/verify/send`     | `POST`       | Send a 6-digit verification code via AWS SES           |
| `/api/verify/check`    | `POST`       | Validate a 6-digit code (10-minute expiry window)      |
| `/api/admin/routes`    | `GET`        | List all routes (filterable by status)                 |
| `/api/admin/routes`    | `POST`       | Update route status (match, archive)                   |
| `/api/admin/routes`    | `DELETE`     | Delete a route                                         |

## Matching Algorithm

The platform uses a two-tier distance calculation to match transportistas with enviadores:

1. **Haversine filter** (`lib/haversine.ts`) - Fast crow-fly distance calculation to quickly filter candidates within a configurable radius (default 2km).
2. **Driving distance** (`lib/driving-distance.ts`) - For matches that pass the Haversine filter, the OpenRouteService API calculates actual road distance and estimated drive time.

A match occurs when both the **origin** and **destination** of a transportista's route are within the configured radius of an enviador's route (or vice versa).

The admin dashboard provides a radius slider (1-50km) to adjust matching sensitivity. Match results are cached for 24 hours using rounded coordinate keys to reduce database load.

## User Flows

### Shipper (Enviador) Flow

1. Visit the homepage and search for available trucks on their route
2. See live match count (today + tomorrow)
3. Click "Publicar" to register their shipment need
4. Complete the 6-step form:
   - **Step 1**: Origin address (autocomplete with map preview)
   - **Step 2**: Destination address (autocomplete with map preview)
   - **Step 3**: Pickup date
   - **Step 4**: Email verification (6-digit code via AWS SES)
   - **Step 5**: Cargo details (type, pallets, weight, description)
   - **Step 6**: Contact information (name, phone)
5. Route is published as `active`
6. Admin matches them with available truckers

### Trucker (Transportista) Flow

1. Click "Soy Transportista" in the navbar
2. Complete the multi-step form with their return route details
3. Verify email
4. Provide contact information
5. Route is published as `active`
6. Algorithm finds matching shippers

### Admin Flow

1. View all active routes on the dashboard (transportistas and enviadores side-by-side)
2. Adjust the match radius slider
3. Review computed matches with haversine + driving distances
4. Mark compatible routes as "matched"
5. Archive completed routes

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (recommend [Neon](https://neon.tech) for serverless)
- AWS account with SES configured (for email verification)
- OpenRouteService API key (for driving distance calculations)

### Setup

1. **Clone the repository** and navigate to the app:

   ```bash
   cd backhaul-match
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables** by copying the template:

   ```bash
   cp .env.example .env.local
   ```

   Then fill in your values:

   ```env
   # Neon Postgres connection string
   DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

   # AWS SES for email verification
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   AWS_REGION=us-east-1
   SES_FROM_EMAIL=noreply@cerovacio.cl

   # OpenRouteService (driving distance calculation)
   ORS_API_KEY=your_openrouteservice_api_key

   # Base URL
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Run database migrations:**

   ```bash
   npx drizzle-kit push
   ```

5. **Seed the database** (optional - adds test users and routes):

   ```bash
   node seed.mjs
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Script          | Command             | Description                      |
|-----------------|---------------------|----------------------------------|
| `dev`           | `npm run dev`       | Start development server         |
| `build`         | `npm run build`     | Create production build          |
| `start`         | `npm run start`     | Start production server          |
| `lint`          | `npm run lint`      | Run ESLint                       |

## Lead Generation (Python)

The `lead-gen/` directory contains a separate Python toolset for researching and compiling lists of potential customers in Santiago, Chile.

**Scrapers:**
- `scrape_web_search.py` - Google web search for trucking companies and factories
- `scrape_directories.py` - Business directory scraping
- `scrape_google_places.py` - Google Places API for location-based business data

**Pipeline:**
```
run_all.py  -->  scrape_*.py (parallel scrapers)
                      |
               merge_results.py (deduplicate & combine)
                      |
             compile_final_csvs.py (final output)
```

**Outputs:**
- `FINAL_transportistas_santiago.csv` - ~2000 trucking companies
- `FINAL_fabricas_enviadores_santiago.csv` - ~2000 factories/shippers

Each record includes: company name, RUT, website, phone, email, address, contact person, LinkedIn, industry, fleet size, and common routes.

## Key Design Decisions

- **Email-first auth** (no passwords) - Reduces friction for truck drivers who may not want to create accounts with passwords. A 6-digit code sent to their email is sufficient.
- **Haversine + driving distance** - The haversine formula is cheap and fast for initial filtering, while the OpenRouteService API provides accurate road distances only for promising matches.
- **Match caching** - Coordinate-based cache keys (rounded to reduce cardinality) with 24-hour TTL to avoid repeated expensive calculations on the homepage match checker.
- **Serverless Postgres** - Neon's HTTP driver means no persistent connection pools are needed, which works well with Vercel's serverless functions.
- **Simulated activity for Santiago** - When real match counts are low, the homepage shows simulated activity (with realistic randomness) to encourage early adopters to publish routes.
