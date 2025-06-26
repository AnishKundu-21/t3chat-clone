# T3 Chat Clone

Pixel-perfect chat application rebuilt the “T3 Stack” way: **Next.js 15 App Router + TypeScript + Tailwind + Prisma + Next-Auth + shadcn/ui**.

---

## Tech Stack

| Layer         | Choice                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| Framework     | **Next.js 15** (App Router, RSC, Turbopack)                                        |
| Styling / UI  | Tailwind CSS · **shadcn/ui** · Radix Primitives                                    |
| Auth          | **Next-Auth v5 beta** &nbsp;•  Credentials + Google OAuth                          |
| Database      | MongoDB Atlas                                                                      |
| ORM           | Prisma 6                                                                           |
| Fetch / State | SWR                                                                                |
| Icons         | lucide-react                                                                       |
| Toasts        | sonner                                                                             |

---

## What’s Implemented ✅

### 1 Authentication
- **Email / Password** sign-up (`/api/register`) hashed with _bcrypt_  
- **Google OAuth** (linking to existing e-mail automatically)  
- Login/logout/session via Next-Auth; custom full-page `/login` & `/signup`  
- Middleware guard redirects unauthenticated users to `/login`

### 2 Database Schema
- Next-Auth core models (`User`, `Account`, `Session`, `VerificationToken`)  
- **Chat** and **ChatMessage** collections with indexes  
- **UserPreference** document for theme & profile settings

### 3 API Routes
| Method & Path               | Purpose                                      |
| --------------------------- | -------------------------------------------- |
| `GET  /api/chat`            | List user’s chats                            |
| `POST /api/chat`            | Create new chat (auto welcome message)       |
| `GET  /api/chat/[id]`       | Fetch single thread                          |
| `POST /api/chat/[id]`       | Append message (auto-title first message)    |
| `DELETE /api/chat/[id]`     | Remove chat & all messages                   |
| `GET/POST /api/preferences` | Save / load user preferences                 |
| `POST /api/register`        | Email + password account creation            |

### 4 Client Hooks
- `useChats` – SWR cached chat list
- `useChat`  – single thread with optimistic send

### 5 UI Components
- **Sidebar** with search, new-chat, avatar, Google/cred sign-in link  
- **ChatPanel** with frosted-glass action bar (theme toggle, customisation)  
- **FloatingButtons** frosted stack when sidebar is collapsed  
- **SearchDialog**, **Settings** layout with tabs & sticky header  
- **ThemeToggle** (dark / light) with persisted choice

### 6 Settings & Preferences
- **Account** – profile, usage, danger-zone  
- **Customisation**  
  - Personal details (name, job, traits, about)  
  - Visual toggles (boring theme, hide PII, disable breaks, stats)  
  - Pink/Magenta theme tokens + live preview  
  - Toast feedback on save/load (Sonner)

### 7 TypeScript Hygiene
- Fully typed components, `forwardRef`-safe shadcn buttons  
- Prisma types generated post-install  
- Runtime checks for nullables eliminated

---

## Core Requirements Progress

- [ ] **Chat with multiple LLMs**  
- [x] **Auth & Sync** (email + Google, session, DB persistence)  
- [x] **Browser Friendly** (all client-side; App Router)  
- [x] **Easy to Try** (`npm run dev` works out of the box)

---

## Roadmap

1. Integrate real LLM back-ends (OpenAI / Groq / etc.)  
2. Full chat history CRUD & sharing  
3. Attachments, image generation, syntax highlighting  
4. Resumable streams / progressive rendering  
5. Mobile PWA polish & accessibility pass

---

## Local Development

```
# 1 Clone
git clone https://github.com//t3chat-clone.git
cd t3chat-clone

# 2 Install deps
npm install        # or pnpm / yarn

# 3 Environment
cp .env.example .env.local
#  ├─ DATABASE_URL          = your MongoDB URI
#  ├─ AUTH_SECRET           = random string
#  ├─ GOOGLE_CLIENT_ID      = from Google Cloud
#  └─ GOOGLE_CLIENT_SECRET  = from Google Cloud

# 4 Prisma → Mongo
npx prisma db push
npx prisma generate   # (postinstall runs this too)

# 5 Run
npm run dev
# open http://localhost:3000
```

---

## Project Structure

```
src/
├─ app/
│  ├─ (auth)/            # /login /signup layout & pages
│  ├─ api/               # Next.js route handlers
│  ├─ settings/          # /settings with nested tabs
│  └─ globals.css        # Tailwind layers + theme tokens
├─ components/
│  ├─ ui/                # shadcn/ui primitives
│  ├─ chat/              # Chat UI composites
│  └─ settings/          # Settings-page widgets
├─ hooks/                # SWR hooks (useChat, useChats)
├─ lib/
│  ├─ prisma.ts          # Prisma client singleton
│  ├─ utils.ts           # cn(), formatting helpers
│  └─ auth.ts            # Next-Auth helpers
└─ prisma/
   └─ schema.prisma      # MongoDB models
```

---

## License

MIT
