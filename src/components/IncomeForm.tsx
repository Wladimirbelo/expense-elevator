
import { useState } from "react";
import { generateId } from "@/utils/financeUtils";
import { Income } from "@/types/finance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface IncomeFormProps {
  onAddIncome: (income: Income) => void;
}

const IncomeForm = ({ onAddIncome }: IncomeFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

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

    const newIncome: Income = {
      id: generateId(),
      description: description.trim(),
      amount: numAmount,
      date: new Date(),
    };

    onAddIncome(newIncome);
    toast.success("Receita adicionada com sucesso!");
    
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
          placeholder="Ex: Salário, Freelance, etc."
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
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-income hover:bg-income/90 text-income-foreground gap-2"
      >
        <PlusCircle size={18} />
        Adicionar Receita
      </Button>
    </motion.form>
  );
};

export default IncomeForm;
