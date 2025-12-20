# The Orchestra Studio

**Next-Gen AI Intelligence Orchestration Platform**

A powerful multi-agent AI collaboration platform where specialized agents work together to refine and perfect your ideas.

## Project Overview

The Orchestra Studio brings together specialized AI agents that think, debate, and refine ideas—just like a team of experts would. With complete transparency into every step of the reasoning process.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom design system
- **Routing**: React Router
- **State Management**: React Context
- **Forms**: React Hook Form
- **Payments**: Razorpay

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── services/       # API and service layer
├── store/          # State management
├── hooks/          # Custom React hooks
└── lib/            # Utility functions
```

## Features

- 🤖 **Multi-Agent System**: Specialized AI agents (Idea, Critic, Refiner, Presenter)
- 🔍 **Complete Transparency**: See every step of the AI reasoning process
- 📊 **Session History**: Track and review all your creative sessions
- 💳 **Subscription Plans**: Starter, Pro, and Enterprise tiers
- 🔐 **Authentication**: Secure user accounts with Firebase
- 📱 **Responsive Design**: Works seamlessly on all devices

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_FIREBASE_API_KEY=your_firebase_key
# Add other environment variables as needed
```

## License

Copyright © 2024 The Orchestra Studio. All rights reserved.

## Support

For questions or support, contact us at:
- Email: hello@theorchestrastudio.com
- Twitter: [@theorchestrastudio](https://twitter.com/theorchestrastudio)
- LinkedIn: [The Orchestra Studio](https://linkedin.com/company/theorchestrastudio)
