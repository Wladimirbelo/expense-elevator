
export type TransactionCategory = 
  | 'Food'
  | 'Housing'
  | 'Transportation'
  | 'Utilities'
  | 'Insurance'
  | 'Medical'
  | 'Savings'
  | 'Personal'
  | 'Entertainment'
  | 'Other'
  | 'Investment';

export const CATEGORIES: TransactionCategory[] = [
  'Food',
  'Housing',
  'Transportation',
  'Utilities',
  'Insurance',
  'Medical',
  'Savings',
  'Personal',
  'Entertainment',
  'Investment',
  'Other'
];

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category?: TransactionCategory;
  month?: string; // Para rastreamento mensal (formato: 'YYYY-MM')
}

export interface Income extends Transaction {
  month: string; // Obrigatório para incomes
}

export interface Expense extends Transaction {
  category: TransactionCategory;
  month: string; // Obrigatório para expenses
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
  month?: string; // Opcional para orçamentos mensais
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category: 'Investment' | 'Savings';
  deadline?: Date;
  description?: string;
}
