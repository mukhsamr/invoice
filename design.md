# Design System: Neo-Brutalism

## Core Principles
1. **Bold Typography**: High contrast between headers and body text.
2. **Thick Borders**: 3px solid black borders for all interactive and container elements.
3. **Hard Shadows**: No blurs. Use solid black offset shadows (e.g., `4px 4px 0px 0px #000000`).
4. **Sharp Geometry**: No border radius. Everything is square and rigid.
5. **High Contrast Palette**: 
   - **Background**: Pure White (#FFFFFF)
   - **Accents**: Dark Emerald (#065F46)
   - **Definitions**: Pure Black (#000000)

## Component Tokens
- **Cards**: `border: 3px solid #000; box-shadow: 4px 4px 0px 0px #000;`
- **Buttons**: `font-weight: 900; border: 3px solid #000; box-shadow: 4px 4px 0px 0px #000;`
- **Inputs**: `border: 3px solid #000; focus-shadow: 4px 4px 0px 0px var(--primary);`
- **Badges**: `border: 3px solid #000; box-shadow: 2px 2px 0px 0px #000;`

## Interaction States
- **Hover**: Translate -2px, -2px and increase shadow depth.
- **Active**: Translate 0, 0 and remove shadow.
