# Setup Guide

## Quick Start

Follow these steps to get the quizbowl flashcard app running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Fetch Quizbowl Data

Download bonuses from the QBReader API:

```bash
npm run fetch-data
```

This will:
- Fetch bonuses for all categories (Literature, History, Science, etc.)
- Save them to the `data/` directory
- Create a summary file with statistics
- Take a few minutes depending on your internet connection (respects 20 req/s rate limit)

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Option 1: Deploy from GitHub

1. Push your code to GitHub:
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will auto-detect Next.js - just click "Deploy"
5. **Important**: After first deployment, run `npm run fetch-data` locally and commit the `data/` directory
6. Push again to update with actual data

### Option 2: Deploy from CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run fetch-data and build:
   ```bash
   npm run fetch-data
   npm run build
   ```

3. Deploy:
   ```bash
   vercel
   ```

## Data Management

### Including Data in Git (Recommended for Easy Deployment)

If you want to include the fetched data in your repository:

1. Remove `data/` from `.gitignore`:
   ```bash
   # Edit .gitignore and remove or comment out the line: data/
   ```

2. Commit the data:
   ```bash
   npm run fetch-data
   git add data/
   git commit -m "Add quizbowl bonus data"
   git push
   ```

**Note**: The data directory will be several MB in size.

### Updating Data

To refresh the bonus data:

```bash
npm run fetch-data
```

This will overwrite existing data files with fresh data from QBReader.

## Firebase Integration (Optional - Future Enhancement)

To use Firebase Firestore instead of local JSON files:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase config to `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   # ... etc
   ```
4. Update `lib/loadBonuses.ts` to use Firebase SDK
5. Modify the fetch script to upload to Firestore

## Customization

### Modify Categories

Edit `scripts/fetchBonuses.ts` and update the `CATEGORIES` array:

```typescript
const CATEGORIES = [
  'Literature',
  'History',
  // Add or remove categories
];
```

### Change Quiz Settings

Edit `components/FlashcardGame.tsx` to modify:
- Number of bonuses loaded: Change `limit=50` parameter
- Randomization: Toggle `random=true` parameter

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.ts`
- Component-specific styles: Each component file

## Troubleshooting

### "No bonuses available for this category"

Make sure you've run `npm run fetch-data` first.

### Build Errors

Clear Next.js cache and rebuild:
```bash
rm -rf .next
npm run build
```

### Data Fetch Fails

Check your internet connection and QBReader API status:
```bash
curl https://www.qbreader.org/api/query?questionType=bonus&maxReturnLength=1
```

## Project Structure

```
quizbowl-flashcards/
├── app/
│   ├── api/              # API routes for data
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utilities
├── scripts/              # Data fetching
├── types/                # TypeScript types
└── data/                 # Downloaded bonuses (gitignored by default)
```

## Contributing

Feel free to submit issues and enhancement requests!
