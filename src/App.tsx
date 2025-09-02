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

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<string>('loading');
  const [currentCompany, setCurrentCompany] = useState<string>('');
  const [currentClient, setCurrentClient] = useState<string>('');

  // Handle subdomain-based routing on app load
  useEffect(() => {
    const subdomain = getSubdomain();
    const company = getCompanyFromSubdomain(subdomain);
    const currentPath = window.location.pathname;
    
    if (company) {
      setCurrentCompany(company);
      
      // Check if there's a client name in the path (e.g., /servicon)
      if (currentPath !== '/' && currentPath.length > 1) {
        const clientName = currentPath.substring(1);
        setCurrentClient(clientName);
        setCurrentView('client-login');
      } else {
        // No client path, go to company landing
        setCurrentView('company-landing');
      }
    } else {
      // If no subdomain or invalid subdomain, show company selector
      setCurrentView('selector');
    }
  }, []);

  const handleNavigation = (path: string) => {
    if (path === '/admin' || path === '/tier1-sellers' || path === '/tier2-sellers' || path === '/plans' || path === '/service-control' || path === '/settings') {
      setCurrentView('admin');
    } else if (path === '/seller-admin' || path === '/clients' || path === '/commissions' || path === '/client-portal') {
      setCurrentView('seller-admin');
    } else if (path === '/dashboard') {
      // Stay in current portal but go to dashboard tab
      return;
    } else if (path === '/home') {
      setCurrentView('selector');
      setCurrentCompany('');
      setCurrentClient('');
    } else if (path === '/back') {
      setCurrentView('company-landing');
      setCurrentClient('');
    } else if (path === '/project-dashboard' || path === '/user-management' || path === '/billing') {
      // Stay in client portal but navigate to specific sections
      return;
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
        return <AdminPortal onNavigate={handleNavigation} />;
      
      case 'seller-admin':
        return <SellerAdminPortal company={currentCompany as any} onNavigate={handleNavigation} />;
      
      case 'client-admin':
      case 'client-viewer':
        return <ClientPortal client={currentClient} onNavigate={handleNavigation} />;
      
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
