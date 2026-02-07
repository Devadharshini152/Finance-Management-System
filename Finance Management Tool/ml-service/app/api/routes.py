from fastapi import APIRouter, HTTPException
from app.schemas import ClassifyRequest, ClassifyResponse, PredictionInput, PredictionResponse, HealthScoreRequest, HealthScoreResponse
from app.ml import classify_description, predict_spending, calculate_health_score

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/classify", response_model=ClassifyResponse)
def classify(req: ClassifyRequest):
    category, confidence = classify_description(req.description)
    return ClassifyResponse(predicted_category=category, confidence=confidence)


@router.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionInput):
    tx_list = [t.model_dump() for t in req.transactions]
    raw = predict_spending(tx_list, months_ahead=6)
    from datetime import datetime
    from dateutil.relativedelta import relativedelta
    now = datetime.now()
    target_months = [(now + relativedelta(months=i)).strftime("%Y-%m") for i in range(1, 7)]
    predictions = [
        {"category": r["category"], "predicted_amount": r["predicted_amount"], "confidence": r["confidence"], "target_month": r["target_month"]}
        for r in raw
    ]
    return PredictionResponse(predictions=predictions, target_months=target_months)


@router.post("/health-score", response_model=HealthScoreResponse)
def health_score(req: HealthScoreRequest):
    score, metrics, recommendations = calculate_health_score(
        req.income_total, req.expense_total, req.budget_adherence_pct
    )
    return HealthScoreResponse(score=score, metrics=metrics, recommendations=recommendations)

from app.schemas import ParseRequest, ParseResponse
from app.ml.nlp import parse_transaction_text

@router.post("/nlp/parse", response_model=ParseResponse)
def parse_transaction(req: ParseRequest):
    result = parse_transaction_text(req.text)
    return ParseResponse(**result)
