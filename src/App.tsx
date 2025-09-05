import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";
import ClientLogin from "./pages/ClientLogin";

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
    if (currentPath === '/admin' || currentPath === '/seller-admin') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentPath === '/admin' ? 'Admin Portal' : 'Seller Admin Portal'}
            </h1>
            <p className="text-gray-600 mb-6">Portal content will be implemented here</p>
            <button 
              onClick={() => setCurrentPath(`/${selectedCompany}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Company Landing
            </button>
          </div>
        </div>
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
            // Handle login success - could navigate to client dashboard
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
