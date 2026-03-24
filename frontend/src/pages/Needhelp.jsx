// // import { useState } from "react";
// // import axios from "axios";
// // import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Badge } from "@/components/ui/badge";
// // import {
// //   HelpCircle,
// //   MessageCircle,
// //   Phone,
// //   Mail,
// //   Search,
// //   ChevronDown,
// //   ChevronUp,
// //   BookOpen,
// //   Video,
// //   FileText,
// //   Clock,
// //   Send,
// //   Lightbulb,
// //   Shield,
// //   CreditCard,
// //   PieChart,
// //   Target,
// //   ArrowLeft,
// //   Bot,
// //   User,
// // } from "lucide-react";

// // const NeedHelp = () => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [expandedFaq, setExpandedFaq] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [showChat, setShowChat] = useState(false);
// //   const [chatMessages, setChatMessages] = useState([]);
// //   const [selectedCategory, setSelectedCategory] = useState(null);
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     subject: "",
// //     message: "",
// //   });
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [status, setStatus] = useState("");

// //   const chatCategories = [
// //     {
// //       id: "transaction",
// //       title: "Transaction Queries",
// //       icon: CreditCard,
// //       questions: [
// //         "How do I add a new transaction?",
// //         "Why is my transaction not showing up?",
// //         "How do I edit or delete a transaction?",
// //         "Can I import transactions from my bank?",
// //       ],
// //     },
// //     {
// //       id: "budget",
// //       title: "Budget Management",
// //       icon: PieChart,
// //       questions: [
// //         "How do I create a budget?",
// //         "Why did I exceed my budget?",
// //         "How do I adjust my budget limits?",
// //         "Can I set up automatic budget alerts?",
// //       ],
// //     },
// //     {
// //       id: "security",
// //       title: "Security & Privacy",
// //       icon: Shield,
// //       questions: [
// //         "Is my data secure?",
// //         "How do I enable two-factor authentication?",
// //         "Can I delete my account data?",
// //         "Who has access to my financial information?",
// //       ],
// //     },
// //     {
// //       id: "goals",
// //       title: "Financial Goals",
// //       icon: Target,
// //       questions: [
// //         "How do I set a savings goal?",
// //         "Can I track multiple goals?",
// //         "How do automatic contributions work?",
// //         "What happens when I reach my goal?",
// //       ],
// //     },
// //   ];

// //   const predefinedAnswers = {
// //     "How do I add a new transaction?":
// //       'To add a new transaction, go to the Transactions page and click the "Add Transaction" button. Fill in the amount, category, description, and date. You can also add transactions by connecting your bank account for automatic import.',
// //     "Why is my transaction not showing up?":
// //       "Transactions may take 1-2 business days to appear if imported from your bank. If you added it manually, check that you selected the correct account and date range in your filters.",
// //     "How do I edit or delete a transaction?":
// //       "Click on any transaction in your list to open the edit dialog. You can modify the amount, category, or description, or click the delete button to remove it completely.",
// //     "Can I import transactions from my bank?":
// //       "Yes! Go to Settings > Connected Accounts and link your bank account. We support over 10,000 financial institutions and will automatically import your transactions securely.",

// //     "How do I create a budget?":
// //       'Navigate to the Budgets section and click "Create New Budget". Choose a category (like Food, Transportation), set your monthly limit, and select the time period. The system will track your spending automatically.',
// //     "Why did I exceed my budget?":
// //       "Budget overages happen when your spending in a category exceeds the set limit. Check your transaction history for that category to see where the extra spending occurred. You can adjust your budget or spending habits accordingly.",
// //     "How do I adjust my budget limits?":
// //       "Go to your Budgets page, click on the budget you want to modify, and update the amount. Changes take effect immediately and will be reflected in your spending tracking.",
// //     "Can I set up automatic budget alerts?":
// //       "Yes! In Settings > Notifications, you can enable alerts when you reach 50%, 80%, or 100% of any budget. Choose to receive notifications via email or in-app.",

// //     "Is my data secure?":
// //       "Absolutely. We use bank-level 256-bit SSL encryption, never store your banking passwords, and are SOC 2 Type II certified. Your data is encrypted both in transit and at rest.",
// //     "How do I enable two-factor authentication?":
// //       'Go to Settings > Security and click "Enable 2FA". You can use an authenticator app like Google Authenticator or receive SMS codes. This adds an extra layer of security to your account.',
// //     "Can I delete my account data?":
// //       'Yes, you have full control over your data. Go to Settings > Privacy and click "Delete Account". This will permanently remove all your data from our servers within 30 days.',
// //     "Who has access to my financial information?":
// //       "Only you have access to your financial data. Our employees cannot view your personal information, and we never sell or share your data with third parties.",

// //     "How do I set a savings goal?":
// //       "Go to Goals > Create New Goal. Set your target amount, deadline, and choose whether to make manual contributions or set up automatic transfers from your checking account.",
// //     "Can I track multiple goals?":
// //       "Yes! You can create unlimited savings goals for different purposes like vacation, emergency fund, or a new car. Each goal is tracked separately with its own progress indicator.",
// //     "How do automatic contributions work?":
// //       'When setting up a goal, choose "Automatic Contributions" and select the amount and frequency. We\'ll transfer money from your linked checking account to your savings goal automatically.',
// //     "What happens when I reach my goal?":
// //       "Congratulations! When you reach 100% of your goal, you'll receive a celebration notification. You can then set a new goal, increase the current target, or mark it as completed.",
// //   };

// //   const startChat = () => {
// //     setShowChat(true);
// //     setChatMessages([
// //       {
// //         type: "bot",
// //         message:
// //           "Hi! I'm here to help you with your questions. Please select a category to get started:",
// //         timestamp: new Date(),
// //       },
// //     ]);
// //   };

