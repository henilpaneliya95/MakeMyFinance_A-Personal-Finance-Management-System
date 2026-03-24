import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Calculator,
  TrendingUp,
  Target,
  Home,
  Briefcase,
  BarChart3,
  PiggyBank,
  Wallet,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Simulator = () => {
  const [activeSimulator, setActiveSimulator] = useState("retirement");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Retirement Calculator State
  const [retirementData, setRetirementData] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    inflationRate: 3,
    desiredIncome: 80000,
  });

  // Loan Calculator State
  const [loanData, setLoanData] = useState({
    loanAmount: 300000,
    interestRate: 4.5,
    loanTerm: 30,
    downPayment: 60000,
    extraPayment: 0,
  });

  // Investment Calculator State
  const [investmentData, setInvestmentData] = useState({
    initialAmount: 10000,
    monthlyContribution: 500,
    timeHorizon: 20,
    expectedReturn: 8,
    riskTolerance: "moderate",
  });

  // Savings Goal Calculator State
  const [savingsData, setSavingsData] = useState({
    goalAmount: 50000,
    currentSavings: 5000,
    monthlyContribution: 800,
    targetDate: "2026-12-31",
    interestRate: 2.5,
  });

  // SIP Calculator State
  const [sipData, setSipData] = useState({
    monthlyInvestment: 5000,
    annualReturn: 12,
    investmentPeriod: 15,
  });

  // SWP Calculator State
  const [swpData, setSwpData] = useState({
    initialCorpus: 2000000,
    monthlyWithdrawal: 20000,
    annualReturn: 8,
    withdrawalPeriod: 20,
  });

  const formatINR = (value) =>
    Number(value ?? 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    });

  const simulators = [
    { id: "retirement", label: "Retirement Planning", icon: Briefcase },
    { id: "loan", label: "Loan Calculator", icon: Home },
    { id: "investment", label: "Investment Growth", icon: TrendingUp },
    { id: "savings", label: "Savings Goals", icon: Target },
    { id: "sip", label: "SIP Calculator", icon: PiggyBank },
    { id: "swp", label: "SWP Calculator", icon: Wallet },
  ];

  const calculateRetirement = () => {
    const yearsToRetirement =
      retirementData.retirementAge - retirementData.currentAge;
    const monthlyReturn = retirementData.expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;

    // Future value of current savings
    const futureCurrentSavings =
      retirementData.currentSavings *
      Math.pow(1 + retirementData.expectedReturn / 100, yearsToRetirement);

    // Future value of monthly contributions
    const futureMonthlyContributions =
      retirementData.monthlyContribution *
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);

    const totalRetirementSavings =
      futureCurrentSavings + futureMonthlyContributions;

    // Calculate if goal is met
    const inflationAdjustedIncome =
      retirementData.desiredIncome *
      Math.pow(1 + retirementData.inflationRate / 100, yearsToRetirement);
    const requiredSavings = inflationAdjustedIncome * 25; // 4% rule

    return {
      totalSavings: totalRetirementSavings,
      requiredSavings: requiredSavings,
      monthlyIncomeAtRetirement: (totalRetirementSavings * 0.04) / 12,
      shortfall: Math.max(0, requiredSavings - totalRetirementSavings),
      onTrack: totalRetirementSavings >= requiredSavings,
    };
  };

  const calculateLoan = () => {
    const principal = loanData.loanAmount - loanData.downPayment;
    const monthlyRate = loanData.interestRate / 100 / 12;
    const totalPayments = loanData.loanTerm * 12;

    // Monthly payment calculation
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const totalInterest = monthlyPayment * totalPayments - principal;
    const totalCost = principal + totalInterest;

    // With extra payments
    let remainingBalance = principal;
    let totalInterestWithExtra = 0;
    let monthsWithExtra = 0;
    const monthlyWithExtra = monthlyPayment + loanData.extraPayment;

    while (remainingBalance > 0 && monthsWithExtra < totalPayments) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(
        monthlyWithExtra - interestPayment,
        remainingBalance
      );

      totalInterestWithExtra += interestPayment;
      remainingBalance -= principalPayment;
      monthsWithExtra++;
    }

    return {
      monthlyPayment: monthlyPayment,
      totalInterest: totalInterest,
      totalCost: totalCost,
      interestSaved: totalInterest - totalInterestWithExtra,
      timeSaved: totalPayments - monthsWithExtra,
    };
  };

  const calculateInvestment = () => {
    const monthlyReturn = investmentData.expectedReturn / 100 / 12;
    const totalMonths = investmentData.timeHorizon * 12;

    // Future value of initial investment
    const futureInitial =
      investmentData.initialAmount *
      Math.pow(
        1 + investmentData.expectedReturn / 100,
        investmentData.timeHorizon
      );

    // Future value of monthly contributions
    const futureMonthly =
      investmentData.monthlyContribution *
      ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);

    const totalValue = futureInitial + futureMonthly;
    const totalContributions =
      investmentData.initialAmount +
      investmentData.monthlyContribution * totalMonths;
    const totalGains = totalValue - totalContributions;

    return {
      finalValue: totalValue,
      totalContributions: totalContributions,
      totalGains: totalGains,
      returnOnInvestment: (totalGains / totalContributions) * 100,
    };
  };

  const calculateSavings = () => {
    const targetDate = new Date(savingsData.targetDate);
    const currentDate = new Date();
    const monthsToGoal = Math.ceil(
      (targetDate - currentDate) / (1000 * 60 * 60 * 24 * 30)
    );

    const monthlyReturn = savingsData.interestRate / 100 / 12;

    // Future value of current savings
    const futureCurrent =
      savingsData.currentSavings * Math.pow(1 + monthlyReturn, monthsToGoal);

    // Future value of monthly contributions
    const futureContributions =
      savingsData.monthlyContribution *
      ((Math.pow(1 + monthlyReturn, monthsToGoal) - 1) / monthlyReturn);

    const projectedTotal = futureCurrent + futureContributions;
    const shortfall = Math.max(0, savingsData.goalAmount - projectedTotal);
    const requiredMonthly =
      shortfall > 0
        ? (savingsData.goalAmount - futureCurrent) /
          ((Math.pow(1 + monthlyReturn, monthsToGoal) - 1) / monthlyReturn)
        : 0;

    return {
      projectedTotal: projectedTotal,
      shortfall: shortfall,
      onTrack: projectedTotal >= savingsData.goalAmount,
      monthsToGoal: monthsToGoal,
      requiredMonthly: requiredMonthly,
    };
  };

  const calculateSIP = () => {
    const monthlyRate = sipData.annualReturn / 100 / 12;
    const totalMonths = sipData.investmentPeriod * 12;

    const maturityAmount =
      sipData.monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvested = sipData.monthlyInvestment * totalMonths;
    const estimatedReturns = maturityAmount - totalInvested;

    return {
      maturityAmount,
      totalInvested,
      estimatedReturns,
      wealthMultiplier:
        totalInvested > 0 ? maturityAmount / totalInvested : 0,
    };
  };

  const calculateSWP = () => {
    const monthlyRate = swpData.annualReturn / 100 / 12;
    const totalMonths = swpData.withdrawalPeriod * 12;

    let balance = swpData.initialCorpus;
    let monthsSustained = 0;

    while (monthsSustained < totalMonths && balance > 0) {
      balance = balance * (1 + monthlyRate) - swpData.monthlyWithdrawal;
      monthsSustained++;

      if (balance <= 0) {
        balance = 0;
        break;
      }
    }

    const totalWithdrawn = swpData.monthlyWithdrawal * monthsSustained;
    const corpusLastedFullTerm = monthsSustained === totalMonths;

    return {
      finalBalance: balance,
      totalWithdrawn,
      monthsSustained,
      yearsSustained: monthsSustained / 12,
      corpusLastedFullTerm,
      shortfallMonths: corpusLastedFullTerm ? 0 : totalMonths - monthsSustained,
    };
  };

  const runSimulation = async () => {
    setLoading(true);

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let calculationResults;
    switch (activeSimulator) {
      case "retirement":
        calculationResults = calculateRetirement();
        break;
      case "loan":
        calculationResults = calculateLoan();
        break;
      case "investment":
        calculationResults = calculateInvestment();
        break;
      case "savings":
        calculationResults = calculateSavings();
        break;
      case "sip":
        calculationResults = calculateSIP();
        break;
      case "swp":
        calculationResults = calculateSWP();
        break;
      default:
        calculationResults = {};
    }

    setResults(calculationResults);
    setLoading(false);
  };

  const resetSimulation = () => {
    setResults(null);
    // Reset to default values based on active simulator
    switch (activeSimulator) {
      case "retirement":
        setRetirementData({
          currentAge: 30,
          retirementAge: 65,
          currentSavings: 50000,
          monthlyContribution: 1000,
          expectedReturn: 7,
          inflationRate: 3,
          desiredIncome: 80000,
        });
        break;
      case "loan":
        setLoanData({
          loanAmount: 300000,
          interestRate: 4.5,
          loanTerm: 30,
          downPayment: 60000,
          extraPayment: 0,
        });
        break;
      case "investment":
        setInvestmentData({
          initialAmount: 10000,
          monthlyContribution: 500,
          timeHorizon: 20,
          expectedReturn: 8,
          riskTolerance: "moderate",
        });
        break;
      case "savings":
        setSavingsData({
          goalAmount: 50000,
          currentSavings: 5000,
          monthlyContribution: 800,
          targetDate: "2026-12-31",
          interestRate: 2.5,
        });
        break;
      case "sip":
        setSipData({
          monthlyInvestment: 5000,
          annualReturn: 12,
          investmentPeriod: 15,
        });
        break;
      case "swp":
        setSwpData({
          initialCorpus: 2000000,
          monthlyWithdrawal: 20000,
          annualReturn: 8,
          withdrawalPeriod: 20,
        });
        break;
    }
  };

  const renderInputForm = () => {
    switch (activeSimulator) {
      case "retirement":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={retirementData.currentAge}
                  onChange={(e) =>
                    setRetirementData({
                      ...retirementData,
                      currentAge: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementData.retirementAge}
                  onChange={(e) =>
                    setRetirementData({
                      ...retirementData,
                      retirementAge: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currentSavings">
                Current Retirement Savings (₹)
              </Label>
              <Input
                id="currentSavings"
                type="number"
                value={retirementData.currentSavings}
                onChange={(e) =>
                  setRetirementData({
                    ...retirementData,
                    currentSavings: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (₹)
              </Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={retirementData.monthlyContribution}
                onChange={(e) =>
                  setRetirementData({
                    ...retirementData,
                    monthlyContribution: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>
                Expected Annual Return (%): {retirementData.expectedReturn}%
              </Label>
              <Slider
                value={[retirementData.expectedReturn]}
                onValueChange={(value) =>
                  setRetirementData({
                    ...retirementData,
                    expectedReturn: value[0],
                  })
                }
                max={15}
                min={1}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="desiredIncome">
                Desired Annual Retirement Income (₹)
              </Label>
              <Input
                id="desiredIncome"
                type="number"
                value={retirementData.desiredIncome}
                onChange={(e) =>
                  setRetirementData({
                    ...retirementData,
                    desiredIncome: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );

      case "loan":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
              <Input
                id="loanAmount"
                type="number"
                value={loanData.loanAmount}
                onChange={(e) =>
                  setLoanData({
                    ...loanData,
                    loanAmount: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="downPayment">Down Payment (₹)</Label>
              <Input
                id="downPayment"
                type="number"
                value={loanData.downPayment}
                onChange={(e) =>
                  setLoanData({
                    ...loanData,
                    downPayment: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Interest Rate (%): {loanData.interestRate}%</Label>
              <Slider
                value={[loanData.interestRate]}
                onValueChange={(value) =>
                  setLoanData({ ...loanData, interestRate: value[0] })
                }
                max={10}
                min={1}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Loan Term (years): {loanData.loanTerm}</Label>
              <Slider
                value={[loanData.loanTerm]}
                onValueChange={(value) =>
                  setLoanData({ ...loanData, loanTerm: value[0] })
                }
                max={40}
                min={5}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="extraPayment">Extra Monthly Payment (₹)</Label>
              <Input
                id="extraPayment"
                type="number"
                value={loanData.extraPayment}
                onChange={(e) =>
                  setLoanData({
                    ...loanData,
                    extraPayment: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );

      case "investment":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="initialAmount">Initial Investment (₹)</Label>
              <Input
                id="initialAmount"
                type="number"
                value={investmentData.initialAmount}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    initialAmount: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (₹)
              </Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={investmentData.monthlyContribution}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    monthlyContribution: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Time Horizon (years): {investmentData.timeHorizon}</Label>
              <Slider
                value={[investmentData.timeHorizon]}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    timeHorizon: value[0],
                  })
                }
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>
                Expected Annual Return (%): {investmentData.expectedReturn}%
              </Label>
              <Slider
                value={[investmentData.expectedReturn]}
                onValueChange={(value) =>
                  setInvestmentData({
                    ...investmentData,
                    expectedReturn: value[0],
                  })
                }
                max={15}
                min={1}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="riskTolerance">Risk Tolerance</Label>
              <select
                id="riskTolerance"
                value={investmentData.riskTolerance}
                onChange={(e) =>
                  setInvestmentData({
                    ...investmentData,
                    riskTolerance: e.target.value,
                  })
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="conservative">Conservative (3-5% return)</option>
                <option value="moderate">Moderate (6-8% return)</option>
                <option value="aggressive">Aggressive (9-12% return)</option>
              </select>
            </div>
          </div>
        );

      case "savings":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="goalAmount">Savings Goal (₹)</Label>
              <Input
                id="goalAmount"
                type="number"
                value={savingsData.goalAmount}
                onChange={(e) =>
                  setSavingsData({
                    ...savingsData,
                    goalAmount: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="currentSavings">Current Savings (₹)</Label>
              <Input
                id="currentSavings"
                type="number"
                value={savingsData.currentSavings}
                onChange={(e) =>
                  setSavingsData({
                    ...savingsData,
                    currentSavings: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="monthlyContribution">
                Monthly Contribution (₹)
              </Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={savingsData.monthlyContribution}
                onChange={(e) =>
                  setSavingsData({
                    ...savingsData,
                    monthlyContribution: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={savingsData.targetDate}
                onChange={(e) =>
                  setSavingsData({ ...savingsData, targetDate: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Interest Rate (%): {savingsData.interestRate}%</Label>
              <Slider
                value={[savingsData.interestRate]}
                onValueChange={(value) =>
                  setSavingsData({ ...savingsData, interestRate: value[0] })
                }
                max={8}
                min={0.1}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>
        );

      case "sip":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="sipMonthlyInvestment">Monthly Investment (₹)</Label>
              <Input
                id="sipMonthlyInvestment"
                type="number"
                value={sipData.monthlyInvestment}
                onChange={(e) =>
                  setSipData({
                    ...sipData,
                    monthlyInvestment: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Expected Annual Return (%): {sipData.annualReturn}%</Label>
              <Slider
                value={[sipData.annualReturn]}
                onValueChange={(value) =>
                  setSipData({ ...sipData, annualReturn: value[0] })
                }
                max={20}
                min={1}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Investment Period (years): {sipData.investmentPeriod}</Label>
              <Slider
                value={[sipData.investmentPeriod]}
                onValueChange={(value) =>
                  setSipData({ ...sipData, investmentPeriod: value[0] })
                }
                max={40}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        );

      case "swp":
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="swpInitialCorpus">Initial Corpus (₹)</Label>
              <Input
                id="swpInitialCorpus"
                type="number"
                value={swpData.initialCorpus}
                onChange={(e) =>
                  setSwpData({
                    ...swpData,
                    initialCorpus: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="swpMonthlyWithdrawal">Monthly Withdrawal (₹)</Label>
              <Input
                id="swpMonthlyWithdrawal"
                type="number"
                value={swpData.monthlyWithdrawal}
                onChange={(e) =>
                  setSwpData({
                    ...swpData,
                    monthlyWithdrawal: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>Expected Annual Return (%): {swpData.annualReturn}%</Label>
              <Slider
                value={[swpData.annualReturn]}
                onValueChange={(value) =>
                  setSwpData({ ...swpData, annualReturn: value[0] })
                }
                max={15}
                min={1}
                step={0.5}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Withdrawal Period (years): {swpData.withdrawalPeriod}</Label>
              <Slider
                value={[swpData.withdrawalPeriod]}
                onValueChange={(value) =>
                  setSwpData({ ...swpData, withdrawalPeriod: value[0] })
                }
                max={40}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderResults = () => {
    if (!results) return null;

    switch (activeSimulator) {
      case "retirement":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Retirement Projection Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="min-w-0 text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800">
                    Projected Savings
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-green-600">
                    ₹{formatINR(results.totalSavings)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Monthly Income
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.monthlyIncomeAtRetirement)}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  results.onTrack ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {results.onTrack ? (
                    <Badge className="bg-green-100 text-green-800">
                      On Track
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      Needs Adjustment
                    </Badge>
                  )}
                </div>
                {!results.onTrack && (
                  <p className="text-center text-red-700">
                    You need an additional ₹{formatINR(results.shortfall)} to
                    meet your
                    retirement goal.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "loan":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                Loan Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Monthly Payment
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.monthlyPayment)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-red-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-red-800">
                    Total Interest
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-red-600">
                    ₹{formatINR(results.totalInterest)}
                  </p>
                </div>
              </div>

              {loanData.extraPayment > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800 mb-2">
                    Extra Payment Benefits
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Interest Saved</p>
                      <p className="text-xl font-bold text-green-600">
                        ₹{formatINR(results.interestSaved)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time Saved</p>
                      <p className="text-xl font-bold text-green-600">
                        {Math.floor(results.timeSaved / 12)} years{" "}
                        {results.timeSaved % 12} months
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "investment":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Investment Growth Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="min-w-0 text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800">
                    Final Value
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-green-600">
                    ₹{formatINR(results.finalValue)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Total Gains
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.totalGains)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-purple-800">ROI</h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-purple-600">
                    {results.returnOnInvestment?.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "savings":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Target className="w-5 h-5 mr-2 text-blue-600" />
                Savings Goal Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Projected Total
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.projectedTotal)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Months to Goal
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-gray-600">
                    {results.monthsToGoal}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  results.onTrack ? "bg-green-50" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {results.onTrack ? (
                    <Badge className="bg-green-100 text-green-800">
                      Goal Achievable
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      Needs Adjustment
                    </Badge>
                  )}
                </div>
                {!results.onTrack && (
                  <p className="text-center text-orange-700">
                    Increase monthly contribution to ₹
                    {formatINR(results.requiredMonthly)} to reach your
                    goal on time.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case "sip":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <PiggyBank className="w-5 h-5 mr-2 text-blue-600" />
                SIP Projection Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Total Invested
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.totalInvested)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800">
                    Estimated Returns
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-green-600">
                    ₹{formatINR(results.estimatedReturns)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-indigo-800">
                    Maturity Value
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-indigo-600">
                    ₹{formatINR(results.maturityAmount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "swp":
        return (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Wallet className="w-5 h-5 mr-2 text-blue-600" />
                SWP Sustainability Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="min-w-0 text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-green-800">
                    Total Withdrawn
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-green-600">
                    ₹{formatINR(results.totalWithdrawn)}
                  </p>
                </div>
                <div className="min-w-0 text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-lg text-blue-800">
                    Final Balance
                  </h3>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold break-all leading-tight text-blue-600">
                    ₹{formatINR(results.finalBalance)}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  results.corpusLastedFullTerm ? "bg-green-50" : "bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-center mb-2">
                  {results.corpusLastedFullTerm ? (
                    <Badge className="bg-green-100 text-green-800">
                      Corpus Lasts Full Period
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-800">
                      Corpus Depletes Early
                    </Badge>
                  )}
                </div>

                <p className="text-center text-gray-700">
                  Your corpus supports withdrawals for {results.monthsSustained} months
                  ({results.yearsSustained?.toFixed(1)} years).
                </p>
                {!results.corpusLastedFullTerm && (
                  <p className="text-center text-orange-700 mt-1">
                    Short by {results.shortfallMonths} months for selected tenure.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Financial Simulator
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Plan your financial future with our advanced calculators and
          projections
        </p>
      </div>

      {/* Simulator Selection */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {simulators.map((sim) => {
              const Icon = sim.icon;
              return (
                <button
                  key={sim.id}
                  onClick={() => {
                    setActiveSimulator(sim.id);
                    setResults(null);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    activeSimulator === sim.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold text-sm">{sim.label}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl font-semibold">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              {simulators.find((s) => s.id === activeSimulator)?.label}{" "}
              Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderInputForm()}

            {/* Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={runSimulation}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Calculating...</span>
                  </div>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>

              <Button
                onClick={resetSimulation}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {results ? (
            <>
              {renderResults()}

              {/* Action Buttons */}
            </>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-600">
                  Fill in the form and click "Run Simulation" to see your
                  results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
