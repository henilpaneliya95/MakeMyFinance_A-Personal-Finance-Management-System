from django.urls import path
from .views import (
    # Auth Views
    AnomalyByUserAPIView,
    APIRootView,
    BudgetListByUserNoAuthView,
    DebtAPIView,
    ExpensePredictionAPIView,
   
    GoalAPIView,
    GoalETAPredictionAPIView,
    RecurringByUserAPIView,
    RunAnomalyDetectionAPIView,
    RunRecurringDetectionAPIView,
    # GoalDetailAPIView,
    SignupView,
    LoginView,

    # New Auth Views
    AuthRegisterView,
    AuthLoginView,
    AuthRefreshView,

    # Account Views
    AccountListCreateAPIView,
    AccountDetailView,
    AccountUpdateView,
    AccountDeleteView,

    # Transaction Views
    TransactionListCreateAPIView,
    TransactionDetailView,
    TransactionUpdateView,
    TransactionDeleteView,
    TransactionsByUserView,
    TransactionsByAccountView,

    # New Financial Data Views
    TransactionsView,
    CreateTransactionView,
    AccountsView,
    BudgetsView,
    GoalsView,

    # Budget Views
    BudgetCreateView,
    BudgetListByUserView,
    BudgetListByAccountView,
    BudgetDetailView,

    # Goal Views
    # GoalListCreateAPIView,


    # Portfolio Views
    PortfolioListCreateAPIView,
    PortfolioDetailView,

    # Debt Views


    # AI Features Views
    AIChatView,
    AINaturalChatView,
    AISuggestionsView,
    AIInsightsView,
    AIConversationHistoryView,

    # Permissions Views
    PermissionsView,
    UpdatePermissionsView,

    # Other Features
    ReviewView,
    ContactMessageView,
)
from .auth_views import (
    RegisterWithOTPView,
    OTPDeliveryStatusView,
    VerifyOTPView,
    LoginWithOTPView,
    VerifyLoginOTPView,
    ForgotPasswordView,
    ResetPasswordView,
    ResendOTPView,
    LogoutView,
)

