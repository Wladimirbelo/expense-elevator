
import { formatCurrency, formatDate } from "@/utils/financeUtils";
import { Transaction } from "@/types/finance";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionListProps {
  transactions: Transaction[];
  type: "income" | "expense";
  onDelete: (id: string) => void;
}

const TransactionList = ({ transactions, type, onDelete }: TransactionListProps) => {
  const bgColor = type === "income" ? "bg-income/10" : "bg-expense/10";
  const textColor = type === "income" ? "text-income" : "text-expense";
  const iconColor = type === "income" ? "text-income" : "text-expense";
  const borderColor = type === "income" ? "border-income/20" : "border-expense/20";

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        {type === "income" ? "Nenhuma receita" : "Nenhuma despesa"} registrada.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between p-4 ${bgColor} ${borderColor} border rounded-xl`}
          >
            <div className="flex-1">
              <p className="font-medium">{transaction.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDate(transaction.date)}</span>
                {'category' in transaction && transaction.category && (
                  <>
                    <span>•</span>
                    <span>{transaction.category}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`text-lg font-semibold ${textColor}`}>
                {type === "expense" ? "- " : "+ "}
                {formatCurrency(transaction.amount)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
                className={`h-8 w-8 ${iconColor}/70 hover:${iconColor}`}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TransactionList;
