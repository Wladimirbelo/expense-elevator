
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
  | 'Other';

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
  'Other'
];

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category?: TransactionCategory;
}

export interface Income extends Transaction {}

export interface Expense extends Transaction {
  category: TransactionCategory;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  amount: number;
}
