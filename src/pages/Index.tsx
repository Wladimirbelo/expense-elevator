
import { useEffect, useState } from "react";
import { Income, Expense, Budget, TransactionCategory, SavingsGoal } from "@/types/finance";
import { 
  calculateBalance, 
  calculateTotalExpenses, 
  calculateTotalIncome,
  formatCurrency,
  formatDate,
} from "@/utils/financeUtils";
import {
  fetchIncomes,
  fetchExpenses,
  fetchBudgets,
  addIncome,
  addExpense,
  addBudget,
  deleteIncome,
  deleteExpense,
  deleteBudget
} from "@/utils/supabaseClient";
import {
  fetchSavingsGoals,
  deleteSavingsGoal,
  updateSavingsGoal
} from "@/utils/savingsGoalUtils";
import Layout from "@/components/Layout";
import FinanceSummary from "@/components/FinanceSummary";
import FinanceTabs from "@/components/FinanceTabs";
import IncomeForm from "@/components/IncomeForm";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetForm from "@/components/BudgetForm";
import SavingsGoalForm from "@/components/SavingsGoalForm";
import TransactionList from "@/components/TransactionList";
import BudgetList from "@/components/BudgetList";
import SavingsGoalList from "@/components/SavingsGoalList";
import ContributeDialog from "@/components/ContributeDialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [contributeDialogOpen, setContributeDialogOpen] = useState(false);

  // Queries
  const { 
    data: incomes = [], 
    isLoading: isLoadingIncomes 
  } = useQuery({
    queryKey: ['incomes', selectedMonth],
    queryFn: fetchIncomes
  });

  const { 
    data: expenses = [], 
    isLoading: isLoadingExpenses 
  } = useQuery({
    queryKey: ['expenses', selectedMonth],
    queryFn: fetchExpenses
  });

  const { 
    data: budgets = [], 
    isLoading: isLoadingBudgets 
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: fetchBudgets
  });

  const { 
    data: savingsGoals = [], 
    isLoading: isLoadingSavingsGoals 
  } = useQuery({
    queryKey: ['savingsGoals'],
    queryFn: fetchSavingsGoals
  });

  // Mutations
  const addIncomeMutation = useMutation({
    mutationFn: (newIncome: Omit<Income, 'id'>) => addIncome(newIncome),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success("Receita adicionada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao adicionar receita!");
    }
  });

  const addExpenseMutation = useMutation({
    mutationFn: (newExpense: Omit<Expense, 'id'>) => addExpense(newExpense),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Despesa adicionada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao adicionar despesa!");
    }
  });

  const addBudgetMutation = useMutation({
    mutationFn: (newBudget: Omit<Budget, 'id'>) => addBudget(newBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Orçamento definido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao definir orçamento!");
    }
  });

  const deleteIncomeMutation = useMutation({
    mutationFn: (id: string) => deleteIncome(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      toast.success("Receita removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover receita!");
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success("Despesa removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover despesa!");
    }
  });

  const deleteBudgetMutation = useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success("Orçamento removido com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover orçamento!");
    }
  });

  const deleteSavingsGoalMutation = useMutation({
    mutationFn: (id: string) => deleteSavingsGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
      toast.success("Meta removida com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao remover meta!");
    }
  });

  const handleAddIncome = (income: Omit<Income, 'id'>) => {
    const incomeWithMonth = {
      ...income,
      month: selectedMonth
    };
    addIncomeMutation.mutate(incomeWithMonth);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const expenseWithMonth = {
      ...expense,
      month: selectedMonth
    };
    addExpenseMutation.mutate(expenseWithMonth);
  };

  const handleAddBudget = (budget: Omit<Budget, 'id'>) => {
    const budgetWithMonth = {
      ...budget,
      month: selectedMonth
    };
    addBudgetMutation.mutate(budgetWithMonth);
  };

  const handleAddSavingsGoal = (goal: SavingsGoal) => {
    queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
  };

  const handleContributeGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setContributeDialogOpen(true);
  };

  const handleContributeSuccess = (updatedGoal: SavingsGoal) => {
    queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
  };

  const handleDeleteIncome = (id: string) => {
    deleteIncomeMutation.mutate(id);
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpenseMutation.mutate(id);
  };

  const handleDeleteBudget = (id: string) => {
    deleteBudgetMutation.mutate(id);
  };

  const handleDeleteSavingsGoal = (id: string) => {
    deleteSavingsGoalMutation.mutate(id);
  };

  const existingBudgetCategories = budgets.map((budget) => budget.category);
  const incomeTotal = calculateTotalIncome(incomes);
  const expenseTotal = calculateTotalExpenses(expenses);
  const balance = calculateBalance(incomes, expenses);

  const incomesContent = (
    <>
      <IncomeForm onAddIncome={handleAddIncome} />
      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-4">Receitas registradas</h2>
      {isLoadingIncomes ? (
        <div className="text-center p-8 text-muted-foreground">Carregando...</div>
      ) : (
        <TransactionList 
          transactions={incomes} 
          type="income" 
          onDelete={handleDeleteIncome} 
        />
      )}
    </>
  );

  const expensesContent = (
    <>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-4">Despesas registradas</h2>
      {isLoadingExpenses ? (
        <div className="text-center p-8 text-muted-foreground">Carregando...</div>
      ) : (
        <TransactionList 
          transactions={expenses} 
          type="expense" 
          onDelete={handleDeleteExpense} 
        />
      )}
    </>
  );

  const budgetsContent = (
    <>
      <BudgetForm 
        onAddBudget={handleAddBudget} 
        existingCategories={existingBudgetCategories as TransactionCategory[]} 
      />
      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-4">Orçamentos definidos</h2>
      {isLoadingBudgets ? (
        <div className="text-center p-8 text-muted-foreground">Carregando...</div>
      ) : (
        <BudgetList 
          budgets={budgets} 
          expenses={expenses} 
          onDelete={handleDeleteBudget} 
        />
      )}
    </>
  );

  const savingsContent = (
    <>
      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="goals">Metas de Investimento</TabsTrigger>
          <TabsTrigger value="add">Nova Meta</TabsTrigger>
        </TabsList>
        <TabsContent value="goals">
          <h2 className="text-xl font-medium mb-4">Metas de Investimento</h2>
          {isLoadingSavingsGoals ? (
            <div className="text-center p-8 text-muted-foreground">Carregando...</div>
          ) : (
            <SavingsGoalList 
              goals={savingsGoals} 
              onDelete={handleDeleteSavingsGoal}
              onContribute={handleContributeGoal}
            />
          )}
        </TabsContent>
        <TabsContent value="add">
          <h2 className="text-xl font-medium mb-4">Adicionar Meta de Investimento</h2>
          <SavingsGoalForm onAddGoal={handleAddSavingsGoal} />
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <Layout>
      <div className="space-y-8">
        <FinanceSummary 
          incomeTotal={incomeTotal} 
          expenseTotal={expenseTotal} 
          balance={balance} 
        />
        
        <FinanceTabs 
          incomesContent={incomesContent}
          expensesContent={expensesContent}
          budgetsContent={budgetsContent}
          savingsContent={savingsContent}
        />
        
        <ContributeDialog 
          goal={selectedGoal}
          open={contributeDialogOpen}
          onOpenChange={setContributeDialogOpen}
          onContributeSuccess={handleContributeSuccess}
        />
      </div>
    </Layout>
  );
};

export default Index;
