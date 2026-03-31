import hashlib
import hmac
import secrets
import socket
from datetime import datetime, timedelta

from django.conf import settings
from django.core.cache import cache
from rest_framework_simplejwt.tokens import AccessToken

from .email_service import send_otp_email
from .models import OTPVerification, User


def _utcnow():
    return datetime.utcnow()


def _normalize_email(email):
    return (email or "").strip().lower()


def _hash_otp(raw_otp):
    secret = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(secret, raw_otp.encode("utf-8"), hashlib.sha256).hexdigest()


def _generate_numeric_otp():
    length = max(4, min(6, int(getattr(settings, "AUTH_OTP_LENGTH", 6))))
    low = 10 ** (length - 1)
    high = (10**length) - 1
    return str(secrets.randbelow(high - low + 1) + low)


def _check_rate_limit(scope, value, max_attempts, window_seconds):
    key = f"auth:ratelimit:{scope}:{value}"
    current = cache.get(key)
    if current is None:
        cache.set(key, 1, timeout=window_seconds)
        return True
    if int(current) >= int(max_attempts):
        return False
    try:
        cache.incr(key)
    except ValueError:
        cache.set(key, int(current) + 1, timeout=window_seconds)
    return True


def enforce_rate_limit(ip_address, email, purpose):
    window_seconds = int(getattr(settings, "AUTH_RATE_LIMIT_WINDOW_SECONDS", 300))
    ip_max = int(getattr(settings, "AUTH_RATE_LIMIT_IP_MAX", 25))
    email_max = int(getattr(settings, "AUTH_RATE_LIMIT_EMAIL_MAX", 8))

    ip_ok = _check_rate_limit(f"ip:{purpose}", ip_address or "unknown", ip_max, window_seconds)
    email_ok = _check_rate_limit(f"email:{purpose}", _normalize_email(email), email_max, window_seconds)
    return ip_ok and email_ok


def get_otp_delivery_status():
    smtp_host = getattr(settings, "EMAIL_HOST", "")
    smtp_port = int(getattr(settings, "EMAIL_PORT", 0) or 0)
    smtp_user = getattr(settings, "EMAIL_HOST_USER", "")
    smtp_password = getattr(settings, "EMAIL_HOST_PASSWORD", "")

    if not smtp_host or not smtp_port:
        return False, "OTP service is not configured."

    if not smtp_user or not smtp_password:
        return False, "OTP service credentials are missing."

    cache_key = "auth:otp-delivery:status"
    cached = cache.get(cache_key)
    if isinstance(cached, tuple) and len(cached) == 2:
        return cached

    try:
        with socket.create_connection((smtp_host, smtp_port), timeout=3):
            result = (True, "OTP service is available.")
    except OSError:
        result = (False, "OTP service is currently unavailable. Please try again in a moment.")

    cache.set(cache_key, result, timeout=30)
    return result


def _create_otp(identifier, purpose):
    otp_code = _generate_numeric_otp()
    now = _utcnow()
    expiry_minutes = int(getattr(settings, "AUTH_OTP_EXPIRY_MINUTES", 10))

    OTPVerification.objects(
        identifier=identifier,
        purpose=purpose,
        is_used=False,
    ).update(set__is_used=True, set__used_at=now)

    otp = OTPVerification(
        identifier=identifier,
        otp=_hash_otp(otp_code),
        purpose=purpose,
        expires_at=now + timedelta(minutes=expiry_minutes),
        is_used=False,
        attempt_count=0,
        max_attempts=int(getattr(settings, "AUTH_OTP_MAX_ATTEMPTS", 5)),
        created_at=now,
    )
    otp.save()
    return otp_code, expiry_minutes


def issue_access_token(user):
    token = AccessToken.for_user(user)
    token["username"] = user.username
    token["email"] = user.email
    token["role"] = user.role
    return str(token)


