# Quizbowl Flashcards

An interactive flashcard application for practicing quizbowl bonuses. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎯 Practice quizbowl bonuses by category
- 🔄 Interactive flip cards with questions and answers
- 📚 Support for multi-part bonuses
- 🎨 Clean, modern UI with dark mode support
- 📱 Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Fetching Data

Before running the app, you need to fetch bonuses from the QBReader database:

```bash
npm run fetch-data
```

This will download bonuses for all categories and save them to the `data/` directory.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
quizbowl-flashcards/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── CategorySelector.tsx
│   ├── FlashcardGame.tsx
│   └── Flashcard.tsx
├── lib/                   # Utility functions and configs
├── scripts/               # Data fetching scripts
│   └── fetchBonuses.ts
├── types/                 # TypeScript type definitions
│   └── quizbowl.ts
└── data/                  # Downloaded bonus data (gitignored)
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Deploy!

Make sure to run `npm run fetch-data` and commit the data files, or set up the Firebase integration for dynamic data.

### Firebase Integration (Optional)

To use Firebase Firestore for data storage:

1. Create a Firebase project
2. Set up Firestore database
3. Add Firebase configuration to `.env.local`
4. Update the data loading logic in components

## Data Source

Bonuses are fetched from the [QBReader API](https://www.qbreader.org/api-docs).

## License

ISC
