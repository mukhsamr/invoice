# Design System: High-End Editorial Digital Identity

## 1. Overview & Creative Philosophy: The Digital Conservatory

This design system is built upon the philosophy of a "Digital Conservatory"—a space where academic tradition meets cutting-edge digital craftsmanship. It rejects standard template aesthetics in favor of a high-end editorial experience that is platform-agnostic and versatile for any professional digital product.

- **Intentional Asymmetry:** Utilize staggered layouts and overlapping elements to create a sense of motion and organic growth.
- **Tonal Depth:** Move away from rigid, boxed-in grids toward a fluid, breathable canvas that feels like a premium physical portfolio.
- **Restraint:** The strength of this system lies in the balance between deep tones and expansive white space.

---

## 2. Colors: Tonal Depth & Organic Atmosphere

Configure these in your Tailwind CSS theme or as custom CSS variables.

### The Color Roles

- **Primary (`#003629`):** Signature deep green. Reserved for moments of high authority, such as primary CTAs and key brand identifiers. Apply via `bg-primary` and `text-primary`.
- **Surface & Background (`#f8faf9`):** A slightly cool, mint-tinted off-white that prevents the interface from feeling "sterile." Apply via `bg-surface`.
- **Tertiary (`#4c221c`):** A deep earth-tone used sparingly for warmth and contrast in specialized elements.

### The "No-Line" Rule

Traditional borders (`border`, `border-t`, etc.) are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts (e.g., nesting `bg-surface-container-low` inside `bg-surface`). Use negative space (`p-8`, `gap-6`) as a structural element rather than a line.

### The Glass & Gradient Rule

To provide visual depth and sophistication:

- Utilize subtle gradients: `bg-gradient-to-b from-primary to-primary-container` for hero sections.
- For floating navigation or modal overlays, apply **Glassmorphism**: `bg-surface/70 backdrop-blur-md` or `backdrop-blur-lg`.

---

## 3. Typography: The Editorial Voice

Utilize Tailwind's typography scale to establish a clear hierarchy that feels both sophisticated and authoritative.

- **Display & Headlines (Manrope or Geometric Sans):** Chosen for geometric precision.
  - `text-5xl` or `text-6xl` should be used for hero statements with `tracking-tight` for an "impact" editorial feel.
- **Body & Labels (Inter or Neutral Sans):** Optimized for legibility.
  - `text-base` is the standard for general descriptions.
  - `text-xs` is used for metadata, always utilizing `uppercase` and `tracking-wide` for professional polish.

---

## 4. Elevation & Depth: Tonal Layering

Avoid traditional, opaque shadows (`shadow-md`, `shadow-lg`). Instead, use ambient light and tonal shifts to create dimension.

### The Layering Principle

Depth is achieved by "stacking" surface tiers using background colors.

### Ambient Shadows

When a floating effect is required (e.g., primary buttons or modals), shadows must be extra-diffused and tinted:

- Use custom tinted shadow utilities such as `shadow-xl shadow-primary/5` or `shadow-2xl shadow-primary/5`.

### The "Ghost Border" Fallback

If a border is absolutely necessary for accessibility (e.g., input fields), use a **Ghost Border**: `border border-outline-variant/20`. Never use 100% opaque, high-contrast borders.

---

## 5. Components: Precision & Intent

### Buttons

- **Primary:** `bg-primary text-on-primary rounded-sm shadow-sm shadow-primary/10`. Add a subtle vertical gradient for a "pressed" look.
- **Secondary:** `bg-secondary-container text-on-secondary-container rounded-sm`. No border.
- **Tertiary:** Text-only with `hover:underline decoration-primary underline-offset-4`.

### Cards

- **Constraint:** Absolutely no divider lines (`divide-y` or `border`).
- **Structure:** Use `gap-4` or `gap-6` to separate media elements from descriptions.
- **Corners:** Keep it sharp but safe using `rounded-sm` or `rounded`.
- **Hover State:** `transition-colors duration-300 hover:bg-surface-container-lowest hover:shadow-xl hover:shadow-primary/5`.

### Input Fields

- **Style:** Minimalist. No solid box. Use `bg-surface-container border-b border-outline-variant/20 rounded-t-sm`.
- **States:** `focus:border-b-2 focus:border-primary focus:outline-none focus:ring-0`.

### Special Component: Highlight Cards

For elements requiring specialized status or emphasis, use `bg-surface-bright border-l-4 border-primary rounded-r-sm`.

---

## 6. Do’s and Don’ts

### Do:

- **Do** use asymmetrical margins (`ml-auto`, `mr-12`, etc.). If text is left-aligned, allow imagery to bleed off the right edge of the grid.
- **Do** prioritize "breathing room." If a layout feels cramped, double the padding (e.g., upgrade `p-4` to `p-8`).

### Don't:

- **Don't** use pure black `bg-black`. Use `bg-primary` (`#003629`) or `bg-[#191c1c]` for an expensive, "ink-like" feel.
- **Don't** use large border radiuses. Strictly avoid `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, and `rounded-full` for structural components. Stick to `rounded-sm` (0.125rem) or `rounded` (0.25rem) to maintain a crisp, formal, and editorial aesthetic.
- **Don't** use standard `border` classes to separate content sections.
