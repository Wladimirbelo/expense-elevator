
import { useState } from "react";
import { generateId } from "@/utils/financeUtils";
import { CATEGORIES, Expense, TransactionCategory } from "@/types/finance";
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
import { MinusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
}

const ExpenseForm = ({ onAddExpense }: ExpenseFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<TransactionCategory>("Food");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error("Por favor, adicione uma descrição");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, adicione um valor válido");
      return;
    }

    const newExpense: Expense = {
      id: generateId(),
      description: description.trim(),
      amount: numAmount,
      category,
      date: new Date(),
    };

    onAddExpense(newExpense);
    toast.success("Despesa adicionada com sucesso!");
    
    // Clear the form
    setDescription("");
    setAmount("");
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
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Supermercado, Aluguel, etc."
          className="border-0 bg-secondary/50 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Valor (R$)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
          className="border-0 bg-secondary/50 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as TransactionCategory)}
        >
          <SelectTrigger id="category" className="border-0 bg-secondary/50 h-12">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-expense hover:bg-expense/90 text-expense-foreground gap-2"
      >
        <MinusCircle size={18} />
        Adicionar Despesa
      </Button>
    </motion.form>
  );
};

export default ExpenseForm;
