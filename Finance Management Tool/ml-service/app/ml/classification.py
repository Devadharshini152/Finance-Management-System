import os
import joblib
from .preprocessing import clean_text

from app.config import ML_MODELS_DIR, DEFAULT_CATEGORIES


def _get_classifier_path():
    path = os.path.join(ML_MODELS_DIR, "category_classifier.pkl")
    if os.path.isfile(path):
        return path
    return None


def _get_vectorizer_path():
    path = os.path.join(ML_MODELS_DIR, "vectorizer.pkl")
    if os.path.isfile(path):
        return path
    return None


def classify_description(description: str):
    cleaned = clean_text(description or "")
    if not cleaned:
        return "Other Expense", 0.5

    clf_path = _get_classifier_path()
    vec_path = _get_vectorizer_path()
    if clf_path and vec_path:
        try:
            clf = joblib.load(clf_path)
            vectorizer = joblib.load(vec_path)
            X = vectorizer.transform([cleaned])
            pred = clf.predict(X)[0]
            proba = clf.predict_proba(X)[0]
            idx = list(clf.classes_).index(pred)
            confidence = float(proba[idx])
            reason = "Pattern match" if confidence > 0.8 else "Best guess based on history"
            return pred, confidence, f"{reason}"
        except Exception:
            pass

    keywords = {
        "Food & Dining": ["food", "grocery", "restaurant", "cafe", "coffee", "tea", "uber eats", "doordash", "walmart", "costco"],
        "Transportation": ["gas", "uber", "lyft", "parking", "toll", "transit", "fuel", "bus", "train", "flight"],
        "Shopping": ["amazon", "store", "shop", "mall", "clothing", "shoes"],
        "Utilities": ["electric", "water", "internet", "phone", "utility", "bill", "wifi"],
        "Healthcare": ["pharmacy", "doctor", "hospital", "medical", "health", "dentist"],
        "Entertainment": ["netflix", "spotify", "movie", "game", "subscription", "ticket", "concert"],
        "Education": ["course", "tuition", "book", "school", "university", "class"],
    }
    for category, words in keywords.items():
        for w in words:
            if w in cleaned:
                return category, 0.8, f"Matched keyword '{w}'"
    return "Other Expense", 0.5, "Default fallback"
