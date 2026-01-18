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
- **Intro**: Hover box with disqualifiers + profile pic
- **Compatibility score**: Fun labels (intriguing/promising/curious/different/wildcard)
- **My answers**: Collapsible section with Linda's responses
- **Make your own**: Collapsible with repo link
- **Share**: Generate summary to copy/email

## Tech Stack
- Pure HTML/CSS/JavaScript (no build step)
- localStorage for response persistence
- Deployable to GitHub Pages or any static host

## File Structure
```
dating/
├── CLAUDE.md              # This file
├── playground.html        # Main playground page
├── index.html             # Landing page (optional)
├── styles/
│   ├── main.css           # Base styles, variables
│   └── playground.css     # All toy styles
├── scripts/
│   ├── content.js         # ALL EDITABLE TEXT LIVES HERE
│   ├── playground.js      # Toy logic, init functions
│   └── easter-eggs.js     # Hidden interactions
└── assets/
    └── linda.jpg          # Profile pic for hover box
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
# GitHub Pages
git remote add origin https://github.com/username/repo.git
git push -u origin main
# Settings → Pages → enable
# Add custom domain in settings + CNAME DNS record
```

Or just upload the folder to any static host (Netlify, Vercel, your own server).
