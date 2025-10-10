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

import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

// Import router components and hooks
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

const queryClient = new QueryClient();

/**
 * We are creating this inner component to get access to React Router's hooks,
 * as they can only be used within a <BrowserRouter> context.
 */
const AppContent = () => {
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  
  // This state will now be driven by the URL from React Router
  const [currentPath, setCurrentPath] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();

  // This effect syncs our `currentPath` state with the browser's URL
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company);
    navigate(`/${company}`); // Use navigate to change the URL
    console.log('Selected company:', company);
  };

  const handleNavigate = (path: string) => {
    navigate(path); // Use navigate for all navigation actions
  };

  const renderCurrentPage = () => {
    // --- ADDED ROUTES FOR PAYMENT ---
    // These checks come first to ensure they are always accessible.
    if (currentPath === '/payment-success') {
      return <PaymentSuccess />;
    }
    if (currentPath === '/payment-failed') {
      return <PaymentFailed />;
    }
    // --- END OF NEW ROUTES ---

    if (!selectedCompany) {
      // The Index page will now only show if there's no company selected AND we are at the root path
      if (currentPath === '/') {
        return <Index onCompanySelect={handleCompanySelect} />;
      }
      // If we are at a deep link without a company selected, we could redirect or show a loader/error.
      // For now, we fall through, but a real app might redirect to '/'.
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

    // Handle client login pages based on URL pattern
    if (currentPath.startsWith('/') && currentPath !== `/${selectedCompany}` && currentPath !== '/') {
      const parts = currentPath.split('/').filter(Boolean);
      if (parts.length > 1) { // e.g., /company/client
        const clientName = parts[1];
        return (
          <ClientLogin 
            company={selectedCompany as 'marketstrendai' | 'xyzseller'}
            client={clientName}
            onBack={() => navigate(`/${selectedCompany}`)}
            onLogin={(role) => {
              console.log(`Logged in as ${role} for client ${clientName}`);
              navigate('/seller-admin');
            }}
          />
        );
      }
    }

    // Check if the current path matches the selected company for the landing page
    if (currentPath === `/${selectedCompany}`) {
      return (
        <CompanyLanding 
          company={selectedCompany as 'jupiterbrains' | 'marketstrendai' | 'xyzseller'} 
          onNavigate={handleNavigate}
          onBack={() => {
            setSelectedCompany('');
            navigate('/');
          }}
        />
      );
    }

    // Default to Index page if no other condition is met, especially on initial load at '/'
    return <Index onCompanySelect={handleCompanySelect} />;
  };

  return renderCurrentPage();
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {/* Wrap the entire application with BrowserRouter */}
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;