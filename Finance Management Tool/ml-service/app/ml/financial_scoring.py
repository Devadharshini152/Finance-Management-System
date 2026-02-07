def calculate_health_score(income_total: float, expense_total: float, budget_adherence_pct=None):
    metrics = {}
    recommendations = []

    savings = income_total - expense_total if income_total else 0
    savings_rate = (savings / income_total * 100) if income_total else 0
    metrics["savings_rate"] = round(savings_rate, 2)
    metrics["income_total"] = income_total
    metrics["expense_total"] = expense_total
    metrics["savings"] = savings

    score = 50
    if savings_rate >= 20:
        score += 25
        recommendations.append("Great savings rate. Consider investing surplus.")
    elif savings_rate >= 10:
        score += 15
        recommendations.append("Good savings. Try to reach 20% savings rate.")
    elif savings_rate >= 0:
        score += 5
        recommendations.append("You're breaking even. Aim to save at least 10%.")
    else:
        score -= 20
        recommendations.append("Spending exceeds income. Review expenses and create a budget.")

    if budget_adherence_pct is not None:
        metrics["budget_adherence_pct"] = budget_adherence_pct
        if budget_adherence_pct >= 90:
            score += 15
            recommendations.append("You're staying within budget.")
        elif budget_adherence_pct >= 70:
            score += 5
        else:
            score -= 10
            recommendations.append("Consider adjusting budgets or spending.")

    score = max(0, min(100, score))
    return score, metrics, recommendations
