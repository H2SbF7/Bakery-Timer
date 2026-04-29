# System Design

**Project:** Bakery Timer
**Version:** 1.0
**Author:** Huỳnh Ngọc Mẫn
**Date:** 2026-04
**Phase:** 3 — Design

---

## 1. Architecture overview

Bakery Timer follows a **3-layer architecture** running entirely on the user's local machine:

```
┌─────────────────────────────────────────┐
│           Browser (UI Layer)            │
│        HTML + CSS + JavaScript          │
│  - Renders timer, handles user events   │
│  - Calls backend via fetch() / REST     │
└───────────────┬─────────────────────────┘
                │ HTTP (localhost:8000)
┌───────────────▼─────────────────────────┐
│         FastAPI (Application Layer)     │
│  - Serves static frontend files         │
│  - Exposes REST API at /api/*           │
│  - Validates input via Pydantic         │
│  - Coordinates between routes & models  │
└───────────────┬─────────────────────────┘
                │ SQLAlchemy ORM
┌───────────────▼─────────────────────────┐
│          SQLite (Data Layer)            │
│  - Single file: bakery_timer.db         │
│  - Stores completed focus sessions      │
└─────────────────────────────────────────┘
```

All three layers run on `localhost`. No network requests leave the machine after setup.

---

## 2. Folder structure

```
bakery-timer/
│
├── backend/
│   ├── main.py           # FastAPI app entry point; mounts static files; includes router
│   ├── database.py       # SQLAlchemy engine + session factory + Base
│   ├── models.py         # ORM table definitions (SQLAlchemy models)
│   ├── schemas.py        # Pydantic request/response schemas
│   └── routes/
│       └── sessions.py   # Route handlers for /api/sessions
│
├── frontend/
│   ├── index.html
│   └── assets/
│       ├── styles/
│       │   └── styles.css
│       ├── scripts/
│       │   └── script.js   # Refactored: calls API instead of localStorage
│       ├── images/
│       └── audios/
│
├── tests/
│   ├── conftest.py       # pytest fixtures (test client, test DB)
│   └── test_sessions.py  # API endpoint tests
│
├── docs/
│   ├── PROJECT_CHARTER.md
│   ├── REQUIREMENTS.md
│   ├── SYSTEM_DESIGN.md   # this file
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   └── TEST_PLAN.md
│
├── .gitignore
├── requirements.txt
└── README.md
```

---

## 3. Component responsibilities

### 3.1 Backend

| File | Responsibility |
|------|---------------|
| `main.py` | Creates the FastAPI app instance, registers the sessions router, mounts the `frontend/` directory as static files so the browser can load the UI |
| `database.py` | Defines the SQLAlchemy engine pointing to `bakery_timer.db`, creates the session factory (`SessionLocal`), and exposes `get_db()` as a FastAPI dependency |
| `models.py` | Defines the `Session` ORM class mapping to the `sessions` table |
| `schemas.py` | Defines `SessionCreate` (input) and `SessionResponse` (output) Pydantic models for request validation and response serialization |
| `routes/sessions.py` | Contains `POST /api/sessions` and `GET /api/sessions` route handlers |

### 3.2 Frontend

| File | Responsibility |
|------|---------------|
| `index.html` | Static markup; imports CSS and JS |
| `styles.css` | Layout and visual styling |
| `script.js` | Timer logic (start, pause, resume, cancel), API calls (`fetch`), DOM updates, push notification request |

### 3.3 Tests

| File | Responsibility |
|------|---------------|
| `conftest.py` | Creates an in-memory SQLite test database and a FastAPI `TestClient`; tears down after each test |
| `test_sessions.py` | Tests happy path and error cases for both API endpoints |

---

## 4. Request flow — completing a session

```
User clicks OK on completion pop-up
        │
        ▼
script.js: closePopup()
        │
        │  POST /api/sessions
        │  { "cake_name": "Cupcake", "duration_minutes": 20 }
        ▼
routes/sessions.py: create_session()
        │
        │  validates via SessionCreate (Pydantic)
        │  writes to DB via SessionLocal
        ▼
models.py: Session row inserted
        │
        │  returns SessionResponse
        ▼
script.js: updates history table in DOM
```

---

## 5. Timer state machine (frontend)

The timer has four states managed in `script.js`:

```
         selectCake() / setCustomTime()
IDLE ────────────────────────────────► READY
                                          │
                                   startTimer()
                                          │
                                          ▼
                          ┌────────── RUNNING ◄──────────┐
                          │               │               │
                    pauseTimer()    countdown = 0   resumeTimer()
                          │               │               │
                          ▼               ▼               │
                        PAUSED      COMPLETED         PAUSED
                          │
                    cancelTimer()
                          │
                          ▼
                         IDLE
```

State controls which buttons are visible (NFR-05):

| State | Visible buttons |
|-------|----------------|
| IDLE | — |
| READY | Start |
| RUNNING | Pause, Cancel |
| PAUSED | Resume, Cancel |
| COMPLETED | (pop-up shown) |

---

## 6. Technology decisions (rationale)

| Decision | Alternative considered | Why this choice |
|----------|----------------------|-----------------|
| FastAPI over Flask | Flask | FastAPI auto-generates `/docs` (OpenAPI UI), has built-in Pydantic validation, and is async-ready — closer to production ML serving patterns |
| SQLite over PostgreSQL | PostgreSQL | Zero config for local use; same SQLAlchemy ORM code works with PostgreSQL by changing one connection string in `database.py` |
| Vanilla JS over React | React | App has minimal UI complexity; adding a build step (npm, webpack) increases setup friction for a local tool |
| `StaticFiles` mount over separate dev server | Vite / live-server | Single `uvicorn` command serves both API and frontend — simpler local setup, matches FR-19 |

---

## 7. Local setup (preview — full version in README.md)

```bash
# Clone the repo
git clone https://github.com/<username>/bakery-timer.git
cd bakery-timer

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn backend.main:app --reload

# Open in browser
# http://localhost:8000
```

The `--reload` flag restarts the server automatically when backend files change during development.
