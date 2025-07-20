import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CompanyLanding from "./pages/CompanyLanding";
import ClientLogin from "./pages/ClientLogin";
import AdminPortal from "./components/Portal/AdminPortal";
import SellerPortal from "./components/Portal/SellerPortal";
import SellerAdminPortal from "./components/Portal/SellerAdminPortal";
import ClientPortal from "./components/Portal/ClientPortal";
import NotFound from "./pages/NotFound";
import { useState, useEffect } from "react";
import { getSubdomain, getCompanyFromSubdomain } from "./utils/subdomain";
import { applyTheme, getThemeForCompany } from "./utils/theme";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<string>('loading');
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [currentClient, setCurrentClient] = useState<string>('');

  // Handle subdomain-based routing and theme application
  useEffect(() => {
    const subdomain = getSubdomain();
    const company = getCompanyFromSubdomain(subdomain);
    
    if (company) {
      // If we have a valid company subdomain, go directly to company landing
      setCurrentCompany(company);
      setCurrentView('company-landing');
      // Apply company-specific theme
      const theme = getThemeForCompany(company);
      applyTheme(theme);
    } else {
      // If no subdomain or invalid subdomain, show company selector
      setCurrentView('selector');
      // Reset to default theme
      applyTheme(null);
    }
  }, []);

  // Apply theme when company changes
  useEffect(() => {
    if (currentCompany) {
      const theme = getThemeForCompany(currentCompany);
      applyTheme(theme);
    }
  }, [currentCompany]);

  const handleNavigation = (path: string) => {
    if (path === '/admin') {
      setCurrentView('admin');
    } else if (path === '/seller-admin') {
      setCurrentView('seller-admin');
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
      case 'loading':
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
      
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
        return <ClientPortal />;
      
      default:
        return <NotFound />;
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
