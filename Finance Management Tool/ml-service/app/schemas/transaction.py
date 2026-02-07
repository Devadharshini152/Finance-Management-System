from pydantic import BaseModel
from typing import Optional
from datetime import date


class ClassifyRequest(BaseModel):
    description: str = ""


class ClassifyResponse(BaseModel):
    predicted_category: str
    confidence: float


class TransactionInput(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    amount: float
    date: date
    type: str = "EXPENSE"


class PredictionInput(BaseModel):
    transactions: list[TransactionInput]


class PredictionItem(BaseModel):
    category: str
    predicted_amount: float
    confidence: float
    target_month: int


class PredictionResponse(BaseModel):
    predictions: list
    target_months: list


class ParseRequest(BaseModel):
    text: str


class ParseResponse(BaseModel):
    amount: float
    category: str
    date: str
    description: str
    reason: str
    confidence: float
