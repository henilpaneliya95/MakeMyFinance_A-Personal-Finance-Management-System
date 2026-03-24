# ml_utils.py
import math
from collections import defaultdict
from statistics import mean, pstdev
from datetime import datetime, timedelta
from bson import ObjectId

from .models import (
    User, Transaction, Goal,
    MLPrediction, SpendingAnomaly, RecurringPattern
)

# -------------------------------
# Helpers   
# -------------------------------
def _get_user(user_id: str) -> User:
    return User.objects.get(id=ObjectId(user_id))

def _month_key(dt: datetime) -> str:
    return dt.strftime("%Y-%m")

def _next_month_label(now: datetime) -> str:
    y, m = now.year, now.month
    if m == 12:
        return f"{y+1}-01"
    return f"{y:04d}-{m+1:02d}"

# -------------------------------
# 1) Expense/Income Forecast (Monthly)
# -------------------------------
def predict_next_month_expense(user_id: str) -> MLPrediction:
    user = _get_user(user_id)

    window_days = 120
    cutoff = datetime.utcnow() - timedelta(days=window_days)
    tx_qs = Transaction.objects(user_id=user, date__gte=cutoff)

    month_income = defaultdict(float)
    month_expense = defaultdict(float)

    for tx in tx_qs:
        key = _month_key(tx.date)
        if tx.type == "income":
            month_income[key] += float(tx.amount or 0)
        elif tx.type == "expense":
            month_expense[key] += float(tx.amount or 0)

    months = sorted(set(month_income.keys()) | set(month_expense.keys()))
    months = months[-3:]

    if months:
        incomes = [month_income[m] for m in months]
        expenses = [month_expense[m] for m in months]
        predicted_income = mean(incomes)
        predicted_expense = mean(expenses)
        predicted_balance = predicted_income - predicted_expense
        confidence = 0.4 if len(months) == 1 else (0.6 if len(months) == 2 else 0.8)
    else:
        predicted_income = 0.0
        predicted_expense = 0.0
        predicted_balance = 0.0
        confidence = 0.2

    pred = MLPrediction(
        user_id=user,
        prediction_type="monthly_forecast",
        target_period=_next_month_label(datetime.utcnow()),
        predicted_income=float(predicted_income),
        predicted_expense=float(predicted_expense),
        predicted_balance=float(predicted_balance),
        confidence=float(confidence),
        model_version="v1.0",
    )
    pred.save()
    return pred

# -------------------------------
# 2) Spending Anomaly Detection
# -------------------------------
def detect_spending_anomalies(user_id: str):
    user = _get_user(user_id)
    expenses = list(Transaction.objects(user_id=user, type="expense"))
    if not expenses:
        return []

    by_cat = defaultdict(list)
    for tx in expenses:
        by_cat[tx.category].append(float(tx.amount or 0))

    cat_stats = {}
    all_amounts = [float(tx.amount or 0) for tx in expenses]
    overall_mean = mean(all_amounts) if all_amounts else 0.0
    overall_threshold = overall_mean * 1.6 if overall_mean > 0 else float("inf")

    for cat, vals in by_cat.items():
        m = mean(vals)
        s = pstdev(vals) if len(vals) > 1 else 0.0
        cat_stats[cat] = (m, s)

    created = []
    for tx in expenses:
        amt = float(tx.amount or 0)
        m, s = cat_stats.get(tx.category, (overall_mean, 0.0))
        z_like = 0 if s == 0 else (amt - m) / s
        ratio = (amt / m) if m > 0 else 0
        is_anomaly = (s > 0 and z_like >= 2.0) or (amt >= overall_threshold) or (ratio >= 1.6)
        if is_anomaly:
            existing = SpendingAnomaly.objects(user_id=user, transaction_id=tx).first()
            if existing:
                continue
            reason_parts = []
            if s > 0 and z_like >= 2.0:
                reason_parts.append(f"z≈{round(z_like,2)}")
            if ratio >= 1.6 and m > 0:
                reason_parts.append(f"{round(ratio,2)}x category avg")
            if amt >= overall_threshold and overall_mean > 0:
                reason_parts.append(">1.6x overall avg")

            anomaly = SpendingAnomaly(
                user_id=user,
                transaction_id=tx,
                anomaly_score=float(max(ratio, z_like if s > 0 else 0)),
                flag_reason="; ".join(reason_parts) or "High deviation",
            )
            anomaly.save()
            created.append(anomaly)
    return created

