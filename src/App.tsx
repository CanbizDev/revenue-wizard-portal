import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";
import ClientLogin from "./pages/ClientLogin";
import AdminPortal from "./components/Portal/AdminPortal";
import SellerAdminPortal from "./components/Portal/SellerAdminPortal";

const queryClient = new QueryClient();

const STORAGE_KEYS = {
  SELECTED_COMPANY: 'webreports_selected_company',
  CURRENT_PATH: 'webreports_current_path'
};

const App = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const savedCompany = localStorage.getItem(STORAGE_KEYS.SELECTED_COMPANY);
      const savedPath = localStorage.getItem(STORAGE_KEYS.CURRENT_PATH);
      
      if (savedCompany) {
        setSelectedCompany(savedCompany);
      }
      if (savedPath) {
        setCurrentPath(savedPath);
      }
    } catch (error) {
      console.warn('Failed to restore state from localStorage:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      if (selectedCompany) {
        localStorage.setItem(STORAGE_KEYS.SELECTED_COMPANY, selectedCompany);
      } else {
        localStorage.removeItem(STORAGE_KEYS.SELECTED_COMPANY);
      }
    } catch (error) {
      console.warn('Failed to save selectedCompany to localStorage:', error);
    }
  }, [selectedCompany]);

  useEffect(() => {
    try {
      if (currentPath) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_PATH, currentPath);
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_PATH);
      }
    } catch (error) {
      console.warn('Failed to save currentPath to localStorage:', error);
    }
  }, [currentPath]);

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
        onBack={() => {
          setSelectedCompany('');
          setCurrentPath('');
        }}
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
