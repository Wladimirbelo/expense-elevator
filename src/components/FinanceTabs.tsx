
import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

interface FinanceTabsProps {
  incomesContent: ReactNode;
  expensesContent: ReactNode;
  budgetsContent: ReactNode;
}

const FinanceTabs = ({ incomesContent, expensesContent, budgetsContent }: FinanceTabsProps) => {
  return (
    <Tabs defaultValue="incomes" className="w-full">
      <TabsList className="grid grid-cols-3 h-14 mb-8 p-1 glass">
        <TabsTrigger 
          value="incomes"
          className="flex items-center gap-2 h-12 data-[state=active]:bg-income/10 data-[state=active]:text-income transition-all"
        >
          <ArrowUpCircle className="h-4 w-4" />
          <span className="hidden md:inline">Receitas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="expenses"
          className="flex items-center gap-2 h-12 data-[state=active]:bg-expense/10 data-[state=active]:text-expense transition-all"
        >
          <ArrowDownCircle className="h-4 w-4" />
          <span className="hidden md:inline">Despesas</span>
        </TabsTrigger>
        <TabsTrigger 
          value="budgets"
          className="flex items-center gap-2 h-12 data-[state=active]:bg-budget/10 data-[state=active]:text-budget transition-all"
        >
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">Orçamentos</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="incomes" className="space-y-6">
        {incomesContent}
      </TabsContent>
      
      <TabsContent value="expenses" className="space-y-6">
        {expensesContent}
      </TabsContent>
      
      <TabsContent value="budgets" className="space-y-6">
        {budgetsContent}
      </TabsContent>
    </Tabs>
  );
};

export default FinanceTabs;
