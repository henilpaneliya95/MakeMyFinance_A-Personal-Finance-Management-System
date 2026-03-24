from sklearn.linear_model import LinearRegression
from collections import defaultdict
from datetime import datetime


from api.models import Transaction, MLPrediction


def predict_salary(user_id):
    transactions = Transaction.objects(user_id=user_id, type="income")
    monthly_totals = defaultdict(float)

    for tx in transactions:
        if tx.date:
            key = tx.date.strftime("%Y-%m")
            monthly_totals[key] += tx.amount

    months = sorted(monthly_totals.keys())
    y = [monthly_totals[m] for m in months]
    X = [[i] for i in range(len(y))]

    if len(X) < 3:
        return None  # not enough data

    model = LinearRegression()
    model.fit(X, y)
    prediction = model.predict([[len(X)]])[0]
    confidence = model.score(X, y)

    ml = MLPrediction(
        user_id=user_id,
        prediction_type="salary",
        target_period="next_month",
        predicted_income=prediction,
        predicted_expense=0,
        predicted_balance=prediction,
        confidence=confidence,
        model_version="1.0"
    )
    ml.save()

    return prediction
