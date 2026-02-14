# StudyBuddy

An offline-first, browser-based AI learning platform that runs LLM inference **entirely on the student's device** via WebGPU. No cloud AI costs, no data collection — conversations never leave the browser.

## Why StudyBuddy?

| Problem | StudyBuddy's Answer |
|---|---|
| Cloud AI tools cost $20+/month per student | Model runs locally — zero per-student AI cost |
| Student chat logs stored on corporate servers | All data stays in IndexedDB on the device |
| No internet at home = no AI tutor | Works fully offline after one-time model download |
| AI gives answers instead of teaching | System prompt tuned to guide, not solve |

## Features

- **Local AI Chat** — Streaming LLM responses powered by [WebLLM](https://github.com/mlc-ai/web-llm), running Llama 3.2 1B directly in the browser via WebGPU
- **Document Q&A** — Upload a PDF, TXT, or Markdown file and ask the AI questions about it. Text is extracted client-side (no upload to any server)
- **Notes** — Built-in note editor with auto-save, organized alongside your study sessions
- **Document Library** — Browse and manage all uploaded documents in one place
- **Offline-First PWA** — Installable as a desktop/mobile app. After the initial model download, everything works without internet
- **Privacy by Design** — FERPA/COPPA/GDPR-friendly. Zero telemetry, zero server-side storage of student data

## Requirements

- **Browser:** Chrome 113+, Edge 113+, or any Chromium-based browser with WebGPU support
- **GPU:** Any discrete or integrated GPU with WebGPU drivers (~1 GB VRAM minimum)
- **Storage:** ~800 MB for the default model (Llama 3.2 1B), cached after first download
- **Node.js:** 18+ (for local development only)

> **Note:** Safari and Firefox do not yet have full WebGPU support. The app will show a clear error message on unsupported browsers.

## Quick Start

```bash
# Clone the repository
git clone <repo-url>
cd school

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in Chrome/Edge. The onboarding flow will walk you through downloading the AI model.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript, Vite 7 |
| Styling | Tailwind CSS v4, shadcn/ui, Radix UI |
| AI Runtime | [@mlc-ai/web-llm](https://github.com/mlc-ai/web-llm) (WebGPU) |
| Model | Llama 3.2 1B Instruct (q4f32, ~800 MB) |
| Storage | IndexedDB via [idb](https://github.com/jakearchibald/idb) |
| PDF Parsing | [pdfjs-dist](https://github.com/nicolo-ribaudo/pdfjs-dist) (client-side) |
| Routing | react-router-dom v7 |
| PWA | vite-plugin-pwa + Workbox |

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── chat/                # Chat interface
│   │   ├── ChatContainer    # Main chat view — messages, input, file upload
│   │   ├── ChatMessage      # Single message bubble (user or assistant)
│   │   ├── ChatInput        # Text input with send + file upload buttons
│   │   ├── ChatHistory      # Sidebar list of past conversations
│   │   ├── StreamingIndicator  # Animated "thinking" dots
│   │   └── DocumentAttachment  # Shows attached document name in chat header
│   ├── workspace/           # Study workspace
│   │   ├── WorkspaceContainer  # Tabs for Notes and Documents
│   │   ├── NoteEditor       # Auto-saving note editor
│   │   ├── NoteList         # Sortable list of notes
│   │   └── DocumentLibrary  # Grid of uploaded documents
│   ├── onboarding/          # First-run setup wizard
│   │   ├── OnboardingFlow   # 3-step flow controller
│   │   ├── WelcomeStep      # Introduction screen
│   │   ├── ModelDownloadStep  # Model download with progress bar
│   │   └── ReadyStep        # Success confirmation
│   ├── layout/              # App shell
│   │   ├── AppShell         # Sidebar + main content + mobile responsive
│   │   ├── Sidebar          # Navigation + chat history + model status
│   │   └── ModelStatusBadge # Green/yellow/red model status indicator
│   └── common/              # Shared components
│       ├── WebGPUCheck      # Blocks the app with error if WebGPU unavailable
│       └── OfflineIndicator # Yellow banner when network is disconnected
├── hooks/
│   ├── useWebLLM.ts         # Model loading, status tracking, streaming chat
│   ├── useChat.ts           # Message state, persistence, document-aware context
│   ├── useNotes.ts          # Notes CRUD against IndexedDB
│   ├── useDocuments.ts      # Document listing and deletion
│   ├── useOnboarding.ts     # Onboarding completion state (localStorage)
│   └── useOnlineStatus.ts   # Navigator online/offline events
├── lib/
│   ├── webllm.ts            # Engine singleton — one MLCEngine shared app-wide
│   ├── db.ts                # IndexedDB schema and CRUD operations
│   ├── documents.ts         # PDF/text extraction and text chunking
│   ├── constants.ts         # Model ID, system prompt, app config
│   └── utils.ts             # Tailwind class merge utility
├── pages/
│   ├── OnboardingPage.tsx   # Full-screen onboarding wizard
│   ├── ChatPage.tsx         # Chat view (new or existing conversation)
│   ├── WorkspacePage.tsx    # Notes + document library
│   └── SettingsPage.tsx     # Model info, clear data, re-run onboarding
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── App.tsx                  # Router, onboarding guard, WebGPU check
├── main.tsx                 # Entry point
└── index.css                # Tailwind + shadcn/ui theme variables
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser (PWA)                  │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  React   │  │  WebLLM  │  │  IndexedDB   │  │
│  │   UI     │──│  Engine  │  │  (idb)       │  │
│  │          │  │  (WebGPU)│  │              │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│       │              │              │           │
│       │         ┌────┴─────┐   ┌────┴────┐     │
│       │         │  Cache   │   │ convos  │     │
│       │         │  Storage │   │ docs    │     │
│       │         │ (model)  │   │ notes   │     │
│       │         └──────────┘   └─────────┘     │
│  ┌────┴──────────────────────────────────┐     │
│  │         Service Worker (Workbox)       │     │
│  │   Precaches app shell + runtime       │     │
│  │   caches model files from HuggingFace │     │
│  └───────────────────────────────────────┘     │
└─────────────────────────────────────────────────┘
          No server required for MVP
```

**Key design decision:** The AI engine is a **module-level singleton** (`src/lib/webllm.ts`). Only one `MLCEngine` instance is ever created, preventing multiple model loads from exhausting GPU memory. All components access it through the `useWebLLM` hook.

## Routes

| Path | Page | Description |
|---|---|---|
| `/onboarding` | OnboardingPage | First-run wizard. Redirects to `/chat` if already completed |
| `/chat` | ChatPage | New conversation |
| `/chat/:id` | ChatPage | Existing conversation loaded from IndexedDB |
| `/workspace` | WorkspacePage | Notes editor + document library |
| `/settings` | SettingsPage | Model info, data management |

## How It Works

### AI Chat Flow
1. User types a message
2. The message history + system prompt (+ optional document context) is sent to the local WebLLM engine
3. WebLLM runs inference on the GPU via WebGPU
4. Tokens stream back and render in real-time using `requestAnimationFrame` batching
5. The completed conversation is persisted to IndexedDB

### Document Q&A Flow
1. User clicks the paperclip icon and selects a PDF/TXT/MD file
2. `pdfjs-dist` extracts text from the file entirely client-side
3. The extracted text is stored in IndexedDB
4. When chatting, the document text (up to 6,000 characters) is injected into the system prompt as context
5. The LLM answers questions using the document content

### Offline Flow
1. First visit: app shell is precached by the service worker
2. Model download: cached in Cache Storage API (by WebLLM) + runtime cached by Workbox
3. Subsequent visits: everything loads from cache — no network needed
4. Data: all conversations, notes, and documents live in IndexedDB

## Switching Models

Edit `src/lib/constants.ts` to change the model:

```typescript
// Smaller, faster (~800 MB download)
export const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f32_1-MLC'

// Better quality, larger (~2-4 GB download)
// export const MODEL_ID = 'Phi-3.5-mini-instruct-q4f16_1-MLC'

// Even more capable, requires more VRAM
// export const MODEL_ID = 'Llama-3.2-3B-Instruct-q4f16_1-MLC'
```

After changing the model, users will need to re-download via Settings > Re-download Model. See the [WebLLM model list](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts) for all available models.

## Data Storage

All data is stored locally. Nothing is ever sent to a server.

| Store | Contents | Location |
|---|---|---|
| `conversations` | Chat messages, titles, document links | IndexedDB |
| `documents` | Uploaded file metadata + extracted text | IndexedDB |
| `notes` | Note titles and content | IndexedDB |
| `appState` | App settings (key-value) | IndexedDB |
| `onboarding_complete` | Whether onboarding was finished | localStorage |
| Model weights | LLM binary weights (~800 MB) | Cache Storage API |

To clear all data: Settings > Clear All Data, or clear site data in browser DevTools.

## Compliance

The architecture is designed to satisfy:

- **FERPA** — No student education records are transmitted or stored server-side
- **COPPA** — No personal information is collected from children
- **GDPR/CCPA** — No data processing occurs outside the user's device

## Troubleshooting

| Issue | Solution |
|---|---|
| "WebGPU Not Supported" | Use Chrome 113+ or Edge 113+. Check `chrome://gpu` for WebGPU status |
| Model download stalls | Check DevTools console for `[WebLLM]` logs. Try a different network. You can skip and retry later |
| Out of memory during inference | Close other GPU-heavy tabs. Try a smaller model (Llama 3.2 1B) |
| Chat input is disabled | The model isn't loaded yet. Click "Load Model" in the chat area or go to Settings > Re-download Model |
| App won't load offline | Visit the app at least once online so the service worker caches the shell. Check DevTools > Application > Service Workers |

## License

MIT
