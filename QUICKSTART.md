# Quick Start Guide

Follow these steps to get your quizbowl flashcard app running with real data!

## 📦 Step 1: Get the Code on Your Local Machine

The project is ready at `/home/user/quizbowl-flashcards/` or download the tarball.

```bash
# If using tarball
tar -xzf quizbowl-flashcards.tar.gz
cd quizbowl-flashcards

# Or just navigate to the directory if you copied it
cd quizbowl-flashcards
```

## 🚀 Step 2: Push to GitHub

```bash
# Verify git remote is configured
git remote -v
# Should show: origin  git@github.com:pravinva/quizbowl-flashcards.git

# Push to GitHub
git push -u origin main

# Enter your GitHub credentials if prompted
```

**Repository URL**: https://github.com/pravinva/quizbowl-flashcards

## 📚 Step 3: Fetch Real Quizbowl Data

This is the most important step! The sample data is just for testing. Now get the real bonuses:

```bash
# Make sure you have dependencies installed
npm install

# Fetch real data from QBReader API
npm run fetch-data
```

**What happens:**
- Fetches bonuses from 12 categories
- Downloads 500-1000 bonuses per category
- Takes 1-2 minutes (respects 20 req/s rate limit)
- Saves to `data/` directory
- Creates `data/summary.json` with statistics

**Expected output:**
```
Starting bonus fetch from QBReader...

Fetching bonuses for category: Literature...
Fetched 892 bonuses
Saved 892 bonuses to literature.json

Fetching bonuses for category: History...
Fetched 1000 bonuses
Saved 1000 bonuses to history.json

... (continues for all categories)

=== Summary ===
Total categories: 12
Total bonuses: 8,450

Bonuses by category:
  Literature: 892
  History: 1000
  Science: 987
  Fine Arts: 756
  ... etc
```

## 🧪 Step 4: Test Locally

```bash
# Start development server
npm run dev

# Open browser to http://localhost:3000
```

**Try it out:**
1. Select a category (e.g., Literature)
2. See a real quizbowl bonus with lead-in
3. Click the card to flip and reveal the answer
4. Navigate through the 3 parts of each bonus
5. Click next/previous to try more bonuses

## 📤 Step 5: Commit Real Data

```bash
# Add the real data files
git add data/

# Commit
git commit -m "Add real QBReader bonus data

- Fetched $(cat data/summary.json | grep totalBonuses) bonuses from QBReader API
- Covers 12 categories including Literature, History, Science, Fine Arts
- Ready for production deployment"

# Push to GitHub
git push
```

## 🌐 Step 6: Deploy to Vercel (Free!)

### Option A: Via Vercel Dashboard

1. Go to https://vercel.com
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Find and select **pravinva/quizbowl-flashcards**
5. Click **"Deploy"** (no configuration needed!)
6. Wait 1-2 minutes for deployment
7. Visit your live app at `https://quizbowl-flashcards.vercel.app` (or similar)

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? quizbowl-flashcards
# - In which directory is your code? ./
# - Want to modify settings? No

# Production deployment
vercel --prod
```

## 🎉 You're Done!

Your quizbowl flashcard app is now:
- ✅ Live on the internet
- ✅ Loaded with real quizbowl bonuses
- ✅ Ready for players to use
- ✅ Free to host and run

**Share your app**: Give friends the Vercel URL to practice quizbowl!

---

## 🔄 Updating Data Later

To refresh with newer bonuses from QBReader:

```bash
# Fetch latest data
npm run fetch-data

# Commit and push
git add data/
git commit -m "Update quizbowl bonus data"
git push

# Vercel will auto-deploy the update!
```

---

## 🛠️ Customization Ideas

### Change Categories
Edit `scripts/fetchBonuses.ts` to add/remove categories:
```typescript
const CATEGORIES = [
  'Literature',
  'History',
  // Add your own!
];
```

### Adjust Quiz Length
Edit `components/FlashcardGame.tsx` line 23:
```typescript
// Change limit=50 to load more/fewer bonuses
const response = await fetch(`/api/bonuses/${category}?random=true&limit=100`);
```

### Modify Styling
- Global styles: `app/globals.css`
- Component styles: Each `.tsx` file has Tailwind classes
- Theme: `tailwind.config.ts`

---

## 📊 Data Structure

Each bonus looks like this:

```json
{
  "_id": "unique-id",
  "leadin": "This author wrote about...",
  "parts": [
    {
      "question": "For 10 points, name this author.",
      "answer": "William Shakespeare",
      "value": 10
    },
    // ... 2 more parts
  ],
  "category": "Literature",
  "subcategory": "British Literature",
  "set": {
    "year": 2023,
    "name": "Tournament Name"
  }
}
```

---

## 🐛 Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Data fetch fails:**
```bash
# Check internet connection
curl https://www.qbreader.org/api/query?questionType=bonus&maxReturnLength=1

# If successful, retry fetch
npm run fetch-data
```

**Vercel deployment issues:**
- Make sure `data/` directory is committed
- Check build logs in Vercel dashboard
- Ensure Node.js version is 18+ in Vercel settings

---

## 📖 More Info

- Full setup guide: `SETUP.md`
- QBReader API docs: https://www.qbreader.org/api-docs
- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs

---

## 🎯 Next Features to Add

Ideas for enhancing the app:
- [ ] User accounts (Firebase Auth)
- [ ] Track which bonuses you've seen
- [ ] Score tracking
- [ ] Difficulty filtering
- [ ] Subcategory selection
- [ ] Timed mode
- [ ] Multiplayer competition
- [ ] Study sets / favorites
- [ ] Search functionality
- [ ] Mobile app (React Native)

**Happy Quizbowling! 🎓**
