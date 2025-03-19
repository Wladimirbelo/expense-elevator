
import { supabase } from './supabaseClient';
import { SavingsGoal } from '@/types/finance';

// Verificar se o supabase está configurado
const useLocalStorage = !supabase;

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

export const fetchSavingsGoals = async () => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const goals = getLocalData('savings_goals', []);
    return goals.map((goal: any) => ({
      ...goal,
      deadline: goal.deadline ? new Date(goal.deadline) : undefined
    })) as SavingsGoal[];
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .select('*');

  if (error) {
    console.error('Erro ao buscar metas de economia:', error);
    return [];
  }

  return data.map(goal => ({
    ...goal,
    deadline: goal.deadline ? new Date(goal.deadline) : undefined
  })) as SavingsGoal[];
};

export const addSavingsGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const goals = getLocalData('savings_goals', []);
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
      deadline: goal.deadline ? goal.deadline.toISOString() : null
    };
    goals.push(newGoal);
    setLocalData('savings_goals', goals);
    return {
      ...newGoal,
      deadline: newGoal.deadline ? new Date(newGoal.deadline) : undefined
    } as SavingsGoal;
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .insert([{
      ...goal,
      deadline: goal.deadline ? goal.deadline.toISOString() : null
    }])
    .select();

  if (error) {
    console.error('Erro ao adicionar meta de economia:', error);
    throw error;
  }

  return {
    ...data[0],
    deadline: data[0].deadline ? new Date(data[0].deadline) : undefined
  } as SavingsGoal;
};

export const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const goals = getLocalData('savings_goals', []);
    const updatedGoals = goals.map((goal: any) => {
      if (goal.id === id) {
        const updatedGoal = { ...goal, ...updates };
        if (updates.deadline) {
          updatedGoal.deadline = updates.deadline.toISOString();
        }
        return updatedGoal;
      }
      return goal;
    });
    setLocalData('savings_goals', updatedGoals);
    const updatedGoal = updatedGoals.find((goal: any) => goal.id === id);
    return {
      ...updatedGoal,
      deadline: updatedGoal.deadline ? new Date(updatedGoal.deadline) : undefined
    } as SavingsGoal;
  }

  const updatedData: any = { ...updates };
  
  if (updates.deadline) {
    updatedData.deadline = updates.deadline.toISOString();
  }

  const { data, error } = await supabase
    .from('savings_goals')
    .update(updatedData)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Erro ao atualizar meta de economia:', error);
    throw error;
  }

  return {
    ...data[0],
    deadline: data[0].deadline ? new Date(data[0].deadline) : undefined
  } as SavingsGoal;
};

export const deleteSavingsGoal = async (id: string) => {
  if (useLocalStorage) {
    // Usar localStorage em vez do Supabase
    const goals = getLocalData('savings_goals', []);
    const updatedGoals = goals.filter((goal: any) => goal.id !== id);
    setLocalData('savings_goals', updatedGoals);
    return { success: true };
  }

  const { error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar meta de economia:', error);
    throw error;
  }
};

export const calculateSavingsProgress = (goal: SavingsGoal) => {
  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
  return {
    percentage,
    remaining: goal.targetAmount - goal.currentAmount
  };
};
