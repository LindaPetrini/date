# Date Me Doc - Linda

## Project Overview
A personal "date me" website with interactive 3D knot puzzles that progressively reveal content. The design philosophy centers on feminine energy: leading with feelings rather than accomplishments, creating space for curiosity rather than listing requirements.

## Design Philosophy
- **Feminine energy**: Soft, inviting, receptive. Not a resume or shopping list.
- **Mystery over explicitness**: Leave room for discovery through conversation
- **Filter through engagement**: The puzzles attract people who enjoy spatial thinking and are willing to invest effort
- **Safety first**: No detailed location info, routines, or overly identifying details

## Aesthetic
Warm earth tones palette:
- Sand (#E8DFD5) - main background
- Cream (#FAF8F5) - card backgrounds
- Terracotta (#C17F59) - primary accent
- Brown (#8B5A2B) - secondary accent
- Sage (#87A878) - interactive elements, success states

Typography: Cinzel Decorative (display), Playfair Display (body), JetBrains Mono (terminal/interactive)

## Puzzle Progression
1. **Perspective**: Identify same knot from different angle (trefoil recognition)
2. **Equivalence**: Are two knots actually the same? (trefoil in different orientations)
3. **Unknotting**: Can this tangle be undone? (complex-looking unknot)

All puzzles use Three.js for realistic 3D tube-based knot rendering with animation.

## Content Structure
- **Visible**: Brief intro - feelings, not resume. Age, relationship goals.
- **After Puzzle 1**: Values, two sides (mind/body), what she's explored
- **After Puzzle 2**: Texture of days, things to share, dealbreakers
- **After Puzzle 3**: Invitation to connect, contact info

## Tech Stack
- Pure HTML/CSS/JavaScript
- Three.js for 3D knot rendering
- localStorage for progress persistence
- Deployable to GitHub Pages

## File Structure
```
dating/
├── CLAUDE.md          # This file
├── index.html         # Main entry point
├── styles/
│   └── main.css       # All styles
├── scripts/
│   ├── main.js        # Core app logic, state, progress
│   ├── puzzles.js     # Puzzle definitions and checking
│   └── knots3d.js     # Three.js knot generation
└── assets/
    └── knots/         # (unused - knots are generated)
```

## Testing Commands
In browser console:
- `resetProgress()` - Start fresh
- `saveProgress(3)` then refresh - See all content

## Key Principles for Content
- Lead with feelings, not skills
- Show softness and openness with discernment
- Don't paint too specific a picture of the ideal partner
- Stay in attracting/receiving energy, not going/getting
