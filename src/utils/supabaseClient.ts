
import { createClient } from '@supabase/supabase-js';
import { CATEGORIES, Transaction, Income, Expense, Budget } from '@/types/finance';

// Inicializa o cliente Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URLs ou chaves faltando!');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funções para gerenciar transações
export const fetchIncomes = async () => {
  const { data, error } = await supabase
    .from('incomes')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }

  return data.map((income) => ({
    ...income,
    date: new Date(income.date),
  })) as Income[];
};

export const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }

  return data.map((expense) => ({
    ...expense,
    date: new Date(expense.date),
  })) as Expense[];
};

export const fetchBudgets = async () => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*');

  if (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return [];
  }

  return data as Budget[];
};

export const addIncome = async (income: Omit<Income, 'id'>) => {
  const { data, error } = await supabase
    .from('incomes')
    .insert([{ ...income, date: income.date.toISOString() }])
    .select();

  if (error) {
    console.error('Erro ao adicionar receita:', error);
    throw error;
  }

  return { ...data[0], date: new Date(data[0].date) } as Income;
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{ ...expense, date: expense.date.toISOString() }])
    .select();

  if (error) {
    console.error('Erro ao adicionar despesa:', error);
    throw error;
  }

  return { ...data[0], date: new Date(data[0].date) } as Expense;
};

export const addBudget = async (budget: Omit<Budget, 'id'>) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert([budget])
    .select();

  if (error) {
    console.error('Erro ao adicionar orçamento:', error);
    throw error;
  }

  return data[0] as Budget;
};

export const deleteIncome = async (id: string) => {
  const { error } = await supabase
    .from('incomes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar receita:', error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar despesa:', error);
    throw error;
  }
};

export const deleteBudget = async (id: string) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar orçamento:', error);
    throw error;
  }
};
