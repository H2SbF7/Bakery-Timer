# Project Charter

**Project:** Bakery Timer
**Version:** 1.0
**Author:** Huỳnh Ngọc Mẫn
**Date:** 2026-04
**Phase:** 1 — Planning

---

## 1. Project overview

Bakery Timer is a web-based productivity tool that uses a baking metaphor to help users maintain focus during work or study sessions. The user selects a "cake type" (or sets a custom time), starts the countdown, and receives a notification when the session ends — similar to the Pomodoro technique but with a more playful, gamified experience.

This project upgrades the original academic prototype (built with plain HTML/JS + localStorage) into a locally-runnable full-stack application with a proper REST API backend and persistent database.

---

## 2. Goals & success criteria

| Goal | Success criteria |
|------|-----------------|
| Functional local app | App runs on any machine with one command; no cloud dependency |
| Full-stack architecture | FastAPI backend + SQLite DB replaces localStorage; frontend calls REST API |
| Portfolio-ready | Public GitHub repo with README, documented API, test coverage |
| Learning outcome | Author can explain every architecture decision without AI assistance |

---

## 3. Scope

**In scope**
- FastAPI backend with `POST /sessions` and `GET /sessions` endpoints
- SQLite database (file-based, local)
- Frontend refactored to call API instead of localStorage
- Basic pytest test suite for API endpoints
- README with setup instructions
- Git history with meaningful commit messages

**Out of scope**
- User authentication / multi-user support
- Cloud deployment
- Mobile app
- Real-time features (WebSocket)

---

## 4. Tech stack decisions

| Layer | Choice | Reason |
|-------|--------|--------|
| Backend | FastAPI (Python) | Aligns with ML/AI stack; auto-generates OpenAPI docs |
| Database | SQLite | Zero config, single file, runs offline — ideal for local app |
| ORM | SQLAlchemy | Industry standard; transferable skill to PostgreSQL later |
| Validation | Pydantic v2 | Built into FastAPI; same library used in many ML pipelines |
| Testing | pytest + httpx | Standard Python testing stack |
| Frontend | Vanilla HTML/CSS/JS | Keep existing work; avoid framework overhead for simple UI |

---

## 5. Constraints

- **Timeline:** 2 weeks (Sprint 1: backend + integration; Sprint 2: tests + polish)
- **Team:** 1 person (solo developer)
- **Environment:** Local machine only; no paid services
- **Timer accuracy:** Countdown error must stay under 1 second

---

## 6. Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| CORS issues between FastAPI and frontend | High | Configure `CORSMiddleware` from day 1 |
| Scope creep (adding features mid-sprint) | Medium | Freeze scope at this charter; park ideas in a backlog file |
| Unfamiliar with SQLAlchemy ORM | Medium | Start with raw SQL first if blocked; refactor to ORM after |

---

## 7. Deliverables

| Deliverable | Target |
|-------------|--------|
| `docs/PROJECT_CHARTER.md` | Day 1 |
| `docs/REQUIREMENTS.md` | Day 1 |
| `docs/SYSTEM_DESIGN.md` | Day 2 |
| `docs/API_SPEC.md` | Day 2 |
| `docs/DB_SCHEMA.md` | Day 2 |
| Working backend + frontend integration | Day 6 |
| `docs/TEST_PLAN.md` + pytest suite | Day 9 |
| `README.md` + public GitHub repo | Day 14 |
