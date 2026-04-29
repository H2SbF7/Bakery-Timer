# Requirements

**Project:** Bakery Timer
**Version:** 1.1
**Author:** Huỳnh Ngọc Mẫn
**Date:** 2026-04
**Phase:** 2 — Requirements

---

## 1. Product overview

Bakery Timer is a web application that runs locally in the browser via a FastAPI backend. Users visit `http://localhost:8000` — no internet connection required after setup. The app gamifies focus sessions using a baking metaphor: users select a cake type or set a custom timer, run a countdown session, and build a persistent history of completed sessions stored in a local SQLite database.

> **Note:** "Runs in the browser" does not mean cloud-hosted. The FastAPI server runs on the user's own machine; the browser is simply the UI layer.

---

## 2. User personas

| Persona | Description | Primary need |
|---------|-------------|--------------|
| Focus user | Student or knowledge worker who wants to manage work sessions | Start a timer quickly; pause or cancel if needed; see session history |
| Developer (local) | Anyone who clones the repo | Run the app with minimal setup steps |

---

## 3. Functional requirements

Priority scale: **P0** = must have (MVP) · **P1** = should have · **P2** = nice to have

### 3.1 Timer — cake selection

| ID | Requirement | Priority | Acceptance criteria |
|----|-------------|----------|---------------------|
| FR-01 | User can select a preset cake type (Cookie 10 min, Cupcake 20 min, Bread 40 min) | P0 | Clicking a preset button sets the timer display and enables the Start button |
| FR-02 | User can create a custom session with an optional name and a required duration in minutes | P0 | Submitting a valid duration (> 0) sets the timer; name defaults to "Custom" if left blank |
| FR-03 | System validates custom time input and rejects non-positive values | P0 | An inline error message appears; timer is not set |

### 3.2 Timer — countdown

| ID | Requirement | Priority | Acceptance criteria |
|----|-------------|----------|---------------------|
| FR-04 | User can start the countdown after selecting a cake | P0 | Countdown begins from the selected duration and ticks down every second |
| FR-05 | User can pause a running countdown | P1 | Clicking Pause freezes the timer display; the interval stops ticking |
| FR-06 | User can resume a paused countdown | P1 | Clicking Resume continues from the paused time |
| FR-07 | User can cancel an active or paused session | P1 | Clicking Cancel resets the timer to the last selected duration; session is not saved to history |
| FR-08 | When the countdown reaches zero, the system plays an audio notification | P0 | Audio plays automatically on completion |
| FR-09 | When the countdown reaches zero, the system sends a browser push notification | P1 | Browser Notification API is triggered if permission granted; notification shows "Your cake is done!" |
| FR-10 | On first load, the app requests browser notification permission from the user | P1 | `Notification.requestPermission()` is called once; result is stored so the prompt does not repeat |
| FR-11 | When the countdown reaches zero, a completion pop-up is displayed | P0 | Pop-up shows "Congratulations! Your cake is done!" with an OK button |
| FR-12 | Closing the pop-up saves the session to the database via API | P0 | A POST request is sent to `/api/sessions`; session appears in history on next load |

### 3.3 Session history

| ID | Requirement | Priority | Acceptance criteria |
|----|-------------|----------|---------------------|
| FR-13 | User can view all completed sessions in a table | P0 | GET `/api/sessions` returns all records; table shows cake name, duration, completed date |
| FR-14 | History table is hidden by default and toggled by a button | P1 | Button click shows/hides the table |
| FR-15 | Sessions are ordered by most recent first | P1 | API returns sessions sorted by `completed_at DESC` |

### 3.4 API

| ID | Requirement | Priority | Acceptance criteria |
|----|-------------|----------|---------------------|
| FR-16 | `POST /api/sessions` accepts a session payload and stores it in SQLite | P0 | Returns `201 Created` with the saved session object including generated `id` |
| FR-17 | `GET /api/sessions` returns all sessions as a JSON array | P0 | Returns `200 OK` with array; returns empty array `[]` if no sessions exist |
| FR-18 | API validates request body and returns `422` for invalid input | P0 | Missing required fields or wrong types return `422 Unprocessable Entity` |
| FR-19 | API serves frontend static files (HTML/CSS/JS) | P1 | Visiting `http://localhost:8000` in a browser loads the app without a separate file server |

---

## 4. Non-functional requirements

### 4.1 Performance

| ID | Requirement | Measure |
|----|-------------|---------|
| NFR-01 | Timer countdown accuracy | Drift ≤ 1 second over a 60-minute session |
| NFR-02 | API response time | `GET /api/sessions` responds in < 200 ms for up to 1,000 records |
| NFR-03 | App startup time | `uvicorn` server ready in < 5 seconds on a standard laptop |

### 4.2 Usability

| ID | Requirement |
|----|-------------|
| NFR-04 | Start button is disabled until a cake type or custom time is selected |
| NFR-05 | Pause, Resume, and Cancel buttons are shown/hidden based on timer state (idle / running / paused) |
| NFR-06 | Error messages are displayed inline, not as browser alerts |
| NFR-07 | App is usable without internet connection after initial load |

### 4.3 Reliability

| ID | Requirement |
|----|-------------|
| NFR-08 | A failed API call must not crash the frontend; an inline error message is shown instead |
| NFR-09 | Session data persists across browser refreshes and app restarts (stored in SQLite, not memory) |
| NFR-10 | Cancelled sessions are never written to the database |

### 4.4 Maintainability

| ID | Requirement |
|----|-------------|
| NFR-11 | Backend follows layered separation: routes, models, and schemas in separate files |
| NFR-12 | All API endpoints have at least one pytest test covering the happy path |

### 4.5 Portability

| ID | Requirement |
|----|-------------|
| NFR-13 | App runs on macOS, Windows, and Linux with Python 3.10+ |
| NFR-14 | Setup requires only `pip install -r requirements.txt` and one `uvicorn` command |

---

## 5. Constraints

- No user authentication in v1.0
- No cloud deployment; local SQLite only
- Frontend remains vanilla HTML/CSS/JS (no framework)
- Timeline: 2 weeks

---

## 6. Out of scope (v1.0)

- Multiple user accounts
- Statistics dashboard (total focus time, streaks)
- Dark mode
- Pause state persisting across page refresh

> These items are candidates for v2.0 and should be tracked in `BACKLOG.md`.

---

## 7. Changes from original prototype

| Original (localStorage) | v1.0 (API + SQLite) |
|------------------------|---------------------|
| Data stored in browser localStorage | Data stored in SQLite via REST API |
| Data lost if browser storage is cleared | Data persists independently of browser |
| No pause / resume / cancel | Pause, resume, and cancel supported (FR-05 to FR-07) |
| No push notification | Browser push notification on session complete (FR-09) |
| No input validation on backend | Pydantic validation on all API inputs |
| No API layer | FastAPI with auto-generated OpenAPI docs at `/docs` |
