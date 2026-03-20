# Date Me Playground - Linda

## Project Overview
A personal "date me" website as an interactive playground of 30 small toys/questions. Instead of a traditional dating doc, visitors explore interactive elements that reveal personality compatibility through engagement.

## Design Philosophy
- **Playground over resume**: If you enjoy this, you might enjoy me
- **No right answers (mostly)**: Signal over judgment
- **Skip around**: Not required to do all 30
- **Filter through engagement**: The format attracts curious, playful people willing to invest effort

## Aesthetic
Petrol green + burgundy/rosa antico palette:
- Cream backgrounds
- Petrol (#2D6A6A) - primary accent, interactive elements
- Burgundy - secondary accent
- Rosa light - borders, subtle elements

Typography: Cinzel Decorative (display), Playfair Display (body), JetBrains Mono (interactive/mono)

## Current Toys (30 total)
Reorderable via `toyOrder` array in content.js:
- texture, body, day, shades, autocomplete, ai, toes, embodiment
- sequence, images, message, music, hold, nature, color, precision
- upside, room, crying, reading, spirit, emotion, neuro, lead
- therapy, god, food, patterns, meta, fun

## Key Features
- **Intro**: Quick info box with photo, age, location, and key attributes
- **Skip to end**: Link at top for those not into interactive things
- **Draggable day builder**: Toy 28 uses drag-and-drop interface with custom activity inputs
- **Visual character card**: Stats-based scorecard with bars, user's color/image, and compatibility label
- **Your answers**: Collapsible section showing user's responses dynamically
- **Linda's answers**: Collapsible section with Linda's responses from content.js
- **Make your own**: Collapsible with repo link
- **Contact form**: Share answers via form (uses mailto, ready for Formspree integration)

## Tech Stack
- Pure HTML/CSS/JavaScript (no build step)
- localStorage for response persistence
- Deployable to GitHub Pages or any static host

## File Structure
```
dating/
├── CLAUDE.md              # This file
├── index.html             # Main playground page
├── styles/
│   ├── main.css           # Base styles, variables
│   └── playground.css     # All toy styles
├── scripts/
│   ├── content.js         # ALL EDITABLE TEXT LIVES HERE
│   └── playground.js      # Toy logic, init functions, drag-drop
└── assets/
    └── linda.jpg          # Profile pic for quick info box
```

## Editing Content
**Everything is in `scripts/content.js`:**
- `intro` - title, subtitle, disqualifiers
- `toyOrder` - reorder toys by moving items in array
- `[toyName]` - each toy's title, options, responses
- `myAnswers` - Linda's own answers
- `end` - share text, make your own section

## Testing
In browser console:
- `localStorage.clear()` then refresh - Start fresh
- `Playground.responses` - See current responses

## Deployment
```bash
# Local testing
python3 -m http.server 8080
# Then visit http://localhost:8080/

# GitHub Pages
git remote add origin https://github.com/username/repo.git
git push -u origin main
# Settings → Pages → enable
# Add custom domain in settings + CNAME DNS record
```

Or just upload the folder to any static host (Netlify, Vercel, your own server).

## Recent Updates
**2025-01-19**: Major UX improvements
- Transformed "assemble a day" toy into drag-and-drop builder with custom activity inputs
- Replaced text-based score with visual character card (stats bars, color/image integration)
- Split answer sections into "your answers" (dynamic) and "linda's answers" (from content.js)
- Simplified intro with quick info box, added skip-to-end link
- Replaced direct email with contact form (mailto-based, Formspree-ready)
- Added safety checks for localStorage and missing DOM elements
