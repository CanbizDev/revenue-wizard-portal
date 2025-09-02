import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";
import ClientLogin from "./pages/ClientLogin";
import AdminPortal from "./components/Portal/AdminPortal";
import SellerAdminPortal from "./components/Portal/SellerAdminPortal";
import ClientPortal from "./components/Portal/ClientPortal";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<string>('selector');
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [currentClient, setCurrentClient] = useState<string>('');
  const [currentActiveTab, setCurrentActiveTab] = useState<string>('dashboard');

  const handleNavigation = (path: string) => {
    if (path === '/admin') {
      setCurrentView('admin');
    } else if (path === '/seller-admin') {
      setCurrentView('seller-admin');
    } else if (path === '/home') {
      setCurrentView('selector');
      setCurrentCompany('');
      setCurrentClient('');
    } else if (path === '/back') {
      setCurrentView('company-landing');
      setCurrentClient('');
    } else if (path.startsWith('/')) {
      const clientName = path.substring(1);
      setCurrentClient(clientName);
      setCurrentView('client-login');
    }
  };

  const handleLogin = (role: 'admin' | 'viewer') => {
    if (role === 'admin') {
      setCurrentView('client-admin');
    } else {
      setCurrentView('client-viewer');
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'selector':
        return <Index onCompanySelect={(company) => {
          setCurrentCompany(company);
          setCurrentView('company-landing');
        }} />;
      
      case 'company-landing':
        return (
          <CompanyLanding 
            company={currentCompany as any}
            onNavigate={handleNavigation}
          />
        );
      
      case 'client-login':
        return (
          <ClientLogin
            company={currentCompany as any}
            client={currentClient}
            onBack={() => setCurrentView('company-landing')}
            onLogin={handleLogin}
          />
        );
      
      case 'admin':
        return <AdminPortal />;
      
      case 'seller-admin':
        return <SellerAdminPortal company={currentCompany as any} />;
      
      case 'client-admin':
      case 'client-viewer':
        return <ClientPortal client={currentClient} />;
      
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {renderCurrentView()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
