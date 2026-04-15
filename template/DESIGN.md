# Design System Document: Liquid Glass & Fluid Intelligence

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **"The Fluid Academy."** 

Moving away from the rigid, boxy layouts typical of traditional educational platforms, this system embraces a youthful, high-end editorial aesthetic. We treat the interface not as a static page, but as a living ecosystem of "liquid glass" elements—translucent, layered, and organic. By utilizing intentional asymmetry and overlapping "glass" containers, we create a sense of momentum and intellectual curiosity. This system prioritizes breathing room and tonal depth over harsh lines, ensuring that even complex educational data feels approachable and premium.

---

## 2. Colors
Our palette is a sophisticated interplay of high-energy primaries and soft, atmospheric neutrals.

*   **Primary (Blue):** `#0053cc` (Primary) to `#779dff` (Primary Container). Use this for action and intellectual focus.
*   **Secondary (Red):** `#bb0100` (Secondary). Reserved for high-impact calls to action and critical feedback, balanced by `#ffc4ba` (Secondary Container) to prevent visual fatigue.
*   **Surface Hierarchy:** Our "White" is never flat. We use `surface` (#f5f7f9) as our canvas, with `surface-container-lowest` (#ffffff) for the most prominent elevated cards.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be achieved through:
1.  **Tonal Shifts:** Placing a `surface-container-low` section against a `background` (#f5f7f9).
2.  **Organic Shapes:** Using fluid, non-geometric background blobs in `tertiary-fixed-dim` (#00b2eb) to guide the eye.

### The "Glass & Gradient" Rule
To achieve the "Liquid" feel, primary CTAs should utilize a signature gradient: `primary` (#0053cc) transitioning diagonally to `primary-container` (#779dff). Floating elements must use **Glassmorphism**: a combination of semi-transparent surface colors (e.g., `surface` at 70% opacity) and a `backdrop-blur` of 12px–20px.

---

## 3. Typography
We utilize a dual-font strategy to balance authority with modern approachability.

*   **Display & Headlines (Plus Jakarta Sans):** This typeface provides a technical yet friendly edge. 
    *   **Display-LG (3.5rem):** Used for "Hero" moments with tight letter-spacing (-0.02em) to create an editorial impact.
*   **Titles & Body (Manrope):** Chosen for its exceptional legibility in dense educational content.
    *   **Body-LG (1rem):** Our standard for reading. 
    *   **Label-MD (0.75rem):** Used for micro-copy and metadata, ensuring a clean, organized look without cluttering the UI.

The hierarchy is strictly enforced to guide the student’s journey: Large, expressive headlines for inspiration, and clean, spacious body text for absorption.

---

## 4. Elevation & Depth
Depth in this system is a result of light and transparency, not artificial shadow.

*   **The Layering Principle:** Instead of shadows, stack surface tiers. Place a `surface-container-highest` navigation bar over a `surface` background. The contrast in tone creates a natural "lift."
*   **Ambient Shadows:** If a card must "float" (e.g., a featured course card), use an extra-diffused shadow: `offset-y: 8px`, `blur: 24px`, and `color: rgba(0, 83, 204, 0.06)` (a blue-tinted shadow). Never use pure black or grey.
*   **The "Ghost Border":** For input fields or containers requiring definition, use the `outline-variant` (#abadaf) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism Depth:** When a "Liquid Glass" panel sits over a gradient background, the background should subtly bleed through, creating a sense of physical thickness and premium polish.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `xl` roundedness (3rem), and a white `on-primary` label.
*   **Secondary Glass:** Semi-transparent `surface-container-highest` with a 10% `primary` tint and `backdrop-blur`.

### Cards (The "Learning Vessel")
*   **Design:** Use `lg` roundedness (2rem). No borders. Use a subtle `surface-container-low` background.
*   **Content:** Forbid dividers. Separate header, body, and footer using the **Spacing Scale** (e.g., 2rem of vertical white space).

### Input Fields
*   **Style:** `surface-container-lowest` fill with a `md` (1.5rem) corner radius.
*   **State:** On focus, transition the background to `primary-container` at 10% opacity and apply the "Ghost Border."

### Chips & Tags
*   **Filter Chips:** Use `full` roundedness (9999px). Unselected chips should be `surface-container-high`; selected chips should be `tertiary` (#006384) with `on-tertiary` text.

### Educational-Specific: Progress Glass
*   **Component:** A translucent progress bar using a `primary` liquid fill inside a `surface-variant` glass container. The "fill" should have a slight inner glow.

---

## 6. Do's and Don'ts

### Do:
*   **Use Intentional Asymmetry:** Allow glass panels to overlap or sit slightly "off-grid" to create a bespoke, editorial feel.
*   **Embrace White Space:** Treat space as a functional element that reduces cognitive load for students.
*   **Tone-on-Tone Layering:** Use slightly different shades of the same hue to define hierarchy.

### Don't:
*   **Don't use 100% Opaque Borders:** This shatters the "Liquid Glass" illusion.
*   **Don't use Default Drop Shadows:** Avoid the "dirty" look of standard grey shadows; always tint your shadows with the primary hue.
*   **Don't use Sharp Corners:** Nothing in this system should be sharper than the `sm` (0.5rem) token. Sharpness equals "Old Education"; softness equals "Modern Growth."
*   **Don't Overcrowd:** If a screen feels "busy," remove a container and use white space to separate the concepts instead.