import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";

const queryClient = new QueryClient();

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    setCurrentPath(`/${company}`);
    console.log('Selected company:', company);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const renderCurrentPage = () => {
    if (!selectedCompany) {
      return <Index onCompanySelect={handleCompanySelect} />;
    }

    return (
      <CompanyLanding 
        company={selectedCompany as 'jupiterbrains' | 'marketstrendai' | 'xyzseller'} 
        onNavigate={handleNavigate}
      />
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderCurrentPage()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
