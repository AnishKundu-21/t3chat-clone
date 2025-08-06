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

1 Authentication
- Credentials sign-up via [`/api/register`](src/app/api/register/route.ts) with bcrypt hashing
- Google OAuth with automatic email linking
- Full-page [`/login`](src/app/(auth)/login/page.tsx) and [`/signup`](src/app/(auth)/signup/page.tsx)
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
- Auth required via `getCurrentUser`; model selectable per request
- Default model: `google/gemma-2-9b-it:free` (configurable via request body)

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
- Account and Customisation pages:
  - Personal details (name, job, traits, bio)
  - Visual toggles (boring theme, hide PII, disable breaks, stats)
  - Live font preview & pastel-pink theme tokens
  - Toast notifications on save/load

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