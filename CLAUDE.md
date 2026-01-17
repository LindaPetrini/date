# Date Me Doc - Linda Petrini

## Project Overview
A personal "date me" website with an interactive knot puzzle mechanic that progressively reveals deeper content about Linda as potential matches solve increasingly challenging spatial reasoning puzzles.

## Design Philosophy
- **Metaphor**: Knots represent the complexity of relationships - working through them to reach understanding
- **Filter**: The puzzles naturally filter for people who enjoy intellectual challenges and spatial thinking
- **Progressive reveal**: Basic info visible, deeper desires/manifestation doc gated behind puzzles

## Aesthetic
Blend of two styles:
1. **Warm & elegant** (from lindapetrini.com): Dusty rose (#D9A3A3), cream, burgundy (#914F62), serif fonts (Cinzel Decorative, Playfair Display)
2. **Interactive/playful**: Terminal-like elements for puzzle sections, green accents (#50C878) for interactive bits

## Puzzle Progression
1. **Stage 1 - Visual Rotation**: Show a knot, identify which of 4 options is the same knot from a different angle (easiest)
2. **Stage 2 - Knot Equivalence**: Are these two knots the same or different? (medium)
3. **Stage 3 - Unknotting Challenge**: Can this knot be untangled without cutting? (hardest)

## Content Structure
- **Visible**: Basic intro, age, looking for, surface-level about me
- **After Puzzle 1**: More about me, values, lifestyle
- **After Puzzle 2**: Ideal day, what I'm looking for in a partner
- **After Puzzle 3**: Manifestation doc, contact information

## Tech Stack
- Pure HTML/CSS/JavaScript (deployable to GitHub Pages)
- SVG-based knot visualizations
- localStorage for progress persistence
- No build step required

## File Structure
```
dating/
├── CLAUDE.md          # This file
├── index.html         # Main entry point
├── styles/
│   └── main.css       # All styles
├── scripts/
│   ├── main.js        # Core app logic
│   ├── puzzles.js     # Puzzle definitions and logic
│   └── knots.js       # Knot SVG generation
└── assets/
    └── knots/         # Pre-made knot SVGs if needed
```

## Development Notes
- Test puzzles for appropriate difficulty
- Ensure mobile responsiveness
- Knots should be visually clear and distinguishable
- Consider color-blind friendly design for puzzle feedback

## Key User Info
- Linda, 29, Italian/Russian
- Mathematician, AI researcher
- Values: curiosity, attunement, honesty, alignment
- Looking for: monogamous life partner, wants 3-4 kids
- Teaches acroyoga, semi-nomadic lifestyle
