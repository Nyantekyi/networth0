# Notes App with Nuxt & Nuxt UI

A powerful note-taking application built with Nuxt 4 and Nuxt UI that supports bidirectional note linking using the `[[NoteName]]` syntax, inspired by tools like Obsidian and Roam Research.

## Features

✨ **Core Functionality**
- Create, edit, and delete notes with real-time auto-save
- Notes persist in browser localStorage
- Sort notes by last updated time

🔗 **Smart Note Linking**
- Link notes using `[[NoteName]]` syntax
- Click linked notes to navigate between them
- Create new notes directly from links
- Visual indicators for existing vs. non-existent links
- Live preview showing parsed links

💅 **Modern UI**
- Clean, responsive design with Nuxt UI components
- Two-panel layout: notes list and editor
- Real-time preview of formatted content
- Sample notes included for first-time users

## Screenshots

![Notes App Initial View](https://github.com/user-attachments/assets/8cc507ea-d561-414a-bf57-3912f425b8e4)

![Creating Links with [[NoteName]]](https://github.com/user-attachments/assets/f787aef2-e4e6-4c3f-b7d4-0d84397ec1cb)

![Bidirectional Linking](https://github.com/user-attachments/assets/159228c9-b48f-42b6-a194-cd25b1ee3415)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, pnpm, yarn, or bun

### Installation

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## How to Use

### Creating Notes
1. Click the **"New Note"** button in the notes list
2. Enter a title for your note
3. Click **"Create Note"**

### Linking Notes
Use the `[[NoteName]]` syntax anywhere in your note content:

```
This is a note about [[JavaScript]].

Check out my [[Todo List]] for more details.
```

### Navigating Links
- **Existing note links** (⚡ icon): Click to navigate to that note
- **Non-existent note links** (+ icon): Click to create the note and navigate to it

### Example Use Cases
- **Personal Wiki**: Build a knowledge base with interconnected topics
- **Project Management**: Link tasks, ideas, and documentation
- **Study Notes**: Connect related concepts and subjects
- **Daily Journal**: Reference previous entries or recurring topics

## Technology Stack

- **Framework**: [Nuxt 4.1.3](https://nuxt.com/)
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/)
- **Styling**: Tailwind CSS (included with Nuxt UI)
- **State Management**: Vue 3 Composables
- **Storage**: Browser localStorage

## Project Structure

```
networth0/
├── app/
│   ├── app.vue              # Root component
│   ├── composables/
│   │   └── useNotes.ts      # Notes management & link parsing logic
│   └── pages/
│       └── index.vue        # Main notes app UI
├── nuxt.config.ts           # Nuxt configuration
├── package.json             # Dependencies
└── README.md                # This file
```

## Key Features Explained

### Link Parsing
The app uses a regex pattern to identify `[[NoteName]]` syntax:
- Matches text between double square brackets
- Checks if the referenced note exists
- Renders as a clickable badge with appropriate styling
- Distinguishes between existing and non-existent links

### Data Persistence
- All notes are stored in browser `localStorage`
- Auto-saves on every content change
- Survives page refreshes and browser restarts

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

