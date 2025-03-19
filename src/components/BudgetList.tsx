
import { Budget, Expense } from "@/types/finance";
import { formatCurrency, calculateBudgetUsage, getBudgetStatus } from "@/utils/financeUtils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const BudgetList = ({ budgets, expenses, onDelete }: BudgetListProps) => {
  if (budgets.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Nenhum orçamento definido.
      </div>
    );
  }

  const getProgressColor = (status: 'good' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'good':
        return 'bg-income';
      case 'warning':
        return 'bg-amber-400';
      case 'exceeded':
        return 'bg-expense';
      default:
        return 'bg-income';
    }
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {budgets.map((budget) => {
          const { used, percentage } = calculateBudgetUsage(budget, expenses);
          const status = getBudgetStatus(percentage);
          const progressColor = getProgressColor(status);
          
          return (
            <motion.div
              key={budget.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-budget/10 border border-budget/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{budget.category}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(budget.id)}
                  className="h-8 w-8 text-budget/70 hover:text-budget"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    <span className="font-semibold">{formatCurrency(used)}</span> 
                    <span className="text-muted-foreground"> de {formatCurrency(budget.amount)}</span>
                  </span>
                  <span 
                    className={`font-medium ${
                      status === 'good' 
                        ? 'text-income' 
                        : status === 'warning' 
                          ? 'text-amber-500' 
                          : 'text-expense'
                    }`}
                  >
                    {Math.min(percentage, 100).toFixed(0)}%
                  </span>
                </div>
                
                <Progress 
                  value={Math.min(percentage, 100)} 
                  max={100} 
                  className="h-2 bg-secondary"
                >
                  <div 
                    className={`h-full ${progressColor} rounded-full transition-all duration-500`} 
                    style={{ width: `${Math.min(percentage, 100)}%` }} 
                  />
                </Progress>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default BudgetList;
