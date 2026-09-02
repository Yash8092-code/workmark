# WORKMARK

![Workmark](https://img.shields.io/badge/Status-Stable%20Milestone%20v1.0.0-success?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Playwright](https://img.shields.io/badge/Playwright-14%2F14%20Passed-brightgreen?style=for-the-badge&logo=playwright)

**Find where you belong.**

Workmark is a modern, full-stack intelligent job discovery and recruitment platform connecting job seekers with high-impact opportunities globally. Built with speed, security, and precision at its core.

---

## 🌟 Key Features

### 🔍 Intelligent Job Discovery & Search
- **Opportunity Radar**: Personalized job recommendations matching seeker skills and country preferences.
- **Country-Aware Job Discovery**: Multi-country job search supporting India, United States, United Kingdom, Canada, Australia, and more.
- **Advanced Multi-Dimensional Filtering**:
  - Filter by Country & City/Location with live typeahead suggestions
  - Work Mode (Remote, Hybrid, Onsite)
  - Job Category / Domain
  - Employment Type (Full-time, Part-time, Contract, Internship)
  - Experience Level & Salary Range
  - Date Posted & Job Source
- **Real-Time URL Sync**: All filters synchronize cleanly with browser URLs for shareable, bookmarkable search states.
- **External Job Ingestion**: Seamless real-time external job aggregation via Adzuna API with deduplication and normalization.
- **Job Match Scoring**: Intelligent scoring based on title, skills, location, and candidate profile preferences.

### 👤 For Job Seekers
- **Professional Profiles**: Manage experience, education, skills, resume uploads, and job alert preferences.
- **Email OTP Verification**: Secure email-based OTP verification powered by Resend with SHA-256 cryptographic token hashing.
- **One-Click Applications**: Apply to jobs with tailored resumes, cover notes, and custom answers.
- **Visual Application Tracking**: Real-time status tracker (Applied, Under Review, Shortlisted, Interviewing, Offered, Rejected).
- **Saved Jobs**: Quick bookmarking to save opportunities for later evaluation.
- **In-App & Email Notifications**: Automatic status updates and job alert notifications.

### 🏢 For Employers
- **Company Profile Management**: Branded company profiles with logos, cover images, and company bios.
- **Job Posting & Management**: Create, edit, draft, publish, and close job postings.
- **Applicant Tracking System (ATS)**: Review candidate applications, inspect profiles and resumes, and update hiring stages.
- **Employer Analytics**: Track job views, applicant volume, and conversion rates.

---

## 🛠️ Technology Stack

### Frontend (`workmark-web`)
- **React 19** & **TypeScript**
- **Vite** - High-performance frontend bundler
- **Tailwind CSS v4** - Utility-first modern design system
- **React Router v7** - Client-side routing and URL state handling
- **TanStack Query (React Query)** - Server state caching and synchronization
- **React Hook Form** & **Zod** - Form management and validation
- **Axios** - HTTP API client with auth interceptors
- **Lucide React** - Modern iconography
- **React Hot Toast** - Toast notification system
- **Playwright** - End-to-end automated testing suite

### Backend (`workmark-api`)
- **Node.js** & **Express**
- **TypeScript** - Strict type checking
- **MongoDB** & **Mongoose** - Database and schema modeling
- **JWT & HTTP-Only Cookies** - Secure session authentication
- **bcryptjs** - Password hashing (salt rounds)
- **Resend** - Transactional email delivery (OTPs, notifications, job alerts)
- **Adzuna API** - Live external job feed integration
- **Cloudinary** & **Multer** - Media and resume upload storage
- **Helmet** & **Express Rate Limit** - API security and rate throttling
- **Zod** - Robust request payload validation

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                   React 19 Web Client                    │
│      (Vite + Tailwind CSS + TanStack Query + Router)     │
│                      Port 5173 / 5174                    │
└────────────────────────────┬─────────────────────────────┘
                             │
                             │ REST API / JSON / Cookies
                             │
┌────────────────────────────▼─────────────────────────────┐
│                   Express API Server                     │
│               (Node.js + TypeScript + Zod)               │
│                        Port 5000                         │
└───────┬────────────────────┬─────────────────────┬───────┘
        │                    │                     │
┌───────▼───────┐    ┌───────▼───────┐     ┌───────▼───────┐
│ MongoDB Atlas │    │  Adzuna API   │     │  Resend Email │
│ (Mongoose ODM)│    │  (Job Feeds)  │     │ (OTPs/Alerts) │
└───────────────┘    └───────────────┘     └───────────────┘
```

---

## 📂 Repository Structure

```
WorkMark/
├── workmark-web/                  # Frontend Application
│   ├── src/
│   │   ├── api/                   # API client and endpoints
│   │   ├── components/            # UI, layout, jobs, auth components
│   │   ├── context/               # Auth and Global state contexts
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Route page components
│   │   └── types/                 # TypeScript type definitions
│   ├── e2e/                       # Playwright E2E test specs
│   ├── public/                    # Static public assets
│   ├── package.json
│   ├── playwright.config.ts       # Playwright configuration
│   ├── vite.config.ts             # Vite configuration
│   └── .env.example               # Frontend environment template
│
├── workmark-api/                  # Backend Application
│   ├── src/
│   │   ├── config/                # Database, Cloudinary, Countries config
│   │   ├── controllers/           # Route controller logic
│   │   ├── middleware/            # Auth, rate limiting, error middleware
│   │   ├── models/                # Mongoose database models
│   │   ├── routes/                # Express API routes
│   │   ├── services/              # Adzuna, Email, Job Alert services
│   │   ├── templates/             # Email HTML templates
│   │   └── server.ts              # Express application entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example               # Backend environment template
│
├── .gitignore                     # Git exclusion rules
└── README.md                      # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18 or later (v20+ recommended)
- **npm**: v9+ or later
- **MongoDB**: Local MongoDB instance or free MongoDB Atlas cluster
- **Adzuna Developer Account** (Optional for external job feeds)
- **Resend Account** (Optional for email delivery)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Yash8092-code/workmark.git
cd workmark
```

---

### 2. Backend Setup (`workmark-api`)

```bash
cd workmark-api
npm install
cp .env.example .env
```

Open `.env` and fill in your configuration:

```env
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=workmark

# Authentication
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# URLs
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173

# Optional: Transactional Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Workmark <onboarding@resend.dev>

# Optional: External Jobs (Adzuna)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
ADZUNA_BASE_URL=https://api.adzuna.com/v1/api
ADZUNA_DEFAULT_COUNTRIES=in,us,gb,ca,au
```

Start the backend server:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`.

---

### 3. Frontend Setup (`workmark-web`)

In a new terminal:
```bash
cd workmark-web
npm install
cp .env.example .env
```

Configure `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```
Frontend runs at `http://localhost:5173`.

---

## 🧪 Testing & Verification

### Frontend TypeScript & Production Build
```bash
cd workmark-web
npm run build
```

### Backend TypeScript Build
```bash
cd workmark-api
npm run build
```

### End-to-End Automated Tests (Playwright)
```bash
cd workmark-web
npx playwright test
```

All 14 automated tests cover:
1. Homepage loading and navigation
2. Jobs page default country & Opportunity Radar toggle
3. Work mode filtering & URL synchronization
4. City / Location autocomplete and filtering
5. Category filtering propagation
6. Multi-filter combination (AND logic) & persistence on page refresh
7. Filter resetting & clearing state across desktop and mobile viewports

---

## 🔒 Security & Environment Protection

- **No Secrets in Version Control**: `.env` files are ignored via `.gitignore`.
- **Placeholder Templates**: `.env.example` provided for both frontend and backend.
- **Client-Side Safety**: Vite only exposes explicit `VITE_` variables; backend private keys (Adzuna, Resend, Cloudinary, Mongo) are never accessible from the client.
- **Hashed Credentials**: Passwords hashed with `bcryptjs`, email OTPs hashed using SHA-256 tokens.
- **API Guardrails**: CORS whitelist, Helmet HTTP headers, Rate Limiting, and Zod schema validation.

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yash**
- GitHub: [@Yash8092-code](https://github.com/Yash8092-code)
- Repository: [workmark](https://github.com/Yash8092-code/workmark)
