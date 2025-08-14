export const investmentPlans = {
  bronze: {
    investmentAmount: "$100",
    dailyReturn: "$2.00",        // Daily profit (Monday-Friday only)
    weeklyIncome: "$10.00",      // CORRECTED: 5 working days × $2.00
    investmentValue: 100         // For backend calculations
  },
  silver: {
    investmentAmount: "$200",
    dailyReturn: "$4.00",        // Daily profit (Monday-Friday only)
    weeklyIncome: "$20.00",      // CORRECTED: 5 working days × $4.00
    investmentValue: 200         // For backend calculations
  },
  gold: {
    investmentAmount: "$300",
    dailyReturn: "$6.00",        // Daily profit (Monday-Friday only)
    weeklyIncome: "$30.00",      // CORRECTED: 5 working days × $6.00
    investmentValue: 300         // For backend calculations
  },
  platinum: {
    investmentAmount: "$500",
    dailyReturn: "$10.00",       // Daily profit (Monday-Friday only)
    weeklyIncome: "$50.00",      // CORRECTED: 5 working days × $10.00
    investmentValue: 500         // For backend calculations
  },
  diamond: {
    investmentAmount: "$1000",
    dailyReturn: "$20.00",       // Daily profit (Monday-Friday only)
    weeklyIncome: "$100.00",     // CORRECTED: 5 working days × $20.00
    investmentValue: 1000        // For backend calculations
  },
  elite: {
    investmentAmount: "$5000",
    dailyReturn: "$100.00",      // Daily profit (Monday-Friday only)
    weeklyIncome: "$500.00",     // CORRECTED: 5 working days × $100.00
    investmentValue: 5000        // For backend calculations
  },
};