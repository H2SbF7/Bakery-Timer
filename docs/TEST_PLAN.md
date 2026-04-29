# Test Plan

**Project:** Bakery Timer  
**Version:** 1.0  
**Author:** Huỳnh Ngọc Mẫn  
**Date:** 2026-04  
**Phase:** 5 — Testing  

---

## 1. Overview

This document defines the test strategy, test cases, and acceptance criteria for Bakery Timer v1.0. Each test case maps to one or more requirement IDs from `REQUIREMENTS.md` so that coverage can be traced end-to-end.

---

## 2. Test scope

| In scope | Out of scope |
|----------|-------------|
| FastAPI API endpoints (automated) | Browser compatibility testing (IE, Safari mobile) |
| Frontend timer logic (manual) | Load testing / performance benchmarking |
| Input validation on backend | Security / penetration testing |
| Push notification permission flow (manual) | Accessibility audit |
| Session history display (manual) | |

---

## 3. Test types and tools

| Type | Tool | Who runs it | When |
|------|------|-------------|------|
| Unit + integration (API) | pytest + httpx | Developer (automated) | Every code change |
| Manual (frontend) | Browser (Chrome) | Developer | End of each sprint |

---

## 4. Test environment

| Item | Value |
|------|-------|
| OS | macOS / Windows / Linux |
| Python | 3.10+ |
| Browser | Chrome (latest) |
| Database | In-memory SQLite (automated tests); `bakery_timer.db` (manual tests) |
| Run command | `pytest tests/ -v` |

---

## 5. Automated test cases — API

These tests live in `tests/test_sessions.py` and use an in-memory SQLite database so they never touch production data.

### 5.1 `POST /api/sessions`

| ID | Test name | Input | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| AT-01 | Save valid session | `{ cake_name: "Cupcake", duration_minutes: 20, completed_at: "2025-05-21T08:00:00Z" }` | `201 Created`; response body contains `id`, all input fields echoed back | FR-16 |
| AT-02 | Save session without cake_name | `{ duration_minutes: 10, completed_at: "2025-05-21T08:00:00Z" }` | `201 Created`; `cake_name` defaults to `"Custom"` | FR-02, FR-16 |
| AT-03 | Reject zero duration | `{ cake_name: "Cookie", duration_minutes: 0, completed_at: "2025-05-21T08:00:00Z" }` | `422 Unprocessable Entity` | FR-03, FR-18 |
| AT-04 | Reject negative duration | `{ cake_name: "Cookie", duration_minutes: -5, completed_at: "2025-05-21T08:00:00Z" }` | `422 Unprocessable Entity` | FR-03, FR-18 |
| AT-05 | Reject missing duration | `{ cake_name: "Cookie", completed_at: "2025-05-21T08:00:00Z" }` | `422 Unprocessable Entity` | FR-18 |
| AT-06 | Reject missing completed_at | `{ cake_name: "Cookie", duration_minutes: 10 }` | `422 Unprocessable Entity` | FR-18 |
| AT-07 | Reject invalid datetime format | `{ cake_name: "Cookie", duration_minutes: 10, completed_at: "not-a-date" }` | `422 Unprocessable Entity` | FR-18 |

### 5.2 `GET /api/sessions`

| ID | Test name | Precondition | Expected result | Requirement |
|----|-----------|--------------|-----------------|-------------|
| AT-08 | Get empty history | No sessions in DB | `200 OK`; response body is `[]` | FR-17 |
| AT-09 | Get all sessions | 3 sessions saved via `POST` | `200 OK`; array contains all 3 sessions | FR-13, FR-17 |
| AT-10 | Sessions ordered by most recent | Sessions saved at T1, T2, T3 | Response order is T3, T2, T1 (descending) | FR-15 |
| AT-11 | Saved session appears in GET | `POST` one session, then `GET` | The posted session is present in the list | FR-16, FR-17 |

---

## 6. Manual test cases — frontend

These are executed in the browser. Results are recorded as Pass / Fail with notes.

### 6.1 Cake selection