urlpatterns = [

    # API Root
    path('', APIRootView.as_view(), name='api-root'),

    # ========================
    # AUTHENTICATION ENDPOINTS
    # ========================
    # Legacy endpoints (keeping for compatibility)
    path('users/signup/', SignupView.as_view(), name='user-signup'),  # Register a new user
    path('users/login/', LoginView.as_view(), name='user-login'),     # Login and get JWT token

    # New auth endpoints with /auth/ prefix
    path('auth/otp-delivery-status/', OTPDeliveryStatusView.as_view(), name='auth-otp-delivery-status'),
    path('auth/register/', RegisterWithOTPView.as_view(), name='auth-register'),
    path('auth/verify-otp/', VerifyOTPView.as_view(), name='auth-verify-otp'),
    path('auth/login/', LoginWithOTPView.as_view(), name='auth-login'),
    path('auth/verify-login-otp/', VerifyLoginOTPView.as_view(), name='auth-verify-login-otp'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='auth-forgot-password'),
    path('auth/reset-password/', ResetPasswordView.as_view(), name='auth-reset-password'),
    path('auth/resend-otp/', ResendOTPView.as_view(), name='auth-resend-otp'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/refresh/', AuthRefreshView.as_view(), name='auth-refresh'),

    # =================
    # ACCOUNT ENDPOINTS
    # =================
    path('accounts/', AccountListCreateAPIView.as_view(), name='account-list-create'),  # GET all accounts / POST new account
    path('accounts/<str:pk>/', AccountDetailView.as_view(), name='account-detail'),     # GET account details
    path('accounts/<str:pk>/update/', AccountUpdateView.as_view(), name='account-update'),  # PUT update account
    path('accounts/<str:pk>/delete/', AccountDeleteView.as_view(), name='account-delete'),  # DELETE account

    # =====================
    # TRANSACTION ENDPOINTS
    # =====================
    # Legacy endpoints
    path('transactions/', TransactionListCreateAPIView.as_view(), name='transaction-list'),  # GET all / POST new transaction
    path('transactions/<str:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),  # GET transaction details
    path('transactions/<str:pk>/update/', TransactionUpdateView.as_view(), name='transaction-update'),  # PUT update transaction
    path('transactions/<str:pk>/delete/', TransactionDeleteView.as_view(), name='transaction-delete'),  # DELETE transaction
    path('transactions/users/<str:user_id>/', TransactionsByUserView.as_view(), name='transactions-by-user'),  # GET transactions by user
    path('transactions/accounts/<str:account_id>/', TransactionsByAccountView.as_view(), name='transactions-by-account'),  # GET transactions by account

    # New simplified endpoints
    path('transactions/', TransactionsView.as_view(), name='transactions-view'),
    path('transactions/create/', CreateTransactionView.as_view(), name='create-transaction'),

    # ===============
    # BUDGET ENDPOINTS
    # ===============
    path('budgets/', BudgetCreateView.as_view(), name='create-budget'),  # POST create budget
    path('budgets/users/<str:user_id>/', BudgetListByUserView.as_view(), name='list-budgets-by-user'),  # GET budgets by user
    path('budgets/accounts/<str:account_id>/', BudgetListByAccountView.as_view(), name='list-budgets-by-account'),  # GET budgets by account
    path('budgets/<str:pk>/', BudgetDetailView.as_view(), name='budget-detail'),  # GET, PUT, DELETE a specific budget
    path("budgets/noauth/<str:user_id>/", BudgetListByUserNoAuthView.as_view(), name="budgets-by-user-noauth"),

    # New simplified endpoints
    path('budgets/', BudgetsView.as_view(), name='budgets-view'),

    # =============
    # GOAL ENDPOINTS
    # =============
    path("goals/", GoalAPIView.as_view(), name="goals"),
    path("goals/<str:pk>/", GoalAPIView.as_view(), name="goal-detail"),

    # New simplified endpoint
    path('goals/', GoalsView.as_view(), name='goals-view'),

    # =================
    # PORTFOLIO ENDPOINTS
    # =================
    path('portfolios/', PortfolioListCreateAPIView.as_view(), name='portfolio-list-create'),   # GET all / POST new
    path('portfolios/<str:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),      # GET, PUT, DELETE single 
    
    # =============
    # DEBT ENDPOINTS
    # =============
    path("debts/", DebtAPIView.as_view(), name="debt-list-create"),
    path("debts/<str:pk>/", DebtAPIView.as_view(), name="debt-detail"),

    # New simplified endpoint
    path('accounts/', AccountsView.as_view(), name='accounts-view'),
   
    # =========
    # AI FEATURES ENDPOINTS
    # =========
    path('ai/chat/', AIChatView.as_view(), name='ai-chat'),
    path('ai/natural-chat/', AINaturalChatView.as_view(), name='ai-natural-chat'),
    path('ai/suggestions/', AISuggestionsView.as_view(), name='ai-suggestions'),
    path('ai/insights/', AIInsightsView.as_view(), name='ai-insights'),
    path('ai/conversation-history/', AIConversationHistoryView.as_view(), name='ai-conversation-history'),

    # =========
    # PERMISSIONS ENDPOINTS
    # =========
    path('permissions/', PermissionsView.as_view(), name='permissions'),
    path('permissions/update/', UpdatePermissionsView.as_view(), name='update-permissions'),
   
    # =========
    # REVIEWS
    # =========
    path('review/', ReviewView.as_view(), name='review'),  # POST or GET reviews

    # =========
    # CONTACT
    # =========
    path("contact/", ContactMessageView.as_view(), name="contact"),
    
    # --- ML ROUTES ---
    path('ml/predict-expense/<str:user_id>/', ExpensePredictionAPIView.as_view(), name='predict-expense'),
    path('ml/anomalies/run/<str:user_id>/', RunAnomalyDetectionAPIView.as_view(), name='run-anomalies'),
    path('ml/recurring/run/<str:user_id>/', RunRecurringDetectionAPIView.as_view(), name='run-recurring'),
    path('ml/goals/eta/<str:user_id>/', GoalETAPredictionAPIView.as_view(), name='goals-eta'),
    # ML - Anomalies & Recurring Patterns
    path('ml/anomalies/users/<str:user_id>/', AnomalyByUserAPIView.as_view(), name='anomalies-by-user'),
    path('ml/recurring/users/<str:user_id>/', RecurringByUserAPIView.as_view(), name='recurring-by-user'),

    
]
