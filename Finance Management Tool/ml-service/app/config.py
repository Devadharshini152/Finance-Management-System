import os

_APP_DIR = os.path.dirname(os.path.abspath(__file__))
ML_MODELS_DIR = os.path.join(_APP_DIR, "models")
DEFAULT_CATEGORIES = [
    "Food & Dining", "Transportation", "Shopping", "Utilities",
    "Healthcare", "Entertainment", "Rent/Mortgage", "Insurance",
    "Education", "Personal Care", "Other Expense"
]
