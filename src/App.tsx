import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    // You can add navigation logic here if needed
    console.log('Selected company:', company);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Index onCompanySelect={handleCompanySelect} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
