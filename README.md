# 🧭 CareerNav AI

An AI-powered career navigator built with **Next.js 14**, **Gemini AI**, **Clerk**, **shadcn/ui**, **Prisma**, and **Supabase**.

---

## ✨ Features

- 🤖 **AI Career Advisor** — Chat with Gemini AI for personalized career guidance
- 📄 **Resume Analyzer** — Upload PDF resume, get ATS score + detailed feedback
- 🗺️ **Career Roadmap Builder** — AI-generated step-by-step career plans
- 👤 **User Profile** — Track current role, target role, skills & experience
- 🔐 **Auth** — Secure login/signup via Clerk
- 🗄️ **Database** — PostgreSQL via Supabase + Prisma ORM

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router, TypeScript) |
| UI | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Auth | Clerk |
| AI | Google Gemini API |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) + Prisma ORM |
| Deployment | Vercel |

---

## 🚀 Setup Guide

### Step 1 — Clone & Install

```bash
git clone https://github.com/yourusername/ai-career-navigator.git
cd ai-career-navigator
npm install
```

---

### Step 2 — Setup Clerk (Auth)

1. Go to [clerk.com](https://clerk.com) → Create a new app
2. Copy your **Publishable Key** and **Secret Key**
3. In Clerk Dashboard → Configure:
   - Sign-in URL: `/login`
   - Sign-up URL: `/signup`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

---

### Step 3 — Setup Gemini API

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API Key
3. Copy the key

---

### Step 4 — Setup Supabase (Database)

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Go to **Settings → Database**
3. Copy the **Connection string** (both pooling and direct)
   - `DATABASE_URL` = Transaction pooler URL (port 6543)
   - `DIRECT_URL` = Direct connection URL (port 5432)

---

### Step 5 — Environment Variables

Create `.env.local` in project root:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxx
CLERK_SECRET_KEY=sk_test_xxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Gemini AI
GEMINI_API_KEY=AIzaxxxx

# Supabase / PostgreSQL
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

---

### Step 6 — Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

---

### Step 7 — Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
ai-career-navigator/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── chat/page.tsx
│   │   ├── resume/page.tsx
│   │   ├── roadmap/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   ├── chat/route.ts
│   │   ├── resume/analyze/route.ts
│   │   ├── roadmap/generate/route.ts
│   │   └── profile/update/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── not-found.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── DashboardHeader.tsx
│   └── ui/
├── lib/
│   ├── gemini.ts
│   ├── db.ts
│   └── utils.ts
├── hooks/
│   └── use-toast.ts
├── types/
│   └── index.ts
├── prisma/
│   └── schema.prisma
├── middleware.ts
└── .env.local
```

---

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add all env variables in Vercel Dashboard → Settings → Environment Variables
```

Or connect your GitHub repo directly at [vercel.com](https://vercel.com) for auto-deployments.

---

## 🤝 Contributing

PRs welcome! Open an issue first for major changes.

---

## 📄 License

MIT
