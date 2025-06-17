### T3 Chat Clone

Pixel-perfect chat application rebuilt with the T3 Stack philosophy (Next.js 14 App Router + TypeScript + Tailwind + Prisma + Next-Auth + shadcn/ui).

---

### Tech Stack

-   **Framework:** Next.js 14 (App Router)
-   **Styling:** Tailwind CSS / shadcn/ui
-   **Auth:** Next-Auth v5 (beta) — Credentials
-   **Database:** MongoDB Atlas
-   **ORM:** Prisma 6
-   **State / Fetching:** SWR
-   **Icons:** lucide-react
-   **Notifications:** Sonner (toast library)

---

### What's Implemented

**1. Authentication**
-   Email / password signup (`/api/register`).
-   Secure hashing with **bcrypt**.
-   Login / logout handled by Next-Auth credentials provider.
-   Session context wrapped with a **SessionProvider** in `Providers.tsx`.
-   UI: `AuthDialog` (Shadcn dialog + tabs).

**2. Database Schema**
-   Standard Next-Auth models (`User`, `Account`, …).
-   **Chat** & **ChatMessage** collections with relations & indexes.
-   **UserPreference** model for storing user settings as JSON.
-   Automatic chat title set from first user message.

**3. API Routes**
-   `GET /api/chat` – list user's chats.
-   `POST /api/chat` – create new chat with welcome message.
-   `GET /api/chat/[id]` – full thread.
-   `POST /api/chat/[id]` – append message (auto-title).
-   `DELETE /api/chat/[id]` – remove chat & all messages.
-   `GET/POST /api/preferences` – save/load user customization settings.

**4. Client Hooks**
-   `useChats` (SWR) – cached chat list.
-   `useChat` (SWR) – single thread with optimistic `sendMessage`.

**5. UI Components**
-   **Sidebar** with dynamic session info, search, new-chat, hover-delete icon + confirm dialog.
-   **ChatPanel** for messages & input.
-   **FloatingButtons** for collapsed sidebar.
-   **SearchDialog** to jump between threads.
-   **Settings Layout** with sticky header & tab navigation.
-   **ThemeToggle** component for dark/light mode switching.
-   Dark-mode ready with theme persistence.

**6. Settings & Preferences**
-   **Account Page** – user profile, usage stats, pro plan benefits, danger zone.
-   **Customization Page** – comprehensive user preference management:
     -   Personal info (name, job, traits, bio)
     -   Visual options toggles (boring theme, hide PII, disable breaks, stats)
     -   Font selection (main text and code fonts with live preview)
     -   Auto-load preferences on page mount
     -   Toast notifications for save/load actions
     -   Database persistence with MongoDB

**7. TypeScript Hygiene**
-   All components typed, `ref`-safe buttons (`forwardRef` fix).
-   Runtime / compile-time issues resolved (`title` never null, `updatedAt` always number).
-   Proper session handling with user ID access in server components.

---

### Roadmap / To-Do

**Authentication & Security**
-   [ ] Social auth providers (Google, GitHub)
-   [ ] Forgot-password / email verification flow
-   [ ] Rate-limiting & abuse protection

**Settings & Preferences**
-   [x] **Visual toggles implemented** (state management complete)
-   [ ] **Connect toggles to actual UI changes** (apply boring theme, hide PII, etc.)
-   [ ] **Complete remaining settings tabs:**
     -   [ ] History & Sync page
     -   [ ] Models configuration page
     -   [ ] API Keys management page
     -   [ ] Attachments settings page
     -   [ ] Contact Us page

**Chat Features**
-   [ ] Integrate assistant response (OpenAI / local LLM)
-   [ ] Merge or import **local** chats into account after login
-   [ ] Attachment support (images, files)
-   [ ] Markdown rendering in messages
-   [ ] Message reactions and editing

**Performance & UX**
-   [ ] Pagination / infinite scroll for long threads
-   [ ] Mobile-first layout polish
-   [ ] Keyboard shortcuts implementation
-   [ ] Loading states and skeleton UI
-   [ ] Offline support with service workers

**Development & Deployment**
-   [ ] Unit & integration tests (Playwright / Vitest)
-   [ ] CI pipeline (lint + type-check + test)
-   [ ] Vercel deploy script & environment doc
-   [ ] Accessibility review and aria-labels
-   [ ] Performance optimization and bundle analysis

---

### Local Development

**1. Clone the repository (replace )**
```
git clone https://github.com//t3chat-clone.git
cd t3chat-clone
```

**2. Install dependencies**
```
npm install
```

**3. Create and configure your environment file**
```
cp .env.example .env.local
```
Then, open `.env.local` and fill in your `DATABASE_URL` and `AUTH_SECRET`.

**4. Push the Prisma schema to MongoDB**
```
npx prisma db push
```

**5. Generate the Prisma client**
```
npx prisma generate
```

**6. Run the development server**
```
npm run dev
```

**7. Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

---

### Project Structure

```
src/
├── app/
│   ├── api/          # API routes (auth, chat, preferences)
│   ├── settings/     # Settings pages with nested layouts
│   └── globals.css   # Global styles
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── settings/     # Settings-specific components
│   └── chat/         # Chat-related components
├── lib/
│   ├── auth.ts       # NextAuth configuration
│   ├── prisma.ts     # Prisma client singleton
│   └── utils.ts      # Utility functions
└── prisma/
    └── schema.prisma # Database schema
```

---

### License

MIT
