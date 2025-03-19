
import { ReactNode } from "react";
import { DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 pb-20">
      <motion.header 
        className="py-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="inline-flex items-center gap-2 mb-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">FinanceTracker</h1>
        </motion.div>
        <p className="text-muted-foreground">Controle suas finanças com simplicidade</p>
      </motion.header>
      
      <main className="container max-w-3xl px-4 sm:px-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
