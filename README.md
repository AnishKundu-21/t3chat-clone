Absolutely! Here’s your **updated `README.md`** in the style you provided, with your current progress and roadmap included.

---

```markdown
# T3 Chat Clone

Pixel-perfect chat application rebuilt with the T3 Stack philosophy (Next.js 14 App Router + TypeScript + Tailwind + Prisma + Next-Auth + shadcn/ui).

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS / shadcn/ui
- **Auth:** Next-Auth v5 (beta) — Credentials, **Session** context in `Providers.tsx`
- **Database:** MongoDB Atlas
- **ORM:** Prisma 6
- **State / Fetching:** SWR
- **Icons:** lucide-react

---

## What’s Implemented

### 1. Authentication
- **Email & password** signup/login via Next-Auth credentials provider
- **Secure hashing** with bcrypt
- **Login / logout** with persistent sessions
- **SessionProvider** in `Providers.tsx`
- **Sign-out button** in UI with toast feedback

### 2. Database Schema
- **Standard Next-Auth models:** `User`, `Account`, `Session`, `VerificationToken`
- **Chat & ChatMessage** collections with relations & indexes
- **UserPreference** collection for storing user settings as JSON
- **Automatic chat title** set from first user message

### 3. API Routes
- **`GET /api/chat`** – List user’s chats
- **`POST /api/chat`** – Create new chat with welcome message
- **`GET /api/chat/[id]`** – Fetch full thread
- **`POST /api/chat/[id]`** – Append message (auto-title)
- **`DELETE /api/chat/[id]`** – Remove chat & all messages
- **`GET /api/preferences`** – Fetch user preferences
- **`POST /api/preferences`** – Save user preferences (customization, settings)

### 4. Client Hooks
- **`useChats` (SWR)** – Cached chat list
- **`useChat` (SWR)** – Single thread with optimistic `sendMessage`
- **Automatic preference loading** (updates UI on page load/refresh)

### 5. UI
- **Sidebar** with dynamic session info, search, new-chat, hover-delete icon + confirm dialog
- **ChatPanel** for messages & input
- **FloatingButtons** for collapsed sidebar
- **SearchDialog** to jump between threads
- **Dark-mode ready**
- **Settings Layout**
    - Sticky header with back button, sign-out, theme toggle
    - Tab navigation for settings pages
- **Customization Page**
    - **User profile fields:** Name, job, traits, about
    - **Visual options toggles:** Boring theme, hide personal info, disable breaks, stats
    - **Font selection:** Main text and code fonts
    - **Preview panel** for code/message styling
    - **Save/load preferences** with toast feedback
- **Toaster** for global toast notifications

### 6. TypeScript Hygiene
- **All components typed**
- **`ref`-safe buttons** (`forwardRef` fix)
- **Runtime/compile-time issues resolved** (`title` never null, `updatedAt` always number)

---

## Roadmap / To-Do

- **Settings Pages**
    - [ ] **Account Page:** User info, usage stats, password reset, account deletion
    - [ ] **Customization Page:**  
        - [ ] **Connect visual option toggles to actual UI changes** (boring theme, hide PII, disable breaks, stats)
        - [ ] **Add more customization options:** Colors, layout, chat bubbles, etc.
    - [ ] **Models/API Keys/Attachments/Contact Us Pages:** Flesh out more tabs in settings navigation
- **Chat & Messaging**
    - [ ] **Integrate assistant response** (OpenAI / local LLM)
    - [ ] **Merge or import local chats into account after login**
    - [ ] **Pagination / infinite scroll for long threads**
- **Authentication**
    - [ ] **Social auth providers** (Google, GitHub)
    - [ ] **Forgot-password / email verification flow**
    - [ ] **Rate-limiting & abuse protection**
- **UI & UX**
    - [ ] **Mobile-first layout polish**
    - [ ] **Accessibility review and aria-labels**
- **Testing & DevOps**
    - [ ] **Unit & integration tests** (Playwright / Vitest)
    - [ ] **CI pipeline** (lint + type-check + test)
    - [ ] **Vercel deploy script & environment documentation**
- **Extra**
    - [ ] **Image uploads**
    - [ ] **Markdown support in chat**
    - [ ] **Keyboard shortcuts**
    - [ ] **User management (admin features)**
    - [ ] **Notifications**

---

## Local Development

1. **Clone the repository (replace ``):**
   ```
   git clone https://github.com//t3chat-clone.git
   cd t3chat-clone
   ```
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Create and configure your environment file:**
   ```
   cp .env.example .env.local
   ```
   Open `.env.local` and fill in your `DATABASE_URL` and `AUTH_SECRET`.
4. **Push the Prisma schema to MongoDB:**
   ```
   npx prisma db push
   ```
5. **Generate the Prisma client:**
   ```
   npx prisma generate
   ```
6. **Run the development server:**
   ```
   npm run dev
   ```

---

## License

MIT
```