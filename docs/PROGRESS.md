# Project Progress

**Project:** Bakery Timer  
**Last updated:** 2026-04-29  
**Current sprint:** Sprint 2 — Completed (Ready for Release v1.0)  

---

## Sprint 1 — Completed

### What was built
- FastAPI backend with SQLite via SQLAlchemy
- `POST /api/sessions` — saves completed session, returns 201
- `GET /api/sessions` — returns all sessions ordered by `completed_at DESC`
- Pydantic v2 validation on all inputs (`model_dump()` not `.dict()`)
- Frontend refactored from localStorage to REST API calls
- Pause / Resume / Cancel timer with correct interval management
- Back button ("Awesome!!") to return to main UI
- History table toggle — fetches fresh data from API on each open
- UI polished and aligned with GitHub Copilot assistance

### Key technical decisions made
- `pauseTimer()` reads `remainingSeconds` from display text, clears both `timer.stop()` and `clearInterval(timerInterval)`
- `resumeTimer()` clears existing interval before creating new one — prevents duplicate interval bug
- `showHistory()` uses `classList.add("show")` not `toggle()` to avoid hiding on first click
- `StaticFiles` uses `Path(__file__).resolve().parent.parent` for absolute path — works regardless of where uvicorn is launched from
- `Timer` constructor takes no arguments — `BakingHistory` class removed entirely

### Environment
- Python 3.13.3
- FastAPI 0.111.0
- SQLAlchemy 2.0.36 (upgraded from 2.0.30 for Python 3.13 compatibility)
- Pydantic 2.13.2
- uvicorn 0.29.0
- pytest 8.2.0
- httpx 0.27.0

### Folder structure
```
bakery-timer/
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routes/
│       ├── __init__.py
│       └── sessions.py
├── frontend/
│   ├── index.html
│   └── assets/
│       ├── styles/styles.css
│       ├── scripts/script.js
│       ├── images/
│       └── audios/
├── tests/
│   └── conftest.py        ← fixture written, test cases pending
├── docs/
│   ├── PROJECT_CHARTER.md
│   ├── REQUIREMENTS.md
│   ├── SYSTEM_DESIGN.md
│   ├── API_SPEC.md
│   ├── DB_SCHEMA.md
│   └── TEST_PLAN.md
├── requirements.txt
└── .gitignore             ← pending creation
```

---

## Sprint 2 — Completed (Ready for Release)

**Update: 2026-04-29**
- ✅ **Testing completed:** 11/11 backend tests passed. Frontend manual testing finished. 3 minor bugs (UX & browser policy) deferred to v2.
- ✅ **Features completed:** Push notifications implemented. Added favicon to suppress 404 error.
- ✅ **Handoff prepared:** `README.md` and `.gitignore` created. Project is ready to be pushed to GitHub.

### Tasks checklist

**Testing**
- [x] Write pytest cases AT-01 to AT-11 in `tests/test_sessions.py`
- [x] Run manual tests MT-01 to MT-25 from TEST_PLAN.md
- [x] Fix any bugs found during testing *(Minor UX bugs deferred to v2)*

**Features pending**
- [x] Push notification — FR-09, FR-10 (Browser Notification API, frontend only)
- [x] Favicon — add `<link rel="icon" href="data:,">` to index.html if 404 still appears

**Handoff**
- [x] Write `README.md` with setup instructions
- [x] Create `.gitignore`
- [ ] Push to GitHub public repo

---

## Known issues / notes
- `module.exports` was removed from script.js (was Node.js syntax, breaks in browser)
- Timer state tracked via `timer.status` inside Timer class — external `timerState` variable not used, can be removed if present
- `cancelTimer()` calls both `timer.stop()` and `clearInterval(timerInterval)` to handle both interval sources
- `favicon.ico 404` in console is cosmetic only, does not affect functionality

---

## How to run locally
```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
# open http://localhost:8000
```
