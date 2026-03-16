# Design System

> Professional · Structured · Refined · Minimal
>
> This file is the single source of truth for all visual decisions.
> Claude Code reads this before generating any component, page, or layout.
> Never deviate from these tokens without updating this file first.

---

## Philosophy

This design system follows one core principle: **precision over decoration**.

Every element earns its place. Whitespace is structural, not accidental. Color is used
to communicate hierarchy, not to decorate. Motion is purposeful — it explains, it
confirms, it guides — never purely ornamental.

The result should feel like a well-made tool: immediately legible, quietly confident,
and completely free of visual noise.

**What this is NOT:**
- It is not a dark-mode-first, neon-accented SaaS aesthetic
- It is not friendly rounded bubbly UI
- It is not a corporate grey box layout
- It is not "default Tailwind"

---

## Typography

### Font Stack

```css
/* Tailwind classes: font-serif / font-sans / font-mono */
--font-serif: 'DM Serif Display', Georgia, serif;  /* display, headings */
--font-sans:  'DM Sans', system-ui, sans-serif;    /* body, UI */
--font-mono:  'JetBrains Mono', 'Fira Code', monospace; /* code */
```

Defined in `@theme inline` — these replace Tailwind's default `font-sans`, `font-serif`, `font-mono` utilities.

### Scale

| Token          | Size     | Weight | Line Height | Usage                               |
|----------------|----------|--------|-------------|-------------------------------------|
| `text-4xl`     | 2.25rem  | 400    | 1.1         | Page titles, hero headings          |
| `text-3xl`     | 1.875rem | 400    | 1.2         | Section headings (font-serif)       |
| `text-xl`      | 1.25rem  | 500    | 1.3         | Card headings, dialog titles        |
| `text-base`    | 1rem     | 400    | 1.6         | Body copy, descriptions             |
| `text-sm`      | 0.875rem | 400    | 1.5         | Secondary info, labels              |
| `text-xs`      | 0.75rem  | 500    | 1.4         | Captions, badges, meta              |

### Rules
- Page and section titles use `font-serif` — everything else uses `font-sans`
- **Never** use font-weight above 500 for DM Sans (reads as shouting)
- **Never** use `font-serif` below `text-xl` (1.25rem)
- Italics in DM Serif Display are beautiful — use them for emphasis in headings
- Letter-spacing: `tracking-tight` on display sizes, `tracking-widest` on all-caps labels

---

## Color

### Token System

Colors use shadcn-vue's semantic token naming. The CSS layer structure is:

```
:root / .dark       → raw OKLCH values (e.g. --background: oklch(0.989 0.003 75))
@theme inline       → maps to Tailwind utilities (e.g. --color-background: var(--background))
Component classes   → use Tailwind semantic utilities (e.g. bg-background, text-foreground)
```

**Critical naming rule:** `--primary` / `text-primary` / `bg-primary` is the **action color** (blue), NOT the text color. Main text = `text-foreground`.

### Light Mode Palette

| Token                  | Tailwind class              | Value      | Usage                           |
|------------------------|-----------------------------|------------|---------------------------------|
| `--background`         | `bg-background`             | `#FAFAF9`  | Page background                 |
| `--foreground`         | `text-foreground`           | `#1C1917`  | Primary text, headings          |
| `--card`               | `bg-card`                   | `#FFFFFF`  | Cards, panels, inputs           |
| `--card-foreground`    | `text-card-foreground`      | `#1C1917`  | Text on cards                   |
| `--border`             | `border-border`             | `#E5E3DF`  | Dividers, outlines              |
| `--input`              | `border-input`              | `#E5E3DF`  | Input borders                   |
| `--muted`              | `bg-muted`                  | subtle bg  | Muted area backgrounds          |
| `--muted-foreground`   | `text-muted-foreground`     | `#9C9890`  | Placeholder, meta, disabled     |
| `--primary`            | `bg-primary` / `text-primary` | `#2563EB` | Interactive — buttons, links    |
| `--primary-foreground` | `text-primary-foreground`   | white      | Text on primary bg              |
| `--secondary`          | `bg-secondary`              | subtle bg  | Secondary button bg             |
| `--secondary-foreground` | `text-secondary-foreground` | dark     | Text on secondary bg            |
| `--destructive`        | `bg-destructive` / `text-destructive` | `#DC2626` | Errors, danger    |
| `--ring`               | `ring-ring`                 | blue       | Focus rings                     |
| `--success`            | `text-success`              | `#16A34A`  | Success states                  |
| `--success-subtle`     | `bg-success-subtle`         | `#F0FDF4`  | Success backgrounds             |
| `--warning`            | `text-warning`              | `#D97706`  | Warning states                  |
| `--warning-subtle`     | `bg-warning-subtle`         | `#FFFBEB`  | Warning backgrounds             |
| `--danger-subtle`      | `bg-danger-subtle`          | `#FEF2F2`  | Danger backgrounds              |

