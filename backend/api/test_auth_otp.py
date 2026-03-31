from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from mongoengine import connect, disconnect
import mongomock

from api.auth_services import issue_access_token, verify_otp
from api.models import OTPVerification, User


@override_settings(
    AUTH_OTP_LENGTH=6,
    AUTH_OTP_EXPIRY_MINUTES=10,
    AUTH_OTP_MAX_ATTEMPTS=2,
    AUTH_REQUIRE_LOGIN_OTP=False,
)
class AuthOTPTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        try:
            disconnect(alias="default")
        except Exception:
            pass
        connect(
            "crown_finance_test",
            alias="default",
            host="mongodb://localhost",
            mongo_client_class=mongomock.MongoClient,
        )

    @classmethod
    def tearDownClass(cls):
        try:
            disconnect(alias="default")
        except Exception:
            pass
        super().tearDownClass()

    def setUp(self):
        self.client = APIClient()
        User.drop_collection()
        OTPVerification.drop_collection()

    @patch("api.auth_services.send_otp_email", return_value=(True, None))
    @patch("api.auth_services._generate_numeric_otp", return_value="123456")
    def test_registration_verify_and_login(self, _otp_mock, _mail_mock):
        register_res = self.client.post(
            "/api/auth/register/",
            {
                "username": "demo",
                "email": "demo@example.com",
                "password": "VeryStrongPass123!",
            },
            format="json",
        )
        self.assertEqual(register_res.status_code, 201)
        self.assertTrue(register_res.data["requires_otp"])

        verify_res = self.client.post(
            "/api/auth/verify-otp/",
            {
                "email": "demo@example.com",
                "otp": "123456",
                "purpose": "registration",
            },
            format="json",
        )
        self.assertEqual(verify_res.status_code, 200)

        user = User.objects.get(email="demo@example.com")
        self.assertTrue(user.email_verified)

        login_res = self.client.post(
            "/api/auth/login/",
            {
                "email": "demo@example.com",
                "password": "VeryStrongPass123!",
            },
            format="json",
        )
        self.assertEqual(login_res.status_code, 200)
        self.assertFalse(login_res.data["requires_otp"])
        self.assertIn("access_token", login_res.data)

    @patch("api.auth_services.send_otp_email", return_value=(True, None))
    @patch("api.auth_services._generate_numeric_otp", return_value="222222")
    def test_forgot_and_reset_password(self, _otp_mock, _mail_mock):
        user = User(
            username="resetme",
            email="reset@example.com",
            email_verified=True,
            role="user",
        )
        user.set_password("OldStrongPass123!")
        user.save()

        forgot_res = self.client.post(
            "/api/auth/forgot-password/",
            {"email": "reset@example.com"},
            format="json",
        )
        self.assertEqual(forgot_res.status_code, 200)

        reset_res = self.client.post(
            "/api/auth/reset-password/",
            {
                "email": "reset@example.com",
                "otp": "222222",
                "new_password": "NewStrongPass456!",
            },
            format="json",
        )
        self.assertEqual(reset_res.status_code, 200)

        login_res = self.client.post(
            "/api/auth/login/",
            {
                "email": "reset@example.com",
                "password": "NewStrongPass456!",
            },
            format="json",
        )
        self.assertEqual(login_res.status_code, 200)
        self.assertIn("access_token", login_res.data)

    @patch("api.auth_services.send_otp_email", return_value=(True, None))
    @patch("api.auth_services._generate_numeric_otp", return_value="333333")
    def test_otp_attempt_limit(self, _otp_mock, _mail_mock):
        user = User(
            username="attempts",
            email="attempts@example.com",
            email_verified=True,
            role="user",
        )
        user.set_password("StrongPass123!")
        user.save()

        self.client.post(
            "/api/auth/resend-otp/",
            {"email": "attempts@example.com", "purpose": "login"},
            format="json",
        )

        ok_1, _ = verify_otp("attempts@example.com", "login", "000000")
        ok_2, _ = verify_otp("attempts@example.com", "login", "111111")
        ok_3, msg = verify_otp("attempts@example.com", "login", "333333")

        self.assertFalse(ok_1)
        self.assertFalse(ok_2)
        self.assertFalse(ok_3)
        self.assertIn(msg, ["Too many attempts. Please request a new code.", "OTP not found. Please request a new code."])

    def test_token_contains_expected_claims(self):
        user = User(
            username="claim_user",
            email="claim@example.com",
            role="user",
            email_verified=True,
        )
        user.set_password("StrongPass123!")
        user.save()

        token = issue_access_token(user)
        self.assertIsInstance(token, str)
        self.assertEqual(token.count("."), 2)


@override_settings(
    AUTH_OTP_LENGTH=6,
    AUTH_OTP_EXPIRY_MINUTES=10,
    AUTH_OTP_MAX_ATTEMPTS=5,
    AUTH_REQUIRE_LOGIN_OTP=True,
)
class AuthLoginOTPRequiredTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        try:
            disconnect(alias="default")
        except Exception:
            pass
        connect(
            "crown_finance_test",
            alias="default",
            host="mongodb://localhost",
            mongo_client_class=mongomock.MongoClient,
        )

    @classmethod
    def tearDownClass(cls):
        try:
            disconnect(alias="default")
        except Exception:
            pass
        super().tearDownClass()

    def setUp(self):
        self.client = APIClient()
        User.drop_collection()
        OTPVerification.drop_collection()

    @patch("api.auth_services.send_otp_email", return_value=(True, None))
    @patch("api.auth_services._generate_numeric_otp", side_effect=["123456", "654321"])
    def test_login_requires_otp_before_token(self, _otp_mock, _mail_mock):
        register_res = self.client.post(
            "/api/auth/register/",
            {
                "username": "otpuser",
                "email": "otpuser@example.com",
                "password": "VeryStrongPass123!",
            },
            format="json",
        )
        self.assertEqual(register_res.status_code, 201)
        self.assertTrue(register_res.data["requires_otp"])

        verify_registration_res = self.client.post(
            "/api/auth/verify-otp/",
            {
                "email": "otpuser@example.com",
                "otp": "123456",
                "purpose": "registration",
            },
            format="json",
        )
        self.assertEqual(verify_registration_res.status_code, 200)

        login_res = self.client.post(
            "/api/auth/login/",
            {
                "email": "otpuser@example.com",
                "password": "VeryStrongPass123!",
            },
            format="json",
        )
        self.assertEqual(login_res.status_code, 200)
        self.assertTrue(login_res.data["requires_otp"])
        self.assertEqual(login_res.data["purpose"], "login")
        self.assertNotIn("access_token", login_res.data)

        verify_login_res = self.client.post(
            "/api/auth/verify-login-otp/",
            {
                "email": "otpuser@example.com",
                "otp": "654321",
            },
            format="json",
        )
        self.assertEqual(verify_login_res.status_code, 200)
        self.assertIn("access_token", verify_login_res.data)
