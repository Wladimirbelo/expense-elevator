
import { useEffect, useState } from "react";
import { Income, Expense, Budget, TransactionCategory } from "@/types/finance";
import { 
  calculateBalance, 
  calculateTotalExpenses, 
  calculateTotalIncome,
  getTransactionStorage,
  saveTransactionStorage,
  getBudgetsStorage,
  saveBudgetsStorage
} from "@/utils/financeUtils";
import Layout from "@/components/Layout";
import FinanceSummary from "@/components/FinanceSummary";
import FinanceTabs from "@/components/FinanceTabs";
import IncomeForm from "@/components/IncomeForm";
import ExpenseForm from "@/components/ExpenseForm";
import BudgetForm from "@/components/BudgetForm";
import TransactionList from "@/components/TransactionList";
import BudgetList from "@/components/BudgetList";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Index = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedIncomes = getTransactionStorage<Income>("incomes");
    const storedExpenses = getTransactionStorage<Expense>("expenses");
    const storedBudgets = getBudgetsStorage();

    setIncomes(storedIncomes);
    setExpenses(storedExpenses);
    setBudgets(storedBudgets);
  }, []);

  const handleAddIncome = (income: Income) => {
    const updatedIncomes = [income, ...incomes];
    setIncomes(updatedIncomes);
    saveTransactionStorage("incomes", updatedIncomes);
  };

  const handleDeleteIncome = (id: string) => {
    const updatedIncomes = incomes.filter((income) => income.id !== id);
    setIncomes(updatedIncomes);
    saveTransactionStorage("incomes", updatedIncomes);
    toast.success("Receita removida com sucesso!");
  };

  const handleAddExpense = (expense: Expense) => {
    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    saveTransactionStorage("expenses", updatedExpenses);
  };

  const handleDeleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    setExpenses(updatedExpenses);
    saveTransactionStorage("expenses", updatedExpenses);
    toast.success("Despesa removida com sucesso!");
  };

  const handleAddBudget = (budget: Budget) => {
    const updatedBudgets = [...budgets, budget];
    setBudgets(updatedBudgets);
    saveBudgetsStorage(updatedBudgets);
  };

  const handleDeleteBudget = (id: string) => {
    const updatedBudgets = budgets.filter((budget) => budget.id !== id);
    setBudgets(updatedBudgets);
    saveBudgetsStorage(updatedBudgets);
    toast.success("Orçamento removido com sucesso!");
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
      <TransactionList 
        transactions={incomes} 
        type="income" 
        onDelete={handleDeleteIncome} 
      />
    </>
  );

  const expensesContent = (
    <>
      <ExpenseForm onAddExpense={handleAddExpense} />
      <Separator className="my-6" />
      <h2 className="text-xl font-medium mb-4">Despesas registradas</h2>
      <TransactionList 
        transactions={expenses} 
        type="expense" 
        onDelete={handleDeleteExpense} 
      />
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
      <BudgetList 
        budgets={budgets} 
        expenses={expenses} 
        onDelete={handleDeleteBudget} 
      />
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
        />
      </div>
    </Layout>
  );
};

export default Index;
