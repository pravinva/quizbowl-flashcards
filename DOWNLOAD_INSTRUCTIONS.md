# How to Download This Project

## Method 1: Copy Project Structure (Recommended)

Since you're on Claude Code web, here's how to get the code locally:

### Step 1: Create a download script

On your local laptop, create a file called `setup-project.sh`:

```bash
#!/bin/bash

# Create project directory
mkdir -p quizbowl-flashcards
cd quizbowl-flashcards

# Initialize git
git init
git branch -M main
git remote add origin https://github.com/pravinva/quizbowl-flashcards.git

# Create package.json
cat > package.json << 'EOF'
{
  "name": "quizbowl-flashcards",
  "version": "1.0.0",
  "description": "Quizbowl flashcard app for practicing bonuses",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "fetch-data": "tsx scripts/fetchBonuses.ts"
  },
  "keywords": ["quizbowl", "flashcards", "education"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "firebase": "^11.1.0",
    "next": "^15.1.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2"
  }
}
EOF

echo "✅ Package.json created"
echo "📦 Run: npm install"
echo "🌐 Then visit: https://github.com/pravinva/quizbowl-flashcards"
echo "📥 And copy the remaining files from the repository"
```

Run it:
```bash
chmod +x setup-project.sh
./setup-project.sh
```

Then manually copy the source files from Claude Code (see below).

---

## Method 2: Ask Me to Show You Each File

I can show you the contents of each file, and you can copy-paste them. Just ask for specific files:

**Example:**
- "Show me app/page.tsx"
- "Show me components/Flashcard.tsx"

---

## Method 3: Wait for GitHub Push Access

If you can provide me with:
- GitHub personal access token, OR
- SSH key setup

I can push directly to your repository, then you just:
```bash
git clone https://github.com/pravinva/quizbowl-flashcards.git
```

---

## File List to Copy

Here are all the files you need to recreate:

### Configuration Files (5 files)
1. `package.json` ✅ (in script above)
2. `tsconfig.json`
3. `next.config.ts`
4. `tailwind.config.ts`
5. `postcss.config.mjs`
6. `.gitignore`
7. `vercel.json`

### App Files (3 files)
8. `app/page.tsx`
9. `app/layout.tsx`
10. `app/globals.css`

### Components (3 files)
11. `components/CategorySelector.tsx`
12. `components/Flashcard.tsx`
13. `components/FlashcardGame.tsx`

### API Routes (2 files)
14. `app/api/categories/route.ts`
15. `app/api/bonuses/[category]/route.ts`

### Library & Types (3 files)
16. `lib/loadBonuses.ts`
17. `types/quizbowl.ts`
18. `scripts/fetchBonuses.ts`

### Documentation (3 files)
19. `README.md`
20. `SETUP.md`
21. `QUICKSTART.md`

**Total: 21 files**

---

## Recommended: Use Method 3

The easiest way is if you can give me push access to GitHub. Then:
1. I push the code
2. You clone it
3. Done!

Would you like me to:
- **A)** Show you how to create a Personal Access Token?
- **B)** Show you each file one by one to copy?
- **C)** Wait for you to set up SSH keys?