Dark mode overrides all the above tokens — the accent `--primary` lightens from `#2563EB` to `#3B82F6`.

### Usage Rules
- `background` is the page. `card` is anything raised from the page (cards, dropdowns, modals).
- `primary` **only** appears on interactive elements: buttons, links, focus rings, active states.
- **Never** use `primary` as a background for large areas.
- **Never** use more than two colors in a single component (neutral + primary, or neutral + semantic).
- **Never** use raw Tailwind color classes (`text-blue-500`, `bg-gray-100`) — always use semantic tokens.

---

## Spacing

Base unit: `4px`. All spacing values are multiples.

```
4px   → gap-1, p-1    (micro — icon padding, tight badges)
8px   → gap-2, p-2    (small — inline elements)
12px  → gap-3, p-3    (default — button padding, input padding)
16px  → gap-4, p-4    (medium — card padding, section gaps)
24px  → gap-6, p-6    (large — section padding)
32px  → gap-8, p-8    (xl — between major sections)
48px  → gap-12, p-12  (2xl — page-level vertical rhythm)
64px  → gap-16, p-16  (3xl — hero spacing)
```

**Rule:** Never use odd spacing values (p-5, p-7, p-9) unless there is a specific optical reason.

---

## Shape & Borders

```
rounded-sm  → 4px   (badges, chips, inputs — precise)
rounded-md  → 8px   (buttons, cards, panels)
rounded-lg  → 12px  (modals, large cards)
rounded-xl  → 16px  (full-width panels, hero sections)
```

Defined via `@theme inline` — these override Tailwind's defaults to match our 4/8/12/16px scale.

**Rules:**
- Cards use `rounded-md` — never `rounded-full` or larger on cards
- Inputs use `rounded-sm` — they should feel precise, not friendly
- Interactive elements (buttons) use `rounded-md`
- **Never** use `rounded-full` on anything larger than an avatar or icon button
- Borders: `border border-border` — never thicker except for active/focus states

---

## Shadows

Shadow use is minimal. Elevation is communicated primarily through borders, not shadows.

```css
--shadow-sm:    0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md:    0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08);
--shadow-lg:    0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.08);
```

**Rules:**
- Default state: no shadow — use border instead
- Hover state on interactive cards: `shadow-[--shadow-md]`
- Floating elements (dropdowns, tooltips): `shadow-[--shadow-lg]`
- **Never** use colored shadows
- **Never** use shadow on text

---

## Motion

Motion is **context-dependent** — the skill generating the component decides.

```css
--duration-instant: 75ms;   /* state toggles (checkbox, switch) */
--duration-fast:    150ms;  /* hover states, micro-interactions */
--duration-base:    200ms;  /* most transitions */
--duration-slow:    300ms;  /* panel slides, modal appears */
--duration-deliberate: 500ms; /* page transitions, hero reveals */

--ease-default: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in:      cubic-bezier(0.4, 0, 1, 1);
--ease-out:     cubic-bezier(0, 0, 0.2, 1);
```

### When to Add Motion
- **Yes:** hover state transitions, focus transitions, dropdown/popover open/close, skeleton loading pulses, toast entry/exit, tab indicator sliding
- **Maybe:** page transitions, accordion open/close, list item additions/removals
- **No:** decorative background animations, parallax scrolling, elements that animate on every render

