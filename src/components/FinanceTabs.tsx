
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  PieChart,
  Target
} from "lucide-react";

interface FinanceTabsProps {
  incomesContent: ReactNode;
  expensesContent: ReactNode;
  budgetsContent: ReactNode;
  savingsContent?: ReactNode;
}

const FinanceTabs = ({ 
  incomesContent, 
  expensesContent, 
  budgetsContent,
  savingsContent 
}: FinanceTabsProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Tabs defaultValue="incomes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="incomes" className="flex gap-2 items-center">
            <ArrowUpCircle className="h-4 w-4 text-income" />
            <span className="hidden sm:inline">Receitas</span>
          </TabsTrigger>
          
          <TabsTrigger value="expenses" className="flex gap-2 items-center">
            <ArrowDownCircle className="h-4 w-4 text-expense" />
            <span className="hidden sm:inline">Despesas</span>
          </TabsTrigger>
          
          <TabsTrigger value="budgets" className="flex gap-2 items-center">
            <PieChart className="h-4 w-4 text-budget" />
            <span className="hidden sm:inline">Orçamentos</span>
          </TabsTrigger>
          
          <TabsTrigger value="savings" className="flex gap-2 items-center">
            <Target className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Metas</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="incomes" className="space-y-4">
          {incomesContent}
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-4">
          {expensesContent}
        </TabsContent>
        
        <TabsContent value="budgets" className="space-y-4">
          {budgetsContent}
        </TabsContent>
        
        <TabsContent value="savings" className="space-y-4">
          {savingsContent}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default FinanceTabs;
