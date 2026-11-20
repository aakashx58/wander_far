# ai-studio-applet

A Next.js AI Studio applet powered by Google Gemini AI.

<img width="1919" height="894" alt="image" src="https://github.com/user-attachments/assets/c04a7ef0-2a92-47a4-895b-96ac1ac366df" />

## Overview

`ai-studio-applet` is a Next.js 15 application built with React 19 and TypeScript. It integrates with the [Google Gemini AI](https://ai.google.dev/) API (`@google/genai`) to provide AI capabilities and is designed to run as an applet within Google AI Studio.

## Tech stack

- [Next.js](https://nextjs.org/) 15 (App Router)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Google Generative AI SDK](https://www.npmjs.com/package/@google/genai)
- [lucide-react](https://lucide.dev/) icons
- [framer motion](https://www.framer.com/motion/) animations
- [react-hook-form](https://react-hook-form.com/) with resolvers
- [Firebase](https://firebase.google.com/) tooling

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm (or your preferred package manager)
- A [Google Gemini API key](https://aistudio.google.com/apikey)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `APP_URL` | The URL where the applet is hosted (e.g. your Cloud Run service URL) |

### Running locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean Next.js cache |

## Project structure

```
wander_far/
├── .vscode/              # VS Code debug configuration (launch.json)
├── app/                  # Next.js App Router (pages, layout, globals)
├── components/           # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── public/               # Static assets
├── .env.example          # Example environment variables
├── next.config.ts        # Next.js configuration
├── package.json          # Project metadata and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Debugging

VS Code launch configurations are provided in `.vscode/launch.json`:

- **Next.js: debug server-side** — launches the Next.js dev server with the Node.js debugger attached.
- **Next.js: debug client (Chrome)** — launches Chrome and attaches the debugger to the frontend (`http://localhost:3000`).
- **Next.js: attach to Chrome** — attaches to an already-running Chrome instance on port 9222.

## Deployment

This applet is intended to be deployed as a Google AI Studio applet, typically on [Cloud Run](https://cloud.google.com/run). Set the `APP_URL` environment variable to your deployed service URL so that self-referential links, OAuth callbacks, and API endpoints resolve correctly.

## License

Private project.
