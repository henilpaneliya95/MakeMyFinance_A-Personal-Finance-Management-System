from datetime import datetime, timezone

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .auth_serializers import (
    ForgotPasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    RegisterSerializer,
    ResendOTPSerializer,
    ResetPasswordSerializer,
    VerifyLoginOTPSerializer,
    VerifyOTPSerializer,
)
from .auth_services import (
    enforce_rate_limit,
    issue_access_token,
    request_login,
    request_password_reset,
    request_registration_otp,
    resend_otp,
    verify_otp,
)
from .models import User


class RegisterWithOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        ip_address = request.META.get("REMOTE_ADDR", "unknown")
        if not enforce_rate_limit(ip_address, email, "registration"):
            return Response(
                {"message": "Too many requests. Please try again shortly."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        try:
            sent, error_msg, user = request_registration_otp(
                username=serializer.validated_data["username"],
                email=email,
                password=serializer.validated_data["password"],
                role=serializer.validated_data.get("role", "user"),
            )
        except Exception as exc:
            return Response(
                {"message": f"Registration failed: {str(exc)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if not sent:
            response_message = error_msg or "Unable to send OTP. Please try again."
            if response_message.startswith("An account with this email"):
                return Response(
                    {
                        "message": "Account already exists. Please login instead.",
                        "requires_otp": False,
                        "existing_account": True,
                    },
                    status=status.HTTP_200_OK,
                )

            # If SMTP is unavailable in production, allow registration to proceed
            # to avoid hard signup outages caused by transient email infra issues.
            lowered = response_message.lower()
            if "network is unreachable" in lowered or "email service is not configured" in lowered:
                user.email_verified = True
                user.updated_at = datetime.now(timezone.utc)
                user.save()
                token = issue_access_token(user)
                return Response(
                    {
                        "message": "Account created. OTP service is temporarily unavailable.",
                        "requires_otp": False,
                        "access_token": token,
                        "token": token,
                        "user": {
                            "id": str(user.id),
                            "username": user.username,
                            "email": user.email,
                            "role": user.role,
                            "email_verified": user.email_verified,
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response({"message": response_message}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response(
            {
                "message": "OTP sent to your email.",
                "requires_otp": True,
                "purpose": "registration",
                "identifier": user.email,
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        purpose = serializer.validated_data["purpose"]
        otp = serializer.validated_data["otp"]

        ok, message = verify_otp(email, purpose, otp)
        if not ok:
            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        if purpose == "registration":
            user = User.objects(email__iexact=email).first()
            if not user:
                return Response(
                    {"message": "Account not found for verification."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            user.email_verified = True
            user.updated_at = datetime.now(timezone.utc)
            user.save()

        return Response({"message": "OTP verified successfully."}, status=status.HTTP_200_OK)


class LoginWithOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        ip_address = request.META.get("REMOTE_ADDR", "unknown")
        if not enforce_rate_limit(ip_address, email, "login"):
            return Response(
                {"message": "Too many requests. Please try again shortly."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        result = request_login(email, serializer.validated_data["password"])
        if not result.get("ok"):
            if result.get("requires_otp"):
                return Response(
                    {
                        "message": result.get("message"),
                        "requires_otp": True,
                        "purpose": result.get("purpose", "registration"),
                        "identifier": email.strip().lower(),
                    },
                    status=status.HTTP_200_OK,
                )
            return Response({"message": result.get("error")}, status=status.HTTP_401_UNAUTHORIZED)

        user = result.get("user")
        if result.get("requires_otp"):
            return Response(
                {
                    "message": result.get("message"),
                    "requires_otp": True,
                    "purpose": "login",
                    "identifier": user.email,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "message": "Login successful.",
                "requires_otp": False,
                "access_token": result.get("token"),
                "token": result.get("token"),
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "email_verified": user.email_verified,
                },
            },
            status=status.HTTP_200_OK,
        )


class VerifyLoginOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyLoginOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        otp = serializer.validated_data["otp"]
        ok, message = verify_otp(email, "login", otp)
        if not ok:
            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects(email__iexact=email).first()
        if not user:
            return Response({"message": "Account not found."}, status=status.HTTP_404_NOT_FOUND)

        user.last_login_at = datetime.now(timezone.utc)
        user.save()
        token = issue_access_token(user)

        return Response(
            {
                "message": "Login OTP verified.",
                "access_token": token,
                "token": token,
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                    "email_verified": user.email_verified,
                },
            },
            status=status.HTTP_200_OK,
        )


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        ip_address = request.META.get("REMOTE_ADDR", "unknown")
        if not enforce_rate_limit(ip_address, email, "reset"):
            return Response(
                {"message": "Too many requests. Please try again shortly."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        request_password_reset(email)
        return Response(
            {"message": "If this email exists, an OTP has been sent."},
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        ok, message = verify_otp(email, "reset", serializer.validated_data["otp"])
        if not ok:
            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects(email__iexact=email).first()
        if not user:
            return Response(
                {"message": "If the account exists, password has been reset."},
                status=status.HTTP_200_OK,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.updated_at = datetime.now(timezone.utc)
        user.save()

        return Response({"message": "Password reset successful."}, status=status.HTTP_200_OK)


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        purpose = serializer.validated_data["purpose"]
        ip_address = request.META.get("REMOTE_ADDR", "unknown")
        if not enforce_rate_limit(ip_address, email, f"resend-{purpose}"):
            return Response(
                {"message": "Too many requests. Please try again shortly."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        ok, message = resend_otp(email, purpose)
        if not ok:
            return Response({"message": message}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"message": message}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
