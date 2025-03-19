
import { Budget, Expense, Income, Transaction } from "@/types/finance";

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

// Calculate total income
export const calculateTotalIncome = (incomes: Income[]): number => {
  return incomes.reduce((total, income) => total + income.amount, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate balance
export const calculateBalance = (incomes: Income[], expenses: Expense[]): number => {
  return calculateTotalIncome(incomes) - calculateTotalExpenses(expenses);
};

// Get expenses by category
export const getExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

// Calculate budget usage
export const calculateBudgetUsage = (
  budget: Budget,
  expenses: Expense[]
): { used: number; percentage: number } => {
  const categoryExpenses = expenses.filter(
    (expense) => expense.category === budget.category
  );
  const used = calculateTotalExpenses(categoryExpenses);
  const percentage = (used / budget.amount) * 100;

  return { used, percentage };
};

export const getBudgetStatus = (percentage: number): 'good' | 'warning' | 'exceeded' => {
  if (percentage <= 75) return 'good';
  if (percentage <= 100) return 'warning';
  return 'exceeded';
};

export const getTransactionStorage = <T extends Transaction>(key: string): T[] => {
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((item: any) => ({
      ...item,
      date: new Date(item.date)
    }));
  } catch (error) {
    console.error(`Error parsing ${key} from storage:`, error);
    return [];
  }
};

export const saveTransactionStorage = <T extends Transaction>(key: string, items: T[]): void => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const getBudgetsStorage = (): Budget[] => {
  const stored = localStorage.getItem('budgets');
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing budgets from storage:', error);
    return [];
  }
};

export const saveBudgetsStorage = (budgets: Budget[]): void => {
  localStorage.setItem('budgets', JSON.stringify(budgets));
};
