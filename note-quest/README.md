# 🎵 NoteQuest — Learn to Read Music

A Duolingo-style music note recognition game built with Next.js, VexFlow, and TailwindCSS.

---

## Architecture

```
notequest/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout + Google Fonts
│   ├── globals.css              # Tailwind + base styles
│   ├── page.tsx                 # Home screen
│   ├── quickfire/
│   │   └── page.tsx             # Quick Fire mode
│   └── adventure/
│       ├── page.tsx             # Adventure map
│       └── [levelId]/
│           └── page.tsx         # Individual level game
│
├── components/                  # Reusable UI components
│   ├── GameEngine.tsx           # Core game loop (shared by both modes)
│   ├── StaffRenderer.tsx        # VexFlow staff + note renderer
│   ├── AnswerButtons.tsx        # 4-option answer grid with feedback
│   ├── TimerBar.tsx             # Animated countdown bar
│   ├── HintBanner.tsx           # Mnemonic hint on wrong answer
│   ├── ScoreBar.tsx             # Progress + score display
│   ├── AdventureMap.tsx         # World/level map grid
│   └── ResultsCard.tsx          # End-of-game results
│
├── lib/
│   └── game/
│       ├── notes.ts             # Note data, wrong-answer generation
│       ├── levels.ts            # World & level definitions (6×5=30)
│       ├── questionEngine.ts    # Spaced repetition + question generator
│       └── progress.ts          # localStorage save/load
│
└── public/                      # Static assets
```

---

## Features

### Quick Fire Mode
- 10 questions with a 5-second timer per question
- +100 pts per correct answer
- +50 speed bonus for answers under 2 seconds
- +200 streak bonus every 3 correct answers in a row
- Persists best score to localStorage

### Adventure Mode
- 6 worlds × 5 levels = 30 levels
- World 1: Treble Clef Spaces (F A C E)
- World 2: Treble Clef Lines (E G B D F)
- World 3: Treble Mastery (mixed treble)
- World 4: Bass Clef Spaces (A C E G)
- World 5: Bass Clef Lines (G B D F A)
- World 6: Grand Staff (treble + bass)
- 80% accuracy required to pass each level
- Level unlock gate (must pass previous level)

### Spaced Repetition
- Each note tracks a memory score (0–1)
- Correct answer: +0.1
- Wrong answer: -0.2
- Weighted random selection: weaker notes appear more often

### Mnemonics
- Treble Spaces: "FACE"
- Treble Lines: "Every Good Boy Deserves Fudge"
- Bass Spaces: "All Cows Eat Grass"
- Bass Lines: "Good Boys Do Fine Always"
- Hint shown automatically after a wrong answer

---

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Steps

```bash
# 1. Clone or copy the project
cd note-quest

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

---

## Build for Production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

### Option A — Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: note-quest
# - Framework: Next.js (auto-detected)
# - Deploy!
```

### Option B — Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Framework will be auto-detected as Next.js
5. Click **Deploy** — no environment variables needed

### Option C — One-click from CLI

```bash
npx vercel --prod
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework, routing, SSR |
| React 18 | UI components |
| TailwindCSS 3 | Styling |
| VexFlow 4 | Musical staff rendering |
| localStorage | Progress persistence |
| TypeScript | Type safety |
| Google Fonts | Playfair Display + DM Sans |

---

## Key Design Decisions

**VexFlow rendering**: `StaffRenderer` dynamically imports VexFlow (browser-only) inside a `useEffect`, avoiding SSR issues. The SVG is re-rendered whenever the note prop changes.

**Spaced repetition**: Uses a simple weighted random picker. The weight for each note is `(1 - memoryScore)² + 0.05`. This means a note with score 0 appears ~20× more often than a fully-mastered note.

**No timer in Adventure mode**: Adventure mode is learner-paced so players can study the staff carefully. Quick Fire mode adds the 5-second timer for pressure.

**Wrong answer generation**: Wrong answers are drawn from the same clef pool, preferring adjacent letter names (±1–2 semitones) to keep difficulty realistic.

---

## Customisation

To add more levels or worlds, edit `lib/game/levels.ts`.

To change question count or timer, edit the constants in `app/quickfire/page.tsx` and `app/adventure/[levelId]/page.tsx`.

To add ledger-line notes (above/below the staff), add more entries to `lib/game/notes.ts` and create a new world.
