# Database Schema

**Project:** Bakery Timer
**Version:** 1.0
**Author:** Huỳnh Ngọc Mẫn
**Date:** 2026-04
**Phase:** 3 — Design

---

## 1. Overview

Bakery Timer uses a single **SQLite** database file (`bakery_timer.db`) stored in the project root. SQLite was chosen for zero-configuration local use; the SQLAlchemy ORM layer means the schema can be migrated to PostgreSQL later by changing only the connection string in `database.py`.

---

## 2. Entity Relationship Diagram

```
┌──────────────────────────────────┐
│            sessions              │
├──────────────────────────────────┤
│ PK  id              INTEGER      │
│     cake_name       TEXT         │
│     duration_minutes INTEGER     │
│     completed_at    TEXT         │
└──────────────────────────────────┘
```

v1.0 has a single table. There are no foreign keys because the app does not have user accounts or multi-entity relationships.

---

## 3. Table definitions

### 3.1 `sessions`

Stores one row per completed focus session. Cancelled sessions are never written (FR-07, NFR-10).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT, NOT NULL | Unique session identifier, auto-assigned by SQLite |
| `cake_name` | TEXT | NOT NULL | Name of the cake type selected or custom name entered by the user. Defaults to `"Custom"` if user left the name field blank |
| `duration_minutes` | INTEGER | NOT NULL, CHECK > 0 | Duration of the session in whole minutes |
| `completed_at` | TEXT | NOT NULL | ISO 8601 UTC timestamp of when the session completed, e.g. `"2025-05-21T08:44:39Z"`. Stored as TEXT because SQLite has no native DATETIME type |

---

## 4. SQLAlchemy model (`models.py`)

```python
from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Session(Base):
    __tablename__ = "sessions"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    cake_name        = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    completed_at     = Column(Text, nullable=False)
```

---

## 5. Pydantic schemas (`schemas.py`)

Pydantic schemas are separate from the ORM model. They define what the API accepts and returns.

```python
from pydantic import BaseModel, Field
from datetime import datetime

class SessionCreate(BaseModel):
    """Request body for POST /api/sessions"""
    cake_name:        str      = Field(default="Custom", min_length=1, max_length=100)
    duration_minutes: int      = Field(..., gt=0, description="Must be greater than 0")
    completed_at:     datetime = Field(..., description="ISO 8601 UTC timestamp")

class SessionResponse(BaseModel):
    """Response body for POST and GET /api/sessions"""
    id:               int
    cake_name:        str
    duration_minutes: int
    completed_at:     datetime

    model_config = {"from_attributes": True}  # allows ORM -> Pydantic conversion
```

---

## 6. Database initialization

The database and table are created automatically on first run via `database.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./bakery_timer.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # required for SQLite with FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    """FastAPI dependency: yields a DB session and closes it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

In `main.py`, call `Base.metadata.create_all(bind=engine)` on startup to create the table if it does not exist.

---

## 7. Sample data

```json
[
  {
    "id": 1,
    "cake_name": "Cupcake",
    "duration_minutes": 20,
    "completed_at": "2025-05-21T08:44:39Z"
  },
  {
    "id": 2,
    "cake_name": "My deep work block",
    "duration_minutes": 40,
    "completed_at": "2025-05-21T09:30:00Z"
  }
]
```

---

## 8. Future schema considerations (v2.0)

If user accounts are added in a future version, the schema would extend to:

```
users          sessions
─────          ────────
id    ◄────── user_id (FK)
email          id
...            cake_name
               duration_minutes
               completed_at
```

Because the ORM and connection string are already abstracted in `database.py`, this migration would require adding a `users` table and a `user_id` foreign key column to `sessions` — no other files need to change structurally.
