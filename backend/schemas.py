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