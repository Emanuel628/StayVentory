# Application 1 — visual style guide

This is the locked visual direction ("field binder / verified turnover" concept).
Everything here is exact — hex values, sizes, weights — so it can be implemented
literally rather than re-interpreted. Paired files in this delivery:

- `theme.ts` — token file, import this everywhere, never hardcode a hex in a screen
- `StatusStamp.tsx` — the verified/status stamp, built with `react-native-svg`
- `QuantityDots.tsx` — the inventory dot-fill indicator

## 0. Why these choices (for anyone else who touches this later)

- The product promise is "every turnover is verified." The stamp is the one
  UI element that performs that promise instead of just labeling a status —
  it should never be diluted into a generic pill/badge elsewhere in the app.
- Fraunces (serif, semibold) is used **only** for proper nouns the user owns:
  house names, room names. Nowhere else. This keeps it a signature, not a theme.
- Everything operational — inventory rows, notes, buttons, nav — stays in
  IBM Plex Sans / Mono. If a screen needs "more personality," the answer is
  never "make the sans-serif bigger or bolder," it's "is there a proper noun
  here that should be serif instead."

---

## 1. Color tokens

| Token              | Hex       | Use                                                             |
|---------------------|-----------|------------------------------------------------------------------|
| `color.paper`        | `#F3EEE2` | Screen background                                                |
| `color.paperRaised`  | `#EAE2CD` | Note/callout blocks (owner notes, cleaner notes)                |
| `color.hairline`     | `#DDD6C4` | All dividers and row separators — 1px, never more                |
| `color.ink`          | `#201F18` | Primary text, icons on light                                     |
| `color.inkMuted`     | `#8A8368` | Eyebrow labels, secondary/meta text (room counts, timestamps)     |
| `color.inkBody`      | `#4A4636` | Note body copy (softer than primary ink, more than muted)         |
| `color.teal`         | `#1F5945` | Status: Ready. Primary action buttons. One accent max per screen. |
| `color.tealOnDark`   | `#DCEFE7` | Icon color when placed on a `color.teal` tile                     |
| `color.ochre`        | `#A9791F` | Status: Low stock                                                |
| `color.ochreOnDark`  | `#F7ECD3` | Icon color on an `color.ochre` tile                               |
| `color.rust`         | `#A8532F` | Status: Needs attention / issue reported                          |
| `color.rustOnDark`   | `#F9E4D9` | Icon color on a `color.rust` tile                                 |
| `color.dotEmpty`     | `#E0D8C2` | Unfilled dot in the quantity indicator                            |

Rules:
- Never use plain black (`#000`) or generic gray anywhere — always one of the tokens above.
- One accent-filled button per screen, always `color.teal`. Everything else is
  outline (`color.ink` border, transparent fill) — this mirrors "restraint" from
  the product rules: no competing CTAs.
- Status colors (`teal` / `ochre` / `rust`) are semantic and fixed to exactly
  three meanings: Ready, Low Stock, Needs Attention. "Needs Cleaning" (the 4th
  app-level status) uses `color.inkMuted` on `color.hairline` — it's a neutral
  waiting state, not a problem state, so it doesn't get a warm color.

## 2. Typography

Three families, three jobs. No other fonts, no italics, no additional weights.

| Role                          | Family              | Weight | Size (mobile)     | Letter spacing |
|-------------------------------|---------------------|--------|--------------------|----------------|
| House name / room name        | Fraunces             | 600    | 18–26px            | normal          |
| Eyebrow label (uppercase)     | IBM Plex Sans        | 400    | 11px               | 0.06–0.08em     |
| Body / list row primary text  | IBM Plex Sans        | 400    | 14–15px            | normal          |
| Button / row label emphasis   | IBM Plex Sans        | 500    | 13–14px            | normal          |
| Meta text (counts, timestamps)| IBM Plex Sans        | 400    | 12–13px            | normal          |
| Quantities, counts, stamp text| IBM Plex Mono        | 500    | 9–13px             | 0.02–0.03em     |

Loading fonts in Expo:

```bash
npx expo install expo-font @expo-google-fonts/fraunces @expo-google-fonts/ibm-plex-sans @expo-google-fonts/ibm-plex-mono
```

```tsx
import { useFonts, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { IBMPlexSans_400Regular, IBMPlexSans_500Medium } from '@expo-google-fonts/ibm-plex-sans';
import { IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';

const [fontsLoaded] = useFonts({
  Fraunces_600SemiBold,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexMono_500Medium,
});
```

Reference fonts by the exact loaded family strings above (e.g.
`fontFamily: 'Fraunces_600SemiBold'`) — do not use `fontWeight` to fake a
weight Expo hasn't loaded, it will silently fall back to system font.

## 3. Spacing and radius

