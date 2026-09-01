# Malaysia Sketchbook — Design Direction

## Three possible approaches

### Theme Name: Archipelago Field Notes

**Very Brief Intro:** A warm editorial travel journal that treats Malaysia as a living archive of coastlines, cities, rainforests, food stalls, and old streets. Watercolor spreads, paper grain, and restrained brass details make the interface feel collected rather than manufactured.

**Probability:** 0.07

### Theme Name: Monsoon Modern

**Very Brief Intro:** A contemporary gallery interface built around deep rain-green, washed limestone, and sharp vermilion accents. The mood is atmospheric and architectural, with more contrast and a slightly more experimental rhythm.

**Probability:** 0.03

### Theme Name: Night Market Ledger

**Very Brief Intro:** A tactile evening notebook inspired by hawker receipts, neon shop signs, ink stamps, and folding menus. It would feel more kinetic and urban, with bolder color moments and denser typographic annotations.

**Probability:** 0.09

## Chosen approach: Archipelago Field Notes

### Design Movement

Contemporary editorial brutalism softened by natural-history field journals and Southeast Asian watercolor travel books. The design should feel authored, tactile, and observant rather than glossy or tourism-brochure polished.

### Core Principles

1. **The page is the interface.** Navigation should feel like handling a physical journal, with the landmark artwork carrying the emotional weight.
2. **Material before ornament.** Paper grain, ink edges, botanical silhouettes, and brass hardware create depth without decorative clutter.
3. **Quiet asymmetry.** Use off-center compositions, generous breathing room, and occasional edge crops to suggest a desk with objects laid out naturally.
4. **Specific Malaysia, not generic tropics.** Pair recognizable places with regional details: kopitiam tiles, mangrove roots, monsoon skies, limestone, rattan, and old shophouse shutters.

### Color Philosophy

The base is warm limestone paper rather than white. Ink is a dark charcoal-brown for a printed, hand-annotated quality. A signature **hibiscus vermilion** appears sparingly in active states, page numbers, and small marks. Palm green and river blue are reserved for artwork and supporting accents so the interface stays calm. Brass is used for the magnifying glass and tiny controls, linking interaction to a physical object.

### Layout Paradigm

A desk-like vertical composition: a centered but slightly low book stage, botanical fragments entering from the edges, and content sections that read as loose journal entries rather than uniform cards. The plates index is a long editorial list with numbering and place names. About and contact content align to a narrow reading column with a botanical counterweight, avoiding a generic centered marketing grid.

### Signature Elements

1. A brass-rimmed draggable loupe that reveals a magnified duplicate of the current spread.
2. A small red hibiscus seal used as the brand mark, favicon, and active navigation detail.
3. Fine ink registration marks and hand-drawn divider strokes that appear between sections and around the page index.

### Interaction Philosophy

Every interaction should feel like a physical gesture: drag the paper, tap the page edge, lean toward a detail, or move the loupe across the image. Motion should have inertia and a sense of friction. Controls remain understated until needed, while keyboard and touch alternatives keep the experience usable without requiring the visual metaphor.

### Animation

The opening sequence is a short, optional paper riffle that introduces the book without delaying access. Page turns use a curved leaf rather than a flat rotation, with a soft spring settle on commit or cancel. Pointer parallax is restrained and stops during a drag. The loupe eases aside if the turning leaf crosses it. Section entrances use small opacity and translate transitions only; no continuous decorative motion should compete with the artwork. All non-essential motion is disabled or shortened under `prefers-reduced-motion`.

### Typography System

Use **Instrument Serif** or a comparable high-contrast editorial serif for the wordmark, landmark titles, and large section moments. Use **Newsreader** or a similarly literary serif for body copy and metadata. Small navigation and labels use the body serif in uppercase with generous tracking. Hierarchy is established through scale, spacing, and case rather than heavy weight: display titles should feel printed, while metadata should feel like catalog notation.

### Brand Essence

**Malaysia, observed slowly — a tactile digital sketchbook for people who want to see the places behind the postcard.**

Personality: **observant, tactile, quietly proud**.

### Brand Voice

Headlines are precise and evocative, never generic. CTAs are invitations to inspect rather than sales language. Microcopy is short, physical, and gently poetic.

Example headline: “A country in margins, rain, and ink.”

Example interaction line: “Pull the page across the light.”

### Wordmark & Logo

The mark is a simple hibiscus seal: five uneven ink petals around a small brass registration dot, drawn as if stamped onto the page. The wordmark should be set in the chosen display serif with a custom red overprint line or small registration offset, never as a default logo font treatment. The standalone symbol is used in the header and favicon.

### Signature Brand Color

**Hibiscus Vermilion — `#C94B3B`.** It is warm, recognizably botanical, and vivid enough to own active states without turning the overall experience into a bright tourist palette.

## Implementation reminders

- Keep the visual hierarchy editorial and tactile; do not introduce generic cards, purple gradients, or a dashboard-like component system.
- Use generated landmark spreads for the prominent book stage and one generated transparent hibiscus mark for branding.
- Keep the interactive book state separate from the page index and informational sections so the content can be expanded later.
- Ask during implementation: **Does this choice reinforce or dilute the Archipelago Field Notes philosophy?**
