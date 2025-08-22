# T3 Chat Clone

Pixel-perfect chat application rebuilt the **T3-Stack** way
(**Next.js 15 App Router · TypeScript · Tailwind · Prisma · Next-Auth · shadcn/ui**)

---

## Tech Stack

| Layer         | Choice                                                   |
| ------------- | -------------------------------------------------------- |
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

1 Authentication

- Credentials sign-up via [`/api/register`](src/app/api/register/route.ts) with bcrypt hashing
- Google OAuth with automatic email linking
- Full-page [`/login`](<src/app/(auth)/login/page.tsx>) and [`/signup`](<src/app/(auth)/signup/page.tsx>)
- Session context via NextAuth `SessionProvider`
- Middleware guard redirects unauthenticated users to `/login`

2 Database Schema

- NextAuth core models: `User`, `Account`, `Session`, `VerificationToken`
- Application models: `Chat`, `ChatMessage` with indexes, and `UserPreference` for settings
- Backed by MongoDB Atlas via Prisma (see [`prisma/schema.prisma`](prisma/schema.prisma))

3 API Routes

- Chat CRUD and retrieval:
  - `GET  /api/chat` — list user chats
  - `POST /api/chat` — create a new chat (auto-welcome)
  - `GET  /api/chat/[id]` — fetch a single thread
  - `POST /api/chat/[id]` — append message (auto-title first msg)
  - `DELETE /api/chat/[id]` — remove chat and all messages
- Preferences:
  - `GET/POST /api/preferences` — load/save user preferences
- Registration:
  - `POST /api/register` — credentials registration

4 AI Streaming (OpenRouter)

- Implemented streaming route to generate assistant replies token-by-token via OpenRouter
- Endpoint: [`/api/chat/stream`](src/app/api/chat/stream/route.ts)
- Uses `openai-edge` + `ai` helpers (`OpenAIStream`, `StreamingTextResponse`)
- Auth required via `getCurrentUser`; model is user-selected (Settings → Models) and passed per request

5 Client Hooks

- [`useChats`](src/hooks/useChats.ts) — SWR-cached chat list
- [`useChat`](src/hooks/useChat.ts) — single thread with optimistic send, revalidation, and chat list invalidation

6 UI Components

- [`Sidebar`](src/components/Sidebar.tsx) with search, new chat, avatar, sign-in/out
- [`ChatPanel`](src/components/ChatPanel.tsx) with frosted-glass action bar (theme toggle, customise)
- [`ChatMessage`](src/components/ChatMessage.tsx) for rendering turns
- [`ChatInput`](src/components/ChatInput.tsx) with model selector and send button
- [`FloatingButtons`](src/components/FloatingButtons.tsx), [`SearchDialog`](src/components/SearchDialog.tsx)
- Settings layout and widgets under [`src/app/settings`](src/app/settings/) and [`src/components/settings`](src/components/settings/)
- shadcn/ui primitives under [`src/components/ui`](src/components/ui)

7 Settings & Preferences

- Settings pages:
  - Customization: personal details (name, job, traits, bio)
  - API Keys: store your OpenRouter API key
  - Models: fetch catalog from OpenRouter and choose which models appear in the chat selector
  - Toast notifications on save

8 TypeScript Hygiene

- Fully typed components and hooks
- Prisma types generated post-install
- Safe `forwardRef` patterns for shadcn components

---

## Core Requirements Progress

- [x] **Chat with LLMs (OpenRouter)** — streaming via `/api/chat/stream`
- [ ] **Multi-provider support** — additional providers (OpenAI, Groq, etc.)
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
git clone https://github.com/your-username/t3chat-clone.git
cd t3chat-clone
```

```
# 2 Install deps
npm install        # or pnpm / yarn
```

```
# 3 Environment (Windows PowerShell)
Copy-Item .env.example .env.local
# Copy to `.env.local` for local development
# Database (MongoDB connection string)
DATABASE_URL=

# NextAuth
AUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OpenRouter API Key
OPENROUTER_API_KEY=
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

## Maintenance & Fixes

- Unified Prisma usage via `src/lib/prisma.ts` to avoid multiple clients in dev.
- Standardized password hashing to `bcryptjs` across API routes to prevent native build issues on Windows.
- Resolved `SearchDialog` casing; `src/components/SearchDialog.tsx` is canonical and the lowercase file re-exports it. Props updated to accept chat list items.
- Harmonized PostCSS config to standard Tailwind + Autoprefixer.
- Added `.env.example` with required variables.

If you previously had casing conflicts on case-insensitive filesystems (Windows), pull latest; the lowercase `search-dialog.tsx` now re-exports the canonical component.

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