Base unit: 4px. Only use multiples of it.

| Token        | Value | Use                                    |
|--------------|-------|------------------------------------------|
| `space.xs`   | 4px   | Gap between an icon and its label         |
| `space.sm`   | 8px   | Gap between elements in a row             |
| `space.md`   | 12px  | Internal padding on note/callout blocks   |
| `space.lg`   | 16px  | Vertical padding on list rows             |
| `space.xl`   | 20px  | Screen horizontal margins                 |

| Token             | Value | Use                                   |
|-------------------|-------|-----------------------------------------|
| `radius.control`  | 3px   | Buttons, note/callout blocks — sharp, not pill |
| `radius.tile`     | 10px  | Room-type icon tiles                     |
| `radius.sheet`    | 22px  | Full-screen sheet corners (if using modal presentation) |

No other radius values. No shadows anywhere — depth comes from the hairline
dividers and the paper/raised color contrast, never `box-shadow` / `elevation`.

## 4. Components

### 4.1 Screen header
Eyebrow (`IBM Plex Sans` 11px, `color.inkMuted`, uppercase, 0.08em) then, directly
below it, the greeting in Fraunces 600 26px, `color.ink`.

Copy: **"Hello, {name}"** or **"Welcome, {name}"** — pick one and use it
everywhere, don't alternate. No time-of-day logic (no "Good morning/afternoon").

### 4.2 House / room list row
Plain row, no card wrapper, `1px solid color.hairline` bottom border, `space.lg`
vertical padding, `space.xl` horizontal padding (screen margin, not per-row).

Left: icon tile (`radius.tile`, 44x44, filled with the row's status color,
icon in the matching `OnDark` color, 22px) + `space.sm` + text stack (name in
Fraunces 600 18px over meta in Plex Sans 12px `color.inkMuted`).
Right: the status stamp (§4.3), never a plain badge/pill for house or room status.

### 4.3 Status stamp
See `StatusStamp.tsx`. Exact spec:
- 46x46 circle, `1.5px` dashed stroke, dash pattern `3,2`, no fill
- Stroke color = the status color (teal / ochre / rust)
- Rotated `-8deg`
- Two-line label inside, centered, IBM Plex Mono 500 9px, 1.1 line height,
  same color as the stroke, uppercase, e.g. `VERIFIED / READY`, `LOW / STOCK`,
  `NEEDS / ATTN`
- This exact treatment is reserved for house-level and room-level status only.
  Do not reuse the stamp shape for anything else (e.g. don't stamp individual
  checklist items) — it stays meaningful because it's rare.

### 4.4 Quantity dots
See `QuantityDots.tsx`. One 7px circle per required unit, filled `color`
(status-appropriate: teal if at/above minimum, rust if below) up to current
count, `color.dotEmpty` for the remainder. Fraction label in IBM Plex Mono
500 12px directly after the dots, same color as the filled dots.

### 4.5 Note / callout block
`color.paperRaised` background, `radius.control` (3px — sharp, not rounded),
`space.md` padding. Eyebrow label above (`IBM Plex Sans` 11px, `color.inkMuted`,
uppercase), body in `IBM Plex Sans` 400 13px `color.inkBody`, 1.5 line height.

### 4.6 Buttons
Two variants only:
- **Primary** (max one per screen): `color.teal` fill, white-on-teal text
  (use `color.tealOnDark`... actually pure white reads better here — use
  `#EEF4EE`), `radius.control`, `IBM Plex Sans` 500 13px, no border.
- **Secondary**: transparent fill, `1px solid color.ink` border, `color.ink`
  text, same radius/type as primary.

No tertiary/ghost/text-only button style — if a screen needs a third action,
that's a sign it needs a menu, not a third button style.

## 5. Icons

The web mockup used Tabler's webfont; in React Native use
[`lucide-react-native`](https://github.com/lucide-icons/lucide) — same
outline weight and visual family, works natively with Expo:

```bash
npx expo install lucide-react-native react-native-svg
```

```tsx
import { Home, Bath, TreePine, Building2 } from 'lucide-react-native';

<Home color={colors.tealOnDark} size={22} strokeWidth={1.75} />
```

Always `strokeWidth={1.75}` (never the 2.5 heavy default) to match the
restrained line weight in the mockup. Icon color is always the tile's
`OnDark` token, never `color.ink`.

## 6. What NOT to do

- No gradients, no drop shadows, no blur — flat fills only
- No rounded pill badges for status — the stamp is the only status device
- No more than one Fraunces element per screen section (house/room name) —
  don't let the serif creep into buttons, labels, or body copy
- No third accent color — teal/ochre/rust is the complete semantic palette
- No card-in-card nesting — a note block can live inside a room screen, but
  never inside another bordered container
