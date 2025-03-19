
import { useState } from "react";
import { SavingsGoal } from "@/types/finance";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Target, CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { addSavingsGoal } from "@/utils/savingsGoalUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SavingsGoalFormProps {
  onAddGoal: (goal: SavingsGoal) => void;
}

const SavingsGoalForm = ({ onAddGoal }: SavingsGoalFormProps) => {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState<'Investment' | 'Savings'>('Investment');
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, adicione um nome para a meta");
      return;
    }

    const numAmount = parseFloat(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Por favor, adicione um valor válido");
      return;
    }

    setLoading(true);

    try {
      const newGoal = {
        name: name.trim(),
        targetAmount: numAmount,
        currentAmount: 0,
        category,
        description: description.trim() || undefined,
        deadline
      };

      const savedGoal = await addSavingsGoal(newGoal);
      onAddGoal(savedGoal);
      toast.success("Meta de investimento adicionada com sucesso!");
      
      // Clear the form
      setName("");
      setTargetAmount("");
      setDescription("");
      setDeadline(undefined);
    } catch (error) {
      toast.error("Erro ao adicionar meta de investimento");
      console.error(error);
    } finally {
      setLoading(false);
    }
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
        <Label htmlFor="name">Nome da Meta</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Viagem para Cancún, Carro novo"
          className="border-0 bg-secondary/50 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target-amount">Valor Alvo (R$)</Label>
        <Input
          id="target-amount"
          type="number"
          min="0"
          step="0.01"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          placeholder="15000,00"
          className="border-0 bg-secondary/50 h-12"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="goal-category">Categoria</Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as 'Investment' | 'Savings')}
        >
          <SelectTrigger id="goal-category" className="border-0 bg-secondary/50 h-12">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Investment">Investimento</SelectItem>
            <SelectItem value="Savings">Poupança</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Data Limite (opcional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal border-0 bg-secondary/50 h-12 ${!deadline ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? (
                format(deadline, "PPP", { locale: ptBR })
              ) : (
                <span>Escolha uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Descrição (opcional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Adicione detalhes sobre sua meta..."
          className="border-0 bg-secondary/50 min-h-[80px] resize-none"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        disabled={loading}
      >
        <Target size={18} />
        {loading ? "Adicionando..." : "Adicionar Meta"}
      </Button>
    </motion.form>
  );
};

export default SavingsGoalForm;