// //   const selectCategory = (category) => {
// //     setSelectedCategory(category);
// //     setChatMessages((prev) => [
// //       ...prev,
// //       {
// //         type: "user",
// //         message: `I need help with ${category.title}`,
// //         timestamp: new Date(),
// //       },
// //       {
// //         type: "bot",
// //         message: `Great! Here are some common questions about ${category.title}. Click on any question to get an answer:`,
// //         timestamp: new Date(),
// //       },
// //     ]);
// //   };

// //   const askQuestion = (question) => {
// //     const answer = predefinedAnswers[question];
// //     setChatMessages((prev) => [
// //       ...prev,
// //       {
// //         type: "user",
// //         message: question,
// //         timestamp: new Date(),
// //       },
// //       {
// //         type: "bot",
// //         message: answer,
// //         timestamp: new Date(),
// //       },
// //       {
// //         type: "bot",
// //         message:
// //           "Is there anything else you'd like to know? You can select another category or ask more questions from the current category.",
// //         timestamp: new Date(),
// //       },
// //     ]);
// //   };

// //   const backToHelp = () => {
// //     setShowChat(false);
// //     setChatMessages([]);
// //     setSelectedCategory(null);
// //   };

// //   const handleChange = (e) => {
// //     setFormData({ ...formData, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setIsSubmitting(true);
// //     setStatus("");
// //     try {
// //       await axios.post("http://localhost:8000/api/contact/", formData);
// //       setStatus("Message sent successfully!");
// //       setFormData({ name: "", email: "", subject: "", message: "" });
// //     } catch (err) {
// //       setStatus("Failed to send message.");
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   const faqData = [
// //     {
// //       id: 1,
// //       category: "Budgets",
// //       question: "How do I set up my first budget?",
// //       answer:
// //         "To create your first budget, go to the Budgets section, click 'Create New Budget', select a category (like Food, Transportation, etc.), set your monthly limit, and choose the time period. The system will automatically track your spending against this budget.",
// //     },
// //     {
// //       id: 2,
// //       category: "Transactions",
// //       question: "How do I categorize my transactions?",
// //       answer:
// //         "You can categorize transactions manually by clicking on any transaction and selecting a category, or enable auto-categorization in Settings. Our AI learns from your patterns to automatically categorize future transactions.",
// //     },
// //     {
// //       id: 3,
// //       category: "Goals",
// //       question: "How do savings goals work?",
// //       answer:
// //         "Create a savings goal by setting a target amount and deadline. You can make contributions manually or set up automatic transfers. The system tracks your progress and sends reminders to help you stay on track.",
// //     },
// //     {
// //       id: 4,
// //       category: "Analytics",
// //       question: "What insights can I get from my spending data?",
// //       answer:
// //         "Our analytics provide spending trends, category breakdowns, income vs expense analysis, and personalized recommendations. You can view monthly, quarterly, or yearly reports to understand your financial patterns.",
// //     },
// //     {
// //       id: 5,
// //       category: "Accounts",
// //       question: "Can I connect multiple bank accounts?",
// //       answer:
// //         "Yes, you can connect multiple checking, savings, and credit card accounts. Each account is tracked separately, and you can view a consolidated dashboard or individual account details.",
// //     },
// //     {
// //       id: 6,
// //       category: "AI Insights",
// //       question: "How does AI help me manage my finances?",
// //       answer:
// //         "Our AI detects unusual spending patterns, predicts next month’s expenses, finds recurring transactions, and estimates when you’ll reach your savings goals. This helps you make smarter financial decisions in real-time.",
// //     },
// //     {
// //       id: 7,
// //       category: "Debt & Portfolio",
// //       question: "Can I track debts and investments in the app?",
// //       answer:
// //         "Yes. The Debt Tracker helps you manage loans, EMIs, and repayment schedules, while the Portfolio section lets you monitor your investments and overall net worth.",
// //     },
// //   ];

// //   const filteredFaqs = faqData.filter(
// //     (faq) =>
// //       faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //       faq.category.toLowerCase().includes(searchQuery.toLowerCase())
// //   );

// //   if (showChat) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 p-6">
// //         <div className="max-w-4xl mx-auto">
// //           {/* Chat Header */}
// //           <div className="flex items-center mb-6">
// //             <Button
// //               variant="outline"
// //               onClick={backToHelp}
// //               className="mr-4 bg-transparent"
// //             >
// //               <ArrowLeft className="w-4 h-4 mr-2" />
// //               Back to Help
// //             </Button>
// //             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //               Chat Support
// //             </h1>
// //           </div>

// //           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //             {/* Chat Messages */}
// //             <div className="lg:col-span-2">
// //               <Card className="border-0 shadow-lg h-96">
// //                 <CardContent className="p-6 h-full flex flex-col">
// //                   <div className="flex-1 overflow-y-auto space-y-4 mb-4">
// //                     {chatMessages.map((msg, index) => (
// //                       <div
// //                         key={index}
// //                         className={`flex ${
// //                           msg.type === "user" ? "justify-end" : "justify-start"
// //                         }`}
// //                       >
// //                         <div
// //                           className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
// //                             msg.type === "user"
// //                               ? "flex-row-reverse space-x-reverse"
// //                               : ""
// //                           }`}
// //                         >
// //                           <div
// //                             className={`w-8 h-8 rounded-full flex items-center justify-center ${
// //                               msg.type === "user"
// //                                 ? "bg-blue-600"
// //                                 : "bg-gray-600"
// //                             }`}
// //                           >
// //                             {msg.type === "user" ? (
// //                               <User className="w-4 h-4 text-white" />
// //                             ) : (
// //                               <Bot className="w-4 h-4 text-white" />
// //                             )}
// //                           </div>
// //                           <div
// //                             className={`p-3 rounded-lg ${
// //                               msg.type === "user"
// //                                 ? "bg-blue-600 text-white"
// //                                 : "bg-gray-100 text-gray-800"
// //                             }`}
// //                           >
// //                             <p className="text-sm">{msg.message}</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             </div>

// //             {/* Categories and Questions */}
// //             <div className="space-y-4">
// //               {!selectedCategory ? (
// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-lg">Select a Category</CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-3">
// //                     {chatCategories.map((category) => {
// //                       const IconComponent = category.icon;
// //                       return (
// //                         <Button
// //                           key={category.id}
// //                           variant="outline"
// //                           className="w-full justify-start h-auto p-4 bg-transparent"
// //                           onClick={() => selectCategory(category)}
// //                         >
// //                           <IconComponent className="w-5 h-5 mr-3" />
// //                           <div className="text-left">
// //                             <div className="font-medium">{category.title}</div>
// //                           </div>
// //                         </Button>
// //                       );
// //                     })}
// //                   </CardContent>
// //                 </Card>
// //               ) : (
// //                 <Card className="border-0 shadow-lg">
// //                   <CardHeader>
// //                     <CardTitle className="text-lg flex items-center">
// //                       <selectedCategory.icon className="w-5 h-5 mr-2" />
// //                       {selectedCategory.title}
// //                     </CardTitle>
// //                   </CardHeader>
// //                   <CardContent className="space-y-2">
// //                     {selectedCategory.questions.map((question, index) => (
// //                       <Button
// //                         key={index}
// //                         variant="ghost"
// //                         className="w-full justify-start text-left h-auto p-3 text-sm"
// //                         onClick={() => askQuestion(question)}
// //                       >
// //                         {question}
// //                       </Button>
// //                     ))}
// //                     <Button
// //                       variant="outline"
// //                       className="w-full mt-4 bg-transparent"
// //                       onClick={() => setSelectedCategory(null)}
// //                     >
// //                       Choose Different Category
// //                     </Button>
// //                   </CardContent>
// //                 </Card>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
// //       {/* Header */}
// //       <div className="text-center space-y-4">
// //         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
// //           How Can We Help You?
// //         </h1>
// //         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
// //           Find answers to common questions, browse tutorials, or contact our
// //           support team
// //         </p>
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6 text-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
// //               <MessageCircle className="w-6 h-6 text-white" />
// //             </div>
// //             <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
// //             <p className="text-gray-600 text-sm mb-4">
// //               Get instant help from our support team
// //             </p>
// //             <Button
// //               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //               onClick={startChat}
// //             >
// //               Start Chat
// //             </Button>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6 text-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
// //               <Phone className="w-6 h-6 text-white" />
// //             </div>
// //             <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
// //             <p className="text-gray-600 text-sm mb-8">
// //               Call us for immediate assistance
// //             </p>
// //             <h4 className="font-semibold text-lg mb-2">+91 9313872776</h4>
// //           </CardContent>
// //         </Card>

// //         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //           <CardContent className="p-6 text-center">
// //             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
// //               <Mail className="w-6 h-6 text-white" />
// //             </div>
// //             <h3 className="font-semibold text-lg mb-2">Email Support</h3>
// //             <p className="text-gray-600 text-sm mb-8">
// //               Send us a detailed message
// //             </p>
// //             <h4 className="font-semibold text-lg">
// //               this platform.new@gmail.com
// //             </h4>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       {/* Search FAQ */}
// //       <Card className="border-0 shadow-lg">
// //         <CardContent className="p-6">
// //           <div className="relative">
// //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
// //             <Input
// //               placeholder="Search frequently asked questions..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="pl-10 h-12 text-lg"
// //             />
// //           </div>
// //         </CardContent>
// //       </Card>

// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //         {/* FAQ Section */}
// //         <div className="lg:col-span-2 space-y-6">
// //           <Card className="border-0 shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="flex items-center text-2xl font-semibold">
// //                 <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
// //                 Frequently Asked Questions
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               {filteredFaqs.map((faq) => (
// //                 <div key={faq.id} className="border border-gray-200 rounded-lg">
// //                   <button
// //                     className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
// //                     onClick={() =>
// //                       setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
// //                     }
// //                   >
// //                     <div>
// //                       <Badge variant="secondary" className="mb-2">
// //                         {faq.category}
// //                       </Badge>
// //                       <p className="font-medium text-gray-900">
// //                         {faq.question}
// //                       </p>
// //                     </div>
// //                     {expandedFaq === faq.id ? (
// //                       <ChevronUp className="w-5 h-5 text-gray-500" />
// //                     ) : (
// //                       <ChevronDown className="w-5 h-5 text-gray-500" />
// //                     )}
// //                   </button>
// //                   {expandedFaq === faq.id && (
// //                     <div className="p-4 pt-0 border-t border-gray-100">
// //                       <p className="text-gray-700 leading-relaxed">
// //                         {faq.answer}
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </CardContent>
// //           </Card>

// //           {/* Tutorials Section */}
// //         </div>

// //         {/* Contact Form */}
// //         <div className="space-y-6">
// //           <form onSubmit={handleSubmit}>
// //             <Card className="border-0 shadow-lg">
// //               <CardHeader>
// //                 <CardTitle className="flex items-center text-xl font-semibold">
// //                   <Send className="w-5 h-5 mr-2 text-blue-600" />
// //                   Contact Support
// //                 </CardTitle>
// //               </CardHeader>
// //               <CardContent className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Name
// //                   </label>
// //                   <Input
// //                     name="name"
// //                     value={formData.name}
// //                     onChange={handleChange}
// //                     placeholder="Your full name"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Email
// //                   </label>
// //                   <Input
// //                     type="email"
// //                     name="email"
// //                     value={formData.email}
// //                     onChange={handleChange}
// //                     placeholder="your.email@example.com"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Subject
// //                   </label>
// //                   <Input
// //                     name="subject"
// //                     value={formData.subject}
// //                     onChange={handleChange}
// //                     placeholder="Brief description of your issue"
// //                     required
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// //                     Message
// //                   </label>
// //                   <Textarea
// //                     value={formData.message}
// //                     name="message"
// //                     onChange={handleChange}
// //                     placeholder="Please describe your issue in detail..."
// //                     rows={4}
// //                     required
// //                   />
// //                 </div>

// //                 <Button
// //                   type="submit"
// //                   disabled={isSubmitting}
// //                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
// //                 >
// //                   {isSubmitting ? (
// //                     <div className="flex items-center space-x-2">
// //                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
// //                       <span>Sending...</span>
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <Send className="w-4 h-4 mr-2" />
// //                       Send Message
// //                     </>
// //                   )}
// //                 </Button>

// //                 {status && (
// //                   <div
// //                     className={`text-center text-sm ${
// //                       status.includes("successfully")
// //                         ? "text-green-600"
// //                         : "text-red-600"
// //                     }`}
// //                   >
// //                     {status}
// //                   </div>
// //                 )}
// //               </CardContent>
// //             </Card>
// //           </form>

// //           {/* Quick Tips */}

// //           <Card className="border-0 shadow-lg">
// //             <CardHeader>
// //               <CardTitle className="text-lg flex items-center">
// //                 <Clock className="w-5 h-5 mr-2 text-blue-600" />
// //                 Support Hours
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="space-y-3">
// //                 <div className="flex items-center">
// //                   <Clock className="w-4 h-4 text-blue-600 mr-3" />
// //                   <div>
// //                     <p className="font-medium text-sm">Monday - Friday</p>
// //                     <p className="text-gray-600 text-xs">
// //                       9:00 AM - 6:00 PM EST
// //                     </p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center">
// //                   <Clock className="w-4 h-4 text-blue-600 mr-3" />
// //                   <div>
// //                     <p className="font-medium text-sm">Weekend</p>
// //                     <p className="text-gray-600 text-xs">
// //                       10:00 AM - 4:00 PM EST
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="border-t pt-4">
// //                 <h4 className="font-medium text-sm mb-3">Response Times</h4>
// //                 <div className="space-y-2">
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm">Chat Support</span>
// //                     <Badge variant="secondary" className="text-xs">
// //                       Instant
// //                     </Badge>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm">Email Support</span>
// //                     <Badge variant="secondary" className="text-xs">
// //                       Within 24 hours
// //                     </Badge>
// //                   </div>
// //                   <div className="flex justify-between items-center">
// //                     <span className="text-sm">Phone Support</span>
// //                     <Badge variant="secondary" className="text-xs">
// //                       Immediate
// //                     </Badge>
// //                   </div>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default NeedHelp;



// import { useState } from "react";
// import axios from "axios";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import {
//   HelpCircle,
//   MessageCircle,
//   Phone,
//   Mail,
//   Search,
//   ChevronDown,
//   ChevronUp,
//   BookOpen,
//   Video,
//   FileText,
//   Clock,
//   Send,
//   Lightbulb,
//   Shield,
//   CreditCard,
//   PieChart,
//   Target,
//   ArrowLeft,
//   Bot,
//   User,
// } from "lucide-react";

// const NeedHelp = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [expandedFaq, setExpandedFaq] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showChat, setShowChat] = useState(false);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     message: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [status, setStatus] = useState("");

//   const chatCategories = [
//     {
//       id: "transaction",
//       title: "Transaction Queries",
//       icon: CreditCard,
//       questions: [
//         "How do I add a new transaction?",
//         "Why is my transaction not showing up?",
//         "How do I edit or delete a transaction?",
//         "Can I import transactions from my bank?",
//       ],
//     },
//     {
//       id: "budget",
//       title: "Budget Management",
//       icon: PieChart,
//       questions: [
//         "How do I create a budget?",
//         "Why did I exceed my budget?",
//         "How do I adjust my budget limits?",
//         "Can I set up automatic budget alerts?",
//       ],
//     },
//     {
//       id: "security",
//       title: "Security & Privacy",
//       icon: Shield,
//       questions: [
//         "Is my data secure?",
//         "How do I enable two-factor authentication?",
//         "Can I delete my account data?",
//         "Who has access to my financial information?",
//       ],
//     },
//     {
//       id: "goals",
//       title: "Financial Goals",
//       icon: Target,
//       questions: [
//         "How do I set a savings goal?",
//         "Can I track multiple goals?",
//         "How do automatic contributions work?",
//         "What happens when I reach my goal?",
//       ],
//     },
//   ];

//   const predefinedAnswers = {
//     "How do I add a new transaction?":
//       'To add a new transaction, go to the Transactions page and click the "Add Transaction" button. Fill in the amount, category, description, and date. You can also add transactions by connecting your bank account for automatic import.',
//     "Why is my transaction not showing up?":
//       "Transactions may take 1-2 business days to appear if imported from your bank. If you added it manually, check that you selected the correct account and date range in your filters.",
//     "How do I edit or delete a transaction?":
//       "Click on any transaction in your list to open the edit dialog. You can modify the amount, category, or description, or click the delete button to remove it completely.",
//     "Can I import transactions from my bank?":
//       "Yes! Go to Settings > Connected Accounts and link your bank account. We support over 10,000 financial institutions and will automatically import your transactions securely.",

//     "How do I create a budget?":
//       'Navigate to the Budgets section and click "Create New Budget". Choose a category (like Food, Transportation), set your monthly limit, and select the time period. The system will track your spending automatically.',
//     "Why did I exceed my budget?":
//       "Budget overages happen when your spending in a category exceeds the set limit. Check your transaction history for that category to see where the extra spending occurred. You can adjust your budget or spending habits accordingly.",
//     "How do I adjust my budget limits?":
//       "Go to your Budgets page, click on the budget you want to modify, and update the amount. Changes take effect immediately and will be reflected in your spending tracking.",
//     "Can I set up automatic budget alerts?":
//       "Yes! In Settings > Notifications, you can enable alerts when you reach 50%, 80%, or 100% of any budget. Choose to receive notifications via email or in-app.",

//     "Is my data secure?":
//       "Absolutely. We use bank-level 256-bit SSL encryption, never store your banking passwords, and are SOC 2 Type II certified. Your data is encrypted both in transit and at rest.",
//     "How do I enable two-factor authentication?":
//       'Go to Settings > Security and click "Enable 2FA". You can use an authenticator app like Google Authenticator or receive SMS codes. This adds an extra layer of security to your account.',
//     "Can I delete my account data?":
//       'Yes, you have full control over your data. Go to Settings > Privacy and click "Delete Account". This will permanently remove all your data from our servers within 30 days.',
//     "Who has access to my financial information?":
//       "Only you have access to your financial data. Our employees cannot view your personal information, and we never sell or share your data with third parties.",

//     "How do I set a savings goal?":
//       "Go to Goals > Create New Goal. Set your target amount, deadline, and choose whether to make manual contributions or set up automatic transfers from your checking account.",
//     "Can I track multiple goals?":
//       "Yes! You can create unlimited savings goals for different purposes like vacation, emergency fund, or a new car. Each goal is tracked separately with its own progress indicator.",
//     "How do automatic contributions work?":
//       'When setting up a goal, choose "Automatic Contributions" and select the amount and frequency. We\'ll transfer money from your linked checking account to your savings goal automatically.',
//     "What happens when I reach my goal?":
//       "Congratulations! When you reach 100% of your goal, you'll receive a celebration notification. You can then set a new goal, increase the current target, or mark it as completed.",
//   };

//   const startChat = () => {
//     setShowChat(true);
//     setChatMessages([
//       {
//         type: "bot",
//         message:
//           "Hi! I'm here to help you with your questions. Please select a category to get started:",
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   const selectCategory = (category) => {
//     setSelectedCategory(category);
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         type: "user",
//         message: `I need help with ${category.title}`,
//         timestamp: new Date(),
//       },
//       {
//         type: "bot",
//         message: `Great! Here are some common questions about ${category.title}. Click on any question to get an answer:`,
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   const askQuestion = (question) => {
//     const answer = predefinedAnswers[question];
//     setChatMessages((prev) => [
//       ...prev,
//       {
//         type: "user",
//         message: question,
//         timestamp: new Date(),
//       },
//       {
//         type: "bot",
//         message: answer,
//         timestamp: new Date(),
//       },
//       {
//         type: "bot",
//         message:
//           "Is there anything else you'd like to know? You can select another category or ask more questions from the current category.",
//         timestamp: new Date(),
//       },
//     ]);
//   };

//   const backToHelp = () => {
//     setShowChat(false);
//     setChatMessages([]);
//     setSelectedCategory(null);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setStatus("");
//     try {
//       await axios.post("http://localhost:8000/api/contact/", formData);
//       setStatus("Message sent successfully!");
//       setFormData({ name: "", email: "", subject: "", message: "" });
//     } catch (err) {
//       setStatus("Failed to send message.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const faqData = [
//     {
//       id: 1,
//       category: "Budgets",
//       question: "How do I set up my first budget?",
//       answer:
//         "To create your first budget, go to the Budgets section, click 'Create New Budget', select a category (like Food, Transportation, etc.), set your monthly limit, and choose the time period. The system will automatically track your spending against this budget.",
//     },
//     {
//       id: 2,
//       category: "Transactions",
//       question: "How do I categorize my transactions?",
//       answer:
//         "You can categorize transactions manually by clicking on any transaction and selecting a category, or enable auto-categorization in Settings. Our AI learns from your patterns to automatically categorize future transactions.",
//     },
//     {
//       id: 3,
//       category: "Goals",
//       question: "How do savings goals work?",
//       answer:
//         "Create a savings goal by setting a target amount and deadline. You can make contributions manually or set up automatic transfers. The system tracks your progress and sends reminders to help you stay on track.",
//     },
//     {
//       id: 4,
//       category: "Analytics",
//       question: "What insights can I get from my spending data?",
//       answer:
//         "Our analytics provide spending trends, category breakdowns, income vs expense analysis, and personalized recommendations. You can view monthly, quarterly, or yearly reports to understand your financial patterns.",
//     },
//     {
//       id: 5,
//       category: "Accounts",
//       question: "Can I connect multiple bank accounts?",
//       answer:
//         "Yes, you can connect multiple checking, savings, and credit card accounts. Each account is tracked separately, and you can view a consolidated dashboard or individual account details.",
//     },
//     {
//       id: 6,
//       category: "AI Insights",
//       question: "How does AI help me manage my finances?",
//       answer:
//         "Our AI detects unusual spending patterns, predicts next month’s expenses, finds recurring transactions, and estimates when you’ll reach your savings goals. This helps you make smarter financial decisions in real-time.",
//     },
//     {
//       id: 7,
//       category: "Debt & Portfolio",
//       question: "Can I track debts and investments in the app?",
//       answer:
//         "Yes. The Debt Tracker helps you manage loans, EMIs, and repayment schedules, while the Portfolio section lets you monitor your investments and overall net worth.",
//     },
//   ];

//   const filteredFaqs = faqData.filter(
//     (faq) =>
//       faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       faq.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   if (showChat) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">
//         <div className="max-w-4xl mx-auto">
//           {/* Chat Header */}
//           <div className="flex items-center mb-6">
//             <Button
//               variant="outline"
//               onClick={backToHelp}
//               className="mr-4 bg-transparent"
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Help
//             </Button>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               Chat Support
//             </h1>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Chat Messages */}
//             <div className="lg:col-span-2">
//               <Card className="border-0 shadow-lg h-96">
//                 <CardContent className="p-6 h-full flex flex-col">
//                   <div className="flex-1 overflow-y-auto space-y-4 mb-4">
//                     {chatMessages.map((msg, index) => (
//                       <div
//                         key={index}
//                         className={`flex ${
//                           msg.type === "user" ? "justify-end" : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
//                             msg.type === "user"
//                               ? "flex-row-reverse space-x-reverse"
//                               : ""
//                           }`}
//                         >
//                           <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center ${
//                               msg.type === "user"
//                                 ? "bg-blue-600"
//                                 : "bg-gray-600"
//                             }`}
//                           >
//                             {msg.type === "user" ? (
//                               <User className="w-4 h-4 text-white" />
//                             ) : (
//                               <Bot className="w-4 h-4 text-white" />
//                             )}
//                           </div>
//                           <div
//                             className={`p-3 rounded-lg ${
//                               msg.type === "user"
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-gray-100 text-gray-800"
//                             }`}
//                           >
//                             <p className="text-sm">{msg.message}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Categories and Questions */}
//             <div className="space-y-4">
//               {!selectedCategory ? (
//                 <Card className="border-0 shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-lg">Select a Category</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-3">
//                     {chatCategories.map((category) => {
//                       const IconComponent = category.icon;
//                       return (
//                         <Button
//                           key={category.id}
//                           variant="outline"
//                           className="w-full justify-start h-auto p-4 bg-transparent"
//                           onClick={() => selectCategory(category)}
//                         >
//                           <IconComponent className="w-5 h-5 mr-3" />
//                           <div className="text-left">
//                             <div className="font-medium">{category.title}</div>
//                           </div>
//                         </Button>
//                       );
//                     })}
//                   </CardContent>
//                 </Card>
//               ) : (
//                 <Card className="border-0 shadow-lg">
//                   <CardHeader>
//                     <CardTitle className="text-lg flex items-center">
//                       <selectedCategory.icon className="w-5 h-5 mr-2" />
//                       {selectedCategory.title}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-2">
//                     {selectedCategory.questions.map((question, index) => (
//                       <Button
//                         key={index}
//                         variant="ghost"
//                         className="w-full justify-start text-left h-auto p-3 text-sm"
//                         onClick={() => askQuestion(question)}
//                       >
//                         {question}
//                       </Button>
//                     ))}
//                     <Button
//                       variant="outline"
//                       className="w-full mt-4 bg-transparent"
//                       onClick={() => setSelectedCategory(null)}
//                     >
//                       Choose Different Category
//                     </Button>
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-8">
//       {/* Header */}
//       <div className="text-center space-y-4">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           How Can We Help You?
//         </h1>
//         <p className="text-gray-600 text-lg max-w-2xl mx-auto">
//           Find answers to common questions, browse tutorials, or contact our
//           support team
//         </p>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6 text-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <MessageCircle className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
//             <p className="text-gray-600 text-sm mb-4">
//               Get instant help from our support team
//             </p>
//             <Button
//               className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//               onClick={startChat}
//             >
//               Start Chat
//             </Button>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6 text-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <Phone className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
//             <p className="text-gray-600 text-sm mb-8">
//               Call us for immediate assistance
//             </p>
//             <h4 className="font-semibold text-lg mb-2">+91 9313872776</h4>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//           <CardContent className="p-6 text-center">
//             <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <Mail className="w-6 h-6 text-white" />
//             </div>
//             <h3 className="font-semibold text-lg mb-2">Email Support</h3>
//             <p className="text-gray-600 text-sm mb-8">
//               Send us a detailed message
//             </p>
//             <h4 className="font-semibold text-lg">
//               this platform.new@gmail.com
//             </h4>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Search FAQ */}
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               placeholder="Search frequently asked questions..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 h-12 text-lg"
//             />
//           </div>
//         </CardContent>
//       </Card>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* FAQ Section */}
//         <div className="lg:col-span-2 space-y-6">
//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="flex items-center text-2xl font-semibold">
//                 <HelpCircle className="w-6 h-6 mr-2 text-blue-600" />
//                 Frequently Asked Questions
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {filteredFaqs.map((faq) => (
//                 <div key={faq.id} className="border border-gray-200 rounded-lg">
//                   <button
//                     className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
//                     onClick={() =>
//                       setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
//                     }
//                   >
//                     <div>
//                       <Badge variant="secondary" className="mb-2">
//                         {faq.category}
//                       </Badge>
//                       <p className="font-medium text-gray-900">
//                         {faq.question}
//                       </p>
//                     </div>
//                     {expandedFaq === faq.id ? (
//                       <ChevronUp className="w-5 h-5 text-gray-500" />
//                     ) : (
//                       <ChevronDown className="w-5 h-5 text-gray-500" />
//                     )}
//                   </button>
//                   {expandedFaq === faq.id && (
//                     <div className="p-4 pt-0 border-t border-gray-100">
//                       <p className="text-gray-700 leading-relaxed">
//                         {faq.answer}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Tutorials Section */}
//         </div>

//         {/* Contact Form */}
//         <div className="space-y-6">
//           <form onSubmit={handleSubmit}>
//             <Card className="border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center text-xl font-semibold">
//                   <Send className="w-5 h-5 mr-2 text-blue-600" />
//                   Contact Support
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Name
//                   </label>
//                   <Input
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Your full name"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email
//                   </label>
//                   <Input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="your.email@example.com"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Subject
//                   </label>
//                   <Input
//                     name="subject"
//                     value={formData.subject}
//                     onChange={handleChange}
//                     placeholder="Brief description of your issue"
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Message
//                   </label>
//                   <Textarea
//                     value={formData.message}
//                     name="message"
//                     onChange={handleChange}
//                     placeholder="Please describe your issue in detail..."
//                     rows={4}
//                     required
//                   />
//                 </div>

//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                 >
//                   {isSubmitting ? (
//                     <div className="flex items-center space-x-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       <span>Sending...</span>
//                     </div>
//                   ) : (
//                     <>
//                       <Send className="w-4 h-4 mr-2" />
//                       Send Message
//                     </>
//                   )}
//                 </Button>

//                 {status && (
//                   <div
//                     className={`text-center text-sm ${
//                       status.includes("successfully")
//                         ? "text-green-600"
//                         : "text-red-600"
//                     }`}
//                   >
//                     {status}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </form>

//           {/* Quick Tips */}

//           <Card className="border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle className="text-lg flex items-center">
//                 <Clock className="w-5 h-5 mr-2 text-blue-600" />
//                 Support Hours
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-3">
//                 <div className="flex items-center">
//                   <Clock className="w-4 h-4 text-blue-600 mr-3" />
//                   <div>
//                     <p className="font-medium text-sm">Monday - Friday</p>
//                     <p className="text-gray-600 text-xs">
//                       9:00 AM - 6:00 PM EST
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <Clock className="w-4 h-4 text-blue-600 mr-3" />
//                   <div>
//                     <p className="font-medium text-sm">Weekend</p>
//                     <p className="text-gray-600 text-xs">
//                       10:00 AM - 4:00 PM EST
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="border-t pt-4">
//                 <h4 className="font-medium text-sm mb-3">Response Times</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Chat Support</span>
//                     <Badge variant="secondary" className="text-xs">
//                       Instant
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Email Support</span>
//                     <Badge variant="secondary" className="text-xs">
//                       Within 24 hours
//                     </Badge>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Phone Support</span>
//                     <Badge variant="secondary" className="text-xs">
//                       Immediate
//                     </Badge>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NeedHelp;

"use client"

import { useState } from "react"
import axios from "axios"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronUp,
  Clock,
  Send,
  Shield,
  CreditCard,
  PieChart,
  Target,
  ArrowLeft,
  Bot,
  User,
} from "lucide-react"
import { API_BASE } from "@/lib/api"

const NeedHelp = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState("")

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
      icon: PieChart,
      questions: [
        "How do I create a budget?",
        "Why did I exceed my budget?",
        "How do I adjust my budget limits?",
        "Can I set up automatic budget alerts?",
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      questions: [
        "Is my data secure?",
        "How do I enable two-factor authentication?",
        "Can I delete my account data?",
        "Who has access to my financial information?",
      ],
    },
    {
      id: "goals",
      title: "Financial Goals",
      icon: Target,
      questions: [
        "How do I set a savings goal?",
        "Can I track multiple goals?",
        "How do automatic contributions work?",
        "What happens when I reach my goal?",
      ],
    },
  ]

  const predefinedAnswers = {
    "How do I add a new transaction?":
      'To add a new transaction, go to the Transactions page and click the "Add Transaction" button. Fill in the amount, category, description, and date. You can also add transactions by connecting your bank account for automatic import.',
    "Why is my transaction not showing up?":
      "Transactions may take 1-2 business days to appear if imported from your bank. If you added it manually, check that you selected the correct account and date range in your filters.",
    "How do I edit or delete a transaction?":
      "Click on any transaction in your list to open the edit dialog. You can modify the amount, category, or description, or click the delete button to remove it completely.",
    "Can I import transactions from my bank?":
      "Yes! Go to Settings > Connected Accounts and link your bank account. We support over 10,000 financial institutions and will automatically import your transactions securely.",

    "How do I create a budget?":
      'Navigate to the Budgets section and click "Create New Budget". Choose a category (like Food, Transportation), set your monthly limit, and select the time period. The system will track your spending automatically.',
    "Why did I exceed my budget?":
      "Budget overages happen when your spending in a category exceeds the set limit. Check your transaction history for that category to see where the extra spending occurred. You can adjust your budget or spending habits accordingly.",
    "How do I adjust my budget limits?":
      "Go to your Budgets page, click on the budget you want to modify, and update the amount. Changes take effect immediately and will be reflected in your spending tracking.",
    "Can I set up automatic budget alerts?":
      "Yes! In Settings > Notifications, you can enable alerts when you reach 50%, 80%, or 100% of any budget. Choose to receive notifications via email or in-app.",

    "Is my data secure?":
      "Absolutely. We use bank-level 256-bit SSL encryption, never store your banking passwords, and are SOC 2 Type II certified. Your data is encrypted both in transit and at rest.",
    "How do I enable two-factor authentication?":
      'Go to Settings > Security and click "Enable 2FA". You can use an authenticator app like Google Authenticator or receive SMS codes. This adds an extra layer of security to your account.',
    "Can I delete my account data?":
      'Yes, you have full control over your data. Go to Settings > Privacy and click "Delete Account". This will permanently remove all your data from our servers within 30 days.',
    "Who has access to my financial information?":
      "Only you have access to your financial data. Our employees cannot view your personal information, and we never sell or share your data with third parties.",

    "How do I set a savings goal?":
      "Go to Goals > Create New Goal. Set your target amount, deadline, and choose whether to make manual contributions or set up automatic transfers from your checking account.",
    "Can I track multiple goals?":
      "Yes! You can create unlimited savings goals for different purposes like vacation, emergency fund, or a new car. Each goal is tracked separately with its own progress indicator.",
    "How do automatic contributions work?":
      'When setting up a goal, choose "Automatic Contributions" and select the amount and frequency. We\'ll transfer money from your linked checking account to your savings goal automatically.',
    "What happens when I reach my goal?":
      "Congratulations! When you reach 100% of your goal, you'll receive a celebration notification. You can then set a new goal, increase the current target, or mark it as completed.",
  }

  const startChat = () => {
    setShowChat(true)
    setChatMessages([
      {
        type: "bot",
        message: "Hi! I'm here to help you with your questions. Please select a category to get started:",
        timestamp: new Date(),
      },
    ])
  }

  const selectCategory = (category) => {
    setSelectedCategory(category)
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
    ])
  }

  const askQuestion = (question) => {
    const answer = predefinedAnswers[question]
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
    ])
  }

  const backToHelp = () => {
    setShowChat(false)
    setChatMessages([])
    setSelectedCategory(null)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("")
    try {
      await axios.post(`${API_BASE}/contact/`, formData)
      setStatus("Message sent successfully!")
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (err) {
      setStatus("Failed to send message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const faqData = [
    {
      id: 1,
      category: "Budgets",
      question: "How do I set up my first budget?",
      answer:
        "To create your first budget, go to the Budgets section, click 'Create New Budget', select a category (like Food, Transportation, etc.), set your monthly limit, and choose the time period. The system will automatically track your spending against this budget.",
    },
    {
      id: 2,
      category: "Transactions",
      question: "How do I categorize my transactions?",
      answer:
        "You can categorize transactions manually by clicking on any transaction and selecting a category, or enable auto-categorization in Settings. Our AI learns from your patterns to automatically categorize future transactions.",
    },
    {
      id: 3,
      category: "Goals",
      question: "How do savings goals work?",
      answer:
        "Create a savings goal by setting a target amount and deadline. You can make contributions manually or set up automatic transfers. The system tracks your progress and sends reminders to help you stay on track.",
    },
    {
      id: 4,
      category: "Analytics",
      question: "What insights can I get from my spending data?",
      answer:
        "Our analytics provide spending trends, category breakdowns, income vs expense analysis, and personalized recommendations. You can view monthly, quarterly, or yearly reports to understand your financial patterns.",
    },
    {
      id: 5,
      category: "Accounts",
      question: "Can I connect multiple bank accounts?",
      answer:
        "Yes, you can connect multiple checking, savings, and credit card accounts. Each account is tracked separately, and you can view a consolidated dashboard or individual account details.",
    },
    {
      id: 6,
      category: "AI Insights",
      question: "How does AI help me manage my finances?",
      answer:
        "Our AI detects unusual spending patterns, predicts next month’s expenses, finds recurring transactions, and estimates when you’ll reach your savings goals. This helps you make smarter financial decisions in real-time.",
    },
    {
      id: 7,
      category: "Debt & Portfolio",
      question: "Can I track debts and investments in the app?",
      answer:
        "Yes. The Debt Tracker helps you manage loans, EMIs, and repayment schedules, while the Portfolio section lets you monitor your investments and overall net worth.",
    },
  ]

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Chat Header */}
          <div className="flex items-center mb-6">
            <Button variant="outline" onClick={backToHelp} className="mr-4 bg-transparent">
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
                      <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                            msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
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
                              msg.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
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
                      const IconComponent = category.icon
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
                      )
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
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          How Can We Help You?
        </h1>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
          Find answers to common questions, browse tutorials, or contact our support team
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Live Chat</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-8">Get instant help from our support team</p>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
              onClick={startChat}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Phone Support</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-8">Call us for immediate assistance</p>
            <h4 className="font-semibold text-sm sm:text-lg mb-2">+91 6353482102</h4>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-4 sm:p-6 text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base sm:text-lg mb-2">Email Support</h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-8">Send us a detailed message</p>
            <h4 className="font-semibold text-xs sm:text-lg break-all">this platform.new@gmail.com</h4>
          </CardContent>
        </Card>
      </div>

      {/* Search FAQ */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:pl-10 h-10 sm:h-12 text-sm sm:text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl md:text-2xl font-semibold">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <button
                    className="w-full p-3 sm:p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {faq.category}
                      </Badge>
                      <p className="font-medium text-gray-900 text-sm sm:text-base pr-2">{faq.question}</p>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="p-3 sm:p-4 pt-0 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="space-y-4 sm:space-y-6">
          <form onSubmit={handleSubmit}>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg sm:text-xl font-semibold">
                  <Send className="w-5 h-5 mr-2 text-blue-600" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <Textarea
                    value={formData.message}
                    name="message"
                    onChange={handleChange}
                    placeholder="Please describe your issue in detail..."
                    rows={4}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                {status && (
                  <div
                    className={`text-center text-sm ${
                      status.includes("successfully") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status}
                  </div>
                )}
              </CardContent>
            </Card>
          </form>

          {/* Support Hours */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Monday - Friday</p>
                    <p className="text-gray-600 text-xs">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Weekend</p>
                    <p className="text-gray-600 text-xs">10:00 AM - 4:00 PM EST</p>
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
  )
}

export default NeedHelp
