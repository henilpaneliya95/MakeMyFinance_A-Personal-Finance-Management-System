from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class APIRootView(APIView):
    def get(self, request):
        return Response({
            'message': 'Welcome to MakeMy Finance API',
            'endpoints': {
                'auth': {
                    'signup': '/api/users/signup/',
                    'login': '/api/users/login/',
                    'register': '/api/auth/register/',
                    'login_new': '/api/auth/login/',
                    'refresh': '/api/auth/refresh/'
                },
                'accounts': '/api/accounts/',
                'transactions': '/api/transactions/',
                'budgets': '/api/budgets/',
                'goals': '/api/goals/',
                'portfolios': '/api/portfolios/',
                'debts': '/api/debts/',
                'ai': {
                    'chat': '/api/ai/chat/',
                    'natural_chat': '/api/ai/natural-chat/',
                    'suggestions': '/api/ai/suggestions/',
                    'insights': '/api/ai/insights/',
                    'conversation_history': '/api/ai/conversation-history/'
                },
                'permissions': {
                    'get': '/api/permissions/',
                    'update': '/api/permissions/update/'
                },
                'review': '/api/review/',
                'contact': '/api/contact/',
                'ml': {
                    'predict-expense': '/api/ml/predict-expense/<user_id>/',
                    'anomalies': '/api/ml/anomalies/',
                    'recurring': '/api/ml/recurring/',
                    'goals-eta': '/api/ml/goals/eta/<user_id>/'
                }
            }
        })

from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, AuthenticationFailed
from bson import ObjectId
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken


def make_token(user):
    """Return an access token string for `user` using SimpleJWT."""
    return str(AccessToken.for_user(user))

# Backwards-compatible short aliases used elsewhere in this file.
try:
    import jwt
    jwt_encode = jwt.encode
    jwt_decode = jwt.decode
except Exception:
    # Fallbacks to avoid NameError during development if PyJWT isn't available.
    jwt_encode = lambda *a, **k: None
    jwt_decode = lambda *a, **k: None


def decode_token(token_str, verify_exp=True):
    """Decode a JWT-like token to payload.

    Tries PyJWT first (if available) then falls back to SimpleJWT's AccessToken.
    Returns dict payload or raises Exception on failure.
    """
    # strip Bearer if present
    if isinstance(token_str, str) and token_str.startswith("Bearer "):
        token_str = token_str.split(" ", 1)[1]

    # Try PyJWT decode if available
    try:
        import jwt as _pyjwt
        options = {} if verify_exp else {"verify_exp": False}
        return _pyjwt.decode(token_str, settings.SECRET_KEY, algorithms=["HS256"], options=options)
    except Exception:
        pass

    # Fallback to SimpleJWT AccessToken (will verify signature/exp)
    try:
        t = AccessToken(token_str)
        return dict(t)
    except Exception as e:
        raise


def encode_payload(payload):
    """Encode a payload dict into a token string using SimpleJWT AccessToken.

    This avoids direct PyJWT usage and creates a token compatible with SimpleJWT.
    """
    t = AccessToken()
    for k, v in payload.items():
        t[k] = v
    return str(t)

from .models import (
    Review, User, Transaction, Budget, Account,
    Goal, Portfolio, Debt, AIConversation, AISuggestion,
    FinancialInsight, UserPermission
)
from .serializers import (
    ReviewSerializer, SignupSerializer, LoginSerializer,
    TransactionSerializer, BudgetSerializer, AccountSerializer,
    GoalSerializer, PortfolioSerializer, DebtSerializer,
    AIConversationSerializer, AISuggestionSerializer,
    FinancialInsightSerializer, UserPermissionSerializer,
    update_account_totals, update_matching_budgets
)

