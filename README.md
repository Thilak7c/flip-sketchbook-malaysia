# Malaysia Sketchbook — Next.js

A tactile, editorial interactive sketchbook of Malaysia, built as a standalone Next.js App Router project.

## Features

- **Interactive page turns:** Drag-to-turn landmark spreads with client-side state.
- **Draggable magnifier:** A brass-rimmed loupe that reveals magnified watercolor details.
- **Editorial layout:** Warm limestone paper, charcoal ink, and hibiscus vermilion branding.
- **Data-driven:** Landmarks are stored in a simple array for easy expansion.
- **Responsive:** Optimized for desktop, tablet, and mobile viewports.
- **Accessible:** Semantic labels, keyboard support, and reduced-motion awareness.

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run the development server:**
   ```bash
   pnpm dev
   ```

3. **Open the site:**
   Navigate to `http://localhost:3000`.

## Production Build

To create an optimized production build:

```bash
pnpm build
```

Then start the production server:

```bash
pnpm start
```

## Project Structure

- `src/app/page.tsx`: The main interactive sketchbook implementation.
- `src/app/globals.css`: The Archipelago Field Notes design system and responsive styling.
- `public/assets/`: Watercolor landmark spreads and brand assets.

## Adding Landmarks

To add a new Malaysian landmark:
1. Place the watercolor spread PNG (16:9) in `public/assets/`.
2. Add a new entry to the `landmarks` array in `src/app/page.tsx`.

## Credits

- **Design Direction:** Archipelago Field Notes
- **Implementation:** Manus AI
- **Artwork:** Generated watercolor field-journal series
# flip-sketchbook-malaysia
