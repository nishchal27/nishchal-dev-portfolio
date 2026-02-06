# Rhymely

**Rhymely** ([rhymely.app](https://rhymely.app)) is a gentle, awareness-first habit app for mindful living. The app is available globally — anyone can use it. Built with Next.js, React, Tailwind CSS, and Firebase.

**Developer doc (stack, setup, recent changes):** [docs/DEVELOPER.md](docs/DEVELOPER.md) · **Implementation summary:** [docs/implementation/IMPLEMENTATION_SUMMARY.md](docs/implementation/IMPLEMENTATION_SUMMARY.md)

#info: this app is live. and also available in playstore.

## Overview

This app helps users notice their habits (sugar and junk food) through daily check-ins, soft streaks, and emotional feedback. It prioritizes:

- **Elegance** - Clean, minimal design
- **Calmness** - Soft colors and gentle interactions
- **Emotional Safety** - Non-judgmental, supportive language
- **Simplicity** - One primary action per screen
- **Performance** - Fast, optimized for daily use

## Tech Stack

- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **TanStack Query (React Query) v5** (server state: user, check-ins, summaries)
- **Framer Motion** (subtle animations only)
- **Firebase** (Firestore, Auth)
- **Google Play Billing** (subscriptions; Android)
- **OpenAI** (AI reflections; optional)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore and Authentication (Anonymous)
   - Copy your Firebase config

4. Create `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
awareness-first-positive-app/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Welcome screen
│   ├── onboarding/        # Onboarding flow
│   ├── check-in/          # Daily check-in
│   ├── reflection/        # Reflection screen
│   ├── home/              # Home/dashboard
│   ├── weekly/            # Weekly summary
│   └── premium/           # Premium info
├── components/            # React components
│   ├── layout/            # Layout components
│   ├── ui/                # shadcn/ui components
│   ├── check-in/          # Check-in components
│   ├── reflection/        # Reflection components
│   ├── streak/            # Streak display
│   └── onboarding/        # Onboarding components
├── lib/                   # Utilities and hooks
│   ├── design-tokens.ts  # Design system tokens
│   ├── firebase/          # Firebase configuration
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── utils/             # Utility functions
└── docs/                  # Documentation
```

## Design System

### Colors
- **Background**: Warm off-white (`#FAF9F6`)
- **Accent**: Soft sage green (`#7A9A7A`)
- **Text**: Soft charcoal (`#2C2C2C`)
- **Success**: Gentle mint (`#A8D5BA`)

### Typography
- **Font**: Inter (friendly sans-serif)
- **Sizes**: Large, readable (18px+ body, 32px+ headings)
- **Line Height**: 1.6-1.8 for comfort

### Spacing
- Base unit: 4px
- Large padding: 24-32px minimum
- Plenty of whitespace

## Key Features

### Daily Check-In
Simple Yes/No questions about habits. Zero distractions, centered layout.

### Reflection
Gentle, non-judgmental messages after check-in. Focus on awareness and honesty.

### Soft Streak
Days checked in (not "perfect days"). Gentle display, no pressure.

### Weekly Summary
Text-based insights, no charts. Gentle pattern observations.

## Android WebView

This app is designed to be wrapped in an Android WebView (Capacitor later). It includes:

- Touch optimizations (44px minimum tap targets)
- Android back button handling
- Safe area support
- Mobile-first responsive design
- Disabled zoom/pinch

## Performance

- Code splitting (automatic with App Router)
- Lazy loading for non-critical components
- Server components where possible
- Optimized Firebase queries
- Minimal JavaScript bundle

## Development

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint
```bash
npm run lint
```

## Privacy policy, Terms, and Play Store

The app’s privacy policy is at `/privacy` and Terms of Service at `/terms`. For Google Play submission, provide the full URLs (e.g. `https://your-domain.com/privacy` and `https://your-domain.com/terms`) in Play Console.

## Firebase Security Rules

See `firestore.rules` for security rules. Key points:
- Users can only read/write their own data
- Check-ins are user-isolated
- Weekly summaries are user-isolated

## License

Private project - All rights reserved