# ========================
# AUTHENTICATION
# ========================

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"].strip().lower()
            password = serializer.validated_data["password"].strip()  # Strip password whitespace

            try:
                # Try to find user by email (case-insensitive)
                user = User.objects.get(email__iexact=email)
                print(f"✅ User found: {user.email}")
                
                # Verify password
                is_password_correct = user.check_password(password)
                print(f"Password check: {is_password_correct}")
                
                if not is_password_correct:
                    print(f"❌ Password mismatch for {email}")
                    raise AuthenticationFailed("Incorrect password")
                    
            except User.DoesNotExist:
                print(f"❌ User not found: {email}")
                raise AuthenticationFailed("User not found")
            except Exception as e:
                print(f"❌ Login error: {str(e)}")
                raise AuthenticationFailed(str(e))

            now = datetime.utcnow()
            exp_time = now + timedelta(hours=1)
            payload = {
                "user_id": str(user.id),
                "username": user.username,
                "email": user.email,
                "exp": int(exp_time.timestamp()),
                "iat": int(now.timestamp())
            }
            token = make_token(user)

            return Response({
                "token": token,
                "username": user.username,
                "email": user.email
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# import jwt
# from django.conf import settings
# from rest_framework.exceptions import AuthenticationFailed

# ========================
# NEW AUTHENTICATION VIEWS
# ========================

class AuthRegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"].strip().lower()
            password = serializer.validated_data["password"].strip()  # Strip password whitespace

            try:
                user = User.objects.get(email__iexact=email)
                print(f"✅ User found: {user.email}")
                
                is_password_correct = user.check_password(password)
                print(f"Password check: {is_password_correct}")
                
                if not is_password_correct:
                    print(f"❌ Password mismatch for {email}")
                    raise AuthenticationFailed("Incorrect password")
            except User.DoesNotExist:
                print(f"❌ User not found: {email}")
                raise AuthenticationFailed("User not found")
            except Exception as e:
                print(f"❌ Auth login error: {str(e)}")
                raise AuthenticationFailed(str(e))

            now = datetime.utcnow()
            exp_time = now + timedelta(hours=1)
            payload = {
                "user_id": str(user.id),
                "username": user.username,
                "email": user.email,
                "exp": int(exp_time.timestamp()),
                "iat": int(now.timestamp())
            }
            token = make_token(user)

            return Response({
                "token": token,
                "user": {
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthRefreshView(APIView):
    def post(self, request):
        try:
            token = request.data.get('token')
            if not token:
                return Response({"error": "Token required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Decode token without verification to get payload
            payload = decode_token(token, verify_exp=False)
            
            # Create new token with fresh expiration
            now = datetime.utcnow()
            exp_time = now + timedelta(hours=1)
            new_payload = {
                "user_id": payload["user_id"],
                "username": payload["username"],
                "email": payload["email"],
                "exp": int(exp_time.timestamp()),
                "iat": int(now.timestamp())
            }
            new_token = encode_payload(new_payload)
            
            return Response({"token": new_token})
            
        except Exception as e:
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ========================
# AI FEATURES VIEWS
# ========================

class AIChatView(APIView):
    def post(self, request):
        user = request.user
        message = request.data.get('message')
        
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save conversation
        conversation = AIConversation(
            user_id=user,
            message=message,
            response="This is a placeholder AI response. Integrate with your AI service here.",
            timestamp=datetime.utcnow()
        )
        conversation.save()
        
        return Response({
            "conversation_id": str(conversation.id),
            "response": conversation.response
        })


class AINaturalChatView(APIView):
    def post(self, request):
        user = request.user
        message = request.data.get('message')
        context = request.data.get('context', {})
        
        if not message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Save conversation with context
        conversation = AIConversation(
            user_id=user,
            message=message,
            response="Natural language response placeholder. Integrate with AI service.",
            context=context,
            timestamp=datetime.utcnow()
        )
        conversation.save()
        
        return Response({
            "conversation_id": str(conversation.id),
            "response": conversation.response
        })


class AISuggestionsView(APIView):
    def get(self, request):
        user = request.user
        
        # Get recent suggestions for user
        suggestions = AISuggestion.objects(user_id=user).order_by('-created_at')[:10]
        serializer = AISuggestionSerializer(suggestions, many=True)
        
        return Response(serializer.data)
    
    def post(self, request):
        user = request.user
        suggestion_type = request.data.get('type')
        content = request.data.get('content')
        
        if not suggestion_type or not content:
            return Response({"error": "Type and content are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        suggestion = AISuggestion(
            user_id=user,
            suggestion_type=suggestion_type,
            content=content,
            created_at=datetime.utcnow()
        )
        suggestion.save()
        
        return Response(AISuggestionSerializer(suggestion).data, status=status.HTTP_201_CREATED)


class AIInsightsView(APIView):
    def get(self, request):
        user = request.user
        
        # Get insights for user
        insights = FinancialInsight.objects(user_id=user).order_by('-created_at')[:10]
        serializer = FinancialInsightSerializer(insights, many=True)
        
        return Response(serializer.data)
    
    def post(self, request):
        user = request.user
        insight_type = request.data.get('type')
        title = request.data.get('title')
        content = request.data.get('content')
        
        if not insight_type or not title or not content:
            return Response({"error": "Type, title, and content are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        insight = FinancialInsight(
            user_id=user,
            insight_type=insight_type,
            title=title,
            content=content,
            created_at=datetime.utcnow()
        )
        insight.save()
        
        return Response(FinancialInsightSerializer(insight).data, status=status.HTTP_201_CREATED)


class AIConversationHistoryView(APIView):
    def get(self, request):
        user = request.user
        
        # Get conversation history
        conversations = AIConversation.objects(user_id=user).order_by('-timestamp')[:50]
        serializer = AIConversationSerializer(conversations, many=True)
        
        return Response(serializer.data)

# ========================
# PERMISSIONS VIEWS
# ========================

class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        
        # Get all permissions for user
        permissions = UserPermission.objects(user_id=user)
        serializer = UserPermissionSerializer(permissions, many=True)
        
        return Response(serializer.data)


class UpdatePermissionsView(APIView):
    def post(self, request):
        user = request.user
        permissions_data = request.data.get('permissions', [])
        
        if not permissions_data:
            return Response({"error": "Permissions data is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        updated_permissions = []
        
        for perm_data in permissions_data:
            permission_type = perm_data.get('permission_type')
            is_granted = perm_data.get('is_granted', False)
            granted_by_user = request.user
            
            if not permission_type:
                continue
                
            # Update or create permission
            permission = UserPermission.objects(user_id=user, permission_type=permission_type).first()
            if permission:
                permission.is_granted = is_granted
                permission.granted_by = granted_by_user
                permission.granted_at = datetime.utcnow()
                permission.save()
            else:
                permission = UserPermission(
                    user_id=user,
                    permission_type=permission_type,
                    is_granted=is_granted,
                    granted_by=granted_by_user
                )
                permission.save()
            
            updated_permissions.append({
                "id": str(permission.id),
                "permission_type": permission.permission_type,
                "is_granted": permission.is_granted,
                "granted_at": permission.granted_at.isoformat()
            })
        
        return Response({
            "message": "Permissions updated successfully",
            "permissions": updated_permissions
        })

# ========================
# SIMPLIFIED VIEWS
# ========================

class TransactionsView(APIView):
    def get(self, request):
        user = request.user
        transactions = Transaction.objects(user_id=user).order_by('-date')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            transaction = serializer.save(user_id=request.user)
            update_account_totals(transaction.account_id)
            update_matching_budgets(transaction)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateTransactionView(APIView):
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            transaction = serializer.save(user_id=request.user)
            update_account_totals(transaction.account_id)
            update_matching_budgets(transaction)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetsView(APIView):
    def get(self, request):
        user = request.user
        budgets = Budget.objects(user_id=user)
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            budget = serializer.save(user_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GoalsView(APIView):
    def get(self, request):
        user = request.user
        goals = Goal.objects(user_id=user)
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            goal = serializer.save(user_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountsView(APIView):
    def get(self, request):
        user = request.user
        accounts = Account.objects(user_id=user)
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            account = serializer.save(user_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# def get_logged_in_user(request):
#     token = request.headers.get("Authorization")
#     if not token:
#         raise AuthenticationFailed("Authentication token missing")
#     try:
#         payload = jwt.decode(token.split(" ")[1], settings.SECRET_KEY, algorithms=["HS256"])
#         return payload["user_id"]
#     except jwt.ExpiredSignatureError:
#         raise AuthenticationFailed("Token expired")
#     except jwt.InvalidTokenError:
#         raise AuthenticationFailed("Invalid token")



# # =================
# # ACCOUNT API
# # =================

# from bson import ObjectId

# class AccountListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             user = User.objects.get(id=ObjectId(user_id))   # ✅ get actual User object
#             accounts = Account.objects(user_id=user)        # ✅ filter with user object
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         # ✅ Always return list (even if empty)
#         serializer = AccountSerializer(accounts, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


#     def post(self, request):
#         serializer = AccountSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from bson import ObjectId
# from rest_framework.exceptions import NotFound

# class AccountDetailView(APIView):
#     def get(self, request, pk):
#         try:
#             account = Account.objects.get(id=ObjectId(pk))  # ✅ MongoEngine
#         except Account.DoesNotExist:
#             raise NotFound("Account not found")

#         return Response(AccountSerializer(account).data)


# class AccountUpdateView(APIView):
#     def put(self, request, pk):
#         try:
#             account = Account.objects(id=ObjectId(pk)).first()
#             if not account:
#                 return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

#             data = request.data
#             account.account_name = data.get("account_name", account.account_name)
#             account.account_type = data.get("account_type", account.account_type)
#             account.description = data.get("description", account.description)
#             account.save()

#             return Response({"message": "Account updated successfully"}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# class AccountDeleteView(APIView):
#     def delete(self, request, pk):
#         try:
#             account = Account.objects(id=ObjectId(pk)).first()  # ✅ MongoEngine safe
#             if not account:
#                 return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

#             account.delete()
#             return Response({"message": "Account deleted"}, status=status.HTTP_204_NO_CONTENT)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



# # =====================
# # TRANSACTION API
# # =====================

# # class TransactionListCreateAPIView(APIView):
# #     def get(self, request):
# #         return Response(TransactionSerializer(Transaction.objects.all(), many=True).data)

# #     def post(self, request):
# #         serializer = TransactionSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# from mongoengine.errors import DoesNotExist

# class TransactionListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             user = User.objects.get(id=ObjectId(user_id))
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         # 👉 sirf is user ke transactions
#         transactions = Transaction.objects(user_id=user)

#         # 👉 filter out broken references
#         clean_transactions = []
#         for txn in transactions:
#             try:
#                 _ = txn.account_id.id   # deref check
#                 clean_transactions.append(txn)
#             except DoesNotExist:
#                 continue   # agar account delete ho gaya hai, skip

#         serializer = TransactionSerializer(clean_transactions, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = TransactionSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 txn = serializer.save()
#                 return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)
#             except Exception as e:
#                 return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# class TransactionsByUserView(APIView):
#     def get(self, request, user_id):
#         user = get_object_or_404(User, id=ObjectId(user_id))
#         transactions = Transaction.objects(user_id=user)
#         return Response(TransactionSerializer(transactions, many=True).data)


# from rest_framework.exceptions import NotFound

# class TransactionsByAccountView(APIView):
#     def get(self, request, account_id):
#         if not account_id or account_id == "null":   # ✅ null handle
#             return Response({"error": "Valid account_id is required"}, status=400)

#         try:
#             account = Account.objects.get(id=ObjectId(account_id))
#         except (Account.DoesNotExist, Exception):
#             return Response({"error": "Account not found"}, status=404)

#         transactions = Transaction.objects(account_id=account)

#         clean_transactions = []
#         for tx in transactions:
#             try:
#                 _ = tx.account_id.id
#                 clean_transactions.append(tx)
#             except Exception:
#                 continue

#         return Response(TransactionSerializer(clean_transactions, many=True).data)




# class TransactionDetailView(APIView):
#     def get(self, request, pk):
#         tx = get_object_or_404(Transaction, id=pk)
#         return Response(TransactionSerializer(tx).data)


# from bson import ObjectId
# from rest_framework.exceptions import NotFound

# class TransactionUpdateView(APIView):
#     def put(self, request, pk):
#         try:
#             tx = Transaction.objects.get(id=ObjectId(pk))   # ✅ MongoEngine
#         except Transaction.DoesNotExist:
#             raise NotFound("Transaction not found")

#         serializer = TransactionSerializer(tx, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





# class TransactionDeleteView(APIView):
#     def delete(self, request, pk):
#         try:
#             tx = Transaction.objects.get(id=ObjectId(pk))   # ✅ MongoEngine way
#         except Transaction.DoesNotExist:
#             raise NotFound("Transaction not found")

#         account = tx.account_id
#         tx.delete()
#         update_account_totals(account)
#         update_matching_budgets(tx)
#         return Response(status=status.HTTP_204_NO_CONTENT)



# # ===============
# # BUDGET API
# # ===============

# class BudgetCreateView(APIView):
#     def post(self, request):
#         serializer = BudgetSerializer(data=request.data)
#         if serializer.is_valid():
#             budget = serializer.save()
#             return Response(BudgetSerializer(budget).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class BudgetListByUserView(APIView):
#     def get(self, request, user_id=None):
#         logged_in_user_id = get_logged_in_user(request)

#         # force filter only for logged in user
#         budgets = Budget.objects(user_id=ObjectId(logged_in_user_id))
#         return Response(BudgetSerializer(budgets, many=True).data)


# class BudgetListByAccountView(APIView):
#     def get(self, request, account_id):
#         try:
#             user_id = request.query_params.get("user_id")
#             if not user_id:
#                 return Response({"error": "user_id query param is required"}, status=400)

#             # ✅ Ensure valid user
#             try:
#                 user = User.objects.get(id=ObjectId(user_id))
#             except User.DoesNotExist:
#                 raise NotFound("User not found")

#             # ✅ Ensure the account belongs to this user
#             try:
#                 account = Account.objects.get(id=ObjectId(account_id), user_id=user)
#             except Account.DoesNotExist:
#                 raise NotFound("Account not found for this user")

#             # ✅ Return only budgets that match both user and account
#             budgets = Budget.objects(user_id=user, account_id=account)
#             serializer = BudgetSerializer(budgets, many=True)
#             return Response(serializer.data)

#         except NotFound as e:
#             return Response({"error": str(e)}, status=404)
#         except Exception as e:
#             return Response(
#                 {"error": "Invalid account_id or no data", "details": str(e)},
#                 status=status.HTTP_400_BAD_REQUEST
#             )


# class BudgetDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Budget.objects.get(id=ObjectId(pk))
#         except Budget.DoesNotExist:
#             raise NotFound("❌ Budget not found")

#     def _ensure_owner(self, request, budget):
#         uid = request.query_params.get("user_id")
#         if uid and str(budget.user_id.id) != uid:
#             raise NotFound("Budget not found")  # hide existence if not owner

#     def get(self, request, pk):
#         budget = self.get_object(pk)
#         self._ensure_owner(request, budget)
#         serializer = BudgetSerializer(budget)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         budget = self.get_object(pk)
#         self._ensure_owner(request, budget)
#         serializer = BudgetSerializer(budget, data=request.data, partial=True)
#         if serializer.is_valid():
#             updated_budget = serializer.save()
#             return Response(BudgetSerializer(updated_budget).data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         budget = self.get_object(pk)
#         self._ensure_owner(request, budget)
#         budget.delete()
#         return Response({"message": "✅ Budget deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# # =============
# # GOAL API
# # =============

# class GoalListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             user = User.objects.get(id=ObjectId(user_id))
#             goals = Goal.objects(user_id=user)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
#         return Response(GoalSerializer(goals, many=True).data)

#     def post(self, request):
#         serializer = GoalSerializer(data=request.data)
#         if serializer.is_valid():
#             goal = serializer.save()
#             return Response(GoalSerializer(goal).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class GoalDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Goal.objects.get(id=ObjectId(pk))
#         except Goal.DoesNotExist:
#             raise NotFound("Goal not found")

#     def get(self, request, pk):
#         return Response(GoalSerializer(self.get_object(pk)).data)

#     def put(self, request, pk):
#         goal = self.get_object(pk)
#         serializer = GoalSerializer(goal, data=request.data, partial=True)
#         if serializer.is_valid():
#             updated_goal = serializer.save()
#             return Response(GoalSerializer(updated_goal).data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         self.get_object(pk).delete()
#         return Response({"message": "✅ Goal deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# # =================
# # PORTFOLIO API
# # =================

# # List all portfolios for a user / Create new
# class PortfolioListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             portfolios = Portfolio.objects(user_id=ObjectId(user_id))
#         except Exception:
#             return Response({"error": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)

#         serializer = PortfolioSerializer(portfolios, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = PortfolioSerializer(data=request.data)
#         if serializer.is_valid():
#             portfolio = serializer.save()
#             return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # Retrieve, Update, Delete
# class PortfolioDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Portfolio.objects.get(id=ObjectId(pk))
#         except Portfolio.DoesNotExist:
#             raise NotFound("Portfolio not found")

#     def get(self, request, pk):
#         portfolio = self.get_object(pk)
#         serializer = PortfolioSerializer(portfolio)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         portfolio = self.get_object(pk)
#         serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
#         if serializer.is_valid():
#             portfolio = serializer.save()
#             return Response(PortfolioSerializer(portfolio).data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         portfolio = self.get_object(pk)
#         portfolio.delete()
#         return Response({"message": "Portfolio deleted"}, status=status.HTTP_204_NO_CONTENT)

# # =============
# # DEBT API
# # =============

# class DebtListCreateAPIView(APIView):
#     def get(self, request):
#         return Response(DebtSerializer(Debt.objects.all(), many=True).data)

#     def post(self, request):
#         serializer = DebtSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class DebtDetailView(APIView):
#     def get(self, request, pk):
#         return Response(DebtSerializer(get_object_or_404(Debt, id=pk)).data)


# class DebtUpdateView(APIView):
#     def put(self, request, pk):
#         debt = get_object_or_404(Debt, id=pk)
#         serializer = DebtSerializer(debt, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=400)


# class DebtDeleteView(APIView):
#     def delete(self, request, pk):
#         get_object_or_404(Debt, id=pk).delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# # =========
# # REVIEWS
# # =========

# class ReviewView(APIView):
#     def get(self, request):
#         reviews = Review.objects.all()
#         return Response(ReviewSerializer(reviews, many=True).data)

#     def post(self, request):
#         serializer = ReviewSerializer(data=request.data)
#         if serializer.is_valid():
#             review = serializer.save()
#             return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # =========
# # CONTACT
# # =========

# from .serializers import ContactMessageSerializer

# class ContactMessageView(APIView):
#     def post(self, request):
#         serializer = ContactMessageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Your message has been sent successfully!"}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from .ml_utils import (
    predict_next_month_expense,
    detect_spending_anomalies,
    find_recurring_patterns,
    predict_goal_completion,
)


from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound, AuthenticationFailed
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from django.conf import settings
from django.core.signing import TimestampSigner
import json

from .models import (
    RecurringPattern, Review, SpendingAnomaly, User, Transaction, Budget, Account,
    Goal, Portfolio
)
from .serializers import (
    RecurringPatternSerializer, ReviewSerializer, SignupSerializer, LoginSerializer, SpendingAnomalySerializer,
    TransactionSerializer, BudgetSerializer, AccountSerializer,
    GoalSerializer, PortfolioSerializer,
    update_account_totals, update_matching_budgets
)

# ========================
# AUTHENTICATION
# ========================

class SignupView(APIView):
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"].strip().lower()
            password = serializer.validated_data["password"].strip()

            try:
                user = User.objects.get(email__iexact=email)
                print(f"✅ User found: {user.email}")
                
                is_password_correct = user.check_password(password)
                print(f"Password check: {is_password_correct}")
                
                if not is_password_correct:
                    print(f"❌ Password mismatch for {email}")
                    raise AuthenticationFailed("Incorrect password")
                    
            except User.DoesNotExist:
                print(f"❌ User not found: {email}")
                raise AuthenticationFailed("User not found")
            except Exception as e:
                print(f"❌ Login error: {str(e)}")
                raise AuthenticationFailed(str(e))

            now = datetime.utcnow()
            exp_time = now + timedelta(hours=1)
            payload = {
                "user_id": str(user.id),
                "username": user.username,
                "email": user.email,
                "exp": int(exp_time.timestamp()),
                "iat": int(now.timestamp())
            }
            token = encode_payload(payload)

            return Response({
                "token": token,
                "username": user.username,
                "email": user.email
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_logged_in_user(request):
    token = request.headers.get("Authorization")
    if not token:
        raise AuthenticationFailed("Authentication token missing")
    try:
        payload = decode_token(token.split(" ")[1])
        return payload["user_id"]
    except Exception:
        raise AuthenticationFailed("Invalid or expired token")


# =================
# USER DELETE API (cascade)
# =================

class UserDeleteView(APIView):
    def delete(self, request, pk):
        try:
            user = User.objects.get(id=ObjectId(pk))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # delete all accounts, transactions, budgets for this user
        accounts = Account.objects(user_id=user)
        for acc in accounts:
            Transaction.objects(account_id=acc).delete()
            Budget.objects(account_id=acc).delete()
            acc.delete()

        user.delete()
        return Response({"message": "User and related data deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# # =================
# # ACCOUNT API
# # =================

# class AccountListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             user = User.objects.get(id=ObjectId(user_id))
#             accounts = Account.objects(user_id=user)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         serializer = AccountSerializer(accounts, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         serializer = AccountSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class AccountDetailView(APIView):
#     def get(self, request, pk):
#         try:
#             account = Account.objects.get(id=ObjectId(pk))
#         except Account.DoesNotExist:
#             raise NotFound("Account not found")

#         return Response(AccountSerializer(account).data)


# class AccountUpdateView(APIView):
#     def put(self, request, pk):
#         try:
#             account = Account.objects(id=ObjectId(pk)).first()
#             if not account:
#                 return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

#             data = request.data
#             account.account_name = data.get("account_name", account.account_name)
#             account.account_type = data.get("account_type", account.account_type)
#             account.description = data.get("description", account.description)
#             account.save()

#             return Response({"message": "Account updated successfully"}, status=status.HTTP_200_OK)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class AccountDeleteView(APIView):
#     def delete(self, request, pk):
#         try:
#             account = Account.objects(id=ObjectId(pk)).first()
#             if not account:
#                 return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

#             # delete related transactions and budgets
#             Transaction.objects(account_id=account).delete()
#             Budget.objects(account_id=account).delete()

#             account.delete()
#             return Response({"message": "Account and related data deleted"}, status=status.HTTP_204_NO_CONTENT)

#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =================
# ACCOUNT API
# =================

class AccountListCreateAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")

        # ✅ agar user_id missing ya 'null' ho to empty list bhejna
        if not user_id or user_id == "null":
            return Response([], status=status.HTTP_200_OK)

        try:
            user = User.objects.get(id=ObjectId(user_id))
            accounts = Account.objects(user_id=user)
        except (User.DoesNotExist, Exception):
            # agar user hi exist nahi karta ya ObjectId invalid hai
            return Response([], status=status.HTTP_200_OK)

        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountDetailView(APIView):
    def get(self, request, pk):
        try:
            account = Account.objects.get(id=ObjectId(pk))
        except Account.DoesNotExist:
            raise NotFound("Account not found")

        return Response(AccountSerializer(account).data)


class AccountUpdateView(APIView):
    def put(self, request, pk):
        try:
            account = Account.objects(id=ObjectId(pk)).first()
            if not account:
                return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

            data = request.data
            account.account_name = data.get("account_name", account.account_name)
            account.account_type = data.get("account_type", account.account_type)
            account.description = data.get("description", account.description)
            account.save()

            return Response({"message": "Account updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AccountDeleteView(APIView):
    def delete(self, request, pk):
        try:
            account = Account.objects(id=ObjectId(pk)).first()
            if not account:
                return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)

            # ✅ delete related transactions and budgets also
            Transaction.objects(account_id=account).delete()
            Budget.objects(account_id=account).delete()

            account.delete()
            return Response({"message": "Account and related data deleted"}, status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# =====================
# TRANSACTION API
# =====================

from mongoengine.errors import DoesNotExist

class TransactionListCreateAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        transactions = Transaction.objects(user_id=user)

        clean_transactions = []
        for txn in transactions:
            try:
                _ = txn.account_id.id
                clean_transactions.append(txn)
            except DoesNotExist:
                continue

        serializer = TransactionSerializer(clean_transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                txn = serializer.save()
                return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"❌ Transaction creation error: {str(e)}")
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        print(f"❌ Serializer validation errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionsByUserView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=ObjectId(user_id))
        transactions = Transaction.objects(user_id=user)
        return Response(TransactionSerializer(transactions, many=True).data)


class TransactionsByAccountView(APIView):
    def get(self, request, account_id):
        if not account_id or account_id == "null":
            return Response({"error": "Valid account_id is required"}, status=400)

        try:
            account = Account.objects.get(id=ObjectId(account_id))
        except (Account.DoesNotExist, Exception):
            return Response({"error": "Account not found"}, status=404)

        transactions = Transaction.objects(account_id=account)

        clean_transactions = []
        for tx in transactions:
            try:
                _ = tx.account_id.id
                clean_transactions.append(tx)
            except Exception:
                continue

        return Response(TransactionSerializer(clean_transactions, many=True).data)


class TransactionDetailView(APIView):
    def get(self, request, pk):
        tx = get_object_or_404(Transaction, id=pk)
        return Response(TransactionSerializer(tx).data)


class TransactionUpdateView(APIView):
    def put(self, request, pk):
        try:
            tx = Transaction.objects.get(id=ObjectId(pk))
        except Transaction.DoesNotExist:
            raise NotFound("Transaction not found")

        serializer = TransactionSerializer(tx, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionDeleteView(APIView):
    def delete(self, request, pk):
        try:
            tx = Transaction.objects.get(id=ObjectId(pk))
        except Transaction.DoesNotExist:
            raise NotFound("Transaction not found")

        account = tx.account_id
        tx.delete()
        update_account_totals(account)
        update_matching_budgets(tx)
        return Response(status=status.HTTP_204_NO_CONTENT)


# ===============
# BUDGET API
# ===============

class BudgetCreateView(APIView):
    def post(self, request):
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            budget = serializer.save()
            return Response(BudgetSerializer(budget).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BudgetListByUserView(APIView):
    def get(self, request, user_id=None):
        logged_in_user_id = get_logged_in_user(request)
        budgets = Budget.objects(user_id=ObjectId(logged_in_user_id))
        return Response(BudgetSerializer(budgets, many=True).data)


class BudgetListByAccountView(APIView):
    def get(self, request, account_id):
        try:
            user_id = request.query_params.get("user_id")
            if not user_id:
                return Response({"error": "user_id query param is required"}, status=400)

            try:
                user = User.objects.get(id=ObjectId(user_id))
            except User.DoesNotExist:
                raise NotFound("User not found")

            try:
                account = Account.objects.get(id=ObjectId(account_id), user_id=user)
            except Account.DoesNotExist:
                raise NotFound("Account not found for this user")

            budgets = Budget.objects(user_id=user, account_id=account)
            serializer = BudgetSerializer(budgets, many=True)
            return Response(serializer.data)

        except NotFound as e:
            return Response({"error": str(e)}, status=404)
        except Exception as e:
            return Response({"error": "Invalid account_id or no data", "details": str(e)},
                            status=status.HTTP_400_BAD_REQUEST)


class BudgetDetailView(APIView):
    def get_object(self, pk):
        try:
            return Budget.objects.get(id=ObjectId(pk))
        except Budget.DoesNotExist:
            raise NotFound("❌ Budget not found")

    def _ensure_owner(self, request, budget):
        uid = request.query_params.get("user_id")
        if uid and str(budget.user_id.id) != uid:
            raise NotFound("Budget not found")

    def get(self, request, pk):
        budget = self.get_object(pk)
        self._ensure_owner(request, budget)
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)

    def put(self, request, pk):
        budget = self.get_object(pk)
        self._ensure_owner(request, budget)
        serializer = BudgetSerializer(budget, data=request.data, partial=True)
        if serializer.is_valid():
            updated_budget = serializer.save()
            return Response(BudgetSerializer(updated_budget).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        budget = self.get_object(pk)
        self._ensure_owner(request, budget)
        budget.delete()
        return Response({"message": "✅ Budget deleted successfully"}, status=status.HTTP_204_NO_CONTENT)




# # LIST + CREATE
# class GoalListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if user_id:
#             goals = Goal.objects(user_id=user_id)
#         else:
#             goals = Goal.objects.all()
#         serializer = GoalSerializer(goals, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         serializer = GoalSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # RETRIEVE + UPDATE + DELETE
# class GoalDetailAPIView(APIView):
#     def get_object(self, pk):
#         try:
#             return Goal.objects.get(id=pk)
#         except (DoesNotExist, ValidationError):
#             return None

#     def get(self, request, pk):
#         goal = self.get_object(pk)
#         if not goal:
#             return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)
#         serializer = GoalSerializer(goal)
#         return Response(serializer.data)

#     def put(self, request, pk):
#         goal = self.get_object(pk)
#         if not goal:
#             return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

#         serializer = GoalSerializer(goal, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         goal = self.get_object(pk)
#         if not goal:
#             return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)
#         goal.delete()
#         return Response({"message": "Goal deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from bson import ObjectId
# from mongoengine.errors import DoesNotExist, ValidationError
# from .models import Goal
# from .serializers import GoalSerializer


# class GoalAPIView(APIView):
#     # ------------------
#     # GET (list or detail)
#     # ------------------
#     def get(self, request, pk=None):
#         if pk:
#             try:
#                 goal = Goal.objects.get(id=ObjectId(pk))
#             except (DoesNotExist, ValidationError):
#                 return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)
#             serializer = GoalSerializer(goal)
#             return Response(serializer.data, status=status.HTTP_200_OK)

#         # list all goals (optional user_id filter)
#         user_id = request.query_params.get("user_id")
#         if user_id:
#             goals = Goal.objects.filter(user_id=ObjectId(user_id))
#         else:
#             goals = Goal.objects.all()

#         serializer = GoalSerializer(goals, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     # ------------------
#     # POST (create)
#     # ------------------
#     def post(self, request):
#         serializer = GoalSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # ------------------
#     # PUT (update)
#     # ------------------
#     def put(self, request, pk=None):
#         if not pk:
#             return Response({"error": "Goal ID required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             goal = Goal.objects.get(id=ObjectId(pk))
#         except (DoesNotExist, ValidationError):
#             return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

#         serializer = GoalSerializer(goal, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     # ------------------
#     # DELETE
#     # ------------------
#     def delete(self, request, pk=None):
#         if not pk:
#             return Response({"error": "Goal ID required"}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             goal = Goal.objects.get(id=ObjectId(pk))
#         except (DoesNotExist, ValidationError):
#             return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

#         goal.delete()
#         return Response({"message": "Goal deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError
from .models import Goal
from .serializers import GoalSerializer


class GoalAPIView(APIView):
    # ------------------
    # GET (list or detail)
    # ------------------
    def get(self, request, pk=None):
        user_id = request.query_params.get("user_id") or request.data.get("user_id")

        if pk:  # detail view
            try:
                goal = Goal.objects.get(id=ObjectId(pk))
                if user_id and str(goal.user_id.id) != str(user_id):
                    return Response({"error": "Not authorized to view this goal"}, status=status.HTTP_403_FORBIDDEN)
            except (DoesNotExist, ValidationError):
                return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = GoalSerializer(goal)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # list view
        if user_id:
            goals = Goal.objects.filter(user_id=ObjectId(user_id))
        else:
            goals = Goal.objects.none()  # 👈 empty if no user_id
        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------
    # POST (create)
    # ------------------
    def post(self, request):
        serializer = GoalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # user_id already sent from frontend
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ------------------
    # PUT (update)
    # ------------------
    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Goal ID required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.data.get("user_id")
        try:
            goal = Goal.objects.get(id=ObjectId(pk))
            if user_id and str(goal.user_id.id) != str(user_id):
                return Response({"error": "Not authorized to update this goal"}, status=status.HTTP_403_FORBIDDEN)
        except (DoesNotExist, ValidationError):
            return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = GoalSerializer(goal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ------------------
    # DELETE
    # ------------------
    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Goal ID required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.query_params.get("user_id") or request.data.get("user_id")
        try:
            goal = Goal.objects.get(id=ObjectId(pk))
            if user_id and str(goal.user_id.id) != str(user_id):
                return Response({"error": "Not authorized to delete this goal"}, status=status.HTTP_403_FORBIDDEN)
        except (DoesNotExist, ValidationError):
            return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)

        goal.delete()
        return Response({"message": "Goal deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# =================
# PORTFOLIO API
# =================

class PortfolioListCreateAPIView(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            portfolios = Portfolio.objects(user_id=ObjectId(user_id))
        except Exception:
            return Response({"error": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PortfolioSerializer(data=request.data)
        if serializer.is_valid():
            portfolio = serializer.save()
            return Response(PortfolioSerializer(portfolio).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioDetailView(APIView):
    def get_object(self, pk):
        try:
            return Portfolio.objects.get(id=ObjectId(pk))
        except Portfolio.DoesNotExist:
            raise NotFound("Portfolio not found")

    def get(self, request, pk):
        portfolio = self.get_object(pk)
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data)

    def put(self, request, pk):
        portfolio = self.get_object(pk)
        serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
        if serializer.is_valid():
            portfolio = serializer.save()
            return Response(PortfolioSerializer(portfolio).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        portfolio = self.get_object(pk)
        portfolio.delete()
        return Response({"message": "Portfolio deleted"}, status=status.HTTP_204_NO_CONTENT)


# =============
# DEBT API
# =============

# # views.py (add these imports at top if not present)
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from mongoengine.errors import DoesNotExist, ValidationError as MEValidationError
# from bson import ObjectId

# from .models import Debt
# from .serializers import DebtSerializer

# # --------- LIST + CREATE (user filter enforced) ----------
# class DebtListCreateAPIView(APIView):
#     def get(self, request):
#         user_id = request.query_params.get("user_id")
#         if not user_id:
#             return Response({"error": "user_id query parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
#         try:
#             debts = Debt.objects.filter(user_id=ObjectId(user_id))
#         except Exception:
#             return Response({"error": "Invalid user_id"}, status=status.HTTP_400_BAD_REQUEST)

#         ser = DebtSerializer(debts, many=True)
#         return Response(ser.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         # Expect user_id in payload (Goals me jaisa) :contentReference[oaicite:1]{index=1}
#         serializer = DebtSerializer(data=request.data)
#         if serializer.is_valid():
#             debt = serializer.save()
#             return Response(DebtSerializer(debt).data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # --------- DETAIL ----------
# class DebtDetailView(APIView):
#     def get(self, request, pk):
#         try:
#             debt = Debt.objects.get(id=pk)  # mongoengine accepts string id
#         except (DoesNotExist, MEValidationError):
#             return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)
#         ser = DebtSerializer(debt)
#         return Response(ser.data, status=status.HTTP_200_OK)

# # --------- UPDATE ----------
# class DebtUpdateView(APIView):
#     def put(self, request, pk):
#         try:
#             debt = Debt.objects.get(id=pk)
#         except (DoesNotExist, MEValidationError):
#             return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)
#         ser = DebtSerializer(debt, data=request.data, partial=True)
#         if ser.is_valid():
#             debt = ser.save()
#             return Response(DebtSerializer(debt).data, status=status.HTTP_200_OK)
#         return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)

# # --------- DELETE ----------
# class DebtDeleteView(APIView):
#     def delete(self, request, pk):
#         try:
#             debt = Debt.objects.get(id=pk)
#         except (DoesNotExist, MEValidationError):
#             return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)
#         debt.delete()
#         return Response({"message": "Debt deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from mongoengine.errors import DoesNotExist, ValidationError
from .models import Debt
from .serializers import DebtSerializer

class DebtAPIView(APIView):
    # ------------------
    # GET (list or detail)
    # ------------------
    def get(self, request, pk=None):
        if pk:
            try:
                debt = Debt.objects.get(id=ObjectId(pk))
            except (DoesNotExist, ValidationError):
                return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = DebtSerializer(debt)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # list all debts (filter by user_id if given)
        user_id = request.query_params.get("user_id")
        if user_id:
            debts = Debt.objects.filter(user_id=ObjectId(user_id))
        else:
            debts = Debt.objects.all()

        serializer = DebtSerializer(debts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # ------------------
    # POST (create)
    # ------------------
    def post(self, request):
        serializer = DebtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ------------------
    # PUT (update)
    # ------------------
    def put(self, request, pk=None):
        if not pk:
            return Response({"error": "Debt ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            debt = Debt.objects.get(id=ObjectId(pk))
        except (DoesNotExist, ValidationError):
            return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DebtSerializer(debt, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ------------------
    # DELETE
    # ------------------
    def delete(self, request, pk=None):
        if not pk:
            return Response({"error": "Debt ID required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            debt = Debt.objects.get(id=ObjectId(pk))
        except (DoesNotExist, ValidationError):
            return Response({"error": "Debt not found"}, status=status.HTTP_404_NOT_FOUND)

        debt.delete()
        return Response({"message": "Debt deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

# =========
# REVIEWS
# =========

class ReviewView(APIView):
    def get(self, request):
        reviews = Review.objects.all()
        return Response(ReviewSerializer(reviews, many=True).data)

    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save()
            return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# =========
# CONTACT
# =========
# contat us page
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from .serializers import ContactMessageSerializer

class ContactMessageView(APIView):
    def post(self, request):
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            contact = serializer.save()

            # Send email to admin with proper formatting
            admin_subject = f"New Contact Message: {contact.subject}"
            admin_message = f"""
            New Contact Form Submission - MakeMy Finance
            
            Contact Details:
            ----------------------------
            Name:    {contact.name}
            Email:   {contact.email}
            Subject: {contact.subject}
            
            Message:
            ----------------------------
            {contact.message}
            
            ----------------------------
            Received at: {contact.created_at.strftime('%Y-%m-%d %H:%M')}
            """
            
            # Confirmation email to user
            user_subject = "Thank you for contacting MakeMy Finance"
            user_message = f"""
            Dear {contact.name},
            
            Thank you for reaching out to MakeMy Finance. We have received your message and our team will get back to you shortly.
            
            Here's a copy of your message for your reference:
            ----------------------------
            Subject: {contact.subject}
            
            {contact.message}
            
            ----------------------------
            If you have any further questions, please don't hesitate to contact us.
            
            Best regards,
            The MakeMy Finance Team
            """
            
            try:
                # Send email to admin
                send_mail(
                    subject=admin_subject,
                    message=admin_message.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )

                # Confirmation email to user
                send_mail(
                    subject=user_subject,
                    message=user_message.strip(),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[contact.email],
                    fail_silently=False,
                )

                return Response(
                    {"message": "Your message has been sent successfully!"}, 
                    status=status.HTTP_201_CREATED
                )
                
            except Exception as e:
                error_message = "Message was saved but there was an error sending emails."
                
                # Show detailed error only in DEBUG mode
                if settings.DEBUG:
                    return Response(
                        {"message": error_message, "error": str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                else:
                    return Response(
                        {"message": error_message},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class ExpensePredictionAPIView(APIView):
    def get(self, request, user_id):
        try:
            pred = predict_next_month_expense(user_id)
            return Response({
                "user_id": str(pred.user_id.id),
                "prediction_type": pred.prediction_type,
                "target_period": pred.target_period,
                "predicted_income": pred.predicted_income,
                "predicted_expense": pred.predicted_expense,
                "predicted_balance": pred.predicted_balance,
                "confidence": pred.confidence,
                "model_version": pred.model_version,
                "created_at": pred.created_at.isoformat(),
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RunAnomalyDetectionAPIView(APIView):
    def post(self, request, user_id):
        try:
            created = detect_spending_anomalies(user_id)
            return Response({
                "created": len(created),
                "anomaly_ids": [str(a.id) for a in created]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RunRecurringDetectionAPIView(APIView):
    def post(self, request, user_id):
        try:
            created = find_recurring_patterns(user_id)
            return Response({
                "created": len(created),
                "pattern_ids": [str(p.id) for p in created]
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GoalETAPredictionAPIView(APIView):
    def get(self, request, user_id):
        try:
            result = predict_goal_completion(user_id)
            return Response({"results": result}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ========================
# NEW AUTHENTICATION VIEWS (with /auth/ prefix)
# ========================

class AuthRegisterView(APIView):
    """POST /api/auth/register/ - User registration"""
    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthLoginView(APIView):
    """POST /api/auth/login/ - User login"""
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            password = serializer.validated_data["password"]

            try:
                user = User.objects.get(email=email)
                if not user.check_password(password):
                    raise AuthenticationFailed("Incorrect password")
            except User.DoesNotExist:
                raise AuthenticationFailed("User not found")

            # Create a simple signed token using Django's signing
            signer = TimestampSigner()
            token_data = {
                'user_id': str(user.id),
                'username': user.username,
                'email': user.email,
                'exp': int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp())
            }
            token = signer.sign(json.dumps(token_data))

            return Response({
                "token": token,
                "username": user.username,
                "email": user.email
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AuthRefreshView(APIView):
    """POST /api/auth/refresh/ - Token refresh"""
    def post(self, request):
        token = request.data.get('token')
        if not token:
            return Response({"error": "Token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode token without verification to get payload
            payload = decode_token(token, verify_exp=False)
            
            # Create new token with fresh expiration
            now = datetime.utcnow()
            exp_time = now + timedelta(hours=1)
            new_payload = {
                "user_id": payload["user_id"],
                "username": payload["username"],
                "email": payload["email"],
                "exp": int(exp_time.timestamp()),
                "iat": int(now.timestamp())
            }
            new_token = encode_payload(new_payload)
            
            return Response({
                "token": new_token,
                "username": payload['username'],
                "email": payload['email']
            })
        except Exception as e:
            # Handle JWT exceptions (ExpiredSignatureError, InvalidTokenError, etc.)
            return Response({"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)


# ========================
# FINANCIAL DATA VIEWS (existing, just ensuring they work)
# ========================

class TransactionsView(APIView):
    """GET /api/transactions/ - Get user transactions"""
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        transactions = Transaction.objects(user_id=user)

        clean_transactions = []
        for txn in transactions:
            try:
                _ = txn.account_id.id
                clean_transactions.append(txn)
            except DoesNotExist:
                continue

        serializer = TransactionSerializer(clean_transactions, many=True)
        return Response(serializer.data)


class CreateTransactionView(APIView):
    """POST /api/transactions/ - Create transaction"""
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                txn = serializer.save()
                return Response(TransactionSerializer(txn).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AccountsView(APIView):
    """GET /api/accounts/ - Get user accounts"""
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id or user_id == "null":
            return Response([], status=status.HTTP_200_OK)

        try:
            user = User.objects.get(id=ObjectId(user_id))
            accounts = Account.objects(user_id=user)
        except (User.DoesNotExist, Exception):
            return Response([], status=status.HTTP_200_OK)

        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BudgetsView(APIView):
    """GET /api/budgets/ - Get user budgets"""
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
            budgets = Budget.objects(user_id=user)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)


class GoalsView(APIView):
    """GET /api/goals/ - Get financial goals"""
    def get(self, request):
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
            goals = Goal.objects(user_id=user)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = GoalSerializer(goals, many=True)
        return Response(serializer.data)


# ========================
# AI FEATURES VIEWS
# ========================

class AIChatView(APIView):
    """POST /api/ai/chat/ - Basic AI chat"""
    def post(self, request):
        user_id = request.data.get('user_id')
        message = request.data.get('message')

        if not user_id or not message:
            return Response({"error": "user_id and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Simple AI response (you can integrate with actual AI service)
        if "budget" in message.lower():
            response = "I can help you with budgeting! Try setting up monthly budgets for different categories."
        elif "saving" in message.lower():
            response = "Great question about savings! Aim to save 20% of your income for long-term financial health."
        elif "investment" in message.lower():
            response = "Investing is important for wealth building. Consider diversified portfolios and long-term strategies."
        else:
            response = "I'm here to help with your financial questions! Ask me about budgeting, savings, or investments."

        # Save conversation
        conversation = AIConversation(
            user_id=user,
            message=message,
            response=response,
            conversation_type="chat"
        )
        conversation.save()

        return Response({
            "message": message,
            "response": response,
            "conversation_id": str(conversation.id)
        })


class AINaturalChatView(APIView):
    """POST /api/ai/natural-chat/ - Natural language chat"""
    def post(self, request):
        user_id = request.data.get('user_id')
        message = request.data.get('message')

        if not user_id or not message:
            return Response({"error": "user_id and message are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # More natural AI response
        response = f"I understand you're asking about: '{message}'. This is a natural language response. For personalized financial advice, I'd recommend consulting with a financial advisor."

        # Save conversation
        conversation = AIConversation(
            user_id=user,
            message=message,
            response=response,
            conversation_type="natural_chat"
        )
        conversation.save()

        return Response({
            "message": message,
            "response": response,
            "conversation_id": str(conversation.id)
        })


class AISuggestionsView(APIView):
    """GET /api/ai/suggestions/ - AI-powered suggestions"""
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Generate suggestions based on user data
        suggestions = []

        # Check transaction patterns
        transactions = Transaction.objects(user_id=user)
        expense_count = sum(1 for t in transactions if t.type == "expense")
        income_count = sum(1 for t in transactions if t.type == "income")

        if expense_count > income_count * 2:
            suggestions.append({
                "type": "budget",
                "title": "Create a Budget",
                "description": "Your expenses are higher than income. Consider creating a monthly budget.",
                "priority": "high"
            })

        if expense_count > 10:
            suggestions.append({
                "type": "saving",
                "title": "Build an Emergency Fund",
                "description": "Start saving 10-15% of your income for emergencies.",
                "priority": "medium"
            })

        # Save suggestions to database
        saved_suggestions = []
        for suggestion_data in suggestions:
            suggestion = AISuggestion(
                user_id=user,
                suggestion_type=suggestion_data["type"],
                title=suggestion_data["title"],
                description=suggestion_data["description"],
                priority=suggestion_data["priority"]
            )
            suggestion.save()
            saved_suggestions.append({
                "id": str(suggestion.id),
                "type": suggestion.suggestion_type,
                "title": suggestion.title,
                "description": suggestion.description,
                "priority": suggestion.priority,
                "is_read": suggestion.is_read,
                "created_at": suggestion.created_at.isoformat()
            })

        return Response({"suggestions": saved_suggestions})


class AIInsightsView(APIView):
    """GET /api/ai/insights/ - Financial insights"""
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Generate insights based on user data
        insights = []

        # Analyze spending patterns
        transactions = Transaction.objects(user_id=user)
        total_expenses = sum(t.amount for t in transactions if t.type == "expense")
        total_income = sum(t.amount for t in transactions if t.type == "income")

        if total_income > 0:
            savings_rate = ((total_income - total_expenses) / total_income) * 100
            if savings_rate < 10:
                insights.append({
                    "type": "spending_pattern",
                    "title": "Low Savings Rate",
                    "description": f"Your current savings rate is {savings_rate:.1f}%. Consider increasing it to at least 20%.",
                    "data": {"savings_rate": savings_rate, "recommended_rate": 20}
                })

        # Goal progress insights
        goals = Goal.objects(user_id=user)
        for goal in goals:
            progress = (goal.current_amount / goal.target_amount) * 100 if goal.target_amount > 0 else 0
            if progress < 50:
                insights.append({
                    "type": "goal_progress",
                    "title": f"Goal Progress: {goal.title}",
                    "description": f"You're {progress:.1f}% towards your goal. Consider increasing monthly contributions.",
                    "data": {"progress": progress, "target": goal.target_amount, "current": goal.current_amount}
                })

        # Save insights to database
        saved_insights = []
        for insight_data in insights:
            insight = FinancialInsight(
                user_id=user,
                insight_type=insight_data["type"],
                title=insight_data["title"],
                description=insight_data["description"],
                data=insight_data["data"]
            )
            insight.save()
            saved_insights.append({
                "id": str(insight.id),
                "type": insight.insight_type,
                "title": insight.title,
                "description": insight.description,
                "data": insight.data,
                "created_at": insight.created_at.isoformat()
            })

        return Response({"insights": saved_insights})


class AIConversationHistoryView(APIView):
    """GET /api/ai/conversation-history/ - Chat history"""
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        conversations = AIConversation.objects(user_id=user).order_by('-created_at')[:50]  # Last 50 conversations

        history = []
        for conv in conversations:
            history.append({
                "id": str(conv.id),
                "message": conv.message,
                "response": conv.response,
                "conversation_type": conv.conversation_type,
                "created_at": conv.created_at.isoformat()
            })

        return Response({"conversations": history})


# ========================
# PERMISSIONS VIEWS
# ========================

class PermissionsView(APIView):
    """GET /api/permissions/ - Get user permissions"""
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all permissions for the user
        permissions = UserPermission.objects(user_id=user)

        # If no permissions exist, create default permissions
        if not permissions:
            default_permissions = [
                "view_transactions", "create_transactions", "edit_transactions", "delete_transactions",
                "view_accounts", "create_accounts", "edit_accounts", "delete_accounts",
                "view_budgets", "create_budgets", "edit_budgets", "delete_budgets",
                "view_goals", "create_goals", "edit_goals", "delete_goals",
                "view_portfolio", "create_portfolio", "edit_portfolio", "delete_portfolio",
                "view_debts", "create_debts", "edit_debts", "delete_debts",
                "ai_chat", "ai_insights", "ai_suggestions"
            ]

            permissions_list = []
            for perm_type in default_permissions:
                permission = UserPermission(
                    user_id=user,
                    permission_type=perm_type,
                    is_granted=True,
                    granted_by=user  # Self-granted for defaults
                )
                permission.save()
                permissions_list.append({
                    "id": str(permission.id),
                    "permission_type": permission.permission_type,
                    "is_granted": permission.is_granted,
                    "granted_at": permission.granted_at.isoformat()
                })
        else:
            permissions_list = []
            for perm in permissions:
                permissions_list.append({
                    "id": str(perm.id),
                    "permission_type": perm.permission_type,
                    "is_granted": perm.is_granted,
                    "granted_at": perm.granted_at.isoformat()
                })

        return Response({"permissions": permissions_list})


class UpdatePermissionsView(APIView):
    """POST /api/permissions/ - Update permissions"""
    def post(self, request):
        user_id = request.data.get('user_id')
        permissions_data = request.data.get('permissions', [])

        if not user_id:
            return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(id=ObjectId(user_id))
            granted_by_user = User.objects.get(id=ObjectId(request.data.get('granted_by', user_id)))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        updated_permissions = []
        for perm_data in permissions_data:
            permission_type = perm_data.get('permission_type')
            is_granted = perm_data.get('is_granted', True)

            if not permission_type:
                continue

            # Update or create permission
            permission = UserPermission.objects(
                user_id=user,
                permission_type=permission_type
            ).first()

            if permission:
                permission.is_granted = is_granted
                permission.granted_by = granted_by_user
                permission.granted_at = datetime.now(timezone.utc)
                permission.save()
            else:
                permission = UserPermission(
                    user_id=user,
                    permission_type=permission_type,
                    is_granted=is_granted,
                    granted_by=granted_by_user
                )
                permission.save()

            updated_permissions.append({
                "id": str(permission.id),
                "permission_type": permission.permission_type,
                "is_granted": permission.is_granted,
                "granted_at": permission.granted_at.isoformat()
            })

        return Response({
            "message": "Permissions updated successfully",
            "permissions": updated_permissions
        })

# class AnomalyByUserAPIView(APIView):
#     def get(self, request, user_id):
#         try:
#             anomalies = SpendingAnomaly.objects(user_id=ObjectId(user_id))
#             serializer = SpendingAnomalySerializer(anomalies, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RecurringByUserAPIView(APIView):
    def get(self, request, user_id):
        try:
            patterns = RecurringPattern.objects(user_id=ObjectId(user_id))
            serializer = RecurringPatternSerializer(patterns, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AnomalyByUserAPIView(APIView):
    def get(self, request, user_id):
        anomalies = SpendingAnomaly.objects(user_id=ObjectId(user_id))
        serializer = SpendingAnomalySerializer(anomalies, many=True)
        return Response(serializer.data, status=200)


from rest_framework.permissions import AllowAny

class BudgetListByUserNoAuthView(APIView):
    authentication_classes = []  # disable JWT/Auth checks
    permission_classes = [AllowAny]  # allow public access

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=ObjectId(user_id))
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        budgets = Budget.objects(user_id=user)
        return Response(BudgetSerializer(budgets, many=True).data, status=status.HTTP_200_OK)
