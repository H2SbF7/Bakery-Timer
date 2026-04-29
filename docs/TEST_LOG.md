# Test Execution Log - Version 1.0

**Date:** 2026-04-29  
**Phase:** 5 - Testing  
**Tester:** Huỳnh Ngọc Mẫn  
**Environment:** Local (Windows, Python 3.13, Chrome (latest))  
**Status:** In Progress (Automation: Done, Manual: Pending)

---

## 1. Automated Test Results (Backend API)
*Executed using: `python -m pytest tests/ -v`*

| ID | Test Name | Status | Notes |
|----|-----------|--------|-------|
| AT-01 | Save valid session | PASS | |
| AT-02 | Save session without cake_name | PASS | |
| AT-03 | Reject zero duration | PASS |  |
| AT-04 | Reject negative duration | PASS |  |
| AT-05 | Reject missing duration | PASS |  |
| AT-06 | Reject missing complete_at | PASS |  |
| AT-07 | Reject invalid datetime format | PASS |  |
| AT-08 | Get empty history | PASS |  |
| AT-09 | Get all sessions | PASS |  |
| AT-10 | Sessions ordered by most recent | PASS |  |
| AT-11 | Saved session appears in GET | PASS |  |

| **Total** | **11/11 Passed** | **100%** | |

---

## 2. Manual Test Execution Log (Frontend UI)
*Executed in Browser (Chrome)*

| ID | Test Name | Status | Date | Notes/Bug Found |
|----|-----------|--------|------|-----------------|
| MT-01 | Select preset cake | PASS | 2026/05/ | |
| MT-02 | Select different preset | PASS | 2026/05/ | |
| MT-03 | Create custom cake with name | PASS  | 2026/05/ | |
| MT-04 | Create custom cake without name | PASS | 2026/05/ |
| MT-05 | Reject zero duration | FAIL  | 2026/05/ | Bug: Alert error message is shown, not inline message |
| MT-06 | Reject negative duration | FAIL  | 2026/05/ | Bug: Alert error message is shown, not inline message |
| MT-07 | Start button disabled on load | PASS  | 2026/05/ | |
| MT-08 | Start countdown | PASS | 2026/05/ | |
| MT-09 | Pause countdown | PASS | 2026/05/ | |
| MT-10 | Resume countdown | PASS  | 2026/05/ | |
| MT-11 | Cancel running session | PASS | 2026/05/ | |
| MT-12 | Cancel paused session | PASS | 2026/05/ | |
| MT-13 | Session completes | PASS | 2026/05/ |  |
| MT-14 | Session saved on pop-up close | PASS | 2026/05/ | |
| MT-15 | History hidden by default | PASS | 2026/05/ | |
| MT-16 | Toggle history | PASS | 2026/05/ | |
| MT-17 | History shown correct data | PASS | 2026/05/ | |
| MT-18 | History persists after refresh | PASS | 2026/05/ |  |
| MT-19 | Most recent session at top | PASS | 2026/05/ | |
| MT-20 | Permission prompt on first load | FAIL | 2026/05/ | Bug: No prompt appears  Note: Permission prompt appears on Brave, not Chrome. Needs to enable manually when view site infomation.|
| MT-21 | Notification fires on completion | PASS | 2026/05/ | |
| MT-22 | No crash if permission denied | PASS | 2026/05/ | |
| MT-23 | API down - complete session |FAIL | 2026/05/ | Bug: Alert error message is shown, not inline message |
| MT-24 | API down - load history |FAIL | 2026/05/ | Bug: Alert error message is shown, not inline message |
| MT-25 | Data persists across restart |PASS | 2026/05/ | |


---

## 3. Summary & Bug Tracking

### Automated backend tests
- 11/11 passed.

### Manual tests
- 25/25 executed.
- 20 passed, 5 failed.

### Bug list

| ID | Description | Location | Requirement | Status |
|----|-------------|----------|-------------|--------|
| BUG-01 | Invalid input shows alert() instead of inline error message | script.js | NFR-06 | Deferred to v2 |
| BUG-02 | API error shows alert() instead of inline error message | script.js | NFR-08 | Deferred to v2 |
| BUG-03 | Push notification permission prompt does not appear on first load in Chrome | script.js | FR-09 | Deferred to v2 (Browser policy) |

### Next step
- Testing phase completed. Ready for release v1.0.
