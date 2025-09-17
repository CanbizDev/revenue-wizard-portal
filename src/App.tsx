import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";
import ClientLogin from "./pages/ClientLogin";
import AdminPortal from "./components/Portal/AdminPortal";
import SellerAdminPortal from "./components/Portal/SellerAdminPortal";

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

    // Handle navigation to different portals
    if (currentPath === '/admin') {
      return <AdminPortal />;
    }
    
    if (currentPath === '/seller-admin') {
      return (
        <SellerAdminPortal 
          company={selectedCompany as 'marketstrendai' | 'xyzseller'}
          onNavigate={handleNavigate}
        />
      );
    }

    // Handle client login pages
    if (currentPath.startsWith('/') && currentPath !== `/${selectedCompany}`) {
      const clientName = currentPath.substring(1);
      return (
        <ClientLogin 
          company={selectedCompany as 'marketstrendai' | 'xyzseller'}
          client={clientName}
          onBack={() => setCurrentPath(`/${selectedCompany}`)}
          onLogin={(role) => {
            console.log(`Logged in as ${role} for client ${clientName}`);
            // Navigate to the appropriate seller admin portal based on company
            setCurrentPath('/seller-admin');
          }}
        />
      );
    }

    // Default to company landing
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
