from pydantic import BaseModel
from typing import Optional


class HealthScoreRequest(BaseModel):
    income_total: float
    expense_total: float
    budget_adherence_pct: Optional[float] = None


class HealthScoreResponse(BaseModel):
    score: int
    metrics: dict
    recommendations: list
