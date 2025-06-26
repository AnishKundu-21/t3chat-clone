# T3 Chat Clone

Pixel-perfect chat application rebuilt the **T3-Stack** way
(**Next.js 15 App Router · TypeScript · Tailwind · Prisma · Next-Auth · shadcn/ui**)

---

## Tech Stack

| Layer         | Choice                                                   |
|---------------|----------------------------------------------------------|
| Framework     | **Next.js 15** (App Router + Turbopack)                  |
| Styling / UI  | Tailwind CSS · shadcn/ui · Radix primitives              |
| Auth          | **Next-Auth v5 (beta)** – Credentials **+ Google OAuth** |
| Database      | MongoDB Atlas                                            |
| ORM           | Prisma 6                                                 |
| Fetch / State | SWR                                                      |
| Icons         | lucide-react                                             |
| Notifications | Sonner                                                   |

---

## What’s Implemented ✔️

### 1 Authentication

- Email / password sign-up (`/api/register`) hashed with bcrypt
- Google OAuth with automatic e-mail linking
- Full-page `/login` / `/signup` (replaces pop-up)
- Session context via `SessionProvider`
- Middleware guard redirects unauthenticated users to `/login`

### 2 Database Schema

- Next-Auth core models (`User`, `Account`, `Session`, `VerificationToken`)
- `Chat` and `ChatMessage` collections with indexes
- `UserPreference` document for theme & profile settings

### 3 API Routes

| Method & Path               | Purpose                               |
|-----------------------------|---------------------------------------|
| `GET  /api/chat`            | List user’s chats                     |
| `POST /api/chat`            | Create a new chat (auto-welcome)      |
| `GET  /api/chat/[id]`       | Fetch single thread                   |
| `POST /api/chat/[id]`       | Append message (auto-title first msg) |
| `DELETE /api/chat/[id]`     | Remove chat & all messages            |
| `GET/POST /api/preferences` | Save / load user preferences          |
| `POST /api/register`        | Register new user (credentials)       |

### 4 Client Hooks

- `useChats` — SWR-cached chat list
- `useChat` — single thread with optimistic send

### 5 UI Components

- **Sidebar** with search, new-chat, avatar, sign-in/out
- **ChatPanel** with frosted-glass action bar (theme toggle + customise)
- **FloatingButtons** frosted stack when sidebar is collapsed
- **SearchDialog**, **Settings** layout with tabs & sticky header
- **ThemeToggle** (dark / light) with persisted choice

### 6 Settings & Preferences

- **Account** page — profile, usage stats, danger zone
- **Customisation** page
  · Personal details (name, job, traits, bio)
  · Visual toggles (boring theme, hide PII, disable breaks, stats)
  · Live font preview & pastel-pink theme tokens
  · Toast notifications on save / load

### 7 TypeScript Hygiene

- Fully typed components & hooks
- Prisma types generated post-install
- Safe `forwardRef` shadcn buttons

---

## Core Requirements Progress

- [ ] **Chat with Various LLMs** — multi-provider inference
- [x] **Authentication & Sync** — credentials + Google, DB persistence
- [x] **Browser Friendly** — no native binaries required
- [x] **Easy to Try** — `npm run dev` works out-of-the-box

---

## Bonus Features (Planned)

- Attachment upload (images / PDFs)
- AI image generation
- Syntax-highlighted code blocks
- Resumable streams after refresh
- Chat branching / sharing links
- Web search integration
- “Bring your own key” (custom API keys)
- Mobile PWA / native wrapper

---

## Roadmap / Next Steps

1. Integrate real LLM back-ends (OpenAI, Groq, etc.)
2. Complete chat CRUD & history syncing
3. Implement bonus features (attachments, images, syntax highlight)
4. Resumable streaming & message persistence
5. Accessibility, mobile polish, PWA deploy

---

## Local Development

```
# 1 Clone
git clone https://github.com//t3chat-clone.git
cd t3chat-clone
```

```
# 2 Install deps
npm install        # or pnpm / yarn
```

```
# 3 Environment
cp .env.example .env.local
#   DATABASE_URL          = your Mongo URI
#   AUTH_SECRET           = random string
#   GOOGLE_CLIENT_ID      = OAuth ID
#   GOOGLE_CLIENT_SECRET  = OAuth secret
```

```
# 4 Sync schema & generate client
npx prisma db push
npx prisma generate
```

```# 5 Run dev server
npm run dev
#  http://localhost:3000
```

---

## Project Structure

```
src/
├─ app/
│  ├─ (auth)/            # /login, /signup layout & pages
│  ├─ api/               # Route handlers (chat, auth, preferences)
│  ├─ settings/          # /settings/* nested tabs
│  └─ globals.css        # Tailwind layers + theme tokens
├─ components/
│  ├─ ui/                # shadcn primitives
│  ├─ chat/              # Chat UI composites
│  └─ settings/          # Settings widgets
├─ hooks/                # useChat, useChats (SWR)
├─ lib/
│  ├─ prisma.ts          # Prisma client singleton
│  ├─ auth.ts            # Next-Auth helpers
│  └─ utils.ts           # Utility fns
└─ prisma/
   └─ schema.prisma
```

---

## License

MIT