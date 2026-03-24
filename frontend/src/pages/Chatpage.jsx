import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bot,
  User,
  CreditCard,
  PiggyBank,
  Shield,
  Target,
  Clock,
} from "lucide-react";

export default function ChatPage({ onBackToHelp }) {
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      message:
        "Hi! I'm here to help you with your questions. Please select a category to get started:",
      timestamp: new Date(),
    },
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const chatCategories = [
    {
      id: "transaction",
      title: "Transaction Queries",
      icon: CreditCard,
      questions: [
        "How do I add a new transaction?",
        "Why is my transaction not showing up?",
        "How do I edit or delete a transaction?",
        "Can I import transactions from my bank?",
      ],
    },
    {
      id: "budget",
      title: "Budget Management",
      icon: PiggyBank,
      questions: [
        "How do I create a budget?",
        "Why am I overspending in some categories?",
        "How do I set spending limits?",
        "Can I track multiple budgets?",
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      questions: [
        "How secure is my financial data?",
        "How do I change my password?",
        "What happens if I forget my login?",
        "Can I enable two-factor authentication?",
      ],
    },
    {
      id: "goals",
      title: "Financial Goals",
      icon: Target,
      questions: [
        "How do I set a savings goal?",
        "How do I track my progress?",
        "Can I have multiple goals?",
        "What if I need to modify my goal?",
      ],
    },
  ];

  const predefinedAnswers = {
    "How do I add a new transaction?":
      "To add a new transaction, click the '+' button on your dashboard, fill in the amount, category, and description, then click 'Save'. You can also use our quick-add feature for faster entry.",
    "Why is my transaction not showing up?":
      "Transactions may take a few moments to appear. Check your internet connection and refresh the page. If it's still missing, ensure you selected the correct account and date.",
    "How do I edit or delete a transaction?":
      "Find the transaction in your list, click the three dots menu, and select 'Edit' or 'Delete'. You can also swipe left on mobile devices for quick actions.",
    "Can I import transactions from my bank?":
      "Yes! Go to Settings > Import Data, connect your bank account securely, and we'll automatically import your recent transactions. This feature supports most major banks.",
    "How do I create a budget?":
      "Navigate to the Budget section, click 'Create New Budget', set your monthly income, allocate amounts to different categories, and save. We'll track your spending against these limits.",
    "Why am I overspending in some categories?":
      "Check your budget vs. actual spending in the Budget tab. We'll show you which categories are over budget and suggest adjustments. Consider setting up spending alerts for better control.",
    "How do I set spending limits?":
      "In the Budget section, click on any category and set a monthly limit. You'll receive notifications when you're approaching or exceeding these limits.",
    "Can I track multiple budgets?":
      "You can create separate budgets for different purposes like personal, business, or vacation planning. Switch between them using the budget selector.",
    "How secure is my financial data?":
      "We use bank-level encryption (256-bit SSL), never store your banking passwords, and are SOC 2 compliant. Your data is encrypted both in transit and at rest.",
    "How do I change my password?":
      "Go to Settings > Security, click 'Change Password', enter your current password and new password twice, then save. We recommend using a strong, unique password.",
    "What happens if I forget my login?":
      "Click 'Forgot Password' on the login page, enter your email, and we'll send you a secure reset link. The link expires in 24 hours for security.",
    "Can I enable two-factor authentication?":
      "Yes! Go to Settings > Security > Two-Factor Authentication. You can use SMS, email, or an authenticator app like Google Authenticator for extra security.",
    "How do I set a savings goal?":
      "Go to Goals section, click 'New Goal', enter your target amount and deadline, and we'll calculate how much you need to save monthly. You can also set up automatic transfers.",
    "How do I track my progress?":
      "Your Goals dashboard shows progress bars, remaining amounts, and timeline. We'll send you weekly updates and celebrate milestones with you!",
    "Can I have multiple goals?":
      "Yes! Create as many goals as you want - emergency fund, vacation, new car, etc. Each goal tracks independently with its own progress and timeline.",
    "What if I need to modify my goal?":
      "Click on any goal to edit the target amount, deadline, or monthly contribution. The system will automatically recalculate your progress and timeline.",
  };

  const selectCategory = (category) => {
    setSelectedCategory(category);
    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        message: `I need help with ${category.title}`,
        timestamp: new Date(),
      },
      {
        type: "bot",
        message: `Great! Here are some common questions about ${category.title}. Click on any question to get an answer:`,
        timestamp: new Date(),
      },
    ]);
  };

  const askQuestion = (question) => {
    const answer = predefinedAnswers[question];
    setChatMessages((prev) => [
      ...prev,
      {
        type: "user",
        message: question,
        timestamp: new Date(),
      },
      {
        type: "bot",
        message: answer,
        timestamp: new Date(),
      },
      {
        type: "bot",
        message:
          "Is there anything else you'd like to know? You can select another category or ask more questions from the current category.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={onBackToHelp}
            className="mr-4 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Help
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chat Support
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Messages */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg h-96">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.type === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                          msg.type === "user"
                            ? "flex-row-reverse space-x-reverse"
                            : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            msg.type === "user" ? "bg-blue-600" : "bg-gray-600"
                          }`}
                        >
                          {msg.type === "user" ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            msg.type === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories and Questions */}
          <div className="space-y-4">
            {!selectedCategory ? (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Select a Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {chatCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant="outline"
                        className="w-full justify-start h-auto p-4 bg-transparent"
                        onClick={() => selectCategory(category)}
                      >
                        <IconComponent className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{category.title}</div>
                        </div>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <selectedCategory.icon className="w-5 h-5 mr-2" />
                    {selectedCategory.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedCategory.questions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3 text-sm"
                      onClick={() => askQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-transparent"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Choose Different Category
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-blue-600" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Monday - Friday</p>
                      <p className="text-gray-600 text-xs">
                        9:00 AM - 6:00 PM EST
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-sm">Weekend</p>
                      <p className="text-gray-600 text-xs">
                        10:00 AM - 4:00 PM EST
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-3">Response Times</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chat Support</span>
                      <Badge variant="secondary" className="text-xs">
                        Instant
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Support</span>
                      <Badge variant="secondary" className="text-xs">
                        Within 24 hours
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Phone Support</span>
                      <Badge variant="secondary" className="text-xs">
                        Immediate
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