def request_registration_otp(username, email, password, role="user"):
    email = _normalize_email(email)
    existing = User.objects(email__iexact=email).first()

    if existing and existing.email_verified:
        return False, "An account with this email already exists.", None

    if existing:
        existing.username = username.strip()
        existing.role = (role or "user").strip().lower() or "user"
        existing.email_verified = False
        existing.set_password(password)
        existing.updated_at = _utcnow()
        existing.save()
        user = existing
    else:
        user = User(
            username=username.strip(),
            email=email,
            role=(role or "user").strip().lower() or "user",
            email_verified=False,
            created_at=_utcnow(),
            updated_at=_utcnow(),
        )
        user.set_password(password)
        user.save()

    otp_code, expiry_minutes = _create_otp(email, "registration")
    sent, error_msg = send_otp_email(email, otp_code, "registration", expiry_minutes)
    return sent, error_msg, user


def verify_otp(identifier, purpose, otp_input):
    now = _utcnow()
    identifier = _normalize_email(identifier)
    otp_record = (
        OTPVerification.objects(
            identifier=identifier,
            purpose=purpose,
            is_used=False,
        )
        .order_by("-created_at")
        .first()
    )

    if not otp_record:
        return False, "OTP not found. Please request a new code."

    if otp_record.expires_at < now:
        otp_record.is_used = True
        otp_record.used_at = now
        otp_record.save()
        return False, "OTP expired. Please request a new code."

    if otp_record.attempt_count >= otp_record.max_attempts:
        otp_record.is_used = True
        otp_record.used_at = now
        otp_record.save()
        return False, "Too many attempts. Please request a new code."

    expected_hash = otp_record.otp
    candidate_hash = _hash_otp((otp_input or "").strip())
    if not hmac.compare_digest(expected_hash, candidate_hash):
        otp_record.attempt_count += 1
        if otp_record.attempt_count >= otp_record.max_attempts:
            otp_record.is_used = True
            otp_record.used_at = now
        otp_record.save()
        return False, "Invalid OTP."

    otp_record.is_used = True
    otp_record.used_at = now
    otp_record.save()
    return True, "OTP verified successfully."


def request_login(email, password):
    email = _normalize_email(email)
    user = User.objects(email__iexact=email).first()

    if not user or not user.check_password(password):
        return {"ok": False, "error": "Invalid email or password."}

    if not user.email_verified:
        otp_code, expiry_minutes = _create_otp(email, "registration")
        sent, _ = send_otp_email(email, otp_code, "registration", expiry_minutes)
        if not sent:
            return {"ok": False, "error": "Email not verified and OTP delivery failed."}
        return {
            "ok": False,
            "requires_otp": True,
            "purpose": "registration",
            "message": "Please verify your email before login.",
        }

    require_login_otp = bool(getattr(settings, "AUTH_REQUIRE_LOGIN_OTP", False) or user.two_factor_enabled)
    if require_login_otp:
        otp_code, expiry_minutes = _create_otp(email, "login")
        sent, error_msg = send_otp_email(email, otp_code, "login", expiry_minutes)
        if not sent:
            return {"ok": False, "error": f"OTP email failed: {error_msg}"}
        return {
            "ok": True,
            "requires_otp": True,
            "purpose": "login",
            "message": "OTP sent for login verification.",
            "user": user,
        }

    user.last_login_at = _utcnow()
    user.save()
    return {
        "ok": True,
        "requires_otp": False,
        "token": issue_access_token(user),
        "user": user,
    }


def request_password_reset(email):
    email = _normalize_email(email)
    user = User.objects(email__iexact=email).first()

    if not user:
        return True

    otp_code, expiry_minutes = _create_otp(email, "reset")
    sent, _ = send_otp_email(email, otp_code, "reset", expiry_minutes)
    return sent


def resend_otp(email, purpose):
    email = _normalize_email(email)
    user = User.objects(email__iexact=email).first()

    if purpose in ("registration", "login", "reset") and not user:
        return False, "Unable to send OTP for this request."

    otp_code, expiry_minutes = _create_otp(email, purpose)
    sent, error_msg = send_otp_email(email, otp_code, purpose, expiry_minutes)
    if not sent:
        return False, f"Failed to send OTP email: {error_msg}"

    return True, "OTP sent successfully."
