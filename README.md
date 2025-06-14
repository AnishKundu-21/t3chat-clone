```markdown
# T3 Chat Clone

Pixel-perfect chat application rebuilt with the **T3 Stack** philosophy  
(Next .js 14 App Router + TypeScript + Tailwind + Prisma + Next-Auth + shadcn/ui).

---

## 📦  Tech Stack

| Layer            | Library / Service                |
| ---------------- | -------------------------------- |
| Framework        | Next .js 14 (App Router)         |
| Styling          | Tailwind CSS / shadcn/ui         |
| Auth             | Next-Auth v5 (beta) — Credentials |
| Database         | MongoDB Atlas                    |
| ORM              | Prisma 6                         |
| State / Fetching | SWR                              |
| Icons            | lucide-react                     |

---

## ✅  What’s Implemented

### 1 · Authentication
- Email / password signup (`/api/register`).
- Secure hashing with **bcrypt**.
- Login / logout handled by Next-Auth credentials provider.
- Session context wrapped with a **SessionProvider** in `Providers.tsx`.
- UI: `AuthDialog` (Shadcn dialog + tabs).

### 2 · Database Schema
- Standard Next-Auth models (`User`, `Account`, …).
- **Chat** & **ChatMessage** collections with relations & indexes.
- Automatic chat title set from first user message.

### 3 · API Routes
- `GET /api/chat` – list user’s chats.  
- `POST /api/chat` – create new chat with welcome message.  
- `GET /api/chat/[id]` – full thread.  
- `POST /api/chat/[id]` – append message (auto-title).  
- `DELETE /api/chat/[id]` – remove chat & all messages.

### 4 · Client Hooks
- `useChats` (SWR) – cached chat list.  
- `useChat` (SWR) – single thread with optimistic `sendMessage`.

### 5 · UI
- **Sidebar** with dynamic session info, search, new-chat, hover-delete icon + confirm dialog.
- **ChatPanel** for messages & input.
- **FloatingButtons** for collapsed sidebar.
- **SearchDialog** to jump between threads.
- Dark-mode ready.

### 6 · TypeScript Hygiene
- All components typed, `ref`-safe buttons (`forwardRef` fix).
- Runtime / compile-time issues resolved (`title` never null, `updatedAt` always number).

---

## 🗺️ Roadmap / To-Do

| Status | Feature / Task |
| :---: | --- |
| ⬜︎ | Integrate assistant response (OpenAI / local LLM) |
| ⬜︎ | Merge or import **local** chats into account after login |
| ⬜︎ | Social auth providers (Google, GitHub) |
| ⬜︎ | Forgot-password / email verification flow |
| ⬜︎ | Rate-limiting & abuse protection |
| ⬜︎ | Pagination / infinite scroll for long threads |
| ⬜︎ | Mobile-first layout polish |
| ⬜︎ | Unit & integration tests (Playwright / Vitest) |
| ⬜︎ | CI pipeline (lint + type-check + test) |
| ⬜︎ | Vercel deploy script & environment doc |
| ⬜︎ | Accessibility review and aria-labels |

---

## 🛠 Local Development

```
git clone https://github.com//t3chat-clone.git
cd t3chat-clone

# install deps
npm install

# copy .env and fill DATABASE_URL + AUTH_SECRET
cp .env.example .env.local

# push Prisma schema to MongoDB
npx prisma db push

# generate Prisma client
npx prisma generate

# dev
npm run dev
```

---

## 📄 License
MIT
```
