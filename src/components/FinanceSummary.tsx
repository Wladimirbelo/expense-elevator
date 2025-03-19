
import { formatCurrency } from "@/utils/financeUtils";
import { ArrowUpCircle, ArrowDownCircle, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface FinanceSummaryProps {
  incomeTotal: number;
  expenseTotal: number;
  balance: number;
}

const FinanceSummary = ({ incomeTotal, expenseTotal, balance }: FinanceSummaryProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div 
        variants={item}
        className="glass p-5 rounded-2xl flex items-center gap-4"
      >
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-income/10">
          <ArrowUpCircle className="h-6 w-6 text-income" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Receitas</p>
          <p className="text-2xl font-semibold text-income">
            {formatCurrency(incomeTotal)}
          </p>
        </div>
      </motion.div>

      <motion.div 
        variants={item}
        className="glass p-5 rounded-2xl flex items-center gap-4"
      >
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-expense/10">
          <ArrowDownCircle className="h-6 w-6 text-expense" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Despesas</p>
          <p className="text-2xl font-semibold text-expense">
            {formatCurrency(expenseTotal)}
          </p>
        </div>
      </motion.div>

      <motion.div 
        variants={item}
        className="glass p-5 rounded-2xl flex items-center gap-4"
      >
        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Balanço</p>
          <p className={`text-2xl font-semibold ${
            balance >= 0 ? 'text-income' : 'text-expense'
          }`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FinanceSummary;