| ID | Test name | Steps | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| MT-01 | Select preset cake | Click "Cookie" button | Timer shows `10:00`; Start button appears and becomes enabled (was hidden before selection) | FR-01 |
| MT-02 | Select different preset | Click "Cupcake" after "Cookie" | Timer updates to `20:00` | FR-01 |
| MT-03 | Create custom session with name | Enter name "Focus block", enter `25`, click "Create custom cake" | Timer shows `25:00`; cake name displays "Focus block" | FR-02 |
| MT-04 | Create custom session without name | Leave name blank, enter `15`, click "Create custom cake" | Timer shows `15:00`; name displays "Custom" | FR-02 |
| MT-05 | Reject zero duration | Enter `0`, click "Create custom cake" | Inline error message shown; timer not set; Start button stays disabled | FR-03, NFR-06 |
| MT-06 | Reject negative duration | Enter `-10`, click "Create custom cake" | Inline error message shown; timer not set | FR-03 |
| MT-07 | Start button hidden on load | Open app without selecting anything | Start button is hidden (not just disabled) — it only appears after a cake is selected | NFR-04 |

### 6.2 Timer — countdown, pause, resume, cancel

| ID | Test name | Steps | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| MT-08 | Start countdown | Select Cookie; click Start | Timer counts down from `10:00`; Pause and Cancel buttons appear | FR-04, NFR-05 |
| MT-09 | Pause countdown | Start timer; click Pause | Timer freezes; Resume and Cancel buttons appear; Pause hidden | FR-05, NFR-05 |
| MT-10 | Resume countdown | Pause timer; click Resume | Timer continues from paused value; Pause and Cancel buttons return | FR-06, NFR-05 |
| MT-11 | Cancel running session | Start timer; click Cancel | Timer resets to selected duration; session not saved; history unchanged | FR-07, NFR-10 |
| MT-12 | Cancel paused session | Pause timer; click Cancel | Same as MT-11 | FR-07, NFR-10 |
| MT-13 | Session completes | Start a 1-minute custom timer; wait | Audio plays; completion pop-up appears; baked cake image shown | FR-08, FR-11 |

### 6.3 Completion and history

| ID | Test name | Steps | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| MT-14 | Session saved on pop-up close | Complete a session; click OK | Session appears in history table; `POST /api/sessions` returned `201` (check browser DevTools Network tab) | FR-12 |
| MT-15 | History hidden by default | Open app | History table is not visible | FR-14 |
| MT-16 | Toggle history | Click "View your baking history" | Table appears; click again; table hides | FR-14 |
| MT-17 | History shows correct data | Complete session "Cookie" 10 min; view history | Row shows: Cookie, 10, today's date | FR-13 |
| MT-18 | History persists after refresh | Complete a session; refresh page; view history | Session still in table (loaded from SQLite via API, not localStorage) | NFR-09 |
| MT-19 | Most recent session at top | Complete 2 sessions; view history | Second session appears above first | FR-15 |

### 6.4 Push notification

| ID | Test name | Steps | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| MT-20 | Permission prompt on first load | Open app in a fresh browser profile | Browser permission dialog appears once | FR-10 |
| MT-21 | Notification fires on completion | Grant permission; complete a session | Browser push notification appears with "Your cake is done!" | FR-09 |
| MT-22 | No crash if permission denied | Deny notification permission; complete a session | App still works normally; pop-up still shown; no JS error in console | FR-09, NFR-08 |

### 6.5 Reliability and error handling

| ID | Test name | Steps | Expected result | Requirement |
|----|-----------|-------|-----------------|-------------|
| MT-23 | API down — complete session | Stop uvicorn; complete a session; click OK | Inline error message shown; app does not crash | NFR-08 |
| MT-24 | API down — load history | Stop uvicorn; click "View history" | Inline error message shown; app does not crash | NFR-08 |
| MT-25 | Data persists across restart | Complete session; stop uvicorn; restart uvicorn; view history | Session still present | NFR-09 |

---

## 7. pytest file structure (reference)

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()
```

```python
# tests/test_sessions.py  — example for AT-01 and AT-08
def test_create_session_valid(client):                              # AT-01
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 20,
        "completed_at": "2025-05-21T08:00:00Z"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["cake_name"] == "Cupcake"
    assert data["duration_minutes"] == 20
    assert "id" in data

def test_get_sessions_empty(client):                               # AT-08
    response = client.get("/api/sessions")
    assert response.status_code == 200
    assert response.json() == []
```

---

## 8. Test coverage target

| Category | Target | Rationale |
|----------|--------|-----------|
| API endpoints (automated) | 100% of P0 endpoints | All P0 API requirements must have a passing test before merge |
| Frontend (manual) | All P0 + P1 manual cases | Executed once at end of Sprint 1 and Sprint 2 |

---

## 9. Definition of done

A feature is considered complete when:

1. The corresponding requirement ID (FR-xx / NFR-xx) has at least one passing test (automated or manual)
2. No existing passing tests are broken
3. Code is committed with a meaningful message referencing the feature (e.g. `feat: add POST /api/sessions endpoint (FR-16)`)
