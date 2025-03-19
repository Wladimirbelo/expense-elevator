
import { useState } from "react";
import { generateId } from "@/utils/financeUtils";
import { Budget, CATEGORIES, TransactionCategory } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

interface BudgetFormProps {
  onAddBudget: (budget: Budget) => void;
  existingCategories: TransactionCategory[];
}

const BudgetForm = ({ onAddBudget, existingCategories }: BudgetFormProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory | "">("");

  const availableCategories = CATEGORIES.filter(
    (cat) => !existingCategories.includes(cat)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      toast.error("Por favor, selecione uma categoria");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, adicione um valor válido");
      return;
    }

    const newBudget: Budget = {
      id: generateId(),
      category: category as TransactionCategory,
      amount: numAmount,
    };

    onAddBudget(newBudget);
    toast.success("Orçamento definido com sucesso!");
    
    // Clear the form
    setAmount("");
    setCategory("");
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass p-6 rounded-2xl shadow-sm space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="budget-category">Categoria</Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as TransactionCategory)}
        >
          <SelectTrigger id="budget-category" className="border-0 bg-secondary/50 h-12">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.length > 0 ? (
              availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Todas as categorias já possuem orçamento
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="budget-amount">Valor (R$)</Label>
        <Input
          id="budget-amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          className="border-0 bg-secondary/50 h-12"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-budget hover:bg-budget/90 text-budget-foreground gap-2"
        disabled={availableCategories.length === 0}
      >
        <Wallet size={18} />
        Definir Orçamento
      </Button>
    </motion.form>
  );
};

export default BudgetForm;
