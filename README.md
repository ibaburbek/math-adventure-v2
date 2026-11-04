# 🏰 Math Adventure — 2D Fantasy Mathematics Game

An educational mathematics adventure game for students aged 8–15 featuring 2D fantasy game maps, 3D animated customizable characters (Three.js), KaTeX mathematical notation, full multilingual support (Kazakh, Russian, English), teacher management dashboard, and Supabase integration.

---

## 🌟 Key Features

### 1. 2D Fantasy Game Maps & 4 Interconnected Worlds
- **World 1: Enchanted Forest** — Lush green woodlands, wooden bridges, glowing mushrooms, and ancient trees.
- **World 2: Desert Kingdom** — Golden sand dunes, ancient pyramids, and mystery oasis puzzles.
- **World 3: Ice Kingdom** — Frosty peaks, crystal bridges, and frozen caverns.
- **World 4: Magic Castle** — Floating rune stones, mystical portals, and final challenges.
- **Game board mechanic**: 1 Correct Answer = 1 Step Forward along the winding 2D path!

### 2. 3D Procedural Animated Characters (Three.js)
- 8 Unique heroes: **Astra the Wizard**, **Leo the Knight**, **Luna the Elf Ranger**, **Sparky the Cyber Golem**, **Fenn the Fox Adventurer**, **Puff the Baby Dragon**, **Nova the Cosmonaut**, and **Pip the Owl Scholar**.
- PBR materials, procedural studio lighting with `RoomEnvironment`, and ground contact shadow.
- Interactive 360° drag rotation and zoom.
- 4 Animation states: **Idle**, **Walking**, **Celebration**, and **Victory**.
- Hero Customizer: customize tunic colors, trim colors, skin/fur tones, hats, armor/robes, accessories, and boots.

### 3. Hero Shop & Rewards
- Earn coins for completing mathematical tasks (Easy: 10, Medium: 20, Hard: 30).
- Buy cosmetics: Wizard hats, Golden crowns, Explorer fedoras, Bunny ears, Knight armor, Dragon wings, Winged boots.
- Strict coin tracking and duplicate purchase prevention.

### 4. Mathematical Engine & KaTeX
- KaTeX integration for crisp rendering of fractions, square roots, powers, subscripts, pi, inequalities, integrals, and summations.
- Accessible math toolbar with click-to-insert math snippets.
- 5 Question Formats:
  1. Multiple Choice (4 or 5 options)
  2. Numeric Answer (with tolerance support)
  3. Text Answer
  4. Image-based Question (with file upload & clipboard screenshot paste Ctrl+V)
  5. Open-ended mathematical solution for teacher review

### 5. Multilingual System (kk, ru, en)
- **Kazakh (kk)**
- **Russian (ru)**
- **English (en)**
- Instant language switcher with persistent `localStorage` preference.

### 6. Teacher Portal
- **Dashboard Metrics**: Total students, active quests, completed levels, pending manual reviews.
- **Student Management**: Add student, edit student, disable/enable, assign username and 4-digit PIN, reveal PINs.
- **Classrooms**: Create classes, student rosters, class leaderboards.
- **Question Bank**: Reusable question sets of 8–10 questions with topic categorization and duplication.
- **Review Queue**: Review open-ended student submissions, write comments, approve or request revisions.
- **Assignments**: Assign question quests to entire classes or individual students with due dates.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
git clone <repo-url>
cd math-adventure
npm install
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate with your Supabase credentials:
```env
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```
*(Note: If no credentials are provided, the game automatically falls back to the built-in high-fidelity persistent local storage engine with sample accounts, so it is 100% playable out-of-the-box!)*

### Running Locally
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🗄️ Supabase PostgreSQL Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of `supabase-schema.sql` and run it.
4. Copy your **Project URL** and **Anon Key** from `Project Settings > API` into your `.env` file.

---

## ☁️ Vercel Deployment Instructions

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Math Adventure"
   git push origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set Build Settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Your app will be live on Vercel with HTTPS!
