# StayVentory Product Direction

## Product

StayVentory is a simple turnover control system for small short-term rental owners.

## Primary flow

1. Owner logs in
2. Owner sees houses
3. Owner opens a house
4. Owner sees rooms
5. Owner opens a room
6. Owner manages inventory, notes, and issues for that room

Cleaning is a separate tab with its own job-based workflow.

## Core areas

- Houses
- Rooms
- Room inventory
- Cleaning jobs
- Room checklists
- Notes
- Repair / Maintenance / Replace

## User roles

- Owner
- Cleaner

## Cleaner access model

Cleaner access is owner-controlled.

### Cleaner onboarding flow

1. Cleaner downloads StayVentory
2. Cleaner creates a cleaner account
3. Owner creates or selects that cleaner inside the app
4. Owner chooses which properties that cleaner can access
5. System generates a one-time random access code
6. Owner sends the invite by email or shares the code directly
7. Cleaner enters the code to link their cleaner account to that owner's properties

This keeps cleaner accounts separate from owner accounts while still making access
explicit and controlled.

### Owner controls

The owner must be able to:

- invite a cleaner by email or username
- generate a one-time access code
- assign one or more specific properties to that cleaner
- remove cleaner access at any time
- update which properties a cleaner can access

### Cleaner visibility

A cleaner should only be able to see data for properties they were assigned to.

For each assigned property, the cleaner can access:

- property name
- property address
- owner contact information
- cleaning instructions
- room-by-room checklist
- room inventory expectations
- notes
- issue reporting
- photo and video uploads

### Cleaner actions

For an assigned property, the cleaner must be able to:

- view cleaning instructions
- view what to clean and what to restock
- upload photos
- upload videos
- delete or replace their own uploaded proof before final submission
- add notes for the owner
- update checklist completion
- report missing, damaged, or replacement-needed items

### Owner review

The owner should be able to review:

- which cleaner has access to which property
- cleaner uploads
- cleaner notes
- checklist completion
- issue reports tied to a specific property and cleaning job

### Product rule

Cleaner access must stay property-scoped, not account-wide.

A cleaner should never see:

- properties they were not assigned to
- unrelated owner settings
- unrelated notes or issues from other properties

## Product rule

The app should remain narrow and useful.

It is not a full property management system. It is a room-by-room readiness,
restock, and verification tool.
