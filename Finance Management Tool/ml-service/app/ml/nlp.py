import re
import dateparser
from datetime import datetime

def parse_transaction_text(text: str):
    """
    Parses natural language transaction text.
    Examples:
    - "Spent 50 on groceries yesterday" -> {amount: 50, category: "Groceries", date: "2023-10-25", description: "groceries"}
    - "Uber 15.50" -> {amount: 15.50, category: "Transportation", date: "2023-10-26", description: "Uber"}
    """
    
    # 1. Extract Amount
    # Look for currency symbols or just numbers
    # Regex for amount: (?:[\$€£¥₹])?\s*(\d+(?:\.\d{1,2})?)
    amount_match = re.search(r'(?:[\$€£¥₹])?\s*(\d+(?:\.\d{1,2})?)', text)
    amount = 0.0
    if amount_match:
        try:
            amount = float(amount_match.group(1))
        except ValueError:
            pass
            
    # 2. Extract Date
    # Use dateparser to finding dates (yesterday, today, last friday, 2023-10-01)
    # We remove the amount from text to avoid confusion, but dateparser is smart
    # However, dateparser returns a datetime. We need to find *where* it is in text to remove it for description extraction
    
    # Simple strategy: replace known keywords or rely on dateparser's search?
    # dateparser.search.search_dates() is useful but requires 'dateparser' package installed which might not be in requirements.
    # If not, we use basic keywords
    
    parse_date = datetime.now()
    # Simple keyword check if dateparser is too heavy or missing
    lower_text = text.lower()
    if 'yesterday' in lower_text:
        from datetime import timedelta
        parse_date = parse_date - timedelta(days=1)
    elif 'tomorrow' in lower_text:
        # unlikely for expense but possible
        from datetime import timedelta
        parse_date = parse_date + timedelta(days=1)
    
    # 3. Extract Description/Category
    # Remove amount from text 
    remaining = text
    if amount_match:
        remaining = remaining.replace(amount_match.group(0), "", 1)
    
    # Remove simple date keywords
    remaining = re.sub(r'\b(yesterday|today|tomorrow)\b', '', remaining, flags=re.IGNORECASE)
    
    # Clean up
    remaining = re.sub(r'\b(spent|on|for|at)\b', '', remaining, flags=re.IGNORECASE).strip()
    remaining = re.sub(r'\s+', ' ', remaining)
    
    description = remaining.strip()
    
    # 4. Infer Category from Description (using existing classification logic if possible, or return raw)
    # We will import classify_description here or let the caller handle it.
    # Better to handle it here to return a complete object.
    
    from .classification import classify_description
    category, conf, reason = classify_description(description)
    
    return {
        "amount": amount,
        "date": parse_date.strftime("%Y-%m-%d"),
        "description": description.title(),
        "category": category,
        "reason": reason,
        "confidence": conf
    }
