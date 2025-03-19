
import { SavingsGoal } from "@/types/finance";
import { formatCurrency, formatDate } from "@/utils/financeUtils";
import { calculateSavingsProgress } from "@/utils/savingsGoalUtils";
import { Trash2, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onDelete: (id: string) => void;
  onContribute: (goal: SavingsGoal) => void;
}

const SavingsGoalList = ({ goals, onDelete, onContribute }: SavingsGoalListProps) => {
  if (goals.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Nenhuma meta de investimento definida.
      </div>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-income';
    if (percentage >= 75) return 'bg-amber-400';
    if (percentage >= 50) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-primary';
  };

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {goals.map((goal) => {
          const { percentage, remaining } = calculateSavingsProgress(goal);
          const progressColor = getProgressColor(percentage);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 bg-primary/10 border border-primary/20 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">{goal.name}</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(goal.id)}
                  className="h-8 w-8 text-primary/70 hover:text-primary"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
              
              {goal.description && (
                <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
              )}
              
              {goal.deadline && (
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Meta para: {formatDate(goal.deadline)}</span>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    <span className="font-semibold">{formatCurrency(goal.currentAmount)}</span> 
                    <span className="text-muted-foreground"> de {formatCurrency(goal.targetAmount)}</span>
                  </span>
                  <span className="font-medium text-primary">
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
                
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Faltam {formatCurrency(remaining)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => onContribute(goal)}
                    className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Contribuir
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default SavingsGoalList;
