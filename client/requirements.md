## Packages
canvas-confetti | For a fun, engaging celebration when reaching the daily hydration goal
@types/canvas-confetti | TypeScript types for confetti
date-fns | Excellent utility for calculating timetable schedules between wake and sleep times

## Notes
- The app uses Replit Auth (`/api/login`, `/api/logout`, `/api/auth/user`) for authentication.
- For users without a profile, the `/api/profile` endpoint returns a 404, prompting the ProfileSetup page to render.
- Custom fonts (Outfit and DM Sans) are imported in index.css.
- Optimistic UI updates are used for the + and - water buttons to ensure a snappy, premium feel.
