import { createClient } from '@supabase/supabase-js';
import { Income, Expense, Budget } from '@/types/finance';

// Chaves de ambiente do Supabase
const supabaseUrl = 'https://pyytuwrzsvmvgvyudvpk.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar se as chaves estão disponíveis
const useLocalStorage = !supabaseKey;

// Se as chaves não estiverem disponíveis, use localStorage para armazenamento temporário
// Caso contrário, crie o cliente Supabase
export const supabase = useLocalStorage 
  ? null 
  : createClient(supabaseUrl, supabaseKey);

console.log(useLocalStorage ? "Usando localStorage temporário (Chave Supabase não configurada)" : "Usando Supabase");

// Função auxiliar para armazenamento local
const getLocalData = (key: string, defaultValue: any = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Erro ao buscar dados locais para ${key}:`, error);
    return defaultValue;
  }
};

const setLocalData = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erro ao salvar dados locais para ${key}:`, error);
  }
};

// Funções para buscar dados
export const fetchIncomes = async () => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    return getLocalData('incomes', []);
  }

  try {
    const { data, error } = await supabase
      .from('incomes')
      .select('*');

    if (error) {
      console.error('Erro ao buscar receitas:', error);
      return [];
    }

    return data.map(income => ({
      ...income,
      date: new Date(income.date)
    })) as Income[];
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return [];
  }
};

export const fetchExpenses = async () => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    return getLocalData('expenses', []);
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .select('*');

    if (error) {
      console.error('Erro ao buscar despesas:', error);
      return [];
    }

    return data.map(expense => ({
      ...expense,
      date: new Date(expense.date)
    })) as Expense[];
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    return [];
  }
};

export const fetchBudgets = async () => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    return getLocalData('budgets', []);
  }

  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*');

    if (error) {
      console.error('Erro ao buscar orçamentos:', error);
      return [];
    }

    return data as Budget[];
  } catch (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return [];
  }
};

// Funções para adicionar dados
export const addIncome = async (income: Omit<Income, 'id'>) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const incomes = getLocalData('incomes', []);
    const newIncome = {
      ...income,
      id: Date.now().toString(),
      date: new Date(income.date)
    };
    incomes.push(newIncome);
    setLocalData('incomes', incomes);
    return newIncome;
  }

  try {
    const { data, error } = await supabase
      .from('incomes')
      .insert([{
        ...income,
        date: income.date.toISOString(),
      }])
      .select();

    if (error) {
      console.error('Erro ao adicionar receita:', error);
      throw error;
    }

    return {
      ...data[0],
      date: new Date(data[0].date)
    } as Income;
  } catch (error) {
    console.error('Erro ao adicionar receita:', error);
    throw error;
  }
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const expenses = getLocalData('expenses', []);
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date(expense.date)
    };
    expenses.push(newExpense);
    setLocalData('expenses', expenses);
    return newExpense;
  }

  try {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        ...expense,
        date: expense.date.toISOString(),
      }])
      .select();

    if (error) {
      console.error('Erro ao adicionar despesa:', error);
      throw error;
    }

    return {
      ...data[0],
      date: new Date(data[0].date)
    } as Expense;
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    throw error;
  }
};

export const addBudget = async (budget: Omit<Budget, 'id'>) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const budgets = getLocalData('budgets', []);
    const newBudget = {
      ...budget,
      id: Date.now().toString()
    };
    budgets.push(newBudget);
    setLocalData('budgets', budgets);
    return newBudget;
  }

  try {
    const { data, error } = await supabase
      .from('budgets')
      .insert([budget])
      .select();

    if (error) {
      console.error('Erro ao adicionar orçamento:', error);
      throw error;
    }

    return data[0] as Budget;
  } catch (error) {
    console.error('Erro ao adicionar orçamento:', error);
    throw error;
  }
};

// Funções para excluir dados
export const deleteIncome = async (id: string) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const incomes = getLocalData('incomes', []);
    const updatedIncomes = incomes.filter((income: Income) => income.id !== id);
    setLocalData('incomes', updatedIncomes);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('incomes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir receita:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir receita:', error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const expenses = getLocalData('expenses', []);
    const updatedExpenses = expenses.filter((expense: Expense) => expense.id !== id);
    setLocalData('expenses', updatedExpenses);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir despesa:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir despesa:', error);
    throw error;
  }
};

export const deleteBudget = async (id: string) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const budgets = getLocalData('budgets', []);
    const updatedBudgets = budgets.filter((budget: Budget) => budget.id !== id);
    setLocalData('budgets', updatedBudgets);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir orçamento:', error);
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao excluir orçamento:', error);
    throw error;
  }
};