# -------------------------------
# 3) Recurring Pattern Detection
# -------------------------------
def find_recurring_patterns(user_id: str):
    user = _get_user(user_id)
    expenses = list(Transaction.objects(user_id=user, type="expense"))
    if not expenses:
        return []

    buckets = defaultdict(list)
    for tx in expenses:
        approx_amt = int(round(float(tx.amount or 0) / 100.0) * 100)
        key = (tx.category, approx_amt)
        buckets[key].append(tx)

    created = []
    for (cat, approx_amt), txs in buckets.items():
        if len(txs) < 3:
            continue
        txs.sort(key=lambda t: t.date)
        gaps = [(txs[i].date - txs[i-1].date).days for i in range(1, len(txs))]
        if not gaps:
            continue
        avg_gap = mean(gaps)
        if 5 <= avg_gap <= 10:
            freq = "Weekly"
        elif 20 <= avg_gap <= 40:
            freq = "Monthly"
        else:
            freq = "Irregular"

        avg_amount = mean([float(t.amount or 0) for t in txs])
        pattern_str = f"{cat} ~{approx_amt}"

        existing = RecurringPattern.objects(user_id=user, category=cat, pattern=pattern_str).first()
        if existing:
            existing.average_amount = float(avg_amount)
            existing.frequency = freq
            existing.last_detected = datetime.utcnow()
            existing.save()
            continue

        rp = RecurringPattern(
            user_id=user,
            pattern=pattern_str,
            category=cat,
            frequency=freq,
            average_amount=float(avg_amount),
            last_detected=datetime.utcnow(),
        )
        rp.save()
        created.append(rp)
    return created

# -------------------------------
# 4) Goal Completion Prediction (Account-aware)
# -------------------------------
from statistics import mean
from datetime import datetime, timedelta
from collections import defaultdict

def predict_goal_completion(user_id: str):
    """
    For each Goal:
      remaining = target_amount - current_amount
      monthly_net = avg (income - expense) from user's accounts (last 3 months)
      ETA = now + months_needed * 30 days (if monthly_net > 0 else 'N/A')
    """
    user = _get_user(user_id)
    goals = list(Goal.objects(user_id=user))

    # ✅ Get all accounts of user
    from .models import Account, Transaction
    accounts = list(Account.objects(user_id=user))
    account_ids = [acc.id for acc in accounts]

    # ✅ Last 120 days transactions of these accounts
    window_days = 120
    cutoff = datetime.utcnow() - timedelta(days=window_days)
    tx_qs = Transaction.objects(user_id=user, account_id__in=account_ids, date__gte=cutoff)

    # ✅ Group by month
    month_income = defaultdict(float)
    month_expense = defaultdict(float)
    for tx in tx_qs:
        key = _month_key(tx.date)
        if tx.type == "income":
            month_income[key] += float(tx.amount or 0)
        elif tx.type == "expense":
            month_expense[key] += float(tx.amount or 0)

    months = sorted(set(month_income.keys()) | set(month_expense.keys()))
    months = months[-3:]  # last 3 months

    monthly_nets = [(month_income[m] - month_expense[m]) for m in months] if months else []

    # ✅ Safe fallback
    if monthly_nets:
        positive_nets = [n for n in monthly_nets if n > 0]
        monthly_net = mean(positive_nets) if positive_nets else 0.0
    else:
        monthly_net = 0.0

    # ✅ For each goal, compute ETA
    results = []
    for g in goals:
        target = float(getattr(g, "target_amount", 0) or 0)
        saved = float(getattr(g, "current_amount", 0) or 0)
        remaining = max(0.0, target - saved)

        if monthly_net > 0 and remaining > 0:
            months_needed = remaining / monthly_net
            eta = datetime.utcnow() + timedelta(days=30 * months_needed)
            eta_str = eta.isoformat()
        else:
            eta_str = "N/A"

        results.append({
            "goal_id": str(g.id),
            "title": getattr(g, "title", ""),
            "target_amount": target,
            "current_saved": saved,
            "predicted_completion_date": eta_str,
            "assumptions": {
                "monthly_net_saving": monthly_net,
                "months_window_used": len(months)
            }
        })

    return results
