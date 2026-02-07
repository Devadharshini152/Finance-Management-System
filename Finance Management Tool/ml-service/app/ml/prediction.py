from collections import defaultdict
from datetime import date
from sklearn.linear_model import LinearRegression
import numpy as np
from app.config import DEFAULT_CATEGORIES

def predict_spending(transactions: list, months_ahead: int = 3):
    if not transactions:
        result = []
        for cat in DEFAULT_CATEGORIES:
            for i in range(1, months_ahead + 1):
                result.append({
                    "category": cat,
                    "predicted_amount": 0.0,
                    "confidence": 0.1,
                    "target_month": i,
                })
        return result

    by_category = defaultdict(list)
    for t in transactions:
        if t.get("type") == "EXPENSE" and t.get("amount"):
            cat = t.get("category") or t.get("description") or "Other Expense"
            try:
                dt = t["date"] if isinstance(t["date"], date) else date.fromisoformat(str(t["date"]))
                by_category[cat].append((dt, float(t["amount"])))
            except (KeyError, TypeError, ValueError):
                pass

    result = []
    
    for cat, data_points in by_category.items():
        if not data_points:
            continue
            
        # Group by month index (0 = current month, -1 = last month, etc.)
        # Actually safer to use ordinal dates for regression
        
        # Sort by date
        data_points.sort(key=lambda x: x[0])
        
        # Prepare data for regression
        # X = Month Index (relative to start), Y = Amount
        # We need to aggregate by month first
        
        monthly_map = defaultdict(float)
        min_date = data_points[0][0]
        
        for d, amt in data_points:
            # Key: number of months since min_date
            month_idx = (d.year - min_date.year) * 12 + (d.month - min_date.month)
            monthly_map[month_idx] += amt
            
        X = np.array(sorted(monthly_map.keys())).reshape(-1, 1)
        y = np.array([monthly_map[x[0]] for x in X])
        
        # If not enough data points (less than 2 months), fall back to average
        if len(X) < 2:
            avg = float(np.mean(y)) if len(y) > 0 else 0.0
            for i in range(1, months_ahead + 1):
                result.append({
                    "category": cat,
                    "predicted_amount": round(avg, 2),
                    "confidence": 0.5, 
                    "target_month": i,
                })
            continue

        # Linear Regression
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict future
        last_month_idx = X[-1][0]
        
        for i in range(1, months_ahead + 1):
            future_idx = last_month_idx + i
            pred = model.predict([[future_idx]])[0]
            
            # Prediction shouldn't be negative
            pred = max(0.0, float(pred))
            
            # Calculate r2 score as rough confidence
            confidence = model.score(X, y) if len(X) > 2 else 0.6
            
            # Cap confidence between 0.1 and 0.95
            confidence = max(0.1, min(0.95, confidence))

            result.append({
                "category": cat,
                "predicted_amount": round(pred, 2),
                "confidence": round(confidence, 2),
                "target_month": i,
            })
            
    return result
