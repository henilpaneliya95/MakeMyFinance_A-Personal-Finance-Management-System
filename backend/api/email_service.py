from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string


def _otp_email_html(otp_code, purpose, expiry_minutes):
    purpose_title = {
        "registration": "Verify your email",
        "login": "Complete your login",
        "reset": "Reset your password",
    }.get(purpose, "Verification code")

    return f"""
    <div style='font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937;'>
      <div style='background: linear-gradient(135deg, #0f766e, #0ea5e9); padding: 24px; border-radius: 12px 12px 0 0;'>
        <h2 style='margin: 0; color: #ffffff;'>MakeMyFinance</h2>
        <p style='margin: 8px 0 0; color: #cffafe;'>{purpose_title}</p>
      </div>
      <div style='border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;'>
        <p style='margin-top: 0;'>Use the OTP below to continue:</p>
        <div style='font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #0f766e; margin: 20px 0;'>{otp_code}</div>
        <p style='margin: 0;'>This code expires in {expiry_minutes} minutes.</p>
        <p style='margin: 16px 0 0; font-size: 12px; color: #6b7280;'>If you did not request this, you can ignore this email safely.</p>
      </div>
    </div>
    """


def send_otp_email(recipient_email, otp_code, purpose, expiry_minutes):
    subject = {
        "registration": "Verify your MakeMyFinance account",
        "login": "Your MakeMyFinance login code",
        "reset": "Your MakeMyFinance password reset code",
    }.get(purpose, "Your MakeMyFinance verification code")

    html_content = _otp_email_html(otp_code, purpose, expiry_minutes)
    text_content = (
        f"Your OTP code is {otp_code}. It expires in {expiry_minutes} minutes. "
        f"If you did not request this, ignore this email."
    )

    message = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient_email],
    )
    message.attach_alternative(html_content, "text/html")

    try:
        message.send(fail_silently=False)
        return True, None
    except Exception as exc:
        return False, str(exc)
