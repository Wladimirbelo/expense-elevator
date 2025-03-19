
import { useState } from "react";
import { SavingsGoal } from "@/types/finance";
import { updateSavingsGoal } from "@/utils/savingsGoalUtils";
import { formatCurrency } from "@/utils/financeUtils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContributeDialogProps {
  goal: SavingsGoal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContributeSuccess: (updatedGoal: SavingsGoal) => void;
}

const ContributeDialog = ({ 
  goal, 
  open, 
  onOpenChange, 
  onContributeSuccess 
}: ContributeDialogProps) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  if (!goal) return null;

  const handleContribute = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, adicione um valor válido");
      return;
    }

    setLoading(true);

    try {
      const newAmount = goal.currentAmount + numAmount;
      const updatedGoal = await updateSavingsGoal(goal.id, {
        currentAmount: newAmount
      });
      
      onContributeSuccess(updatedGoal);
      onOpenChange(false);
      setAmount("");
      
      if (newAmount >= goal.targetAmount) {
        toast.success(`Parabéns! Você atingiu sua meta para ${goal.name}!`);
      } else {
        toast.success(`Contribuição de ${formatCurrency(numAmount)} adicionada com sucesso!`);
      }
    } catch (error) {
      toast.error("Erro ao adicionar contribuição");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contribuir para {goal.name}</DialogTitle>
          <DialogDescription>
            Adicione um valor para contribuir com sua meta de
            {' '}{formatCurrency(goal.targetAmount)}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="contribution-amount">Valor da Contribuição</Label>
            <Input
              id="contribution-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="h-12"
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Valor atual:</span>
            <span className="font-medium">{formatCurrency(goal.currentAmount)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Valor restante:</span>
            <span className="font-medium">{formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleContribute} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Processando..." : "Confirmar Contribuição"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContributeDialog;