### Tailwind Transition Classes to Use
```
transition-colors duration-150     → color/border/bg changes on hover
transition-shadow duration-150     → shadow on card hover
transition-transform duration-200  → element movement
transition-opacity duration-200    → fades
```

---

## Components

### Buttons

Three variants only. No more.

| Variant   | Use case                              | Classes |
|-----------|---------------------------------------|---------|
| `solid`   | Primary action (one per view max)     | `bg-primary text-primary-foreground hover:bg-primary/90` |
| `outline` | Secondary action                      | `border border-border bg-transparent hover:bg-accent text-foreground` |
| `ghost`   | Tertiary, nav items, icon buttons     | `text-muted-foreground hover:text-foreground hover:bg-accent` |

Sizes: `sm` (h-8, px-3, text-sm), `md` (h-9, px-4, text-base), `lg` (h-11, px-6, text-base)

**Rules:**
- Never more than one `solid` button per view
- Destructive actions use `solid` with `bg-destructive text-destructive-foreground`
- Loading state: spinner replaces leading icon, button disabled, opacity-75
- **Never** use gradient backgrounds on buttons

### Cards

```
border border-border rounded-md bg-card
shadow-[--shadow-sm] hover:shadow-[--shadow-md] transition-shadow duration-150
p-6
```

**Rules:**
- Cards always have a border — shadow alone is not enough contrast on `bg-background`
- Interactive cards (clickable) get `cursor-pointer` and hover shadow transition
- Never nest cards more than one level deep

### Inputs

```
h-9 w-full rounded-sm border border-input
bg-card px-3 text-sm text-foreground
placeholder:text-muted-foreground
focus:outline-none focus:border-primary focus:ring-2 focus:ring-ring/30
transition-colors duration-150
```

**Rules:**
- Label always above the input, never inside (placeholder is not a label)
- Error state: `border-destructive`, `text-destructive` helper text below
- Disabled state: `opacity-50 cursor-not-allowed`

### Dividers

```html
<hr class="border-t border-border my-6" />
```

Never use a decorative divider where whitespace is sufficient.

---

## Layout

### Page Structure

```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8   ← content container
```

### Grid

Prefer CSS Grid for layouts. Standard columns: 12 (desktop), 4 (mobile).

```
grid grid-cols-12 gap-6     ← main layout grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  ← card grids
```

### Sidebar Layout

```
grid grid-cols-[240px_1fr]  ← fixed sidebar + fluid content
```

---

## Iconography

Use `lucide-vue-next` exclusively. Never mix icon libraries.

```ts
import { ArrowRight, Check, X, ChevronDown } from 'lucide-vue-next'
```

Sizes: `size-4` (16px) for inline/UI icons, `size-5` (20px) for emphasis, `size-6` (24px) for standalone.
Color: always inherit from parent text color — never hardcode icon colors.

---

## The `cn()` Utility

All components use `cn()` from `~/lib/utils` to merge Tailwind classes conditionally.

```ts
import { cn } from '~/lib/utils'

// Usage
const classes = cn(
  'base-classes',
  variant === 'solid' && 'bg-primary text-primary-foreground',
  disabled && 'opacity-50 cursor-not-allowed',
  props.class,  // always accept external class overrides
)
```

---

## Do Not

- ❌ `text-blue-500` or any raw Tailwind color — use `text-primary`, `text-foreground`, etc.
- ❌ `bg-gray-50` → use `bg-background` or `bg-muted`
- ❌ `text-[--color-primary]` (old naming) → use `text-foreground`
- ❌ `font-[family-name:var(--font-display)]` (old) → use `font-serif`
- ❌ `font-bold` on body copy
- ❌ `rounded-full` on cards or form elements
- ❌ Colored shadows
- ❌ More than 3 colors in a single component
- ❌ Decorative animations on page load (unless hero/landing)
- ❌ Inter, Roboto, or system-ui as a display font
- ❌ Cards without borders
- ❌ Buttons wider than their content (unless full-width is intentional)
- ❌ Icon + text misaligned vertically (always use `flex items-center gap-2`)
