# StayVentory Design Lock

## Rule

The files in `../design-reference/` are not inspiration. They are the approved
visual system for the app.

Required source files:

- [STYLE_GUIDE.md](../design-reference/STYLE_GUIDE.md)
- [theme.ts](../design-reference/theme.ts)
- [StatusStamp.tsx](../design-reference/StatusStamp.tsx)
- [QuantityDots.tsx](../design-reference/QuantityDots.tsx)

## Implementation requirement

All UI work for StayVentory must follow those files exactly unless the user
approves a change first.

That includes:

- colors
- typography roles
- spacing
- radii
- status semantics
- component behavior
- icon weight
- overall restraint of the layouts

## Explicit constraints

- No drifting from the provided palette.
- No replacing the stamp with generic pills or badges.
- No nested-card layouts.
- No extra accent colors.
- No gradients, shadows, or blur.
- No alternate layout system unless approved.

## Product-specific interpretation

This app should look like:

- operational
- restrained
- tactile
- modern
- easy to use inside a real cleaning workflow

This app should not look like:

- a generic SaaS dashboard
- a glossy startup template
- a card-heavy admin panel
- a trend-driven "vibe coded" mobile concept
