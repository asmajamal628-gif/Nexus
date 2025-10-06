# Nexus Platform – Component Structure & Architecture

## 📂 Folder Structure
- `pages/` → Contains route-based components (e.g., login, dashboard).
- `components/` → Reusable UI components (Navbar, Calendar, MeetingCard).
- `styles/` → Global styles and theme configuration.
- `utils/` → Helper functions for API calls and formatting.
- `hooks/` → Custom React hooks.

## 🧩 Key Components
- `LoginPage` → Handles user login with form inputs.
- `Dashboard` → Displays meetings, calendar, and user profile info.
- `Calendar` → FullCalendar integration for scheduling.
- `MeetingCard` → Shows meeting details (title, date, status).
- `Navbar` → Provides navigation between pages.

## 🔄 Data Flow
- User logs in via `LoginPage`.
- `Dashboard` loads and shows `Calendar` + `MeetingCard`s.
- State (via Context/Redux) manages user info and meeting data.
- API requests (in `utils/`) fetch or update meeting information.
