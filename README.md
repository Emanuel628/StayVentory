# StayVentory

StayVentory is a mobile app for short-term rental owners and cleaners.

Core promise:

**Know every room is clean, stocked, and guest-ready before check-in.**

## Current project state

This folder has been created as the project root for the new app.

Current included assets:

- `design-reference/STYLE_GUIDE.md`
- `design-reference/theme.ts`
- `design-reference/StatusStamp.tsx`
- `design-reference/QuantityDots.tsx`

These files are the locked visual direction for the app and must be followed
exactly unless explicitly approved otherwise.

## Non-negotiable design rule

StayVentory will use the look, layout direction, colors, typography rules, and
SVG/component treatments from `design-reference/` exactly.

Do not:

- reinterpret the color palette
- substitute a different status treatment
- replace the typography system
- add gradients, shadows, or decorative dashboard UI
- drift away from the provided spacing and restraint rules

## Initial structure

- `design-reference/` locked design source of truth
- `docs/` product and implementation documentation
- `src/` app source

## Next build step

The next technical step should be:

1. scaffold the Expo + TypeScript app in this folder
2. move the design tokens/components into the real app structure
3. create the Supabase schema
4. build the owner auth and houses flow first

## Backend foundation

The project now includes the first backend wiring layer:

- Supabase client bootstrap
- typed database definitions
- auth/session provider
- starter auth service
- starter houses service
- initial SQL schema migration

Setup details live in [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md).

## Current product decisions

- StayVentory uses owner-invited cleaner access
- cleaners create their own cleaner accounts
- owners grant access by invite plus one-time code
- cleaner visibility is limited to assigned properties only
