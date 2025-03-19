
import { supabase } from './supabaseClient';
import { SavingsGoal } from '@/types/finance';

export const fetchSavingsGoals = async () => {
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
