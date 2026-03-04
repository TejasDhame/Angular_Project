export interface StaticExpense {
  _id: string;
  name: string;
  amount: number;
  expense_date: string;
  expense_category: string;
  payment: string;
  comment: string;
}

export const STATIC_EXPENSES: StaticExpense[] = [
  { _id: 'exp-001', name: 'Milk and Bread', amount: 180, expense_date: 'Fri Jan 03 2026', expense_category: 'Groceries', payment: 'UPI', comment: 'Weekly essentials' },
  { _id: 'exp-002', name: 'Office Commute', amount: 240, expense_date: 'Sat Jan 04 2026', expense_category: 'Transportation', payment: 'Card', comment: 'Cab rides' },
  { _id: 'exp-003', name: 'Movie Tickets', amount: 600, expense_date: 'Mon Jan 06 2026', expense_category: 'Entertainment', payment: 'Card', comment: 'Weekend movie' },
  { _id: 'exp-004', name: 'Phone Recharge', amount: 399, expense_date: 'Wed Jan 08 2026', expense_category: 'Utilities', payment: 'UPI', comment: 'Monthly plan' },
  { _id: 'exp-005', name: 'Lunch Meeting', amount: 520, expense_date: 'Fri Jan 10 2026', expense_category: 'Food', payment: 'Cash', comment: 'Client lunch' },
  { _id: 'exp-006', name: 'Petrol Refill', amount: 1500, expense_date: 'Sun Jan 12 2026', expense_category: 'Transportation', payment: 'Card', comment: 'Fuel top up' },
  { _id: 'exp-007', name: 'Internet Bill', amount: 899, expense_date: 'Tue Jan 14 2026', expense_category: 'Utilities', payment: 'Net Banking', comment: 'Home broadband' },
  { _id: 'exp-008', name: 'Vegetables', amount: 340, expense_date: 'Thu Jan 16 2026', expense_category: 'Groceries', payment: 'UPI', comment: 'Local market' },
  { _id: 'exp-009', name: 'Coffee with Friend', amount: 260, expense_date: 'Sat Jan 18 2026', expense_category: 'Food', payment: 'Cash', comment: 'Cafe visit' },
  { _id: 'exp-010', name: 'Gym Membership', amount: 1200, expense_date: 'Mon Jan 20 2026', expense_category: 'Health', payment: 'Card', comment: 'Monthly fee' },
  { _id: 'exp-011', name: 'OTT Subscription', amount: 499, expense_date: 'Wed Jan 22 2026', expense_category: 'Entertainment', payment: 'UPI', comment: 'Streaming plan' },
  { _id: 'exp-012', name: 'Medicine Purchase', amount: 740, expense_date: 'Fri Jan 24 2026', expense_category: 'Health', payment: 'Cash', comment: 'Pharmacy order' },
  { _id: 'exp-013', name: 'Dinner Out', amount: 1450, expense_date: 'Sun Jan 26 2026', expense_category: 'Food', payment: 'Card', comment: 'Family dinner' },
  { _id: 'exp-014', name: 'Electricity Bill', amount: 2100, expense_date: 'Tue Jan 28 2026', expense_category: 'Utilities', payment: 'Net Banking', comment: 'Monthly bill' },
  { _id: 'exp-015', name: 'Stationery', amount: 320, expense_date: 'Thu Jan 30 2026', expense_category: 'Education', payment: 'UPI', comment: 'Notebook and pens' },
  { _id: 'exp-016', name: 'Book Purchase', amount: 680, expense_date: 'Sat Feb 01 2026', expense_category: 'Education', payment: 'Card', comment: 'Technical book' },
  { _id: 'exp-017', name: 'Water Can', amount: 90, expense_date: 'Mon Feb 03 2026', expense_category: 'Household', payment: 'Cash', comment: 'Drinking water' },
  { _id: 'exp-018', name: 'Auto Fare', amount: 150, expense_date: 'Wed Feb 05 2026', expense_category: 'Transportation', payment: 'UPI', comment: 'Short trip' },
];
